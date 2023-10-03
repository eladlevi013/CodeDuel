import mongoose from "mongoose";
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    email: String,
    username: String,
    password: String,
    score: Number,
    scoreHistory: [Number],
});

export default mongoose.models.Account 
    || mongoose.model('Account', accountSchema);