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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScore = exports.register = exports.logout = exports.login = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const Account_1 = __importDefault(require("../models/Account"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Input validation
        yield (0, express_validator_1.body)('email')
            .isEmail().withMessage('Please provide a valid email address.')
            .normalizeEmail()
            .run(req);
        yield (0, express_validator_1.body)('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
            .trim()
            .run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        // Credentials validation
        const { email, password } = req.body;
        const account = yield Account_1.default.findOne({ email });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        if (!(yield bcryptjs_1.default.compare(password, account.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Set session data
        req.session.account = account._id;
        req.session.save();
        return res.status(200).json({
            message: 'Logged in successfully',
            account: account
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout. Try again.' });
        }
        // Clear the session cookie from the client's browser
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully' });
    });
});
exports.logout = logout;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Input validation
        yield (0, express_validator_1.body)('email')
            .isEmail().withMessage('Please provide a valid email address.')
            .normalizeEmail()
            .run(req);
        yield (0, express_validator_1.body)('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
            .trim()
            .run(req);
        yield (0, express_validator_1.body)('username')
            .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
            .trim()
            .run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        const { email, password, username } = req.body;
        const existingAccount = yield Account_1.default.findOne({ email });
        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists' });
        }
        const id = new mongoose_1.default.Types.ObjectId();
        const hash = yield bcryptjs_1.default.hash(password, 10);
        const newAccount = new Account_1.default({
            _id: id,
            email: email,
            username: username,
            password: hash,
            role: 'User',
            levelsData: {},
            score: 0
        });
        const account = yield newAccount.save();
        // Set session data
        req.session.account = account._id;
        req.session.save();
        return res.status(200).json({
            message: 'Account created',
            account: account,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});
exports.register = register;
const getScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accountId = req.session.account;
    const account = yield Account_1.default.findById(accountId);
    if (!account) {
        return res.status(404).json({ message: 'Account not found' });
    }
    else {
        return res.status(200).json({
            message: 'Score retrieved',
            score: account.score,
        });
    }
});
exports.getScore = getScore;
