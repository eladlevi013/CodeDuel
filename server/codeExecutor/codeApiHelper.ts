import axios from 'axios';

// language ids for the judge api
export const PYTHON_LANGUAGE_ID = 71;
export const JAVA_LANGUAGE_ID = 62;
export const INVALID_LANGUAGE_ID = -1;

const BASE_URL = process.env.PRODUCTION === 'true' ? 'codeduel-production-3585.up.railway.app' 
    : 'http://localhost:3000';

const HEADERS = { 'Content-Type': 'application/json' };

export async function executeCodeOnServer(languageId:number, code:string) {
    const submissionOptions = {
        url: `${BASE_URL}/execute`,
        method: 'POST',
        headers: HEADERS,
        data: JSON.stringify({
            "language": languageId,
            "code": code,
        })
    };

    try {
        const submissionResponse = await axios(submissionOptions);
        return submissionResponse.data;
    } catch (error) {
        console.error("Error executing code on API");
    }
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