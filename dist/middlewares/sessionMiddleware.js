"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
exports.default = (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    name: 'sessionServer',
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 2592000000,
        sameSite: 'none',
    },
    store: connect_mongo_1.default.create({ mongoUrl: process.env.MONGO_URL }),
});
