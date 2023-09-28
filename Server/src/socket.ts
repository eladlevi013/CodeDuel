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

    socket.on('disconnect', () => {
      for (const [roomCode, room] of rooms) {
          const playerIndex = room.players.indexOf(socket.id);
          if (playerIndex > -1) {
            socket.to(roomCode).emit('playerDisconnected', 'The other player has left the game');
            
            // Remove player from room
            room.players.splice(playerIndex, 1);

            // If the room is empty, delete it from the rooms map
            if (room.players.length === 0) {
                rooms.delete(roomCode);
            }
            
            // If the game started and there's only one player left, you might want to delete the room or reset it
            if (room.gameStarted && room.players.length === 1) {
              socket.to(roomCode).emit('otherPlayerLeft');
              rooms.delete(roomCode);
            }
            
            break;
          }
      }
  
      const publicRoomsArray = publicRooms();
      io.emit('getRooms', publicRoomsArray);
  });
  

    socket.on('leaveRoom', (roomCode) => {
      const room = rooms.get(roomCode);

      if (room) {
        const index = room.players.indexOf(socket.id);
        if (index > -1) {
          room.players.splice(index, 1);
          socket.leave(roomCode);
        }
      }

      const publicRoomsArray = publicRooms();
      io.emit('getRooms', publicRoomsArray);
    });
    
    
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
            room.gameStarted = true;
            io.to(roomCode).emit('startGame', question);
          }
        }
      }

      const publicRoomsArray = publicRooms();
      io.emit('getRooms', publicRoomsArray);
    })

    // chat events
    socket.on('sendMessage', (message: string, roomCode: string) => {
      console.log(message, roomCode);
      socket.to(roomCode).emit('receiveMessage', message);
    });
  })
}
