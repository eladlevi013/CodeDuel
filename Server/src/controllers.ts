import { Request, Response } from 'express';
import axios from 'axios';
import { pollForResult } from './utils';
import { questions } from './questions';

export async function runTestCases(req: Request, res: Response): Promise<void> {
    const questionId = req.body.questionId;
    const code = req.body.code;

    const language = req.body.language;
    let languageId;

    // language validation
    if (!language || typeof language !== 'string' 
        || language.trim() === ''  || language.length > 50) {
        res.status(400).send('Invalid language');
        return;    
    } else {
        switch (language.toLowerCase()) {
            case 'python':
                languageId = 71;
                break;
            case 'javascript':
                languageId = 63;
                break;
            case 'java':
                languageId = 62;
                break;
            default:
                res.status(400).send('Invalid language');
                return;
        }
    }

    // checking test cases on given code
    const testCases: Map<string, string> = questions[questionId].testCases;

    const pythonCode = `
        ${code}
        // checking weather all test cases are euqla to expected output
        return ${[...testCases].map(([input, output]) => `f(${input}) == ${output}`).join(' && ')}
    `;

    console.log(pythonCode);
}

export async function executeCode(languageId:number, code:string) {
    const submissionOptions = {
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        method: 'POST',
        headers: {
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "language_id": languageId,
            "source_code": code,
        })
    };

    try {
        const submissionResponse = await axios(submissionOptions);
        const token = submissionResponse.data.token;
        const resultResponse = await pollForResult(token);
        return resultResponse.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
