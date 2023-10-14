import { runTestCases } from './codeExecutor/runTestCases';
import { questions } from './db/questions';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { BasePlayer, LoggedInPlayer, Player, Room } from './models/Room';
import { publicRooms, roomCodeGenerator, getRoomCodeFromSocketId } from './utils/roomsHelper'
import accountSchema from './models/Account';
import Account from './models/Account';

// Sockets constants
const PLAYERS_PER_ROOM = 2;
const CONNECTION_SOCKET_EVENT = 'connection';
const CODE_SUBMISSION_SOCKET_EVENT = 'codeSubmission';
const CODE_SUCCESS_SOCKET_EVENT = 'codeSuccess';
const CODE_WRONG_SOCKET_EVENT = 'codeWrong';
const CODE_ERROR_SOCKET_EVENT = 'codeError';
const SEND_ROOMS_SOCKET_EVENT = 'sendRooms';
const GET_ROOMS_SOCKET_EVENT = 'getRooms';
const DISCONNECT_SOCKET_EVENT = 'disconnect';
const OTHER_PLAYER_LEFT_SOCKET_EVENT = 'otherPlayerLeft';
const LEAVE_ROOM_SOCKET_EVENT = 'leaveRoom';
const ROOM_FULL_SOCKET_EVENET = 'roomFull';
const CREATE_ROOM_SOCKET_EVENT = 'createRoom';
const CREATED_ROOM_SOCKET_EVENT = 'createdRoom';
const JOIN_ROOM_SOCKET_EVENT = 'joinRoom';
const JOINED_ROOM_SOCKET_EVENT = 'joinedRoom';
const ROOM_NOT_FOUND_SOCKET_EVENT = 'roomNotFound';
const START_GAME_SOCKET_EVENT = 'startGame';
const SEND_MESSAGE_SOCKET_EVENT = 'sendMessage';
const RECEIVE_MESSAGE_SOCKET_EVENT = 'receiveMessage';
const START_GAME_TIMER_SOCKET_EVENT = 'startGameTimer';
const GAME_END_TIE_SOCKET_EVENT = 'endGameTie';
const GAME_END_LOSE_SOCKET_EVENT = 'gameEndLose';
const GAME_END_WIN_SOCKET_EVENT = 'gameEndWin';
const SECONDS_POST_SUCCESSFUL_CODE_SUBMISSION = 15;

// Global variables
const rooms = new Map<string, Room>();

const isLoggedinPlayer = (player: Player): player is LoggedInPlayer => {
  return (player as LoggedInPlayer).uid !== undefined;
};

const updateWinnerPlayerScore = async (player: Player) => {
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
}

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
}

const updatePariticipantScore = async (player: Player) => {
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
}

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
      const result = await runTestCases(code, questionId, language);
      const errorMessage = result?.stderr;
      
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
      if (result.stdout && !result.stdout.toLowerCase().includes('true')) {
        socket.emit(CODE_WRONG_SOCKET_EVENT, `Test case failed.`);
        return;
      }

      // Emit success to client
      const roomCode = getRoomCodeFromSocketId(socket.id, rooms);
      const room = rooms.get(roomCode);
      
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
                  io.to(player.sid).emit(GAME_END_LOSE_SOCKET_EVENT);
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
    
    socket.on(SEND_ROOMS_SOCKET_EVENT, () => {
      socket.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });

    socket.on(DISCONNECT_SOCKET_EVENT, () => {
      for (const [roomCode, room] of rooms.entries()) {
        const playerIndex = room.players.findIndex
          (player => player.sid === socket.id);
        
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
    
    socket.on(LEAVE_ROOM_SOCKET_EVENT, (roomCode) => {
      const room = rooms.get(roomCode);

      if (room) {
        const index = room.players.findIndex(player => player.sid === socket.id);
        
        if (index > -1) {
          room.players.splice(index, 1);
          socket.leave(roomCode);

          if(room.countdownStarted) {
            socket.to(roomCode).emit(OTHER_PLAYER_LEFT_SOCKET_EVENT);
            const winner = room.players[0] as LoggedInPlayer;
            updateWinnerPlayerScore(winner);
            rooms.delete(roomCode);
          }
        }
      }

      io.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });
    
    socket.on(CREATE_ROOM_SOCKET_EVENT, (isPublic) => {
      const roomCode = roomCodeGenerator().toString();
      rooms.set(roomCode, { players: [], isPublic: isPublic, gameStarted: false, 
        countdownStarted: false, successfulSubmissions: [], roomCode: roomCode });
      socket.emit(CREATED_ROOM_SOCKET_EVENT, roomCode);
      io.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });
    
    socket.on(JOIN_ROOM_SOCKET_EVENT, async (roomCode: string, uid: string) => {
      if (rooms.has(roomCode)) {
        const room = rooms.get(roomCode);

        // if room is full 
        if (room && room.players.length === PLAYERS_PER_ROOM) {
          socket.emit(ROOM_FULL_SOCKET_EVENET);
          return;
        }
        
        if ((room && room.players[0] && room.players[0].sid !== socket.id) || room && room.players.length === 0) {
          // adding player to room object
          if (uid == null) {
            room.players.push({sid: socket.id});
          } else {
            const account = await Account.findById(uid);
            const username = account?.username;
            const score = account?.score;

            room.players.push({ sid: socket.id, uid: uid, username: username, score: score});
          }

          // Join the room
          socket.join(roomCode);
          socket.emit(JOINED_ROOM_SOCKET_EVENT, roomCode);

          if (room.players.length == PLAYERS_PER_ROOM) {
            // const question = questions[Math.floor(Math.random() * questions.length)];
            const question = questions[3];
            room.gameStarted = true;
            io.to(roomCode).emit(START_GAME_SOCKET_EVENT, question);

            printRooms(rooms);

            // Loop through all players in the room and update their scores
            for (let player of room.players) {
              updatePariticipantScore(player);
            }
          }
        }
      } else {
        socket.emit(ROOM_NOT_FOUND_SOCKET_EVENT);
      }
    
      io.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });    

    socket.on(SEND_MESSAGE_SOCKET_EVENT, (message: string, roomCode: string) => {
      socket.to(roomCode).emit(RECEIVE_MESSAGE_SOCKET_EVENT, message);
    });
  })
}
