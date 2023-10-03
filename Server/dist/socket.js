"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
const runTestCases_1 = require("./codeExecutor/runTestCases");
const questions_1 = require("./db/questions");
const socket_io_1 = require("socket.io");
const roomsHelper_1 = require("./utils/roomsHelper");
// define constants
const PLAYERS_PER_ROOM = 2;
const CONNECTION_SOCKET_EVENT = 'connection';
const CODE_SUBMISSION_SOCKET_EVENT = 'codeSubmission';
const CODE_SUCCESS_SOCKET_EVENT = 'codeSuccess';
const CODE_WRONG_SOCKET_EVENT = 'codeWrong';
const CODE_ERROR_SOCKET_EVENT = 'codeError';
const SEND_ROOMS_SOCKET_EVENT = 'sendRooms';
const GET_ROOMS_SOCKET_EVENT = 'getRooms';
const DISCONNECT_SOCKET_EVENT = 'disconnect';
const OTHER_PLAYER_LEFT_SOCKET_EVENT = 'otherPlayerLeft';
const LEAVE_ROOM_SOCKET_EVENT = 'leaveRoom';
const CREATE_ROOM_SOCKET_EVENT = 'createRoom';
const CREATED_ROOM_SOCKET_EVENT = 'createdRoom';
const JOIN_ROOM_SOCKET_EVENT = 'joinRoom';
const JOINED_ROOM_SOCKET_EVENT = 'joinedRoom';
const START_GAME_SOCKET_EVENT = 'startGame';
const SEND_MESSAGE_SOCKET_EVENT = 'sendMessage';
const RECEIVE_MESSAGE_SOCKET_EVENT = 'receiveMessage';
const START_GAME_TIMER_SOCKET_EVENT = 'startGameTimer';
const END_GAME_SOCKET_EVENT = 'endGame';
const SECONDS_POST_SUCCESSFUL_CODE_SUBMISSION = 15;
const rooms = new Map();
const getRoomCodeFromSocketId = (socketId) => {
    for (const [roomCode, room] of rooms) {
        if (room.players.includes(socketId)) {
            return roomCode;
        }
    }
    return '';
};
const getRoomWinner = (roomCode) => {
    const room = rooms.get(roomCode);
    let winner = '';
    let minTime = Number.MAX_SAFE_INTEGER;
    if (room) {
        for (const [socketId, submissionStats] of room.successfulSubmissions) {
            const time = parseInt(submissionStats.time);
            if (time < minTime) {
                minTime = time;
                winner = socketId;
            }
        }
    }
    return winner;
};
const setupSocketIO = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, { cors: { origin: '*' } });
    io.on(CONNECTION_SOCKET_EVENT, (socket) => {
        socket.on(CODE_SUBMISSION_SOCKET_EVENT, (code, questionId, language) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            const result = yield (0, runTestCases_1.runTestCases)(code, questionId, language);
            const errorMessage = result.stderr || result.compile_output;
            if (errorMessage) {
                socket.emit(CODE_ERROR_SOCKET_EVENT, errorMessage.slice(0, 200).concat('...'));
                return;
            }
            if (result.message) {
                socket.emit(CODE_ERROR_SOCKET_EVENT, result.message);
                return;
            }
            if (!result.stdout.toLowerCase().includes('true')) {
                socket.emit(CODE_WRONG_SOCKET_EVENT);
                return;
            }
            const roomCode = getRoomCodeFromSocketId(socket.id);
            const room = rooms.get(roomCode);
            if (!roomCode || !room) {
                console.error(`RoomCode: ${roomCode}, or Room does not exist.`);
                return;
            }
            (_a = room.successfulSubmissions) === null || _a === void 0 ? void 0 : _a.set(socket.id, {
                time: result.time,
                memory: result.memory
            });
            if (((_b = room.successfulSubmissions) === null || _b === void 0 ? void 0 : _b.size) === room.players.length) {
                io.in(roomCode).emit(END_GAME_SOCKET_EVENT, getRoomWinner(roomCode));
                room.countdown = false;
                rooms.delete(roomCode);
            }
            if (((_c = room.successfulSubmissions) === null || _c === void 0 ? void 0 : _c.size) === 1) {
                socket.to(roomCode).emit(START_GAME_TIMER_SOCKET_EVENT);
                socket.emit(CODE_SUCCESS_SOCKET_EVENT);
                room.countdown = true;
                setTimeout(() => {
                    const currentRoom = rooms.get(roomCode);
                    if (currentRoom && currentRoom.countdown) {
                        io.in(roomCode).emit(END_GAME_SOCKET_EVENT, getRoomWinner(roomCode));
                        currentRoom.countdown = false;
                        rooms.delete(roomCode);
                    }
                }, SECONDS_POST_SUCCESSFUL_CODE_SUBMISSION * 1000);
            }
        }));
        socket.on(SEND_ROOMS_SOCKET_EVENT, () => {
            socket.emit(GET_ROOMS_SOCKET_EVENT, (0, roomsHelper_1.publicRooms)(rooms));
        });
        socket.on(DISCONNECT_SOCKET_EVENT, () => {
            for (const [roomCode, room] of rooms) {
                const playerIndex = room.players.indexOf(socket.id);
                if (playerIndex > -1) {
                    room.players.splice(playerIndex, 1);
                    if (room.gameStarted && room.players.length === 1) {
                        socket.to(roomCode).emit(OTHER_PLAYER_LEFT_SOCKET_EVENT);
                        rooms.delete(roomCode);
                    }
                    break;
                }
            }
            io.emit(GET_ROOMS_SOCKET_EVENT, (0, roomsHelper_1.publicRooms)(rooms));
        });
        socket.on(LEAVE_ROOM_SOCKET_EVENT, (roomCode) => {
            const room = rooms.get(roomCode);
            if (room) {
                const index = room.players.indexOf(socket.id);
                if (index > -1) {
                    room.players.splice(index, 1);
                    socket.leave(roomCode);
                }
            }
            io.emit(GET_ROOMS_SOCKET_EVENT, (0, roomsHelper_1.publicRooms)(rooms));
        });
        socket.on(CREATE_ROOM_SOCKET_EVENT, (isPublic) => {
            const roomCode = (0, roomsHelper_1.roomCodeGenerator)().toString();
            rooms.set(roomCode, { players: [], isPublic: isPublic, gameStarted: false,
                countdown: false, successfulSubmissions: new Map() });
            socket.emit(CREATED_ROOM_SOCKET_EVENT, roomCode);
            io.emit(GET_ROOMS_SOCKET_EVENT, (0, roomsHelper_1.publicRooms)(rooms));
        });
        socket.on(JOIN_ROOM_SOCKET_EVENT, (roomCode) => {
            if (rooms.has(roomCode)) {
                const room = rooms.get(roomCode);
                if (room && room.players[0] !== socket.id) {
                    room.players.push(socket.id);
                    socket.join(roomCode);
                    socket.emit(JOINED_ROOM_SOCKET_EVENT, roomCode);
                    if (room.players.length == PLAYERS_PER_ROOM) {
                        // const question = questions[Math.floor(Math.random() * questions.length)];
                        const question = questions_1.questions[5];
                        room.gameStarted = true;
                        io.to(roomCode).emit(START_GAME_SOCKET_EVENT, question);
                    }
                }
            }
            io.emit(GET_ROOMS_SOCKET_EVENT, (0, roomsHelper_1.publicRooms)(rooms));
        });
        socket.on(SEND_MESSAGE_SOCKET_EVENT, (message, roomCode) => {
            socket.to(roomCode).emit(RECEIVE_MESSAGE_SOCKET_EVENT, message);
        });
    });
};
exports.setupSocketIO = setupSocketIO;
