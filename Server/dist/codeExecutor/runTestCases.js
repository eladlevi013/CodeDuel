"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTestCases = void 0;
// import from judgeApiHelper.ts
const judgeApiHelper_1 = require("./judgeApiHelper");
const languageHelper_1 = require("./languageHelper");
const questions_1 = require("../db/questions");
const LANGUAGE_HELPERS = {
    [judgeApiHelper_1.PYTHON_LANGUAGE_ID]: languageHelper_1.pythonHelper,
    [judgeApiHelper_1.JAVA_LANGUAGE_ID]: languageHelper_1.javaHelper,
};
async function runTestCases(code, questionId, language) {
    const question = questions_1.questions[parseInt(questionId) - 1];
    const testCases = question.testCases;
    const languageId = (0, judgeApiHelper_1.getLanguageId)(language);
    if (languageId === judgeApiHelper_1.INVALID_LANGUAGE_ID) {
        throw new Error(`Invalid or unsupported language: ${language}`);
    }
    const helper = LANGUAGE_HELPERS[languageId];
    const finalCode = helper.getFullCode(code, question, testCases);
    // print final code to console
    // console.clear();
    // console.log(finalCode);
    return await (0, judgeApiHelper_1.executeCodeOnJudgeApi)(languageId, finalCode);
}
exports.runTestCases = runTestCases;
