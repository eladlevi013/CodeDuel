import Account from '../models/Account';
import { LoggedInPlayer, Player, Room } from '../models/Room';
import { ROOM_FULL_SOCKET_EVENET, PLAYERS_PER_ROOM, JOINED_ROOM_SOCKET_EVENT } from '../socket';
import {
  GET_ROOMS_SOCKET_EVENT,
  ROOM_NOT_FOUND_SOCKET_EVENT,
  START_GAME_SOCKET_EVENT,
  ROOM_MANAGEMENT_ERROR_SOCKET_EVENT,
  SQL_GAME_MODE,
  CODING_GAME_MODE
} from '../socket';
import { questions } from '../questions/coding/codingQuestions';
import { getTypeByLanguage } from '../executors/codeExecutor/languageUtil/languageHelper';
import { sqlQuestions } from '../questions/sql/sqlQuestions';
import { getExampleAnswer, getTablePreview } from '../executors/sqlExecutor/runSqlCheck';
import { updatePariticipantScore } from './scoreHandler';
import Battle from '../models/Battle';
import mongoose from 'mongoose';

export const publicRooms = (rooms: Map<string, Room>) => {
  const roomsArray: Room[] = [];

  for (const [roomCode, room] of rooms.entries()) {
    if (room.isPublic && room.players.length < 2) roomsArray.push({ ...room, roomCode });
  }

  return roomsArray;
};

export const roomCodeGenerator = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const getRoomCodeFromSocketId = (socketId: string, rooms: Map<string, Room>): string => {
  for (const [roomCode, room] of rooms.entries()) {
    if (room.players.some(player => player.sid === socketId)) {
      return roomCode;
    }
  }

  return '';
};

