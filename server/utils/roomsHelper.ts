import Account from '../models/Account';
import { LoggedInPlayer, Room } from '../models/Room';
import { ROOM_FULL_SOCKET_EVENET, PLAYERS_PER_ROOM, JOINED_ROOM_SOCKET_EVENT } from '../socket';
import {
  GET_ROOMS_SOCKET_EVENT,
  ROOM_NOT_FOUND_SOCKET_EVENT,
  START_GAME_SOCKET_EVENT,
  ROOM_MANAGEMENT_ERROR_SOCKET_EVENT,
  updatePariticipantScore,
  SQL_GAME_MODE,
  CODING_GAME_MODE
} from '../socket';
import { questions } from '../db/codingQuestions';
import { getTypeByLanguage } from '../executors/codeExecutor/languageUtil/languageHelper';
import { sqlQuestions } from '../db/sqlQuestions';
import { getExampleAnswer, getTablePreview } from '../executors/sqlExecutor/runSqlCheck';

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

  for (let i = 0; i < 6; i++) {
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
      // adding player to room object
      if (uid == null) {
        room.players.push({ sid: socket.id });
      } else {
        const account = await Account.findById(uid);
        const username = account?.username;
        const score = account?.score;

        room.players.push({ sid: socket.id, uid: uid, username: username, score: score });
      }

      // Join the room
      socket.join(roomCode);
      socket.emit(JOINED_ROOM_SOCKET_EVENT, roomCode);

      if (room.players.length == PLAYERS_PER_ROOM) {
        // deep copy of question object
        const question =
          room.mode === SQL_GAME_MODE
            ? JSON.parse(
                JSON.stringify(sqlQuestions[Math.floor(Math.random() * sqlQuestions.length)])
              )
            : JSON.parse(JSON.stringify(questions[Math.floor(Math.random() * questions.length)]));

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
    const roomCode = roomCodeGenerator();
    const room = {
      players: [],
      isPublic: true,
      gameStarted: false,
      countdownStarted: false,
      successfulSubmissions: [],
      roomCode: roomCode,
      mode: Math.floor(Math.random() * 1 + 1) === 1 ? CODING_GAME_MODE : SQL_GAME_MODE
    };
    rooms.set(roomCode, room);
    return roomCode;
  }
};
