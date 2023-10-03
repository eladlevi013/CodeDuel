"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageId = exports.pollForResult = exports.executeCodeOnJudgeApi = exports.INVALID_LANGUAGE_ID = exports.JAVA_LANGUAGE_ID = exports.PYTHON_LANGUAGE_ID = void 0;
const axios_1 = __importDefault(require("axios"));
// language ids for the judge api
exports.PYTHON_LANGUAGE_ID = 71;
exports.JAVA_LANGUAGE_ID = 62;
exports.INVALID_LANGUAGE_ID = -1;
const BASE_URL = process.env.PRODUCTION === 'true' ? 'https://judge0-ce.p.rapidapi.com'
    : 'http://localhost:2358';
const HEADERS = process.env.PRODUCTION === 'true' ? {
    'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
} : {
    'Content-Type': 'application/json'
};
async function executeCodeOnJudgeApi(languageId, code) {
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
        const submissionResponse = await (0, axios_1.default)(submissionOptions);
        const token = submissionResponse.data.token;
        const resultResponse = await pollForResult(token);
        return resultResponse.data;
    }
    catch (error) {
        console.error("Error executing code on Judge0 API");
    }
}
exports.executeCodeOnJudgeApi = executeCodeOnJudgeApi;
async function pollForResult(token) {
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
                const resultResponse = await (0, axios_1.default)(resultOptions);
                const status = resultResponse.data.status.description;
                if (status !== 'Processing' && status !== 'In Queue') {
                    clearInterval(interval);
                    resolve(resultResponse);
                }
                else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error('Maximum poll attempts reached.'));
                }
            }
            catch (error) {
                clearInterval(interval);
                reject(error);
            }
            attempts++;
        }, pollInterval);
    });
}
exports.pollForResult = pollForResult;
// get the language id from the language name
function getLanguageId(language) {
    let languageId = exports.INVALID_LANGUAGE_ID;
    let trimmedLanguage = language.trim().toLowerCase();
    switch (trimmedLanguage) {
        case 'python':
            languageId = exports.PYTHON_LANGUAGE_ID;
            break;
        case "java":
            languageId = exports.JAVA_LANGUAGE_ID;
            break;
        default:
            return languageId;
    }
    return languageId;
}
exports.getLanguageId = getLanguageId;
