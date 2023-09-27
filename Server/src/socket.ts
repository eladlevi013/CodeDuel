import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { roomCodeGenerator } from './utils';
import { rooms, Room } from './rooms';

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
          socket.emit('joinedRoom', roomCode);
        }
      }

      const publicRoomsArray = publicRooms();
      io.emit('getRooms', publicRoomsArray);
    })
  })
}
