"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const accountSchema = new Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    email: String,
    username: String,
    password: String,
    score: Number,
    scoreHistory: [Number],
});
exports.default = mongoose_1.default.models.Account
    || mongoose_1.default.model('Account', accountSchema);
