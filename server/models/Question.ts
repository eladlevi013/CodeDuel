/*
    primitive types:
    - string
    - char
    - boolean
    - number
    - decimal

    complex types:
    - array(primitive)
    - array(complex)
*/
export interface Variable {
  value: any;
  type: any;
}

export interface FunctionSignature {
  name: string;
  args: Variable[];
  returnType: any;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  example: string;
  funcSignature: FunctionSignature;
  difficulty: number;
  categories: string[];
  testCases: Map<Variable, Variable>;
}
