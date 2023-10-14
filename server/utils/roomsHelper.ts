import Account from "../models/Account";
import { LoggedInPlayer, Player, Room } from "../models/Room";

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

export const quickMatch = async (uid: string | null, rooms: Map<string, Room>) => {
  const loggedIn = uid !== null;
  const roomCode = roomCodeGenerator();
  
  if (loggedIn) {
    const account = await Account.findOne({ _id: uid });
    if (!account) return;

    const player: LoggedInPlayer = {
      sid: '',
      uid: account._id,
      username: account.username,
      score: account.score
    };
  }
}