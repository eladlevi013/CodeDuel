"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTestCases = void 0;
// import from judgeApiHelper.ts
const codeApiHelper_1 = require("./codeApiHelper");
const languageHelper_1 = require("./languageHelper");
const questions_1 = require("../db/questions");
const INVALID_LANGUAGE_ID = 'invalid';
const PYTHON_LANGUAGE_ID = 'python';
const JAVA_LANGUAGE_ID = 'java';
const LANGUAGE_HELPERS = {
    [PYTHON_LANGUAGE_ID]: languageHelper_1.pythonHelper,
    [JAVA_LANGUAGE_ID]: languageHelper_1.javaHelper,
};
function runTestCases(code, questionId, language) {
    return __awaiter(this, void 0, void 0, function* () {
        const question = questions_1.questions[parseInt(questionId) - 1];
        const testCases = question.testCases;
        if (language !== PYTHON_LANGUAGE_ID && language !== JAVA_LANGUAGE_ID) {
            return {
                stdout: '',
                stderr: `Invalid or unsupported language: ${language}`,
            };
        }
        const helper = LANGUAGE_HELPERS[language];
        const finalCode = helper.getFullCode(code, question, testCases);
        const result = yield (0, codeApiHelper_1.executeCodeOnServer)(language, finalCode);
        return result;
    });
}
exports.runTestCases = runTestCases;
