import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Player = new Schema({
  sid: String,
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
});

const battleSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: Date,
  roomCode: String,
  battleMode: String,
  questionId: Number,
  players: [Player],
  submissions: [Player],
  winner: Player
});

export default mongoose.models.Battle || mongoose.model('Battle', battleSchema);
