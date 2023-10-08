import { Room } from "../models/Room";

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