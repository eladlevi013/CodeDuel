import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { roomCodeGenerator } from './utils';
import { rooms, Room } from './rooms';
import { questions } from './questions';

export const setupSocketIO = (httpServer: HttpServer) => {
  const io = new Server(httpServer, { cors: { origin: '*' } });
  
  const publicRooms = () => {
    const roomsArray: Room[] = [];

    for (const [roomCode, room] of rooms.entries()) {
      if (room.isPublic && room.players.length < 2)
        roomsArray.push({ ...room, roomCode });
    }
    
    return roomsArray;
  }

  io.on('connection', (socket: Socket) => {
    socket.on('sendRooms', (message: string) => {
      socket.emit('getRooms', publicRooms());
    });

    socket.on('disconnect', () => console.log('user disconnected'));
    
    socket.on('createRoom', () => {
      const roomCode = roomCodeGenerator().toString();
      rooms.set(roomCode, { players: [], isPublic: true });
      socket.emit('createdRoom', roomCode);

      const publicRoomsArray = publicRooms();
      io.emit('getRooms', publicRoomsArray);
    });    
    
    socket.on('joinRoom', (roomCode: string) => {
      if (rooms.has(roomCode)) {
        const room = rooms.get(roomCode);

        if (room) {
          room.players.push(socket.id);
          socket.join(roomCode);
          socket.emit('joinedRoom', roomCode);
          
          // start game if there are 2 players
          if (room.players.length == 2) {
            const question = questions[Math.floor(Math.random() * questions.length)];
            io.to(roomCode).emit('startGame', question);
          }
        }
      }

      const publicRoomsArray = publicRooms();
      io.emit('getRooms', publicRoomsArray);
    })

    socket.on('leaveRoom', (roomCode: string) => {
      if (rooms.has(roomCode)) {
        const room = rooms.get(roomCode);

        if (room) {
          room.players = room.players.filter(player => player !== socket.id);
          socket.emit('leftRoom', roomCode);
        }
      }

      const publicRoomsArray = publicRooms();
      io.emit('getRooms', publicRoomsArray);
    });

    // chat events
    socket.on('sendMessage', (message: string, roomCode: string) => {
      console.log(message, roomCode);
      socket.to(roomCode).emit('receiveMessage', message);
    });
  })
}
