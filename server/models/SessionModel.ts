import { Session } from 'express-session';

export default interface SessionModel extends Session {
  account?: any;
}
