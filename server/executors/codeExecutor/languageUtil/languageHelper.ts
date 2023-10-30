import { Question, Variable } from '../../../models/Question';
import { javaHelper } from './javaHelper';
import { pythonHelper } from './pythonHelper';

export interface LanguageHelper {
  getCheckStatement: (question: Question, testCases: Map<Variable, Variable>) => string;
  getFullCode(code: string, question: Question, testCases: Map<Variable, Variable>): string;
  transformArrayValues(value: any, type: any): string;
  getType(type: string): string;
  getValue(variable: Variable): string;
}

// getting array inner-type and nesting count
export function getArrayInfo(str: string): { nestedArray: number; arrayType: string } {
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

// converting array to valid representation for language
export function transformArrayValuesByLanguage(obj: any) {
  return {
    java: javaHelper.transformArrayValues(obj.value, obj.type),
    python: pythonHelper.transformArrayValues(obj.value, obj.type)
  };
}

// checking if type is primitive
export function isPrimitiveType(type: string) {
  return ['string', 'char', 'boolean', 'number', 'decimal'].includes(type);
}

// handling primitive types for each language
export const getTypeByLanguage = (type: any): { java: string; python: string } => {
  if (isPrimitiveType(type)) {
    return {
      java: javaHelper.getType(type),
      python: pythonHelper.getType(type)
    };
  } else {
    if (type.startsWith('array')) {
      const arrayData = getArrayInfo(type);

      return {
        java: `${getTypeByLanguage(arrayData?.arrayType).java}${'[]'.repeat(
          arrayData.nestedArray
        )}`,
        python: `List[${getTypeByLanguage(arrayData?.arrayType).python}]${' * '.repeat(
          arrayData.nestedArray
        )}`
      };
    }
  }

  return { java: type, python: type };
};

// handling values for each language
export const getValueByLanguage = (variable: Variable) => {
  const type = variable.type;

  if (isPrimitiveType(type)) {
    return {
      java: javaHelper.getValue(variable),
      python: pythonHelper.getValue(variable)
    };
  } else if (type.startsWith('array')) {
    const arrayValues = transformArrayValuesByLanguage(variable);
    arrayValues.java = `new ${getTypeByLanguage(type).java} ${arrayValues.java}`;
    arrayValues.python = `${arrayValues.python}`;
    return arrayValues;
  } else {
    return { java: `${variable.value}`, python: `${variable.value}` };
  }
};
