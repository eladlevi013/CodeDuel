export interface Variable {
    value: string,
    type: string
}

export interface FunctionSignature {
    name: string,
    args: Variable[],
    returnType: string
}

export interface Question {
    id: string,
    title: string,
    description: string,
    example: string,
    funcSignature: FunctionSignature
    difficulty: number,
    category: string,
    testCases: Map<Variable, Variable>
}
