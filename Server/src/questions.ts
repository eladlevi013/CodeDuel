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

export const questions: Question[] = [
{
    id: '1',
    title: 'Reverse a string',
    description: 'Reverse a string',
    example: 'reverseString("hello") === "olleh"',
    funcSignature: {
        name: 'reverseString',
        args: [{name: 'str', type: 'string'}],
        returnType: 'string'
    },
    difficulty: 1,
    category: 'string',
    testCases: new Map<string, string>([
        ['hello', 'olleh'],
        ['Howdy', 'ydwoH'],
        ['Greetings from Earth', 'htraE morf sgniteerG']
    ])
}
]