export const joinRoom = async (
  socket: any,
  io: any,
  rooms: Map<string, Room>,
  roomCode: string,
  uid: string | null
) => {
  if (rooms.has(roomCode)) {
    const room = rooms.get(roomCode);

    // if room is full
    if (room && room.players.length === PLAYERS_PER_ROOM) {
      socket.emit(ROOM_FULL_SOCKET_EVENET);
      return;
    }

    // checking if logged-in player is already in the room
    if (room && room.players.some(player => 'uid' in player && player.uid === uid)) {
      socket.emit(
        ROOM_MANAGEMENT_ERROR_SOCKET_EVENT,
        'You are already in this room from another client!'
      );
      return;
    }

    // checking whether the socketid is already in the room
    if (
      (room && room.players[0] && room.players[0].sid !== socket.id) ||
      (room && room.players.length === 0)
    ) {
      let username = null;

      // adding player to room object
      if (uid == null) {
        room.players.push({ sid: socket.id });
      } else {
        const account = await Account.findById(uid);
        username = account?.username;
        const score = account?.score;
        room.players.push({ sid: socket.id, uid: uid, username: username, score: score });
      }

      console.log(
        `${username == null ? 'Anonymous' : `player ${username}`} joins room ${roomCode} 👋`
      );

      // Join the room
      socket.join(roomCode);
      socket.emit(JOINED_ROOM_SOCKET_EVENT, roomCode);

      if (room.players.length == PLAYERS_PER_ROOM) {
        // deep copy of question object
        const question =
          room.mode === SQL_GAME_MODE
            ? JSON.parse(JSON.stringify(sqlQuestions[room.questionId]))
            : JSON.parse(JSON.stringify(questions[room.questionId]));

        if (room.mode === CODING_GAME_MODE) {
          // updating question data-types
          question.funcSignature.args.forEach(
            (arg: { type: { base: any; java: string; python: string } }) => {
              arg.type = {
                base: arg.type,
                java: getTypeByLanguage(arg.type).java,
                python: getTypeByLanguage(arg.type).python
              };
            }
          );

          // updating question return type
          question.funcSignature.returnType = {
            base: question.funcSignature.returnType,
            java: getTypeByLanguage(question.funcSignature.returnType).java,
            python: getTypeByLanguage(question.funcSignature.returnType).python
          };
        } else if (room.mode === SQL_GAME_MODE) {
          question.example = await getExampleAnswer(question.id);

          // updating question tables data
          for (const tableName of Object.keys(question.tables)) {
            question.tables[tableName] = await getTablePreview(tableName);
          }
        }

        room.gameStarted = true;
        io.to(roomCode).emit(START_GAME_SOCKET_EVENT, question, room.mode);

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
};

export const quickMatch = async (uid: string | null, rooms: Map<string, Room>) => {
  const loggedIn = uid !== null && uid !== undefined;

  // filtered rooms
  const roomsFiltered = publicRooms(rooms).filter(
    (room: { players: any[] }) => room.players.length == 1
  );
  const loggedInPlayersRooms = Array.from(roomsFiltered.values()).filter(
    (room: { players: any[] }) => room.players.some((player: any) => 'uid' in player)
  );
  const guestPlayersRooms = Array.from(roomsFiltered.values()).filter((room: { players: any[] }) =>
    room.players.some((player: any) => !('uid' in player))
  );

  if (loggedIn) {
    if (loggedInPlayersRooms.length > 0) {
      const player = await Account.findById(uid);
      const playerScore = player?.score;

      let closestRoom = loggedInPlayersRooms[0];
      let closestScoreDifference = Math.abs(
        (closestRoom.players[0] as LoggedInPlayer).score - playerScore!
      );

      for (let i = 1; i < loggedInPlayersRooms.length; i++) {
        const roomPlayerScore = (loggedInPlayersRooms[i].players[0] as LoggedInPlayer).score;
        const scoreDifference = Math.abs(roomPlayerScore - playerScore!);

        if (scoreDifference < closestScoreDifference) {
          closestRoom = loggedInPlayersRooms[i];
          closestScoreDifference = scoreDifference;
        }
      }

      return closestRoom.roomCode;
    } else {
      if (guestPlayersRooms.length > 0) {
        return guestPlayersRooms[0].roomCode;
      } else {
        return createOrJoinEmptyRoom(rooms);
      }
    }
  } else {
    if (guestPlayersRooms.length > 0) {
      return guestPlayersRooms[0].roomCode;
    } else {
      if (loggedInPlayersRooms.length > 0) {
        return loggedInPlayersRooms[0].roomCode;
      } else {
        return createOrJoinEmptyRoom(rooms);
      }
    }
  }
};

export const createOrJoinEmptyRoom = async (rooms: Map<string, Room>) => {
  const emptyRooms = Array.from(rooms.values()).filter(
    (room: { players: any[] }) => room.players.length === 0
  );
  if (emptyRooms.length > 0) {
    const room = emptyRooms[0];
    return room.roomCode;
  } else {
    return createRoom(rooms, null, null);
  }
};

export const createRoom = (
  rooms: Map<string, Room>,
  gameMode: string | null,
  isPublic: boolean | null
) => {
  const roomCode = roomCodeGenerator();

  if (gameMode === null) {
    gameMode = Math.floor(Math.random() * 2) == 0 ? CODING_GAME_MODE : SQL_GAME_MODE;
  }

  const room = {
    players: [],
    isPublic: isPublic == null ? true : isPublic,
    gameStarted: false,
    countdownStarted: false,
    successfulSubmissions: [],
    roomCode: roomCode,
    mode: gameMode,
    questionId:
      gameMode === SQL_GAME_MODE
        ? Math.floor(Math.random() * sqlQuestions.length)
        : Math.floor(Math.random() * questions.length)
  };
  rooms.set(roomCode, room);
  console.log(
    `Creating room: ${room.roomCode}, with mode: ${room.mode} and isPublic: ${room.isPublic} 🎉`
  );

  return roomCode;
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
      console.log(`Player ${index + 1}:`, JSON.stringify(player, null, 2));
    });

    console.log('Successful Submissions:');
    room.successfulSubmissions.forEach((submission, index) => {
      console.log(`Submission ${index + 1}:`);
      console.log('Player:', JSON.stringify(submission, null, 2));
    });

    console.log('-----------------------');
  });
}

export function addingBattleToDB(room: Room, winner: Player | null) {
  // converting uid to mongoose.Types.ObjectId
  room.players.forEach(player => {
    if ('uid' in player) {
      player.uid = new mongoose.Types.ObjectId(player.uid.toString());
    }
  });

  // converting winner uid to mongoose.Types.ObjectId
  if (winner && 'uid' in winner) {
    winner.uid = new mongoose.Types.ObjectId(winner.uid.toString());
  }

  const battle = new Battle({
    _id: new mongoose.Types.ObjectId(),
    date: new Date(),
    roomCode: room.roomCode,
    battleMode: room.mode,
    questionId: room.questionId,
    players: room.players,
    submissions: room.successfulSubmissions,
    winner: winner
  });

  battle.save();

  console.log(`Battle ${room.roomCode} saved to DB! 📝`);
}
