import { Question, Variable } from '../models/Question';

export interface LanguageHelper {
    getCheckStatement: (question: Question, testCases: Map<Variable, Variable>) => string;
    getFullCode(code: string, question: Question, testCases: Map<Variable, Variable>): string;
}

export const getComplexTypeByLanguage = (type: string): { java: string, python: string } => {
    if (type.startsWith('array')) {
        const arrayType = type.slice(6, -1);
        return { java: `${getTypeByLanguage(arrayType).java}[]`, python: `List[${getTypeByLanguage(arrayType).python}]` };
    }

    return { java: type, python: type };
}

export const getTypeByLanguage = (type: string) => {
    switch (type) {
        case 'string':
            return { java: 'String', python: 'str' };
        case 'char':
            return { java: 'char', python: 'str' };
        case 'boolean':
            return { java: 'boolean', python: 'bool' };
        case 'number':
            return { java: 'int', python: 'int' };
        case 'decimal':
            return { java: 'double', python: 'float' };
        default:
            return getComplexTypeByLanguage(type);
    }
}

export const getValueByLanguage = (value: Variable) => {
    const type = value.type;

    if (type === 'string') {
        return { java: `"${value.value}"`, python: `"${value.value}"` };
    } else if (type === 'char') {
        return { java: `'${value.value}'`, python: `'${value.value}'` };
    } else if (type === 'boolean') {
        return { java: `${value.value}`, python: `${value.value.charAt(0).toUpperCase() + value.value.slice(1)}` };
    } else if (type === 'number') {
        return { java: `${value.value}`, python: `${value.value}` };
    } else if (type === 'decimal') {
        return { java: `${value.value}`, python: `${value.value}` };
    } else {
        return { java: `${value.value}`, python: `${value.value}` };
    }
}

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

export const javaHelper: LanguageHelper = {
    getCheckStatement(question, testCases) {
        const getJavaRepresentation = (variable: Variable): string => {
            switch (variable.type) {
                case 'string':
                    return `"${variable.value}"`;
                case 'char':
                    return `'${variable.value}'`;
                case 'boolean':
                case 'int':
                case 'double':
                    return `${variable.value}`;
                default:
                    if (variable.type.startsWith("array")) {
                        const arrayType = getComplexTypeByLanguage(variable.type).java;
                        const values = variable.value.replace(/\[/g, '{').replace(/\]/g, '}');
                        return `new ${arrayType}${values}`;
                    }
                    return `${variable.value}`;
            }
        };

        const testCasesList = [...testCases].map(([input, output]) => {
            const inputRepresentation = getJavaRepresentation(input);
            const outputRepresentation = getJavaRepresentation(output);
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
