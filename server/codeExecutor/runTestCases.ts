import { executeCode } from "./codeExecutor";
import { pythonHelper, javaHelper, LanguageHelper } from "./languageHelper";
import { Variable } from "../models/Question";
import { questions } from "../db/questions";

const PYTHON_LANGUAGE_ID = 'python';
const JAVA_LANGUAGE_ID = 'java';

const LANGUAGE_HELPERS: Record<string, LanguageHelper> = {
  [PYTHON_LANGUAGE_ID]: pythonHelper,
  [JAVA_LANGUAGE_ID]: javaHelper,
};

export async function runTestCases(code: string, questionId: string, language: string) {
  const question = questions[parseInt(questionId) - 1];
  const testCases: Map<Variable, Variable> = question.testCases;

  if (language !== PYTHON_LANGUAGE_ID && language !== JAVA_LANGUAGE_ID) {
    return {
      stdout: '',
      stderr: `Invalid or unsupported language: ${language}`,
    }
  }

  const helper = LANGUAGE_HELPERS[language];
  const finalCode = helper.getFullCode(code, question, testCases);
  const result = await executeCode(language, finalCode);
  return result;
}
