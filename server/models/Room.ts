export interface BasePlayer {
  sid: string; // socket id for every player
}

export interface LoggedInPlayer extends BasePlayer {
  uid: string;  // user id for logged-in players
  initialScoreZero: boolean;
}

export interface GuestPlayer extends BasePlayer {}

export type Player = LoggedInPlayer | GuestPlayer;

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
