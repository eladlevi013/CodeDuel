export interface FunctionSignature {
    name: string,
    args: {name:string, type:string}[],
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
    testCases: Map<string, string>
}
