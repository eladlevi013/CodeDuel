import { runTestCases } from './executors/codeExecutor/runTestCases';
import { runSqlCheck } from './executors/sqlExecutor/runSqlCheck';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { BasePlayer, LoggedInPlayer, Player, Room } from './models/Room';
import {
  publicRooms,
  roomCodeGenerator,
  getRoomCodeFromSocketId,
  quickMatch,
  joinRoom,
  addingBattleToDB,
  createRoom
} from './utils/roomsHelper';
import {
  updateWinnerPlayerScore,
  isLoggedinPlayer,
  updatePlayersScoreOnTie
} from './utils/scoreHandler';

// Game Globals
const rooms = new Map<string, Room>();

// Sockets constants
export const PLAYERS_PER_ROOM = 2;
export const CONNECTION_SOCKET_EVENT = 'connection';
export const CODE_SUBMISSION_SOCKET_EVENT = 'codeSubmission';
export const CODE_SUCCESS_SOCKET_EVENT = 'codeSuccess';
export const CODE_WRONG_SOCKET_EVENT = 'codeWrong';
export const CODE_ERROR_SOCKET_EVENT = 'codeError';
export const SEND_ROOMS_SOCKET_EVENT = 'sendRooms';
export const GET_ROOMS_SOCKET_EVENT = 'getRooms';
export const DISCONNECT_SOCKET_EVENT = 'disconnect';
export const OTHER_PLAYER_LEFT_SOCKET_EVENT = 'otherPlayerLeft';
export const LEAVE_ROOM_SOCKET_EVENT = 'leaveRoom';
export const ROOM_FULL_SOCKET_EVENET = 'roomFull';
export const CREATE_ROOM_SOCKET_EVENT = 'createRoom';
export const CREATED_ROOM_SOCKET_EVENT = 'createdRoom';
export const JOIN_ROOM_SOCKET_EVENT = 'joinRoom';
export const JOINED_ROOM_SOCKET_EVENT = 'joinedRoom';
export const ROOM_NOT_FOUND_SOCKET_EVENT = 'roomNotFound';
export const START_GAME_SOCKET_EVENT = 'startGame';
export const SEND_MESSAGE_SOCKET_EVENT = 'sendMessage';
export const RECEIVE_MESSAGE_SOCKET_EVENT = 'receiveMessage';
export const START_GAME_TIMER_SOCKET_EVENT = 'startGameTimer';
export const GAME_END_TIE_SOCKET_EVENT = 'endGameTie';
export const GAME_END_LOSE_SOCKET_EVENT = 'gameEndLose';
export const GAME_END_WIN_SOCKET_EVENT = 'gameEndWin';
export const ROOM_MANAGEMENT_ERROR_SOCKET_EVENT = 'roomManagementError';
export const QUICK_MATCH_SOCKET_EVENT = 'quickMatch';

// Game constants
export const SECONDS_POST_SUCCESSFUL_CODE_SUBMISSION = 60;
export const SQL_GAME_MODE = 'sql';
export const CODING_GAME_MODE = 'coding';

