import { Question, Variable } from '../models/Question';

export const questions: Question[] = [
    {
        id: '1',
        title: 'Maximum Difference',
        description: 'Given an array of integers, find the maximum difference between two elements such that the larger element comes after the smaller element.',
        example: 'maxDifference([2, 3, 10, 6, 4, 8, 1]) === 8',
        funcSignature: {
            name: 'maxDifference',
            args: [{ value: 'arr', type: 'array(int)' }],
            returnType: 'number'
        },
        difficulty: 2,
        categories: ['arrays', 'algorithm'],
        testCases: new Map<Variable, Variable>([
            [{ value: [2, 3, 10, 6, 4, 8, 1], type: 'array(number)' }, { value: 8, type: 'number' }],
            [{ value: [7, 9, 5, 6, 3, 2], type: 'array(number)' }, { value: 2, type: 'number' }],
            [{ value: [1, 2, 3, 4, 5], type: 'array(number)' }, { value: 4, type: 'number' }]
        ])
    },
    {
        id: '2',
        title: 'Flatten String Matrix',
        description: 'Given a 2D array (matrix) of strings, flatten it into a 1D array. Your solution should not use any built-in flatten methods.',
        example: `flattenStringMatrix([['a', 'b'], ['c', 'd'], ['e', 'f']]) === ['a', 'b', 'c', 'd', 'e', 'f']`,
        funcSignature: {
            name: 'flattenStringMatrix',
            args: [{ value: 'matrix', type: 'array(array(string))' }],
            returnType: 'array(string)'
        },
        difficulty: 2,
        categories: ['arrays', 'algorithm'],
        testCases: new Map([
            [{ value: [['a', 'b'], ['c', 'd'], ['e', 'f']], type: 'array(array(string))' }, { value: ['a', 'b', 'c', 'd', 'e', 'f'], type: 'array(string)' }],
            [{ value: [['hello'], ['world']], type: 'array(array(string))' }, { value: ['hello', 'world'], type: 'array(string)' }],
            [{ value: [['apple', 'banana'], ['cherry', 'date']], type: 'array(array(string))' }, { value: ['apple', 'banana', 'cherry', 'date'], type: 'array(string)' }]
        ])
    }    
    // {
    //     id: '2',
    //     title: 'Can Form Triangle?',
    //     description: 'Given an array of integers, determine if any three numbers can form the sides of a triangle.',
    //     example: 'canFormTriangle([4, 1, 3, 6]) === true',
    //     funcSignature: {
    //         name: 'canFormTriangle',
    //         args: [{ value: 'arr', type: 'array(number)' }],
    //         returnType: 'boolean'
    //     },
    //     difficulty: 3,
    //     categories: ['arrays', 'geometry'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '[4, 1, 3, 6]', type: 'array(number)' }, { value: 'true', type: 'boolean' }],
    //         [{ value: '[1, 2, 3]', type: 'array(number)' }, { value: 'false', type: 'boolean' }],
    //         [{ value: '[10, 15, 5, 7]', type: 'array(number)' }, { value: 'true', type: 'boolean' }]
    //     ])
    // },
    // {
    //     id: '3',
    //     title: 'Vowel Count',
    //     description: 'Count the number of vowels in a given string.',
    //     example: 'vowelCount("hello") === 2',
    //     funcSignature: {
    //         name: 'vowelCount',
    //         args: [{ value: 'str', type: 'string' }],
    //         returnType: 'number'
    //     },
    //     difficulty: 1,
    //     categories: ['string', 'algorithm'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: 'hello', type: 'string' }, { value: '2', type: 'number' }],
    //         [{ value: 'world', type: 'string' }, { value: '1', type: 'number' }],
    //         [{ value: 'aeiou', type: 'string' }, { value: '5', type: 'number' }]
    //     ])
    // },
    // {
    //     id: '4',
    //     title: 'Is Ascending?',
    //     description: 'Check if the given array of numbers is in ascending order.',
    //     example: 'isAscending([1, 2, 3, 4]) === true',
    //     funcSignature: {
    //         name: 'isAscending',
    //         args: [{ value: 'arr', type: 'array(number)' }],
    //         returnType: 'boolean'
    //     },
    //     difficulty: 2,
    //     categories: ['arrays', 'algorithm'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '[1, 2, 3, 4]', type: 'array(number)' }, { value: 'true', type: 'boolean' }],
    //         [{ value: '[1, 3, 2, 4]', type: 'array(number)' }, { value: 'false', type: 'boolean' }],
    //         [{ value: '[5, 6, 7, 8]', type: 'array(number)' }, { value: 'true', type: 'boolean' }]
    //     ])  
    // },
    // {
    //     id: '5',
    //     title: 'Is Prime?',
    //     description: 'Determine if a given number is prime.',
    //     example: 'isPrime(7) === true',
    //     funcSignature: {
    //         name: 'isPrime',
    //         args: [{ value: 'num', type: 'number' }],
    //         returnType: 'boolean'
    //     },
    //     difficulty: 2,
    //     categories: ['numbers', 'algorithm'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '7', type: 'number' }, { value: 'true', type: 'boolean' }],
    //         [{ value: '4', type: 'number' }, { value: 'false', type: 'boolean' }],
    //         [{ value: '17', type: 'number' }, { value: 'true', type: 'boolean' }]
    //     ])
    // },
    // {
    //     id: '6',
    //     title: 'Factorial',
    //     description: 'Calculate the factorial of a given non-negative number.',
    //     example: 'factorial(5) === 120',
    //     funcSignature: {
    //         name: 'factorial',
    //         args: [{ value: 'num', type: 'number' }],
    //         returnType: 'number'
    //     },
    //     difficulty: 2,
    //     categories: ['numbers', 'recursion'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '5', type: 'number' }, { value: '120', type: 'number' }],
    //         [{ value: '3', type: 'number' }, { value: '6', type: 'number' }],
    //         [{ value: '0', type: 'number' }, { value: '1', type: 'number' }]
    //     ])
    // },
    // {
    //     id: '7',
    //     title: 'Most Frequent Item',
    //     description: 'Find the item that appears most frequently in an array. If multiple items have the same frequency, return the one that appears first.',
    //     example: 'mostFrequentItem(["a", "b", "a", "c", "c", "b", "b"]) === "b"',
    //     funcSignature: {
    //         name: 'mostFrequentItem',
    //         args: [{ value: 'arr', type: 'array(string)' }],
    //         returnType: 'string'
    //     },
    //     difficulty: 3,
    //     categories: ['arrays', 'algorithm'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '["a", "b", "a", "c", "c", "b", "b"]', type: 'array(string)' }, { value: '"b"', type: 'string' }],
    //         [{ value: '["apple", "banana", "apple"]', type: 'array(string)' }, { value: '"apple"', type: 'string' }],
    //         [{ value: '["cat", "dog", "fish"]', type: 'array(string)' }, { value: '"cat"', type: 'string' }]
    //     ])
    // },
    // {
    //     id: '9',
    //     title: 'Longest Substring Without Repeating Characters',
    //     description: 'Given a string, find the length of the longest substring without repeating characters. For example, the longest substrings without repeating letters for "abcabcbb" are "abc", which the length is 3. For "bbbbb", the longest substring is "b", with the length of 1.',
    //     example: 'lengthOfLongestSubstring("pwwkew") === 3',
    //     funcSignature: {
    //         name: 'lengthOfLongestSubstring',
    //         args: [{ value: 's', type: { JAVA: 'String', PYTHON: 'str' } }],
    //         returnType: { JAVA: 'int', PYTHON: 'int' }
    //     },
    //     difficulty: 3,
    //     categories: ['string', 'algorithm'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: 'abcabcbb', type: { JAVA: 'String', PYTHON: 'str' } }, { value: '3', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: 'bbbbb', type: { JAVA: 'String', PYTHON: 'str' } }, { value: '1', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: 'pwwkew', type: { JAVA: 'String', PYTHON: 'str' } }, { value: '3', type: { JAVA: 'int', PYTHON: 'int' } }]
    //     ])
    // },    
    // {
    //     id: '10',
    //     title: 'Sum of Divisors',
    //     description: 'Calculate the sum of all divisors of a given number.',
    //     example: 'sumOfDivisors(12) === 28', // 1 + 2 + 3 + 4 + 6 + 12 = 28
    //     funcSignature: {
    //         name: 'sumOfDivisors',
    //         args: [{ value: 'num', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         returnType: { JAVA: 'int', PYTHON: 'int' }
    //     },
    //     difficulty: 2,
    //     categories: ['math'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '12', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '28', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: '5', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '6', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: '7', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '8', type: { JAVA: 'int', PYTHON: 'int' } }]
    //     ])
    // },
    // {
    //     id: '11',
    //     title: 'Is Perfect Square?',
    //     description: 'Determine if a given number is a perfect square.',
    //     example: 'isPerfectSquare(16) === true',
    //     funcSignature: {
    //         name: 'isPerfectSquare',
    //         args: [{ value: 'num', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         returnType: { JAVA: 'boolean', PYTHON: 'bool' }
    //     },
    //     difficulty: 2,
    //     categories: ['math'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '16', type: { JAVA: 'int', PYTHON: 'int' } }, { value: 'true', type: { JAVA: 'boolean', PYTHON: 'bool' } }],
    //         [{ value: '14', type: { JAVA: 'int', PYTHON: 'int' } }, { value: 'false', type: { JAVA: 'boolean', PYTHON: 'bool' } }],
    //         [{ value: '36', type: { JAVA: 'int', PYTHON: 'int' } }, { value: 'true', type: { JAVA: 'boolean', PYTHON: 'bool' } }]
    //     ])
    // },
    // {
    //     id: '12',
    //     title: 'Nth Fibonacci Number',
    //     description: 'Find the nth number in the Fibonacci sequence. Assume the sequence starts with 0 and 1.',
    //     example: 'fibonacci(5) === 5',
    //     funcSignature: {
    //         name: 'fibonacci',
    //         args: [{ value: 'n', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         returnType: { JAVA: 'int', PYTHON: 'int' }
    //     },
    //     difficulty: 2,
    //     categories: ['math', 'recursion'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '5', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '5', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: '6', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '8', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: '7', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '13', type: { JAVA: 'int', PYTHON: 'int' } }]
    //     ])
    // },
    // {
    //     id: '13',
    //     title: 'Is Palindrome Number?',
    //     description: 'Determine if a given number is a palindrome.',
    //     example: 'isPalindromeNumber(121) === true',
    //     funcSignature: {
    //         name: 'isPalindromeNumber',
    //         args: [{ value: 'num', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         returnType: { JAVA: 'boolean', PYTHON: 'bool' }
    //     },
    //     difficulty: 2,
    //     categories: ['math'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '121', type: { JAVA: 'int', PYTHON: 'int' } }, { value: 'true', type: { JAVA: 'boolean', PYTHON: 'bool' } }],
    //         [{ value: '123', type: { JAVA: 'int', PYTHON: 'int' } }, { value: 'false', type: { JAVA: 'boolean', PYTHON: 'bool' } }],
    //         [{ value: '1331', type: { JAVA: 'int', PYTHON: 'int' } }, { value: 'true', type: { JAVA: 'boolean', PYTHON: 'bool' } }]
    //     ])
    // },
    // {
    //     id: '14',
    //     title: 'Count Set Bits',
    //     description: 'For a given number, count the number of ones in its binary representation.',
    //     example: 'countSetBits(13) === 3',  // Binary representation of 13 is 1101
    //     funcSignature: {
    //         name: 'countSetBits',
    //         args: [{ value: 'num', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         returnType: { JAVA: 'int', PYTHON: 'int' }
    //     },
    //     difficulty: 2,
    //     categories: ['math', 'bitwise operations'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '13', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '3', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: '128', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '1', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: '255', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '8', type: { JAVA: 'int', PYTHON: 'int' } }]
    //     ])
    // },
    // {
    //     id: '15',
    //     title: 'Sum of Digits',
    //     description: 'Calculate the sum of digits of a given number.',
    //     example: 'sumOfDigits(123) === 6',
    //     funcSignature: {
    //         name: 'sumOfDigits',
    //         args: [{ value: 'num', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         returnType: { JAVA: 'int', PYTHON: 'int' }
    //     },
    //     difficulty: 1,
    //     categories: ['math'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '123', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '6', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: '456', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '15', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: '789', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '24', type: { JAVA: 'int', PYTHON: 'int' } }]
    //     ])
    // },
    // {
    //     id: '16',
    //     title: 'Nth Triangular Number',
    //     description: 'Find the nth triangular number. The nth triangular number is the sum of the first n natural numbers.',
    //     example: 'triangularNumber(4) === 10', // 1 + 2 + 3 + 4 = 10
    //     funcSignature: {
    //         name: 'triangularNumber',
    //         args: [{ value: 'n', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         returnType: { JAVA: 'int', PYTHON: 'int' }
    //     },
    //     difficulty: 2,
    //     categories: ['math'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '4', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '10', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: '5', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '15', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: '6', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '21', type: { JAVA: 'int', PYTHON: 'int' } }]
    //     ])
    // },
    // {
    //     id: '17',
    //     title: 'Find Divisors',
    //     description: 'Return all the divisors of a given number.',
    //     example: 'findDivisors(12) === [1, 2, 3, 4, 6, 12]',
    //     funcSignature: {
    //         name: 'findDivisors',
    //         args: [{ value: 'num', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         returnType: { JAVA: 'int[]', PYTHON: 'List[int]' }
    //     },
    //     difficulty: 2,
    //     categories: ['math'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '12', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '[1, 2, 3, 4, 6, 12]', type: { JAVA: 'int[]', PYTHON: 'List[int]' } }],
    //         [{ value: '15', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '[1, 3, 5, 15]', type: { JAVA: 'int[]', PYTHON: 'List[int]' } }],
    //         [{ value: '7', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '[1, 7]', type: { JAVA: 'int[]', PYTHON: 'List[int]' } }]
    //     ])
    // },
    // {
    //     id: '18',
    //     title: 'Calculate Fibonacci sequence',
    //     description: 'Write a function to calculate the Fibonacci sequence up to the nth number. The Fibonacci sequence is a series of numbers where a number is the sum of the two preceding ones, usually starting with 0 and 1.',
    //     example: 'fibonacci(5) === [0, 1, 1, 2, 3, 5]',
    //     funcSignature: {
    //         name: 'fibonacci',
    //         args: [{ value: 'n', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         returnType: { JAVA: 'int[]', PYTHON: 'List[int]' }
    //     },
    //     difficulty: 3,
    //     categories: ['math', 'recursion'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '5', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '[0,1,1,2,3,5]', type: { JAVA: 'int[]', PYTHON: 'List[int]' } }],
    //         [{ value: '7', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '[0,1,1,2,3,5,8,13]', type: { JAVA: 'int[]', PYTHON: 'List[int]' } }],
    //         [{ value: '10', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '[0,1,1,2,3,5,8,13,21,34,55]', type: { JAVA: 'int[]', PYTHON: 'List[int]' } }]
    //     ])
    // },
    // {
    //     id: '19',
    //     title: 'Sum of numbers in a string',
    //     description: 'Given a string, return the sum of the numbers appearing in the string, ignoring all other characters.',
    //     example: 'sumNumbers("abc123xyz") === 123',
    //     funcSignature: {
    //         name: 'sumNumbers',
    //         args: [{ value: 'str', type: { JAVA: 'String', PYTHON: 'str' } }],
    //         returnType: { JAVA: 'int', PYTHON: 'int' }
    //     },
    //     difficulty: 2,
    //     categories: ['string', 'algorithm'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: 'abc123xyz', type: { JAVA: 'String', PYTHON: 'str' } }, { value: '123', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: 'aa11b33', type: { JAVA: 'String', PYTHON: 'str' } }, { value: '44', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         [{ value: 'Chocolate22', type: { JAVA: 'String', PYTHON: 'str' } }, { value: '22', type: { JAVA: 'int', PYTHON: 'int' } }]
    //     ])
    // },
    // {
    //     id: '20',
    //     title: 'Is Power of Two?',
    //     description: 'Determine if a given number is a power of two.',
    //     example: 'isPowerOfTwo(16) === true',
    //     funcSignature: {
    //         name: 'isPowerOfTwo',
    //         args: [{ value: 'num', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         returnType: { JAVA: 'boolean', PYTHON: 'bool' }
    //     },
    //     difficulty: 2,
    //     categories: ['math'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '16', type: { JAVA: 'int', PYTHON: 'int' } }, { value: 'true', type: { JAVA: 'boolean', PYTHON: 'bool' } }],
    //         [{ value: '14', type: { JAVA: 'int', PYTHON: 'int' } }, { value: 'false', type: { JAVA: 'boolean', PYTHON: 'bool' } }],
    //         [{ value: '32', type: { JAVA: 'int', PYTHON: 'int' } }, { value: 'true', type: { JAVA: 'boolean', PYTHON: 'bool' } }]
    //     ])
    // },
    // {
    //     id: '21',
    //     title: 'testing question, not a real question',
    //     description: 'testing question, not a real question',
    //     example: 'testing question, not a real question',
    //     funcSignature: {
    //         name: 'testing',
    //         args: [{ value: 'test', type: { JAVA: 'int', PYTHON: 'int' } }],
    //         returnType: { JAVA: 'int', PYTHON: 'int' }
    //     },
    //     difficulty: 1,
    //     categories: ['testing', 'question'],
    //     testCases: new Map<Variable, Variable>([
    //         [{ value: '100', type: { JAVA: 'int', PYTHON: 'int' } }, { value: '100', type: { JAVA: 'int', PYTHON: 'int' } }],
    //     ])
    // }    
]
