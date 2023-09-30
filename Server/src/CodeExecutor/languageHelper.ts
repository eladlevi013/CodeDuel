import { Question, Variable } from "../Models/Question";

export interface LanguageHelper {
    getCheckStatement: (question: Question, testCases: Map<Variable, Variable>) => string;
    getFullCode(code: string, question: Question, testCases: Map<Variable, Variable>): string;
}

export const pythonHelper: LanguageHelper = {
    getCheckStatement(question, testCases) {
        function getValueOfPrimitiveType(variable: Variable) {
            switch (variable.type) {
                case 'string':
                    return `'${variable.value}'`;
                case 'char':
                    return `'${variable.value}'`;
                case 'boolean':
                    return `${variable.value.charAt(0).toUpperCase() + variable.value.slice(1)}`;
                case 'int': 
                    return `${variable.value}`;
                case 'float': 
                    return `${variable.value}`;
                default: 
                    return `${variable.value}`;
            }
        }
        
        function getValueOfType(variable: Variable) {
            if (variable.type.slice(-2) === '[]') {
                const values = variable.value.split(',');
                return values;
            } else {
                return getValueOfPrimitiveType(variable);
            }
        }
        
        const testCasesList = [...testCases].map(([input, output]) => 
            `${question.funcSignature.name}(${getValueOfType(input)}) == ${getValueOfType(output)}`
        ).join(' and \n\t '); 

        return `print(${testCasesList})`;
    },
    getFullCode(code, question, testCases) {
        return `${code}\n\n${this.getCheckStatement(question, testCases)}\n`;
    },
};

export const javaHelper: LanguageHelper = {
    getCheckStatement(question, testCases) {
        function getJavaPrimitiveRepresentation(variable: Variable): string {
            switch (variable.type) {
                case 'string':
                    return `"${variable.value}"`;
                case 'char':
                    return `'${variable.value}'`;
                case 'boolean':
                case 'int':
                case 'float':
                    return `${variable.value}`;
                default:
                    return `${variable.value}`;
            }
        }

        function getJavaRepresentation(variable: Variable): string {
            if (variable.type.endsWith("[]")) {
                const arrayType = variable.type.slice(0, -2);
                const values = variable.value.replace(/\[/g, '{').replace(/\]/g, '}');
                return `new ${arrayType}[]${values}`;
            } else {
                return getJavaPrimitiveRepresentation(variable);
            }
        }

        const testCasesList = [...testCases].map(([input, output]) => {
            const inputRepresentation = getJavaRepresentation(input);
            const outputRepresentation = getJavaRepresentation(output);
            const equalityCheck = input.type.endsWith("[]") ?
                `Arrays.equals(${question.funcSignature.name}(${inputRepresentation}), ${outputRepresentation})` :
                `Objects.equals(${question.funcSignature.name}(${inputRepresentation}), ${outputRepresentation})`;
            return equalityCheck;
        }).join(" && \n\t\t");

        return `
    public static void main(String[] args) {
        System.out.println(${testCasesList});
    }`;
    },
    getFullCode(code: string, question: Question, testCases: Map<Variable, Variable>) {
        const checkStatement = this.getCheckStatement(question, testCases);
        return `
import java.util.Arrays;
import java.util.Objects;

public class Main {
    ${code.replace(/\n/g, '\n\t')}
    ${checkStatement.replace(/\n/g, '\n\t')}
}`;
    }
};