export interface Room {
  players: string[];
  isPublic: boolean;
  roomCode?: string;
  gameStarted?: boolean;
}
