export interface Room {
  players: string[];
  isPublic: boolean;
  roomCode?: string;
  gameStarted?: boolean;
}

export const rooms = new Map<string, Room>();