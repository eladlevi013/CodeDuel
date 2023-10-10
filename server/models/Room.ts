export interface BasePlayer {
  sid: string; // socket id
}

export interface LoggedInPlayer extends BasePlayer {
  uid: string;  // mongodb user id
  initialScoreZero: boolean;
}

export type Player = LoggedInPlayer | BasePlayer;

export interface Submission {
  player: Player; 
  time: string;
  memory: number;
}

export interface Room {
  players: Player[];
  isPublic: boolean;
  roomCode: string;
  gameStarted: boolean;
  countdownStarted: boolean;
  successfulSubmissions: Submission[];
}
