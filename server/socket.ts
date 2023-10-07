import { runTestCases } from './codeExecutor/runTestCases';
import { questions } from './db/questions';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Room, SubmissionStats } from './models/Room';
import { publicRooms, roomCodeGenerator } from './utils/roomsHelper'

// define constants
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

const rooms = new Map<string, Room>();

const getRoomCodeFromSocketId = (socketId: string): string => {
  for (const [roomCode, room] of rooms) {
    if (room.players.includes(socketId)) {
      return roomCode;
    }
  }
  return '';
}

const getRoomWinner = (roomCode: string): string => {
  const room = rooms.get(roomCode);
  let winner = '';
  let minTime = Number.MAX_SAFE_INTEGER;

  if (room) {
    for (const [socketId, submissionStats] of room.successfulSubmissions!) {
      const time = parseInt(submissionStats.time);
      if (time < minTime) {
        minTime = time;
        winner = socketId;
      }
    }
  }

  return winner;
}

export const setupSocketIO = (httpServer: HttpServer) => {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on(CONNECTION_SOCKET_EVENT, (socket: Socket) => {

    socket.on(CODE_SUBMISSION_SOCKET_EVENT, async (code, questionId, language) => {
      const result = await runTestCases(code, questionId, language);
    
      if (!result) {
        console.error(`Result is undefined.`);
        return;
      }
    
      const errorMessage = result.stderr;
    
      if (errorMessage) {
        socket.emit(CODE_ERROR_SOCKET_EVENT, errorMessage);
        return;
      }

          
      if (result.stdout && !result.stdout.includes('true')) {
        socket.emit(CODE_WRONG_SOCKET_EVENT, `Test case failed.`);
        return;
      }
    
      const roomCode = getRoomCodeFromSocketId(socket.id);
      const room = rooms.get(roomCode);
    
      if (!roomCode || !room) {
        console.error(`RoomCode: ${roomCode}, or Room does not exist.`);
        return;
      }
    
      // Update the successfulSubmissions set.
      if (!room.successfulSubmissions) {
        room.successfulSubmissions = new Map<string, SubmissionStats>();
      }
      room.successfulSubmissions.set(socket.id, { time: 'none', memory: 0 });
    
      if (room.successfulSubmissions.size === room.players.length) {
        io.in(roomCode).emit(END_GAME_SOCKET_EVENT, getRoomWinner(roomCode));
        room.countdown = false;
        rooms.delete(roomCode);
        return;
      }
    
      if (room.successfulSubmissions.size === 1) {
        socket.to(roomCode).emit(START_GAME_TIMER_SOCKET_EVENT);
        socket.emit(CODE_SUCCESS_SOCKET_EVENT);
        room.countdown = true;
    
        setTimeout(() => {
          const currentRoom = rooms.get(roomCode);
    
          if (currentRoom && currentRoom.countdown) {
            io.in(roomCode).emit(END_GAME_SOCKET_EVENT, getRoomWinner(roomCode));
            currentRoom.countdown = false;
            rooms.delete(roomCode);
          }
        }, SECONDS_POST_SUCCESSFUL_CODE_SUBMISSION * 1000);
      }
    });
    
    socket.on(SEND_ROOMS_SOCKET_EVENT, () => {
      socket.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });

    socket.on(DISCONNECT_SOCKET_EVENT, () => {
      for (const [roomCode, room] of rooms) {
        const playerIndex = room.players.indexOf(socket.id);
        
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
        const index = room.players.indexOf(socket.id);
        
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
        countdown: false, successfulSubmissions: new Map<string, SubmissionStats>() });
      socket.emit(CREATED_ROOM_SOCKET_EVENT, roomCode);
      io.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });
    
    socket.on(JOIN_ROOM_SOCKET_EVENT, (roomCode: string) => {
      if (rooms.has(roomCode)) {
        const room = rooms.get(roomCode);

        if (room && room.players[0] !== socket.id) {
          room.players.push(socket.id);
          socket.join(roomCode);
          socket.emit(JOINED_ROOM_SOCKET_EVENT, roomCode);
          
          if (room.players.length == PLAYERS_PER_ROOM) {
            // const question = questions[Math.floor(Math.random() * questions.length)];
            const question = questions[5];
            room.gameStarted = true;
            io.to(roomCode).emit(START_GAME_SOCKET_EVENT, question);
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
