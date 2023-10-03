import { Question, Variable } from '../Models/question';

export const questions: Question[] = [
    {
        id: '1',
        title: 'Reverse a string',
        description: 'Reverse a string',
        example: 'reverseString("hello") === "olleh"',
        funcSignature: {
            name: 'reverseString',
            args: [{ value: 'str', type: 'string' }],
            returnType: 'string'
        },
        difficulty: 1,
        categories: ['string', 'algorithm'],
        testCases: new Map<Variable, Variable>([
            [{ value: 'hello', type: 'string' }, { value: 'olleh', type: 'string' }],
            [{ value: 'Howdy', type: 'string' }, { value: 'ydwoH', type: 'string' }],
            [{ value: 'Greetings from Earth', type: 'string' }, { value: 'htraE morf sgniteerG', type: 'string' }]
        ])
    },
    {
        id: '2',
        title: 'Find the factorial of a number',
        description: 'Write a function to find the factorial of a given non-negative integer. The factorial of a number is the product of all positive integers up to that number. For example, the factorial of 5 is 120 (5*4*3*2*1).',
        example: 'factorial(5) === 120',
        funcSignature: {
            name: 'factorial',
            args: [{ value: 'num', type: 'int' }],
            returnType: 'int'
        },
        difficulty: 2,
        categories: ['math', 'recursion'],
        testCases: new Map<Variable, Variable>([
            [{ value: '0', type: 'int' }, { value: '1', type: 'int' }],
            [{ value: '5', type: 'int' }, { value: '120', type: 'int' }],
            [{ value: '7', type: 'int' }, { value: '5040', type: 'int' }]
        ])
    },
    {
        id: '3',
        title: 'Check if a string is a palindrome',
        description: 'A palindrome is a word, phrase, number, or other sequences of characters that reads the same forward and backward (ignoring spaces, punctuation, and capitalization). Write a function that returns true if the given string is a palindrome and false if it is not.',
        example: 'isPalindrome("Racecar") === true',
        funcSignature: {
            name: 'isPalindrome',
            args: [{ value: 'str', type: 'string' }],
            returnType: 'boolean'
        },
        difficulty: 2,
        categories: ['string', 'algorithm'],
        testCases: new Map<Variable, Variable>([
            [{ value: 'Racecar', type: 'string' }, { value: 'true', type: 'boolean' }],
            [{ value: 'hello', type: 'string' }, { value: 'false', type: 'boolean' }],
            [{ value: 'A man a plan a canal Panama', type: 'string' }, { value: 'true', type: 'boolean' }]
        ])
    },
    {
        id: '4',
        title: 'Find the largest number in an array',
        description: 'Write a function to find the largest number in an array of numbers. The array may contain duplicates. You need to consider that the array might have negative numbers as well, so pay attention to how you handle different types of inputs. Your implementation should go through the array and return the largest element found.',
        example: 'findLargest([1,5,8,3]) === 8\nfindLargest([-12,0,-15,20]) === 20',
        funcSignature: {
            name: 'findLargest',
            args: [{ value: 'nums', type: 'int[]' }],
            returnType: 'int'
        },
        difficulty: 1,
        categories: ['array', 'algorithm'],
        testCases: new Map<Variable, Variable>([
            [{ value: '[1,5,8,3]', type: 'int[]' }, { value: '8', type: 'int' }],
            [{ value: '[12,4,5,9]', type: 'int[]' }, { value: '12', type: 'int' }],
            [{ value: '[-1,-5,-8,-3]', type: 'int[]' }, { value: '-1', type: 'int' }],
            [{ value: '[-12,0,-15,20]', type: 'int[]' }, { value: '20', type: 'int' }],
            [{ value: '[100,200,300,400]', type: 'int[]' }, { value: '400', type: 'int' }]
        ])
    },
    {
        id: '5',
        title: 'Calculate Fibonacci sequence',
        description: 'Write a function to calculate the Fibonacci sequence up to the nth number. The Fibonacci sequence is a series of numbers where a number is the sum of the two preceding ones, usually starting with 0 and 1.',
        example: 'fibonacci(5) === [0, 1, 1, 2, 3, 5]',
        funcSignature: {
            name: 'fibonacci',
            args: [{ value: 'n', type: 'int' }],
            returnType: 'int[]'
        },
        difficulty: 3,
        categories: ['math', 'recursion'],
        testCases: new Map<Variable, Variable>([
            [{ value: '5', type: 'int' }, { value: '[0,1,1,2,3,5]', type: 'int[]' }],
            [{ value: '7', type: 'int' }, { value: '[0,1,1,2,3,5,8,13]', type: 'int[]' }],
            [{ value: '10', type: 'int' }, { value: '[0,1,1,2,3,5,8,13,21,34,55]', type: 'int[]' }]
        ])
    },
    {
        id: '6',
        title: 'Prime Number Checker',
        description: 'A prime number is a natural number greater than 1 that cannot be formed by multiplying two smaller natural numbers other than itself. Write a function to check if a given number is a prime number. Your implementation should return true if the number is prime and false if it is not.',
        example: 'isPrime(11) === true\nisPrime(4) === false',
        funcSignature: {
            name: 'isPrime',
            args: [{ value: 'num', type: 'int' }],
            returnType: 'boolean'
        },
        difficulty: 2,
        categories: ['math', 'number theory'],
        testCases: new Map<Variable, Variable>([
            [{ value: '11', type: 'int' }, { value: 'true', type: 'boolean' }],
            [{ value: '4', type: 'int' }, { value: 'false', type: 'boolean' }],
            [{ value: '19', type: 'int' }, { value: 'true', type: 'boolean' }]
        ])
    },
    {
        id: '7',
        title: 'Longest Substring Without Repeating Characters',
        description: 'Given a string, find the length of the longest substring without repeating characters. For example, the longest substrings without repeating letters for "abcabcbb" are "abc", which the length is 3. For "bbbbb", the longest substring is "b", with the length of 1.',
        example: 'lengthOfLongestSubstring("pwwkew") === 3',
        funcSignature: {
            name: 'lengthOfLongestSubstring',
            args: [{ value: 's', type: 'string' }],
            returnType: 'int'
        },
        difficulty: 3,
        categories: ['string', 'algorithm'],
        testCases: new Map<Variable, Variable>([
            [{ value: 'abcabcbb', type: 'string' }, { value: '3', type: 'int' }],
            [{ value: 'bbbbb', type: 'string' }, { value: '1', type: 'int' }],
            [{ value: 'pwwkew', type: 'string' }, { value: '3', type: 'int' }]
        ])
    },
    {
        id: '8',
        title: 'Merge Intervals',
        description: 'Given an array of intervals where intervals[i] = [starti, endi], merge any overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input. Your solution should work efficiently even when the input list of intervals is not sorted.',
        example: 'mergeIntervals([[1,3],[2,6],[8,10],[15,18]]) === [[1,6],[8,10],[15,18]]',
        funcSignature: {
            name: 'mergeIntervals',
            args: [{ value: 'intervals', type: 'int[][]' }],
            returnType: 'int[][]'
        },
        difficulty: 3,
        categories: ['array', 'interval'],
        testCases: new Map<Variable, Variable>([
            [
                { value: '[[1,3],[2,6],[8,10],[15,18]]', type: 'int[][]' }, 
                { value: '[[1,6],[8,10],[15,18]]', type: 'int[][]' }
            ],
            [
                { value: '[[1,4],[4,5]]', type: 'int[][]' }, 
                { value: '[[1,5]]', type: 'int[][]' }
            ]
        ])
    },
    {
        id: '9',
        title: 'Balanced Parentheses',
        description: 'Write a function that takes a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\' and determines if the input string is valid. An input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. An empty string is also considered valid.',
        example: 'isValid("()[]{}") === true\nisValid("(]") === false',
        funcSignature: {
            name: 'isValid',
            args: [{ value: 's', type: 'string' }],
            returnType: 'boolean'
        },
        difficulty: 2,
        categories: ['string', 'stack'],
        testCases: new Map<Variable, Variable>([
            [{ value: '()[]{}', type: 'string' }, { value: 'true', type: 'boolean' }],
            [{ value: '(]', type: 'string' }, { value: 'false', type: 'boolean' }],
            [{ value: '{[]}', type: 'string' }, { value: 'true', type: 'boolean' }]
        ])
    },
    {
        id: '11',
        title: 'Minimum Window Substring',
        description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string. A substring is a contiguous sequence of characters within the string.',
        example: 'minWindow("ADOBECODEBANC", "ABC") === "BANC"',
        funcSignature: {
            name: 'minWindow',
            args: [{ value: 's', type: 'string' }, { value: 't', type: 'string' }],
            returnType: 'string'
        },
        difficulty: 4,
        categories: ['string', 'two pointers'],
        testCases: new Map<Variable, Variable>([
            [{ value: 's:ADOBECODEBANC,t:ABC', type: 'string' }, { value: 'BANC', type: 'string' }],
            [{ value: 's:AA,t:AA', type: 'string' }, { value: 'AA', type: 'string' }]
        ])
    },
    {
        id: '12',
        title: 'Serialize and Deserialize Binary Tree',
        description: 'Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You need to ensure that a binary tree can be serialized to a string, and this string can be deserialized back to the original tree structure.',
        example: 'deserialize(serialize(root)).val === root.val',
        funcSignature: {
            name: 'serialize',
            args: [{ value: 'root', type: 'TreeNode' }],
            returnType: 'string'
        },
        difficulty: 4,
        categories: ['tree', 'design'],
        testCases: new Map<Variable, Variable>([
            [{ value: '1,2,3,null,null,4,5', type: 'TreeNode' }, { value: '1,2,3,null,null,4,5', type: 'string' }],
        ])
    },
    {
        id: '13',
        title: 'Longest Consecutive Sequence',
        description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
        example: 'longestConsecutive([100, 4, 200, 1, 3, 2]) === 4',
        funcSignature: {
            name: 'longestConsecutive',
            args: [{ value: 'nums', type: 'int[]' }],
            returnType: 'int'
        },
        difficulty: 4,
        categories: ['array', 'sorting'],
        testCases: new Map<Variable, Variable>([
            [{ value: '[100,4,200,1,3,2]', type: 'int[]' }, { value: '4', type: 'int' }],
            [{ value: '[0,3,7,2,5,8,4,6,0,1]', type: 'int[]' }, { value: '9', type: 'int' }]
        ])
    },
    {
        id: '14',
        title: 'Maximum Product Subarray',
        description: 'Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product. It is guaranteed that the answer will fit in a 32-bit integer. A subarray is a contiguous subsequence of the array.',
        example: 'maxProduct([2,3,-2,4]) === 6',
        funcSignature: {
            name: 'maxProduct',
            args: [{ value: 'nums', type: 'int[]' }],
            returnType: 'int'
        },
        difficulty: 3,
        categories: ['array'],
        testCases: new Map<Variable, Variable>([
            [{ value: '[2,3,-2,4]', type: 'int[]' }, { value: '6', type: 'int' }],
            [{ value: '[-2,0,-1]', type: 'int[]' }, { value: '0', type: 'int' }]
        ])
    }
];