export const setupSocketIO = (httpServer: HttpServer) => {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on(CONNECTION_SOCKET_EVENT, (socket: Socket) => {
    socket.on(CODE_SUBMISSION_SOCKET_EVENT, async (code, questionId, language) => {
      const roomCode = getRoomCodeFromSocketId(socket.id, rooms);
      const room = rooms.get(roomCode);
      let result;
      let errorMessage;

      // Run code acording to game mode
      if (room?.mode === SQL_GAME_MODE) {
        result = await runSqlCheck(questionId, code);
        errorMessage = result?.stderr;
      } else {
        result = await runTestCases(code, questionId, language);
        errorMessage = result?.stderr;
      }

      if (!result) {
        console.error(`Result is undefined.`);
        return;
      }

      // Emit error to client
      if (errorMessage) {
        socket.emit(CODE_ERROR_SOCKET_EVENT, errorMessage);
        return;
      }

      // Emit failure to client
      if (room?.mode === SQL_GAME_MODE) {
        if (result?.stdout == false) {
          socket.emit(CODE_WRONG_SOCKET_EVENT, `Sql query is wrong.`);
          return;
        }
      } else {
        if (result.stdout && !result?.stdout.toString().toLowerCase().includes('true')) {
          socket.emit(CODE_WRONG_SOCKET_EVENT, `Test case failed.`);
          return;
        }
      }

      // Error in room management
      if (!roomCode || !room) {
        console.error(`RoomCode: ${roomCode}, or Room does not exist.`);
        return;
      }

      // On successful submission add submission to room
      const player = room.players.find(player => player.sid === socket.id) as Player;

      let submittedPlayerFound = false;
      room.successfulSubmissions.forEach(submission => {
        if (submission.sid === player.sid) {
          submittedPlayerFound = true;
        }
      });

      if (!submittedPlayerFound) {
        room.successfulSubmissions.push(player);
      }

      // On first successful submission, start timer
      if (room.successfulSubmissions.length === 1) {
        socket.to(roomCode).emit(START_GAME_TIMER_SOCKET_EVENT);
        socket.emit(CODE_SUCCESS_SOCKET_EVENT);
        room.countdownStarted = true;

        // start countdown to end game
        setTimeout(async () => {
          if (room && room.countdownStarted && room.players.length == 2) {
            const winnerPlayer = rooms.get(roomCode)?.successfulSubmissions[0] as BasePlayer;

            if (winnerPlayer) {
              // sending all players except winnerPlayer.id
              for (let player of room.players) {
                if (player.sid !== winnerPlayer.sid) {
                  const winnerPlayerName = isLoggedinPlayer(winnerPlayer)
                    ? winnerPlayer.username
                    : 'the other player';
                  io.to(player.sid).emit(GAME_END_LOSE_SOCKET_EVENT, winnerPlayerName);
                }
              }

              // send only to winnerPlayer.id
              updateWinnerPlayerScore(winnerPlayer);
              io.to(winnerPlayer.sid).emit(GAME_END_WIN_SOCKET_EVENT);
              addingBattleToDB(room, winnerPlayer);
            }

            rooms.delete(roomCode);
          }
        }, SECONDS_POST_SUCCESSFUL_CODE_SUBMISSION * 1000);
      }

      // if all players solved problem, end game
      if (room.successfulSubmissions.length === room.players.length) {
        io.in(roomCode).emit(GAME_END_TIE_SOCKET_EVENT);
        addingBattleToDB(room, null);
        updatePlayersScoreOnTie(room.players);
        room.countdownStarted = false;

        return;
      }
    });

    socket.on(QUICK_MATCH_SOCKET_EVENT, async (uid: string) => {
      const roomCode = await quickMatch(uid, rooms);
      joinRoom(socket, io, rooms, roomCode, uid);
    });

    socket.on(SEND_ROOMS_SOCKET_EVENT, () => {
      socket.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });

    socket.on(DISCONNECT_SOCKET_EVENT, () => {
      for (const [roomCode, room] of rooms.entries()) {
        const playerIndex = room.players.findIndex(player => player.sid === socket.id);
        const roomBackup = JSON.parse(JSON.stringify(room));

        if (playerIndex > -1) {
          room.players.splice(playerIndex, 1);

          if (room.gameStarted && room.players.length === 1) {
            socket.to(roomCode).emit(OTHER_PLAYER_LEFT_SOCKET_EVENT);
            const winner = room.players[0] as LoggedInPlayer;
            addingBattleToDB(roomBackup, winner);
            updateWinnerPlayerScore(winner);
            rooms.delete(roomCode);
          }

          break;
        }
      }

      io.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });

    socket.on(LEAVE_ROOM_SOCKET_EVENT, roomCode => {
      const room = rooms.get(roomCode);

      if (room) {
        const index = room.players.findIndex(player => player.sid === socket.id);

        if (index > -1) {
          room.players.splice(index, 1);
          socket.leave(roomCode);

          if (room.countdownStarted) {
            socket.to(roomCode).emit(OTHER_PLAYER_LEFT_SOCKET_EVENT);
            const winner = room.players[0] as LoggedInPlayer;
            updateWinnerPlayerScore(winner);
            rooms.delete(roomCode);
          }
        }
      }

      io.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });

    socket.on(CREATE_ROOM_SOCKET_EVENT, (isPublic, gameMode) => {
      const roomCode = createRoom(rooms, gameMode, isPublic);

      socket.emit(CREATED_ROOM_SOCKET_EVENT, roomCode);
      io.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });

    socket.on(JOIN_ROOM_SOCKET_EVENT, async (roomCode: string, uid: string) => {
      joinRoom(socket, io, rooms, roomCode, uid);
    });

    socket.on(SEND_MESSAGE_SOCKET_EVENT, (message: string, roomCode: string) => {
      const sender = rooms.get(roomCode)?.players.find(player => player.sid === socket.id);

      if (sender) {
        const username = isLoggedinPlayer(sender) ? sender.username : 'Anonymous';
        socket.to(roomCode).emit(RECEIVE_MESSAGE_SOCKET_EVENT, message, username);
      }
    });
  });
};
