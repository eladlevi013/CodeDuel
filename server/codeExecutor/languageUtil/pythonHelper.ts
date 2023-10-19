import { LanguageHelper } from './languageHelper';
import { getValueByLanguage } from './languageHelper';

export const pythonHelper: LanguageHelper = {
    getCheckStatement(question, testCases) {                
        const testCasesList = [...testCases].map(([input, output]) => 
            `${question.funcSignature.name}(${getValueByLanguage(input).python}) == ${getValueByLanguage(output).python}`
        ).join(' and '); 

        return `print(${testCasesList})`;
    },
    getFullCode(code, question, testCases) {
        return `${code}\n\n${this.getCheckStatement(question, testCases)}\n`;
    },
};
