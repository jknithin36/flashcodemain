"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Play, Shuffle } from "lucide-react";
import { challenges, Challenge } from "@/constants/challenges";

export default function DailyChallengePage() {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      const result = logs.join("\n").trim();
      setOutput(result);

      if (result === currentChallenge?.expectedOutput.trim()) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
      setShowModal(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setOutput(`Error: ${err.message}`);
      } else {
        setOutput("Unknown error occurred.");
      }
      setIsSuccess(false);
      setShowModal(true);
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

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 border border-green-400";
      case "medium":
        return "bg-orange-100 text-orange-700 border border-orange-400";
      case "hard":
        return "bg-red-100 text-red-700 border border-red-400";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
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
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium mb-2">
              {currentChallenge.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-1">
              {currentChallenge.description}
            </p>
            <p className="text-xs text-muted-foreground italic">
              Expected output: <code>{currentChallenge.expectedOutput}</code>
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-md self-start ${getTagColor(
              currentChallenge.tag
            )}`}
          >
            {currentChallenge.tag.toUpperCase()}
          </span>
        </div>
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl max-w-md w-full text-center border border-blue-300 animate-fadeInUp">
            <div className="text-5xl mb-4">{isSuccess ? "🦅" : "✨"}</div>

            <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-400">
              {isSuccess ? "Flash-tastic! 💙💛" : "Almost there, Flash! 💪"}
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isSuccess
                ? "You crushed it! Keep soaring, Golden Flash! 🚀"
                : "You're just one step away. Keep going and you'll shine! 💛"}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
