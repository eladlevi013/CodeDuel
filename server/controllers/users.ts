import { Request, Response } from 'express';
import Account from '../models/Account';
import SessionModel from '../models/SessionModel';

/**
 * @swagger
 * /users/score:
 *   get:
 *     tags:
 *       - Account
 *     summary: Retrieve account score
 *     responses:
 *       200:
 *         description: Account score retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Score retrieved
 *                 score:
 *                   type: integer
 *                   example: 85
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account not found
 *     security:
 *       - sessionAuth: []
 */
export const getScore = async (req: Request, res: Response) => {
  const accountId = (req.session as SessionModel).account;
  const account = await Account.findById(accountId);

  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  } else {
    return res.status(200).json({
      message: 'Score retrieved',
      score: account.score
    });
  }
};

/**
 * @swagger
 * /users/leaderboard:
 *   get:
 *     tags:
 *       - Account
 *     summary: Retrieve the top 10 accounts based on score
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leaderboard retrieved
 */
export const getLeaderboard = async (req: Request, res: Response) => {
  Account.find()
    .sort({ score: -1 })
    .limit(10)
    .then(results => {
      return res.status(200).json({
        message: 'Leaderboard retrieved',
        leaderboard: results
      });
    })
    .catch(error => {
      console.log(error.message);
    });
};
