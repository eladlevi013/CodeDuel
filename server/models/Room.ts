export interface BasePlayer {
  sid: string; // socket id
}

export interface LoggedInPlayer extends BasePlayer {
  uid: string | Object; // mongodb user id
  username: string;
  score: number;
}

export type Player = LoggedInPlayer | BasePlayer;

export interface Room {
  players: Player[];
  mode: string;
  questionId: number;
  isPublic: boolean;
  roomCode: string;
  gameStarted: boolean;
  countdownStarted: boolean;
  successfulSubmissions: Player[];
}
