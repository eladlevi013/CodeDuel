import axios from 'axios';

export async function executeCodeOnJudgeApi(languageId:number, code:string) {
    const submissionOptions = {
        url: 'http://localhost:2358/submissions',
        method: 'POST',
        headers: {
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

export async function pollForResult(token: string): Promise<any> {
    const resultOptions = {
        url: `http://localhost:2358/submissions/${token}`,
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
