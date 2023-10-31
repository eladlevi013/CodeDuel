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
  joinRoom
} from './utils/roomsHelper';
import accountSchema from './models/Account';

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
export const SECONDS_POST_SUCCESSFUL_CODE_SUBMISSION = 60;

// Global variables
const rooms = new Map<string, Room>();

const isLoggedinPlayer = (player: Player): player is LoggedInPlayer => {
  return (player as LoggedInPlayer).uid !== undefined;
};

export const updateWinnerPlayerScore = async (player: Player) => {
  if (!isLoggedinPlayer(player)) {
    // The player is not logged in; nothing to update
    return null;
  }

  let scoreToAdd = player.score == 0 ? 1 : 2;

  try {
    const account = await accountSchema.findById(player.uid);

    if (!account) {
      console.error(`Account not found for uid: ${player.uid}`);
      return null;
    }

    account.score += scoreToAdd;
    await account.save();
    return account.score;
  } catch (error) {
    console.error('Error updating player score:', error);
    return null;
  }
};

const updatePlayersScoreOnTie = async (players: Player[]) => {
  for (let player of players) {
    if (isLoggedinPlayer(player)) {
      try {
        const account = await accountSchema.findById(player.uid);

        if (!account) {
          console.error(`Account not found for uid: ${player.uid}`);
          return null;
        }

        account.score += 1;
        await account.save();
      } catch (error) {
        console.error('Error updating player score:', error);
        return null;
      }
    }
  }
};

export const updatePariticipantScore = async (player: Player) => {
  const loggedInPlayer = player as LoggedInPlayer;

  if (loggedInPlayer && loggedInPlayer.uid !== null) {
    try {
      const account = await accountSchema.findById(loggedInPlayer.uid);
      if (account) {
        if (account.score > 0) {
          account.score -= 1;
          await account.save();
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};

export function printRooms(rooms: Map<string, Room>): void {
  rooms.forEach((room, roomKey) => {
    console.log('Room Key:', roomKey);
    console.log('isPublic:', room.isPublic);
    console.log('roomCode:', room.roomCode);
    console.log('gameStarted:', room.gameStarted);
    console.log('countdownStarted:', room.countdownStarted);

    console.log('Players:');
    room.players.forEach((player, index) => {
      // Convert the player object to a JSON string for easy printing.
      console.log(`Player ${index + 1}:`, JSON.stringify(player, null, 2));
    });

    console.log('Successful Submissions:');
    room.successfulSubmissions.forEach((submission, index) => {
      console.log(`Submission ${index + 1}:`);
      console.log('Player:', JSON.stringify(submission.player, null, 2));
      console.log('Time:', submission.time);
      console.log('Memory:', submission.memory);
    });

    console.log('-----------------------');
  });
}

export const setupSocketIO = (httpServer: HttpServer) => {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on(CONNECTION_SOCKET_EVENT, (socket: Socket) => {
    socket.on(CODE_SUBMISSION_SOCKET_EVENT, async (code, questionId, language) => {
      const roomCode = getRoomCodeFromSocketId(socket.id, rooms);
      const room = rooms.get(roomCode);
      let result;
      let errorMessage;

      if (room?.mode === 'sql') {
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
      if (room?.mode === 'sql') {
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

      // on successful submission, add submission to room
      const player = room.players.find(player => player.sid === socket.id) as Player;
      room.successfulSubmissions.push({ player: player, time: 'none', memory: 0 });

      // on first successful submission, start timer
      if (room.successfulSubmissions.length === 1) {
        socket.to(roomCode).emit(START_GAME_TIMER_SOCKET_EVENT);
        socket.emit(CODE_SUCCESS_SOCKET_EVENT);
        room.countdownStarted = true;

        // start countdown to end game
        setTimeout(async () => {
          if (room && room.countdownStarted && room.players.length == 2) {
            const winnerPlayer = rooms.get(roomCode)?.successfulSubmissions[0].player as BasePlayer;
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
            }

            rooms.delete(roomCode);
          }
        }, SECONDS_POST_SUCCESSFUL_CODE_SUBMISSION * 1000);
      }

      // if all players solved problem, end game
      if (room.successfulSubmissions.length === room.players.length) {
        io.in(roomCode).emit(GAME_END_TIE_SOCKET_EVENT);
        updatePlayersScoreOnTie(room.players);
        room.countdownStarted = false;
        return;
      }
    });

    socket.on('quickMatch', async (uid: string) => {
      const roomCode = await quickMatch(uid, rooms);
      joinRoom(socket, io, rooms, roomCode, uid);
    });

    socket.on(SEND_ROOMS_SOCKET_EVENT, () => {
      socket.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });

    socket.on(DISCONNECT_SOCKET_EVENT, () => {
      for (const [roomCode, room] of rooms.entries()) {
        const playerIndex = room.players.findIndex(player => player.sid === socket.id);

        if (playerIndex > -1) {
          room.players.splice(playerIndex, 1);

          if (room.gameStarted && room.players.length === 1) {
            socket.to(roomCode).emit(OTHER_PLAYER_LEFT_SOCKET_EVENT);
            const winner = room.players[0] as LoggedInPlayer;
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
      console.log(gameMode);

      const roomCode = roomCodeGenerator().toString();
      rooms.set(roomCode, {
        players: [],
        isPublic: isPublic,
        gameStarted: false,
        countdownStarted: false,
        successfulSubmissions: [],
        roomCode: roomCode,
        mode: gameMode
      });
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
