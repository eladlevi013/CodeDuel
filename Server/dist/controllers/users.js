"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const Account_1 = __importDefault(require("../models/Account"));
const login = async (req, res) => {
    try {
        // Input validation
        await (0, express_validator_1.body)('email')
            .isEmail().withMessage('Please provide a valid email address.')
            .normalizeEmail()
            .run(req);
        await (0, express_validator_1.body)('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
            .trim()
            .run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        // credentials validation
        const { email, password } = req.body;
        const account = await Account_1.default.findOne({ email });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Set session variable
        const sessionId = req.session.id;
        return res.status(200).json({
            message: 'Logged in successfully',
            sessionId: sessionId,
            account: account
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        // Input validation
        await (0, express_validator_1.body)('email')
            .isEmail().withMessage('Please provide a valid email address.')
            .normalizeEmail()
            .run(req);
        await (0, express_validator_1.body)('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
            .trim()
            .run(req);
        await (0, express_validator_1.body)('username')
            .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
            .trim()
            .run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        const { email, password, username } = req.body;
        const existingAccount = await Account_1.default.findOne({ email });
        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists' });
        }
        const id = new mongoose_1.default.Types.ObjectId();
        const hash = await bcryptjs_1.default.hash(password, 10);
        const newAccount = new Account_1.default({
            _id: id,
            email: email,
            username: username,
            password: hash,
            role: 'User',
            levelsData: {},
            currentLevel: 1
        });
        const sessionId = req.session.id;
        const account = await newAccount.save();
        return res.status(200).json({
            message: 'Account created',
            account: account,
            sessionId: sessionId,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
};
exports.register = register;
