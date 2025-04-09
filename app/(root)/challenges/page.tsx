"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Play, Shuffle } from "lucide-react";

// Define the challenge type
type Challenge = {
  title: string;
  description: string;
};

// 50 challenge objects
const challenges: Challenge[] = [
  {
    title: "Reverse a string",
    description: "Write a function to reverse a string.",
  },
  {
    title: "Check for palindrome",
    description: "Write a function to check if a string is a palindrome.",
  },
  {
    title: "Sum of digits",
    description: "Write a function to calculate the sum of digits of a number.",
  },
  {
    title: "Find factorial",
    description: "Write a function to find the factorial of a number.",
  },
  {
    title: "Fibonacci number",
    description: "Write a function to return the Nth Fibonacci number.",
  },
  {
    title: "Prime check",
    description: "Write a function to check if a number is prime.",
  },
  {
    title: "Find max in array",
    description: "Write a function to find the maximum number in an array.",
  },
  {
    title: "Remove duplicates",
    description: "Write a function to remove duplicates from an array.",
  },
  {
    title: "Count vowels",
    description: "Write a function to count vowels in a string.",
  },
  {
    title: "String compression",
    description: "Write a function to compress a string (e.g. aabcc → a2b1c2).",
  },
  {
    title: "Binary to decimal",
    description: "Write a function to convert binary to decimal.",
  },
  {
    title: "Decimal to binary",
    description: "Write a function to convert decimal to binary.",
  },
  {
    title: "Anagram check",
    description: "Write a function to check if two strings are anagrams.",
  },
  {
    title: "Find intersection",
    description: "Write a function to find the intersection of two arrays.",
  },
  {
    title: "Merge sorted arrays",
    description: "Write a function to merge two sorted arrays.",
  },
  {
    title: "Rotate array",
    description: "Write a function to rotate an array by K steps.",
  },
  {
    title: "Flatten array",
    description: "Write a function to flatten a nested array.",
  },
  {
    title: "Matrix transpose",
    description: "Write a function to transpose a matrix.",
  },
  {
    title: "Check balanced parentheses",
    description: "Write a function to check for balanced parentheses.",
  },
  {
    title: "Capitalize words",
    description:
      "Write a function to capitalize the first letter of each word.",
  },
  {
    title: "Deep clone object",
    description: "Write a function to deep clone a JavaScript object.",
  },
  {
    title: "Find longest word",
    description: "Write a function to find the longest word in a sentence.",
  },
  {
    title: "Check power of 2",
    description: "Write a function to check if a number is a power of 2.",
  },
  {
    title: "GCD of two numbers",
    description: "Write a function to find the GCD of two numbers.",
  },
  {
    title: "LCM of two numbers",
    description: "Write a function to find the LCM of two numbers.",
  },
  {
    title: "Remove falsy values",
    description: "Write a function to remove falsy values from an array.",
  },
  {
    title: "Get unique values",
    description: "Write a function to return unique values from an array.",
  },
  {
    title: "Group by key",
    description: "Write a function to group an array of objects by key.",
  },
  {
    title: "Sum of nested array",
    description: "Write a function to sum all numbers in a nested array.",
  },
  {
    title: "Reverse number",
    description: "Write a function to reverse a number.",
  },
  {
    title: "Check Armstrong number",
    description:
      "Write a function to check if a number is an Armstrong number.",
  },
  {
    title: "Check leap year",
    description: "Write a function to check if a year is a leap year.",
  },
  {
    title: "Count words in string",
    description: "Write a function to count words in a string.",
  },
  {
    title: "Shuffle array",
    description: "Write a function to shuffle elements in an array.",
  },
  {
    title: "Sort by frequency",
    description: "Write a function to sort elements by frequency.",
  },
  {
    title: "Convert case",
    description:
      "Write a function to convert uppercase to lowercase and vice versa.",
  },
  {
    title: "Check isomorphic strings",
    description: "Write a function to check if two strings are isomorphic.",
  },
  {
    title: "Find missing number",
    description: "Write a function to find the missing number in an array.",
  },
  {
    title: "Sum of even numbers",
    description: "Write a function to sum all even numbers in an array.",
  },
  {
    title: "Detect cycle in list",
    description: "Write a function to detect a cycle in a linked list.",
  },
  {
    title: "Linked list reversal",
    description: "Write a function to reverse a linked list.",
  },
  {
    title: "Find median",
    description: "Write a function to find the median of an array.",
  },
  {
    title: "Palindrome number",
    description: "Write a function to check if a number is a palindrome.",
  },
  {
    title: "Subarray sum",
    description:
      "Write a function to check if a subarray with given sum exists.",
  },
  {
    title: "Validate brackets",
    description:
      "Write a function to validate if brackets are properly closed.",
  },
  {
    title: "Sum of squares",
    description: "Write a function to return the sum of squares of numbers.",
  },
  {
    title: "Flatten nested object",
    description: "Write a function to flatten a deeply nested object.",
  },
  {
    title: "Check string rotation",
    description:
      "Write a function to check if one string is a rotation of another.",
  },
  {
    title: "Check pangram",
    description: "Write a function to check if a sentence is a pangram.",
  },
  {
    title: "Zip two arrays",
    description: "Write a function to zip two arrays into one.",
  },
];

export default function DailyChallengePage() {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  );

  useEffect(() => {
    const random = Math.floor(Math.random() * challenges.length);
    setCurrentChallenge(challenges[random]);
  }, []);

  const runCode = () => {
    try {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.join(" ")),
      };
      const codeToRun = `(function(console){ ${code} })(customConsole);`;
      new Function("customConsole", codeToRun)(customConsole);
      setOutput(logs.join("\n"));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setOutput(` Error: ${err.message}`);
      } else {
        setOutput(" Unknown error occurred.");
      }
    }
  };

  const getRandomChallenge = () => {
    let newChallenge: Challenge;
    do {
      newChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    } while (newChallenge.title === currentChallenge?.title);
    setCurrentChallenge(newChallenge);
    setCode("");
    setOutput("");
  };

  if (!currentChallenge) {
    return (
      <div className="p-6 text-muted-foreground">Loading challenge...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Flashes - Code Challenge
        </h1>
        <button
          onClick={getRandomChallenge}
          className="flex items-center gap-2 bg-muted px-3 py-2 border border-border rounded-md text-sm text-muted-foreground hover:bg-muted/80"
        >
          <Shuffle size={16} /> Change Question
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-5 mb-6">
        <h2 className="text-lg font-medium mb-2">{currentChallenge.title}</h2>
        <p className="text-sm text-muted-foreground">
          {currentChallenge.description}
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-5 mb-6">
        <CodeMirror
          value={code}
          height="300px"
          extensions={[javascript({ jsx: true })]}
          theme="dark"
          onChange={(val) => setCode(val)}
        />
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={runCode}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow transition"
        >
          <Play size={16} />
          Run Code
        </button>
      </div>

      <div className="bg-muted border border-border rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
          Output:
        </h3>
        <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
          {output || "No output yet."}
        </pre>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8">
        Editor powered by{" "}
        <a
          href="https://github.com/uiwjs/react-codemirror"
          target="_blank"
          className="underline hover:text-blue-600"
        >
          @uiw/react-codemirror
        </a>{" "}
        and{" "}
        <a
          href="https://codemirror.net/"
          target="_blank"
          className="underline hover:text-blue-600"
        >
          CodeMirror 6
        </a>
        .
      </p>
    </div>
  );
}
