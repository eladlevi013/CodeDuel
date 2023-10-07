export interface Player {
  sid: string;
  uid: string;
}

export interface SubmissionStats {
  time: string;
  memory: number;
}

export interface Room {
  players: Player[];
  isPublic: boolean;
  roomCode?: string;
  gameStarted?: boolean;
  countdown?: boolean;
  successfulSubmissions?: Map<string, SubmissionStats>;
}
