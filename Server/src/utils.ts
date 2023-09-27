export const roomCodeGenerator = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

import axios from 'axios';

export async function pollForResult(token: string): Promise<any> {
    const resultOptions = {
        url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        headers: {
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
    };

    let attempts = 0;
    const maxAttempts = Number(process.env.MAX_POLL_ATTEMPTS) || 10;
    const pollInterval = Number(process.env.POLL_INTERVAL_MS) || 2000; // 2 seconds

    return new Promise((resolve, reject) => {
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
