export interface FunctionSignature {
    name: string,
    params: Map<string, string>,
    returnType: string
}

export interface Question {
    id: string,
    title: string,
    description: string,
    example: string,
    funcSignature: FunctionSignature
    // difficulty: number,
    // category: string,
}

export const questions: Question[] = [
    {
        id: "1",
        title: "Reverse a string",
        description: "Given a string, return a new string with the reversed order of characters",
        example: "reverse('apple') === 'leppa'",
        funcSignature: {
            name: "reverse",
            params: new Map([["str", "string"]]),
            returnType: "string"
        }
    },
    {
        id: "2",
        title: "Palindrome",
        description: "Given a string, return true if the string is a palindrome or false if it is not. Palindromes are strings that form the same word if it is reversed. *Do* include spaces and punctuation in determining if the string is a palindrome.",
        example: "palindrome('abba') === true",
        funcSignature: {
            name: "palindrome",
            params: new Map([["str", "string"]]),
            returnType: "boolean"
        }
    },
    {
        id: "3",
        title: "Reverse an integer",
        description: "Given an integer, return an integer that is the reverse ordering of numbers.",
        example: "reverseInt(15) === 51",
        funcSignature: {
            name: "reverseInt",
            params: new Map([["n", "number"]]),
            returnType: "number"
        }
    },
    {
        id: "4",
        title: "Max Character",
        description: "Given a string, return the character that is most commonly used in the string.",
        example: "maxChar('abcccccccd') === 'c'",
        funcSignature: {
            name: "maxChar",
            params: new Map([["str", "string"]]),
            returnType: "string"
        }
    },
    {
        id: "5",
        title: "FizzBuzz",
        description: "Write a program that console logs the numbers from 1 to n. But for multiples of three print 'fizz' instead of the number and for the multiples of five print 'buzz'. For numbers which are multiples of both three and five print 'fizzbuzz'.",
        example: "fizzBuzz(5) === 1, 2, fizz, 4, buzz",
        funcSignature: {
            name: "fizzBuzz",
            params: new Map([["n", "number"]]),
            returnType: "void"
        }
    },
    {
        id: "6",
        title: "Array Chunking",
        description: "Given an array and chunk size, divide the array into many subarrays where each subarray is of length size",
        example: "chunk([1,2,3,4], 2) === [[1,2], [3,4]]",
        funcSignature: {
            name: "chunk",
            params: new Map([["arr", "number[]"], ["size", "number"]]),
            returnType: "number[][]"
        }
    },
    {
        id: "7",
        title: "Anagrams",
        description: "Check to see if two provided strings are anagrams of eachother. One string is an anagram of another if it uses the same characters in the same quantity. Only consider characters, not spaces or punctuation. Consider capital letters to be the same as lower case.",
        example: "anagrams('rail safety', 'fairy tales') === true",
        funcSignature: {
            name: "anagrams",
            params: new Map([["strA", "string"], ["strB", "string"]]),
            returnType: "boolean"
        }
    },
    {
        id: "8",
        title: "Sentence Capitalization",
        description: "Write a function that accepts a string. The function should capitalize the first letter of each word in the string then return the capitalized string.",
        example: "capitalize('a short sentence') === 'A Short Sentence'",
        funcSignature: {
            name: "capitalize",
            params: new Map([["str", "string"]]),
            returnType: "string"
        }
    },
    {
        id: "9",
        title: "Printing Steps",
        description: "Write a function that accepts a positive number N. The function should console log a step shape with N levels using the # character. Make sure the step has spaces on the right hand side!",
        example: "steps(2) === '# ', '##'",
        funcSignature: {
            name: "steps",
            params: new Map([["n", "number"]]),
            returnType: "void"
        }
    },
    {
        id: "10",
        title: "Pyramid",
        description: "Write a function that accepts a positive number N. The function should console log a pyramid shape with N levels using the # character. Make sure the pyramid has spaces on both the left *and* right hand sides!",
        example: "pyramid(3) === '  #  ', ' ### ', '#####'",
        funcSignature: {
            name: "pyramid",
            params: new Map([["n", "number"]]),
            returnType: "void"
        }
    },
    {
        id: "11",
        title: "Find the Vowels",
        description: "Write a function that returns the number of vowels used in a string. Vowels are the characters 'a', 'e', 'i', 'o', and 'u'.",
        example: "vowels('Hi There!') === 3",
        funcSignature: {
            name: "vowels",
            params: new Map([["str", "string"]]),
            returnType: "number"
        }
    },
    {
        id: "12",
        title: "Matrix Spiral",
        description: "Write a function that accepts an integer N and returns a NxN spiral matrix.",
        example: "matrix(2) === [[1, 2], [4, 3]]",
        funcSignature: {
            name: "matrix",
            params: new Map([["n", "number"]]),
            returnType: "number[][]"
        }
    },
    {
        id: "13",
        title: "Fibonacci",
        description: "Print out the n-th entry in the fibonacci series. The fibonacci series is an ordering of numbers where each number is the sum of the preceeding two.",
        example: "fib(4) === 3",
        funcSignature: {
            name: "fib",
            params: new Map([["n", "number"]]),
            returnType: "number"
        }
    },
    {
        id: "14",
        title: "Queue",
        description: "Implement a Queue datastructure using two stacks. *Do not* create an array inside of the 'Queue' class. Queue should implement the methods 'add', 'remove', and 'peek'. For a reminder on what each method does, look back at the Queue exercise.",
        example: "const q = new Queue(); q.add(1); q.add(2); q.peek() === 1; q.remove() === 1; q.remove() === 2;",
        funcSignature: {
            name: "Queue",
            params: new Map(),
            returnType: "class"
        }
    },
    {
        id: "15",
        title: "Weave",
        description: "Implement the 'weave' function. Weave receives two queues as arguments and combines the contents of each into a new, third queue. The third queue should contain the *alterating* content of the two queues. The function should handle queues of different lengths without inserting 'undefined' into the new one. *Do not* access the array inside of any queue, only use the 'add', 'remove', and 'peek' functions.",
        example: "const queueOne = new Queue(); queueOne.add(1); queueOne.add(2); const queueTwo = new Queue(); queueTwo.add('Hi'); queueTwo.add('There'); const q = weave(queueOne, queueTwo); q.remove() === 1; q.remove() === 'Hi'; q.remove() === 2; q.remove() === 'There';",
        funcSignature: {
            name: "weave",
            params: new Map([["sourceOne", "Queue"], ["sourceTwo", "Queue"]]),
            returnType: "Queue"
        }
    },
]