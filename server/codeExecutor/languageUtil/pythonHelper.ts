import { Variable } from '../../models/Question';
import { LanguageHelper } from './languageHelper';
import { getValueByLanguage } from './languageHelper';
import { getArrayInfo } from './languageHelper';

export const pythonHelper: LanguageHelper = {
  getCheckStatement(question, testCases) {
    const testCasesList = [...testCases]
      .map(
        ([input, output]) =>
          `${question.funcSignature.name}(${getValueByLanguage(input).python}) == ${
            getValueByLanguage(output).python
          }`
      )
      .join(' and ');

    return `print(${testCasesList})`;
  },
  getFullCode(code, question, testCases) {
    return `${code}\n\n${this.getCheckStatement(question, testCases)}\n`;
  },
  transformArrayValues(value: any, type: any) {
    if (Array.isArray(value)) {
      return '[' + value.map(item => this.transformArrayValues(item, type)).join(', ') + ']';
    } else {
      return getValueByLanguage({ type: getArrayInfo(type).arrayType, value: value }).python;
    }
  },
  getType(type: string) {
    switch (type) {
      case 'string':
        return 'str';
      case 'char':
        return 'str';
      case 'boolean':
        return 'bool';
      case 'number':
        return 'int';
      case 'decimal':
        return 'float';
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
        return value ? 'True' : 'False';
      case 'number':
        return `${value}`;
      case 'decimal':
        return `${value}`;
      default:
        return value;
    }
  }
};
