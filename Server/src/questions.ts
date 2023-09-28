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
},
{
    id: '2',
    title: 'Find the factorial of a number',
    description: 'Write a function to find the factorial of a given non-negative integer. The factorial of a number is the product of all positive integers up to that number. For example, the factorial of 5 is 120 (5*4*3*2*1).',
    example: 'factorial(5) === 120',
    funcSignature: {
        name: 'factorial',
        args: [{name: 'num', type: 'int'}],
        returnType: 'int'
    },
    difficulty: 2,
    category: 'math',
    testCases: new Map<string, string>([
        ['0', '1'],
        ['5', '120'],
        ['7', '5040']
    ])
},
{
    id: '3',
    title: 'Check if a string is a palindrome',
    description: 'A palindrome is a word, phrase, number, or other sequences of characters that reads the same forward and backward (ignoring spaces, punctuation, and capitalization). Write a function that returns true if the given string is a palindrome and false if it is not.',
    example: 'isPalindrome("Racecar") === true',
    funcSignature: {
        name: 'isPalindrome',
        args: [{name: 'str', type: 'string'}],
        returnType: 'boolean'
    },
    difficulty: 2,
    category: 'string',
    testCases: new Map<string, string>([
        ['Racecar', 'true'],
        ['hello', 'false'],
        ['A man a plan a canal Panama', 'true']
    ])
},
{
    id: '4',
    title: 'Find the largest number in an array',
    description: 'Write a function to find the largest number in an array of numbers.',
    example: 'findLargest([1,5,8,3]) === 8',
    funcSignature: {
        name: 'findLargest',
        args: [{name: 'nums', type: 'int[]'}],
        returnType: 'int'
    },
    difficulty: 1,
    category: 'array',
    testCases: new Map<string, string>([
        ['[1,5,8,3]', '8'],
        ['[12,4,5,9]', '12'],
        ['[-1,-5,-8,-3]', '-1']
    ])
},
{
    id: '5',
    title: 'Calculate Fibonacci sequence',
    description: 'Write a function to calculate the Fibonacci sequence up to the nth number. The Fibonacci sequence is a series of numbers where a number is the sum of the two preceding ones, usually starting with 0 and 1.',
    example: 'fibonacci(5) === [0, 1, 1, 2, 3, 5]',
    funcSignature: {
        name: 'fibonacci',
        args: [{name: 'n', type: 'int'}],
        returnType: 'int[]'
    },
    difficulty: 3,
    category: 'math',
    testCases: new Map<string, string>([
        ['5', '[0,1,1,2,3,5]'],
        ['7', '[0,1,1,2,3,5,8,13]'],
        ['10', '[0,1,1,2,3,5,8,13,21,34,55]']
    ])
}
]