    import { Question, Variable } from '../models/Question';

    export interface LanguageHelper {
        getCheckStatement: (question: Question, testCases: Map<Variable, Variable>) => string;
        getFullCode(code: string, question: Question, testCases: Map<Variable, Variable>): string;
    }

    function extractInnermost(str: string): { nestedArray: number; arrayType: string } {
        let nestingCount = 0;
        
        function peelLayer(s: string): string {
            const match = s.match(/^array\((.+)\)$/);
            if (match) {
                nestingCount++;
                return peelLayer(match[1]);
            }
            return s;
        }
        
        const extractedType = peelLayer(str);
        
        return {
            nestedArray: nestingCount,
            arrayType: extractedType
        };
    }

    // converting array to java/python representation
    function transformToLangRepresentation(obj: any) {
        function toJava(value: any): string {
            if (Array.isArray(value)) {
                const result = `{${value.map(item => toJava(item)).join(', ')}}`;
                return result;
            } else {
                return getValueByLanguage({ type: extractInnermost(obj.type).arrayType, value: value }).java;
            }
        }

        function toPython(value: string | string[]): string {
            if (Array.isArray(value)) {
                return '[' + value.map(item => toPython(item)).join(', ') + ']';
            } else {
                return getValueByLanguage({ type: extractInnermost(obj.type).arrayType, value: value }).python;
            }            
        }

        return {
            java: toJava(obj.value),
            python: toPython(obj.value)
        };
    }

    // returns the array type on nested arrays case
    export const getComplexTypeByLanguage = (type: string): { java: string, python: string } => {
        if (type.startsWith('array')) {
            const arrayData = extractInnermost(type);

            return { 
                java: `${getTypeByLanguage(arrayData?.arrayType).java}${'[]'
                    .repeat(arrayData.nestedArray)}`,
                python: `List[${getTypeByLanguage(arrayData?.arrayType).python}]${' * '
                    .repeat(arrayData.nestedArray)}`
            };
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
        } else if (type.startsWith('array')) {
            const arrayData = transformToLangRepresentation(value);
            arrayData.java = `new ${getComplexTypeByLanguage(type).java}` + arrayData.java;
            return arrayData;
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
