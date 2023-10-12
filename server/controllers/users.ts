import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import Account from '../models/Account';
import SessionModel from '../models/SessionModel';

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

        // Credentials validation
        const { email, password } = req.body;
        const account = await Account.findOne({ email });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        
        if (!await bcryptjs.compare(password, account.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Set session data
        (req.session as SessionModel).account = account._id;
        req.session.save();

        return res.status(200).json({
            message: 'Logged in successfully',
            account: account
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}

export const logout = async (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout. Try again.' });
        }
        
        // Clear the session cookie from the client's browser
        res.clearCookie('connect.sid');
        
        return res.status(200).json({ message: 'Logged out successfully' });
    });
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
            score: 0
        });

        const account = await newAccount.save();

        // Set session data
        (req.session as SessionModel).account = account._id;
        req.session.save();

        return res.status(200).json({
            message: 'Account created',
            account: account,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
};

export const getScore = async (req: Request, res: Response) => {
    const accountId = (req.session as SessionModel).account;
    const account = await Account.findById(accountId);

    if (!account) {
        return res.status(404).json({ message: 'Account not found' });
    } else {
        return res.status(200).json({
            message: 'Score retrieved',
            score: account.score,
        });
    }
};

export const getLeaderboard = async (req: Request, res: Response) => {
    Account.find().sort({score: -1}).limit(10)
    .then(results => {
        return res.status(200).json({
            message: 'Leaderboard retrieved',
            leaderboard: results,
        });
    })
    .catch(error => {console.log(error.message)})
};