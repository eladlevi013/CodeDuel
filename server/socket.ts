import { runTestCases } from './codeExecutor/runTestCases';
import { questions } from './db/questions';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Room } from './models/Room';
import { publicRooms, roomCodeGenerator, getRoomCodeFromSocketId } from './utils/roomsHelper'
import accountSchema from './models/Account';

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
const CREATE_ROOM_SOCKET_EVENT = 'createRoom';
const CREATED_ROOM_SOCKET_EVENT = 'createdRoom';
const JOIN_ROOM_SOCKET_EVENT = 'joinRoom';
const JOINED_ROOM_SOCKET_EVENT = 'joinedRoom';
const ROOM_NOT_FOUND_SOCKET_EVENT = 'roomNotFound';
const START_GAME_SOCKET_EVENT = 'startGame';
const SEND_MESSAGE_SOCKET_EVENT = 'sendMessage';
const RECEIVE_MESSAGE_SOCKET_EVENT = 'receiveMessage';
const START_GAME_TIMER_SOCKET_EVENT = 'startGameTimer';
const END_GAME_SOCKET_EVENT = 'endGame';
const SECONDS_POST_SUCCESSFUL_CODE_SUBMISSION = 15;

// Global variables
const rooms = new Map<string, Room>();

// Currently returns the first player in the room
const getRoomWinnerUid = (roomCode: string): string => {
  const room = rooms.get(roomCode);
  return room?.successfulSubmissions[0].uid ?? '';
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
      if (result.stdout && !result.stdout.includes('true')) {
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
      room.successfulSubmissions.push({ uid: socket.id, time: 'none', memory: 0 });
      
      // on first successful submission, start timer
      if (room.successfulSubmissions.length === 1) {
        socket.to(roomCode).emit(START_GAME_TIMER_SOCKET_EVENT);
        socket.emit(CODE_SUCCESS_SOCKET_EVENT);
        room.countdown = true;
        
        // start countdown to end game
        setTimeout(async () => {    
          if (room.countdown) {
            io.in(roomCode).emit(END_GAME_SOCKET_EVENT, getRoomWinnerUid(roomCode));
            const winnerSid = getRoomWinnerUid(roomCode).toString();
            const WinnerUid = rooms.get(roomCode)?.players.find
              (player => player.sid === winnerSid)?.uid;
            const account = await accountSchema.findById(WinnerUid);
            account.score += 2;
            await account.save();
            room.countdown = false;
            rooms.delete(roomCode);
          }
        }, SECONDS_POST_SUCCESSFUL_CODE_SUBMISSION * 1000);
      }

      // if all players solved problem, end game
      if (room.successfulSubmissions.length === room.players.length) {
        const winner = getRoomWinnerUid(roomCode);
        io.in(roomCode).emit(END_GAME_SOCKET_EVENT, winner);
        room.countdown = false;
        rooms.delete(roomCode);
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
        }
      }

      io.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });
    
    socket.on(CREATE_ROOM_SOCKET_EVENT, (isPublic) => {
      const roomCode = roomCodeGenerator().toString();
      rooms.set(roomCode, { players: [], isPublic: isPublic, gameStarted: false, 
        countdown: false, successfulSubmissions: [], roomCode: roomCode });
      socket.emit(CREATED_ROOM_SOCKET_EVENT, roomCode);
      io.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });
    
    socket.on(JOIN_ROOM_SOCKET_EVENT, async (roomCode: string, uid: string) => {
      if (rooms.has(roomCode)) {
        const room = rooms.get(roomCode);

        if ((room && room.players[0] && room.players[0].sid !== socket.id) || room && room.players.length === 0) {
          room.players.push({ sid: socket.id, uid: uid });
          socket.join(roomCode);
          socket.emit(JOINED_ROOM_SOCKET_EVENT, roomCode);

          if (room.players.length == PLAYERS_PER_ROOM) {
            // const question = questions[Math.floor(Math.random() * questions.length)];
            const question = questions[5];
            room.gameStarted = true;
            io.to(roomCode).emit(START_GAME_SOCKET_EVENT, question);
    
            // Loop through all players in the room and update their scores
            for (let player of room.players) {
              if (player.uid !== null) {
                try {
                  const account = await accountSchema.findById(player.uid);
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
