// import models
import { Variable } from "../Models/Question";
// import language helpers
import { pythonHelper, javaHelper, LanguageHelper } from "./languageHelper";
// import questions db
import { questions } from "../db/questions";
// import from judgeApiHelper.ts
import { getLanguageId, INVALID_LANGUAGE_ID, JAVA_LANGUAGE_ID,
  PYTHON_LANGUAGE_ID, executeCodeOnJudgeApi} from "./judgeApiHelper";

const LANGUAGE_HELPERS: Record<number, LanguageHelper> = {
  [PYTHON_LANGUAGE_ID]: pythonHelper,
  [JAVA_LANGUAGE_ID]: javaHelper,
};

// run the test cases on the judge api
export async function runTestCases(code: string, questionId: string, language: string) {
  // clearing the console
  console.clear();

  const question = questions[parseInt(questionId) - 1];
  const testCases: Map<Variable, Variable> = question.testCases;
  const languageId = getLanguageId(language);

  if (languageId === INVALID_LANGUAGE_ID) {
    throw new Error(`Invalid or unsupported language: ${language}`);
  }

  const helper = LANGUAGE_HELPERS[languageId];
  const finalCode = helper.getFullCode(code, question, testCases);

  console.log(finalCode);

  return await executeCodeOnJudgeApi(languageId, finalCode);
}
