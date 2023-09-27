export interface Room {
  players: string[];
  isPublic: boolean;
  roomCode?: string;
}

export const rooms = new Map<string, Room>();