"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomCodeGenerator = exports.publicRooms = void 0;
const publicRooms = (rooms) => {
    const roomsArray = [];
    for (const [roomCode, room] of rooms.entries()) {
        if (room.isPublic && room.players.length < 2)
            roomsArray.push(Object.assign(Object.assign({}, room), { roomCode }));
    }
    return roomsArray;
};
exports.publicRooms = publicRooms;
const roomCodeGenerator = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
};
exports.roomCodeGenerator = roomCodeGenerator;
