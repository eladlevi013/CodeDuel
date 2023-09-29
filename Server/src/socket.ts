import { runTestCases } from './CodeExecutor/codeExecutorHelper';
import { questions } from './db/questions';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Room } from './Models/Room';
import { publicRooms, roomCodeGenerator } from './Utils/roomsHelper'

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
const START_GAME_SOCKET_EVENT = 'startGame';
const SEND_MESSAGE_SOCKET_EVENT = 'sendMessage';
const RECEIVE_MESSAGE_SOCKET_EVENT = 'receiveMessage';

const rooms = new Map<string, Room>();

export const setupSocketIO = (httpServer: HttpServer) => {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on(CONNECTION_SOCKET_EVENT, (socket: Socket) => {
    socket.on(CODE_SUBMISSION_SOCKET_EVENT, async (code: string, 
      questionId: string, language: string) => {
      const result = await runTestCases(code, questionId, language);

      if (result.stderr != null) {
        socket.emit(CODE_ERROR_SOCKET_EVENT, result.stderr.split('')
          .splice(0,100).join('').concat('...'));
      } else {
        if (result.stdout.includes('True') || result.stdout.includes('true')) {
          socket.emit(CODE_SUCCESS_SOCKET_EVENT);
        } else {
          socket.emit(CODE_WRONG_SOCKET_EVENT);
        }
      }
    });

    socket.on(SEND_ROOMS_SOCKET_EVENT, (message: string) => {
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
    
    socket.on(CREATE_ROOM_SOCKET_EVENT, () => {
      const roomCode = roomCodeGenerator().toString();
      rooms.set(roomCode, { players: [], isPublic: true, gameStarted: false });
      socket.emit(CREATED_ROOM_SOCKET_EVENT, roomCode);
      io.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });
    
    socket.on(JOIN_ROOM_SOCKET_EVENT, (roomCode: string) => {
      if (rooms.has(roomCode)) {
        const room = rooms.get(roomCode);

        if (room) {
          room.players.push(socket.id);
          socket.join(roomCode);
          socket.emit(JOINED_ROOM_SOCKET_EVENT, roomCode);
          
          if (room.players.length == PLAYERS_PER_ROOM) {
            // const question = questions[Math.floor(Math.random() * questions.length)];
            const question = questions[3];
            room.gameStarted = true;
            io.to(roomCode).emit(START_GAME_SOCKET_EVENT, question);
          }
        }
      }

      io.emit(GET_ROOMS_SOCKET_EVENT, publicRooms(rooms));
    });

    socket.on(SEND_MESSAGE_SOCKET_EVENT, (message: string, roomCode: string) => {
      socket.to(roomCode).emit(RECEIVE_MESSAGE_SOCKET_EVENT, message);
    });
  })
}
