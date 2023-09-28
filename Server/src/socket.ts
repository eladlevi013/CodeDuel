import axios from 'axios';
import { pollForResult } from './utils';
import { questions } from './questions';
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
    socket.on('codeSubmission', async (code: string, questionId: string, language: string) => {
      let languageId;
      let trimmedLanguage = language.trim().toLowerCase();

      switch (trimmedLanguage) {
        case 'python':
          languageId = 71;
          break;
        case 'javascript':
          languageId = 63;
          break;
        case "java":
          languageId = 62;
          break;
        default:
          return;
      }

      // checking test cases on given code
      const question = questions[parseInt(questionId) - 1];
      const testCases: Map<string, string> = question.testCases;

      let checkStatement = "";
      switch (trimmedLanguage) {
        case 'python':
          if (question.funcSignature.returnType === 'string') {
            checkStatement = `print(${[...testCases].map(([input, output]) => `${question.funcSignature.name}('${input}') == '${output}'`).join(' and ')})`;
          } else {
            checkStatement = `print(${[...testCases].map(([input, output]) => `${question.funcSignature.name}(${input}) == ${output}`).join(' and ')})`;
          }
          break;
          
        case 'javascript':
          if (question.funcSignature.returnType === 'string') {
            checkStatement = `console.log(${[...testCases].map(([input, output]) => `${question.funcSignature.name}('${input}') === '${output}'`).join(' && ')})`;
          } else {
            checkStatement = `console.log(${[...testCases].map(([input, output]) => `${question.funcSignature.name}(${input}) === ${output}`).join(' && ')})`;
          }
          break;

        case 'java':
          const className = "Main";
          const methodStatements = [...testCases].map(([input, output]) => {
            if (question.funcSignature.returnType === 'string') {
              return `System.out.println(${question.funcSignature.name}("${input}").equals("${output}"));`;
            } else {
              return `System.out.println(${question.funcSignature.name}(${input}) == ${output});`;
            }
          }).join('\n');
          
          checkStatement = `
            public class ${className} {
              ${code}

              public static void main(String[] args) {
                ${methodStatements}
              }
            }
          `;
        break;
      }

      const finalCode = trimmedLanguage === 'java' ? checkStatement : `${code}\n${checkStatement}`;

      console.log(finalCode);

      const result = await executeCode(languageId, finalCode);
      
      console.log(result);
      socket.emit('codeResult', result.stdout);
    });

    async function executeCode(languageId:number, code:string) {
      const submissionOptions = {
          url: 'http://localhost:2358/submissions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({
            "language_id": languageId,
            "source_code": code,
          })
      };
  
      try {
          const submissionResponse = await axios(submissionOptions);
          const token = submissionResponse.data.token;
          const resultResponse = await pollForResult(token);
          return resultResponse.data;
      } catch (error) {
          console.error(error);
          throw error;
      }
  }

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
