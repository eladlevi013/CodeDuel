export interface Player {
  sid: string;
  uid: string;
}

export interface Submission {
  uid: string;
  time: string;
  memory: number;
}

export interface Room {
  players: Player[];
  isPublic: boolean;
  roomCode: string;
  gameStarted: boolean;
  countdown: boolean;
  successfulSubmissions: Submission[];
}
