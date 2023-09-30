import axios from 'axios';

// language ids for the judge api
export const PYTHON_LANGUAGE_ID = 71;
export const JAVA_LANGUAGE_ID = 62;
export const INVALID_LANGUAGE_ID = -1;

const BASE_URL = process.env.PRODUCTION === 'true' ? 'https://judge0-ce.p.rapidapi.com' 
    : 'http://localhost:2358';
const HEADERS = process.env.PRODUCTION === 'true' ? {
    'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
} : {
    'Content-Type': 'application/json'
};

export async function executeCodeOnJudgeApi(languageId:number, code:string) {
    const submissionOptions = {
        url: `${BASE_URL}/submissions`,
        method: 'POST',
        headers: HEADERS,
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

export async function pollForResult(token: string): Promise<any> {
    const resultOptions = {
        url: `${BASE_URL}/submissions/${token}`,
        headers: HEADERS,
    };

    const maxAttempts = Number(process.env.MAX_POLL_ATTEMPTS) || 10;
    const pollInterval = Number(process.env.POLL_INTERVAL_MS) || 2000;

    return new Promise((resolve, reject) => {
        let attempts = 0;
        const interval = setInterval(async () => {
            try {
                const resultResponse = await axios(resultOptions);
                const status = resultResponse.data.status.description;
                if (status !== 'Processing' && status !== 'In Queue') {
                    clearInterval(interval);
                    resolve(resultResponse);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error('Maximum poll attempts reached.'));
                }
            } catch (error) {
                clearInterval(interval);
                reject(error);
            }
            attempts++;
        }, pollInterval);
    });
}

// get the language id from the language name
export function getLanguageId(language: string): number {
    let languageId = INVALID_LANGUAGE_ID;
    let trimmedLanguage = language.trim().toLowerCase();
  
    switch (trimmedLanguage) {
      case 'python':
        languageId = PYTHON_LANGUAGE_ID;
        break;
      case "java":
        languageId = JAVA_LANGUAGE_ID;
        break;
      default:
        return languageId;
    }
  
    return languageId;
}