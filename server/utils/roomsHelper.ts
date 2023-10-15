import Account from "../models/Account";
import { LoggedInPlayer, Player, Room } from "../models/Room";
import { ROOM_FULL_SOCKET_EVENET, PLAYERS_PER_ROOM, JOINED_ROOM_SOCKET_EVENT } from "../socket";
import { GET_ROOMS_SOCKET_EVENT, ROOM_NOT_FOUND_SOCKET_EVENT, START_GAME_SOCKET_EVENT, updatePariticipantScore } from "../socket";
import { questions } from "../db/questions";

export const publicRooms = (rooms:Map<string, Room>) => {
  const roomsArray: Room[] = [];

  for (const [roomCode, room] of rooms.entries()) {
    if (room.isPublic && room.players.length < 2)
      roomsArray.push({ ...room, roomCode });
  }
  
  return roomsArray;
}

export const roomCodeGenerator = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

export const getRoomCodeFromSocketId = (socketId: string, rooms:Map<string, Room>): string => {
  for (const [roomCode, room] of rooms.entries()) {
    if (room.players.some(player => player.sid === socketId)) {
      return roomCode;
    }
  }

  return '';
}

export const joinRoom = async (socket: any, io: any, rooms: Map<string, Room>, roomCode: string, uid: string | null) => {
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
        const question = questions[Math.floor(Math.random() * questions.length)];
        // const question = questions[3];
        room.gameStarted = true;
        io.to(roomCode).emit(START_GAME_SOCKET_EVENT, question);

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
}

export const quickMatch = async (uid: string | null, rooms: Map<string, Room>) => {
  const loggedIn = uid !== null && uid !== undefined;

  // filtered rooms
  const roomsFiltered = publicRooms(rooms).filter((room: { players: any[]; }) => room.players.length == 1);
  const loggedInPlayersRooms = Array.from(roomsFiltered.values()).filter((room: { players: any[]; }) =>
    room.players.some((player: any) => 'uid' in player));
  const guestPlayersRooms = Array.from(roomsFiltered.values()).filter((room: { players: any[]; }) =>
    room.players.some((player: any) => !('uid' in player)));

  if (loggedIn) {
    if (loggedInPlayersRooms.length > 0) {
      const player = await Account.findById(uid);
      const playerScore = player?.score;

      let closestRoom = loggedInPlayersRooms[0];
      let closestScoreDifference = Math.abs((closestRoom.players[0] as LoggedInPlayer).score - playerScore!);

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
}

export const createOrJoinEmptyRoom = async (rooms: Map<string, Room>) => {
  const emptyRooms = Array.from(rooms.values()).filter((room: { players: any[]; }) => room.players.length === 0);
  if (emptyRooms.length > 0) {
    const room = emptyRooms[0];
    return room.roomCode;
  } else {
    const roomCode = roomCodeGenerator();
    const room = { players: [], isPublic: true, gameStarted: false, 
      countdownStarted: false, successfulSubmissions: [], roomCode: roomCode };
    rooms.set(roomCode, room);
    return roomCode;
  }
}
