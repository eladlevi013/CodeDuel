import { Question, Variable } from '../../models/Question';

export const questions: Question[] = [
  {
    id: '1',
    title: 'Maximum Difference',
    description:
      'Given an array of integers, find the maximum difference between two elements such that the larger element comes after the smaller element.',
    example: 'maxDifference([2, 3, 10, 6, 4, 8, 1]) === 8',
    funcSignature: {
      name: 'maxDifference',
      args: [{ value: 'arr', type: 'array(int)' }],
      returnType: 'number'
    },
    difficulty: 2,
    categories: ['arrays', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: [2, 3, 10, 6, 4, 8, 1], type: 'array(number)' },
        { value: 8, type: 'number' }
      ],
      [
        { value: [7, 9, 5, 6, 3, 2], type: 'array(number)' },
        { value: 2, type: 'number' }
      ],
      [
        { value: [1, 2, 3, 4, 5], type: 'array(number)' },
        { value: 4, type: 'number' }
      ]
    ])
  },
  {
    id: '2',
    title: 'Flatten String Matrix',
    description:
      'Given a 2D array (matrix) of strings, flatten it into a 1D array. Your solution should not use any built-in flatten methods.',
    example: `flattenStringMatrix([['a', 'b'], ['c', 'd'], ['e', 'f']]) === ['a', 'b', 'c', 'd', 'e', 'f']`,
    funcSignature: {
      name: 'flattenStringMatrix',
      args: [{ value: 'matrix', type: 'array(array(string))' }],
      returnType: 'array(string)'
    },
    difficulty: 2,
    categories: ['arrays', 'algorithm'],
    testCases: new Map([
      [
        {
          value: [
            ['a', 'b'],
            ['c', 'd'],
            ['e', 'f']
          ],
          type: 'array(array(string))'
        },
        { value: ['a', 'b', 'c', 'd', 'e', 'f'], type: 'array(string)' }
      ],
      [
        { value: [['hello'], ['world']], type: 'array(array(string))' },
        { value: ['hello', 'world'], type: 'array(string)' }
      ],
      [
        {
          value: [
            ['apple', 'banana'],
            ['cherry', 'date']
          ],
          type: 'array(array(string))'
        },
        { value: ['apple', 'banana', 'cherry', 'date'], type: 'array(string)' }
      ]
    ])
  },
  {
    id: '3',
    title: 'Can Form Triangle?',
    description:
      'Given an array of integers, determine if any three numbers can form the sides of a triangle.',
    example: 'canFormTriangle([4, 1, 3, 6]) === true',
    funcSignature: {
      name: 'canFormTriangle',
      args: [{ value: 'arr', type: 'array(number)' }],
      returnType: 'boolean'
    },
    difficulty: 3,
    categories: ['arrays', 'geometry'],
    testCases: new Map<Variable, Variable>([
      [
        { value: [4, 1, 3, 6], type: 'array(number)' },
        { value: true, type: 'boolean' }
      ],
      [
        { value: [1, 2, 3], type: 'array(number)' },
        { value: false, type: 'boolean' }
      ],
      [
        { value: [10, 15, 5, 7], type: 'array(number)' },
        { value: true, type: 'boolean' }
      ]
    ])
  },
  {
    id: '4',
    title: 'Vowel Count',
    description: 'Count the number of vowels in a given string.',
    example: 'vowelCount("hello") === 2',
    funcSignature: {
      name: 'vowelCount',
      args: [{ value: 'str', type: 'string' }],
      returnType: 'number'
    },
    difficulty: 1,
    categories: ['string', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 'hello', type: 'string' },
        { value: 2, type: 'number' }
      ],
      [
        { value: 'world', type: 'string' },
        { value: 1, type: 'number' }
      ],
      [
        { value: 'aeiou', type: 'string' },
        { value: 5, type: 'number' }
      ]
    ])
  },
  {
    id: '5',
    title: 'Is Ascending?',
    description: 'Check if the given array of numbers is in ascending order.',
    example: 'isAscending([1, 2, 3, 4]) === true',
    funcSignature: {
      name: 'isAscending',
      args: [{ value: 'arr', type: 'array(number)' }],
      returnType: 'boolean'
    },
    difficulty: 2,
    categories: ['arrays', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: [1, 2, 3, 4], type: 'array(number)' },
        { value: true, type: 'boolean' }
      ],
      [
        { value: [1, 3, 2, 4], type: 'array(number)' },
        { value: false, type: 'boolean' }
      ],
      [
        { value: [5, 6, 7, 8], type: 'array(number)' },
        { value: true, type: 'boolean' }
      ]
    ])
  },
  {
    id: '6',
    title: 'Is Prime?',
    description: 'Determine if a given number is prime.',
    example: 'isPrime(7) === true',
    funcSignature: {
      name: 'isPrime',
      args: [{ value: 'num', type: 'number' }],
      returnType: 'boolean'
    },
    difficulty: 2,
    categories: ['numbers', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 7, type: 'number' },
        { value: true, type: 'boolean' }
      ],
      [
        { value: 4, type: 'number' },
        { value: false, type: 'boolean' }
      ],
      [
        { value: 17, type: 'number' },
        { value: true, type: 'boolean' }
      ]
    ])
  },
  {
    id: '7',
    title: 'Factorial',
    description: 'Calculate the factorial of a given non-negative number.',
    example: 'factorial(5) === 120',
    funcSignature: {
      name: 'factorial',
      args: [{ value: 'num', type: 'number' }],
      returnType: 'number'
    },
    difficulty: 2,
    categories: ['numbers', 'recursion'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 5, type: 'number' },
        { value: 120, type: 'number' }
      ],
      [
        { value: 3, type: 'number' },
        { value: 6, type: 'number' }
      ],
      [
        { value: 0, type: 'number' },
        { value: 1, type: 'number' }
      ]
    ])
  },
  {
    id: '8',
    title: 'Most Frequent Item',
    description:
      'Find the item that appears most frequently in an array. If multiple items have the same frequency, return the one that appears first.',
    example: 'mostFrequentItem(["a", "b", "a", "c", "c", "b", "b"]) === "b"',
    funcSignature: {
      name: 'mostFrequentItem',
      args: [{ value: 'arr', type: 'array(string)' }],
      returnType: 'string'
    },
    difficulty: 3,
    categories: ['arrays', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: ['a', 'b', 'a', 'c', 'c', 'b', 'b'], type: 'array(string)' },
        { value: 'b', type: 'string' }
      ],
      [
        { value: ['apple', 'banana', 'apple'], type: 'array(string)' },
        { value: 'apple', type: 'string' }
      ],
      [
        { value: ['cat', 'dog', 'fish'], type: 'array(string)' },
        { value: 'cat', type: 'string' }
      ]
    ])
  },
  {
    id: '9',
    title: 'Longest Substring Without Repeating Characters',
    description:
      'Given a string, find the length of the longest substring without repeating characters.',
    example: 'longestSubstring("abcabcbb") === 3',
    funcSignature: {
      name: 'longestSubstring',
      args: [{ value: 'str', type: 'string' }],
      returnType: 'number'
    },
    difficulty: 3,
    categories: ['strings', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 'abcabcbb', type: 'string' },
        { value: 3, type: 'number' }
      ],
      [
        { value: 'bbbbb', type: 'string' },
        { value: 1, type: 'number' }
      ],
      [
        { value: 'pwwkew', type: 'string' },
        { value: 3, type: 'number' }
      ]
    ])
  },

  {
    id: '10',
    title: 'Sum of Divisors',
    description: 'Calculate the sum of all divisors of a given number.',
    example: 'sumOfDivisors(6) === 12',
    funcSignature: {
      name: 'sumOfDivisors',
      args: [{ value: 'num', type: 'number' }],
      returnType: 'number'
    },
    difficulty: 2,
    categories: ['numbers', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 6, type: 'number' },
        { value: 12, type: 'number' }
      ],
      [
        { value: 4, type: 'number' },
        { value: 7, type: 'number' }
      ],
      [
        { value: 10, type: 'number' },
        { value: 18, type: 'number' }
      ]
    ])
  },

  {
    id: '11',
    title: 'Is Perfect Square?',
    description: 'Determine if a given number is a perfect square.',
    example: 'isPerfectSquare(16) === true',
    funcSignature: {
      name: 'isPerfectSquare',
      args: [{ value: 'num', type: 'number' }],
      returnType: 'boolean'
    },
    difficulty: 2,
    categories: ['numbers', 'math'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 16, type: 'number' },
        { value: true, type: 'boolean' }
      ],
      [
        { value: 18, type: 'number' },
        { value: false, type: 'boolean' }
      ],
      [
        { value: 25, type: 'number' },
        { value: true, type: 'boolean' }
      ]
    ])
  },
  {
    id: '12',
    title: 'Nth Fibonacci Number',
    description: 'Given a positive integer n, return the nth number in the Fibonacci sequence.',
    example: 'nthFibonacci(5) === 5',
    funcSignature: {
      name: 'nthFibonacci',
      args: [{ value: 'n', type: 'number' }],
      returnType: 'number'
    },
    difficulty: 2,
    categories: ['numbers', 'recursion'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 5, type: 'number' },
        { value: 5, type: 'number' }
      ],
      [
        { value: 6, type: 'number' },
        { value: 8, type: 'number' }
      ],
      [
        { value: 7, type: 'number' },
        { value: 13, type: 'number' }
      ]
    ])
  },

  {
    id: '13',
    title: 'Is Palindrome String?',
    description:
      'Determine if a given string is a palindrome. Consider the string case-insensitive and ignore any non-alphanumeric characters.',
    example: 'isPalindrome("A man, a plan, a canal, Panama") === true',
    funcSignature: {
      name: 'isPalindrome',
      args: [{ value: 'str', type: 'string' }],
      returnType: 'boolean'
    },
    difficulty: 2,
    categories: ['strings', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 'A man, a plan, a canal, Panama', type: 'string' },
        { value: true, type: 'boolean' }
      ],
      [
        { value: 'racecar', type: 'string' },
        { value: true, type: 'boolean' }
      ],
      [
        { value: 'hello', type: 'string' },
        { value: false, type: 'boolean' }
      ]
    ])
  },

  {
    id: '14',
    title: 'Count Set Bits',
    description:
      'Given a positive integer, count the number of 1s (set bits) in its binary representation.',
    example: 'countSetBits(5) === 2',
    funcSignature: {
      name: 'countSetBits',
      args: [{ value: 'num', type: 'number' }],
      returnType: 'number'
    },
    difficulty: 2,
    categories: ['numbers', 'bit-manipulation'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 5, type: 'number' },
        { value: 2, type: 'number' }
      ],
      [
        { value: 7, type: 'number' },
        { value: 3, type: 'number' }
      ],
      [
        { value: 10, type: 'number' },
        { value: 2, type: 'number' }
      ]
    ])
  },
  {
    id: '15',
    title: 'Sum of Digits',
    description: 'Given a non-negative integer, return the sum of its digits.',
    example: 'sumOfDigits(123) === 6',
    funcSignature: {
      name: 'sumOfDigits',
      args: [{ value: 'num', type: 'number' }],
      returnType: 'number'
    },
    difficulty: 1,
    categories: ['numbers'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 123, type: 'number' },
        { value: 6, type: 'number' }
      ],
      [
        { value: 456, type: 'number' },
        { value: 15, type: 'number' }
      ],
      [
        { value: 789, type: 'number' },
        { value: 24, type: 'number' }
      ]
    ])
  },

  {
    id: '16',
    title: 'Nth Triangular Number',
    description:
      'Given a positive integer n, return the nth triangular number. The nth triangular number is the sum of all integers from 1 to n.',
    example: 'nthTriangular(4) === 10',
    funcSignature: {
      name: 'nthTriangular',
      args: [{ value: 'n', type: 'number' }],
      returnType: 'number'
    },
    difficulty: 2,
    categories: ['numbers', 'math'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 4, type: 'number' },
        { value: 10, type: 'number' }
      ],
      [
        { value: 5, type: 'number' },
        { value: 15, type: 'number' }
      ],
      [
        { value: 6, type: 'number' },
        { value: 21, type: 'number' }
      ]
    ])
  },

  {
    id: '17',
    title: 'Find Divisors',
    description: 'Given a positive integer, return an array containing all of its divisors.',
    example: 'findDivisors(12) === [1, 2, 3, 4, 6, 12]',
    funcSignature: {
      name: 'findDivisors',
      args: [{ value: 'num', type: 'number' }],
      returnType: 'array(number)'
    },
    difficulty: 2,
    categories: ['numbers', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 12, type: 'number' },
        { value: [1, 2, 3, 4, 6, 12], type: 'array(number)' }
      ],
      [
        { value: 15, type: 'number' },
        { value: [1, 3, 5, 15], type: 'array(number)' }
      ],
      [
        { value: 16, type: 'number' },
        { value: [1, 2, 4, 8, 16], type: 'array(number)' }
      ]
    ])
  },
  {
    id: '18',
    title: 'Calculate Fibonacci Sequence',
    description:
      'Given a positive integer n, return the first n numbers in the Fibonacci sequence as an array.',
    example: 'calculateFibonacci(5) === [0, 1, 1, 2, 3]',
    funcSignature: {
      name: 'calculateFibonacci',
      args: [{ value: 'n', type: 'number' }],
      returnType: 'array(number)'
    },
    difficulty: 2,
    categories: ['numbers', 'recursion', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 5, type: 'number' },
        { value: [0, 1, 1, 2, 3], type: 'array(number)' }
      ],
      [
        { value: 3, type: 'number' },
        { value: [0, 1, 1], type: 'array(number)' }
      ],
      [
        { value: 6, type: 'number' },
        { value: [0, 1, 1, 2, 3, 5], type: 'array(number)' }
      ]
    ])
  },

  {
    id: '19',
    title: 'Sum of Numbers in a String',
    description: 'Given a string, extract all the numbers and return their sum.',
    example: 'sumOfNumbersInString("abc123def45") === 168',
    funcSignature: {
      name: 'sumOfNumbersInString',
      args: [{ value: 'str', type: 'string' }],
      returnType: 'number'
    },
    difficulty: 2,
    categories: ['strings', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 'abc123def45', type: 'string' },
        { value: 168, type: 'number' }
      ],
      [
        { value: 'hello123', type: 'string' },
        { value: 123, type: 'number' }
      ],
      [
        { value: '10cats20dogs', type: 'string' },
        { value: 30, type: 'number' }
      ]
    ])
  },

  {
    id: '20',
    title: 'Is Power of Two?',
    description: 'Determine if a given positive integer is a power of two.',
    example: 'isPowerOfTwo(16) === true',
    funcSignature: {
      name: 'isPowerOfTwo',
      args: [{ value: 'num', type: 'number' }],
      returnType: 'boolean'
    },
    difficulty: 2,
    categories: ['numbers', 'bit-manipulation', 'algorithm'],
    testCases: new Map<Variable, Variable>([
      [
        { value: 16, type: 'number' },
        { value: true, type: 'boolean' }
      ],
      [
        { value: 18, type: 'number' },
        { value: false, type: 'boolean' }
      ],
      [
        { value: 32, type: 'number' },
        { value: true, type: 'boolean' }
      ]
    ])
  }
];
