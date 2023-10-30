import { executeCode } from './codeExecutor';
import { LanguageHelper } from './languageUtil/languageHelper';
import { Variable } from '../models/Question';
import { questions } from '../db/codingQuestions';
import { pythonHelper } from './languageUtil/pythonHelper';
import { javaHelper } from './languageUtil/javaHelper';

const PYTHON_LANGUAGE_ID = 'python';
const JAVA_LANGUAGE_ID = 'java';

const LANGUAGE_HELPERS: Record<string, LanguageHelper> = {
  [PYTHON_LANGUAGE_ID]: pythonHelper,
  [JAVA_LANGUAGE_ID]: javaHelper
};

export async function runTestCases(code: string, questionId: string, language: string) {
  const question = questions[parseInt(questionId) - 1];
  const testCases: Map<Variable, Variable> = question.testCases;

  // Check if language is valid
  if (language !== PYTHON_LANGUAGE_ID && language !== JAVA_LANGUAGE_ID) {
    return {
      stdout: '',
      stderr: `Invalid or unsupported language: ${language}`
    };
  }

  // helper creating final code based on language
  const helper = LANGUAGE_HELPERS[language];
  const finalCode = helper.getFullCode(code, question, testCases);
  const result = await executeCode(language, finalCode);

  return result;
}
