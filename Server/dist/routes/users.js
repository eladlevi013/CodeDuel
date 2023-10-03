"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const users_1 = require("../controllers/users");
router.post('/login', users_1.login);
router.post('/register', users_1.register);
router.get('/hey', (req, res) => {
    res.send('hey');
});
exports.default = router;
