export interface SubmissionStats {
  time: string;
  memory: number;
}

export interface Room {
  players: string[];
  isPublic: boolean;
  roomCode?: string;
  gameStarted?: boolean;
  countdown?: boolean;
  successfulSubmissions?: Map<string, SubmissionStats>;
}
