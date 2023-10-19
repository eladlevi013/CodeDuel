import { LanguageHelper, getArrayInfo } from './languageHelper';
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
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

public class Main {
    ${code}
    
    public static void main(String[] args) {
        ${checkStatement}
    }
}`;
    },
    transformArrayValues(value: any, type: any) {
        if (Array.isArray(value)) {
            const result = `{${value.map(item => this.transformArrayValues(item, type)).join(', ')}}`;
            return result;
        } else {
            return getValueByLanguage({ type: getArrayInfo(type).arrayType, value: value }).java;
        }
    },
    getType(type: string) {
        switch (type) {
            case 'string':
                return 'String';
            case 'char':
                return 'char';
            case 'boolean':
                return 'boolean';
            case 'number':
                return 'int';
            case 'decimal':
                return 'double';
            default:
                return type;
        }
    },
    getValue(variable: Variable): string {
        const type = variable.type;
        const value = variable.value;

        switch (type) {
            case 'string':
                return `"${value}"`;
            case 'char':
                return `'${value}'`;
            case 'boolean':
                return value ? 'true' : 'false';
            case 'number':
                return `${value}`;
            case 'decimal':
                return `${value}`;
            default:
                return value;
        }
    }
};
