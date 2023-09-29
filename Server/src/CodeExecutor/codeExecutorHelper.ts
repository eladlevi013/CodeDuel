import { questions } from "../db/questions";
import { executeCodeOnJudgeApi } from "./judgeApiHelper";

export async function runTestCases(code: string, questionId: string, language: string) {
    let languageId = -1;
    let trimmedLanguage = language.trim().toLowerCase();

    switch (trimmedLanguage) {
        case 'python':
            languageId = 71;
            break;
        case 'javascript':
            languageId = 63;
            break;
        case "java":
            languageId = 62;
            break;
        default:
            return;
    }

    // checking test cases on given code
    const question = questions[parseInt(questionId) - 1];
    const testCases: Map<string, string> = question.testCases;

    let checkStatement = "";
    switch (trimmedLanguage) {
    case 'python':
        if (question.funcSignature.returnType === 'string') {
        checkStatement = `print(${[...testCases].map(([input, output]) => `${question.funcSignature.name}('${input}') == '${output}'`).join(' and ')})`;
        } else {
        checkStatement = `print(${[...testCases].map(([input, output]) => `${question.funcSignature.name}(${input}) == ${output}`).join(' and ')})`;
        }
        break;
        
    case 'javascript':
        if (question.funcSignature.returnType === 'string') {
        checkStatement = `console.log(${[...testCases].map(([input, output]) => `${question.funcSignature.name}('${input}') === '${output}'`).join(' && ')})`;
        } else {
        checkStatement = `console.log(${[...testCases].map(([input, output]) => `${question.funcSignature.name}(${input}) === ${output}`).join(' && ')})`;
        }
        break;

    case 'java':
        const className = "Main";
        const methodStatements = [...testCases].map(([input, output]) => {
        if (question.funcSignature.returnType === 'string') {
            return `System.out.println(${question.funcSignature.name}("${input}").equals("${output}"));`;
        } else {
            return `System.out.println(${question.funcSignature.name}(${input}) == ${output});`;
        }
        }).join('\n');
        
        checkStatement = `
        public class ${className} {
            ${code}

            public static void main(String[] args) {
            ${methodStatements}
            }
        }
        `;
    break;
    }

    const finalCode = trimmedLanguage === 'java' ? checkStatement : `${code}\n${checkStatement}`;
    const result: Promise<any> = await executeCodeOnJudgeApi(languageId, finalCode);
    return result;
}
