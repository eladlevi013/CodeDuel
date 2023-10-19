import { LanguageHelper } from './languageHelper';
import { Question, Variable } from '../../models/Question';
import { getValueByLanguage } from './languageHelper';

export const javaHelper: LanguageHelper = {
    getCheckStatement(question, testCases) {
        const testCasesList = [...testCases].map(([input, output]) => {
            const inputRepresentation = getValueByLanguage(input).java;
            const outputRepresentation = getValueByLanguage(output).java;
            const equalityCheck = output.type.endsWith("[]") || output.type.startsWith("array") ?
                `Arrays.equals(${question.funcSignature.name}(${inputRepresentation}), ${outputRepresentation})` :
                `Objects.equals(${question.funcSignature.name}(${inputRepresentation}), ${outputRepresentation})`;
            return equalityCheck;
        }).join(" && ");

        return `System.out.println(${testCasesList});`;
    },

    getFullCode(code: string, question: Question, testCases: Map<Variable, Variable>) {
        const checkStatement = this.getCheckStatement(question, testCases);
        return `
import java.util.Arrays;
import java.util.Objects;

public class Main {
    ${code}
    
    public static void main(String[] args) {
        ${checkStatement}
    }
}`;
    }
};
