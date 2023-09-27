import { Request, Response } from 'express';
import axios from 'axios';
import { pollForResult } from './utils';

export async function executeCode(req: Request, res: Response): Promise<void> {
    const submissionOptions = {
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        method: 'POST',
        headers: {
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "language_id": 71,
            "source_code": "print('Hello World')",
        })
    };

    try {
        const submissionResponse = await axios(submissionOptions);
        const token = submissionResponse.data.token;
        const resultResponse = await pollForResult(token);
        res.send(resultResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).send((error as Error).toString());
    }
}
