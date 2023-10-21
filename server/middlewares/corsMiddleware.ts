import cors from 'cors';

export default cors({
  origin: process.env.CLIENT_URL,
  credentials: true
});
