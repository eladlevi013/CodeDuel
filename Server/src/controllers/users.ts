import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import Account from '../models/account';
import { Session } from 'express-session';

interface AccountSession extends Session {
    account?: any;
}

export const login = async (req: Request, res: Response) => {
    try {
        // Input validation
        await body('email')
            .isEmail().withMessage('Please provide a valid email address.')
            .normalizeEmail()
            .run(req);

        await body('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
            .trim()
            .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        // credentials validation
        const { email, password } = req.body;
        const account = await Account.findOne({ email });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        const isMatch = await bcryptjs.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Set session variable
        const sessionId = (req.session as AccountSession).id;

        return res.status(200).json({
            message: 'Logged in successfully',
            sessionId: sessionId,
            account: account
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        // Input validation
        await body('email')
            .isEmail().withMessage('Please provide a valid email address.')
            .normalizeEmail()
            .run(req);

        await body('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
            .trim()
            .run(req);

        await body('username')
            .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
            .trim()
            .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { email, password, username } = req.body;
        const existingAccount = await Account.findOne({ email });
        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists' });
        }

        const id = new mongoose.Types.ObjectId();
        const hash = await bcryptjs.hash(password, 10);
        const newAccount = new Account({
            _id: id,
            email: email,
            username: username,
            password: hash,
            role: 'User',
            levelsData: {},
            currentLevel: 1
        });

        const sessionId = (req.session as AccountSession).id;
        const account = await newAccount.save();
        
        return res.status(200).json({
            message: 'Account created',
            account: account,
            sessionId: sessionId,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
};
