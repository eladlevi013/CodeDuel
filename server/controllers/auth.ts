import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import Account from '../models/Account';
import SessionModel from '../models/SessionModel';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
 *     description: Authenticate a user and return the user data and token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Input validation error
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user by providing email, username, and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *     responses:
 *       200:
 *         description: Successfully registered a new user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Account already exists or input validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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
            .isLength({ min: 3, max: 10 }).withMessage('Username must be between 3 and 10 characters long.')
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