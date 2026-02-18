"use client";

import { Header } from "@/components/Header";
import { Highscore } from "@/components/Highscore";
import { Main } from "@/components/Main";
import { Results } from "@/components/Results";
import { SpeedDetails } from "@/components/SpeedDetails";
import { useEffect, useRef, useState } from "react";

import texts from "@/data/texts.json";
import { generateWordText } from "@/data/wordPool";
import { saveSession } from "@/lib/history";

function getRandomText(difficulty: string): string {
  const pool = texts[difficulty as keyof typeof texts] || texts["Easy"];
  return pool[Math.floor(Math.random() * pool.length)];
}

function getDuration(mode: string): number {
  const match = mode.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export default function Home() {
  const [gameState, setGameState] = useState("idle");
  const [timeRemaining, setTimeRemaining] = useState(
    getDuration("Timed (60s)"),
  );

  const [wordList, setWordList] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [typedChars, setTypedChars] = useState("");
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [keyErrors, setKeyErrors] = useState<Record<string, number>>({});
  const wpmSamplesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const [consistency, setConsistency] = useState(100);

  const [difficulty, setDifficulty] = useState("Easy");
  const [mode, setMode] = useState("Timed (60s)");

  const [sampleText, setSampleText] = useState(
    () => texts[difficulty as keyof typeof texts][0],
  );

  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("typingTestHighScore");
    if (saved) setHighScore(Number(saved));
  }, []);

  // High-precision elapsed time for final WPM calculations
  const getElapsedSeconds = () => {
    if (!startTimeRef.current) return 0;
    return (performance.now() - startTimeRef.current) / 1000;
  };

  // Live WPM uses state-based elapsed time (updates every timer tick)
  const elapsedTime =
    mode.startsWith("Timed") || mode === "Words"
      ? (getDuration(mode) || 60) - timeRemaining
      : timeRemaining;
  const wpm =
    elapsedTime > 0 ? Math.round(correctChars / 5 / (elapsedTime / 60)) : 0;

  const accuracy =
    correctChars + incorrectChars > 0
      ? Math.round((correctChars / (correctChars + incorrectChars)) * 100)
      : 100;

  useEffect(() => {
    if (gameState !== "typing") return;

    const timer = setInterval(() => {
      if (mode.startsWith("Timed") || mode === "Words") {
        setTimeRemaining((prev) => Math.max(prev - 1, 0));
      } else {
        setTimeRemaining((prev) => prev + 1);
      }
      // Sample WPM for consistency calculation
      const elapsed = getElapsedSeconds();
      if (elapsed > 0) {
        const currentWpm = Math.round(correctChars / 5 / (elapsed / 60));
        if (currentWpm > 0) {
          wpmSamplesRef.current.push(currentWpm);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
    // correctChars is read via closure but we intentionally don't restart the timer for it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, mode]);

  useEffect(() => {
    if (
      (mode.startsWith("Timed") || mode === "Words") &&
      gameState === "typing" &&
      timeRemaining === 0
    ) {
      setGameState("finished");
      // Calculate consistency score from WPM samples
      const samples = wpmSamplesRef.current;
      if (samples.length >= 2) {
        const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
        const variance =
          samples.reduce((sum, s) => sum + (s - mean) ** 2, 0) / samples.length;
        const stdDev = Math.sqrt(variance);
        const cv = mean > 0 ? stdDev / mean : 0;
        setConsistency(Math.round(Math.max(0, Math.min(100, (1 - cv) * 100))));
      } else {
        setConsistency(100);
      }
      // Use precise elapsed for final WPM
      const elapsed = getElapsedSeconds();
      const finalWpm =
        elapsed > 0 ? Math.round(correctChars / 5 / (elapsed / 60)) : 0;
      if (finalWpm > highScore) {
        setHighScore(finalWpm);
        setIsNewHighScore(true);
        localStorage.setItem("typingTestHighScore", String(finalWpm));
      }
      saveSession({
        wpm: finalWpm,
        accuracy,
        correctChars,
        incorrectChars,
        mode,
        difficulty,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, gameState]);

  const handleType = (key: string) => {
    if (gameState === "finished") return;

    // Ignore modifier keys (Shift, Control, Alt, etc.) — only allow single chars and Backspace
    if (key.length > 1 && key !== "Backspace") return;

    // Handle Backspace
    if (key === "Backspace") {
      if (typedChars.length === 0) return;
      const lastIndex = typedChars.length - 1;
      const deletedChar = typedChars[lastIndex];
      const expectedChar = sampleText[lastIndex];

      // Roll back the correct/incorrect count
      if (deletedChar === expectedChar) {
        setCorrectChars((prev) => Math.max(0, prev - 1));
      } else {
        setIncorrectChars((prev) => Math.max(0, prev - 1));
      }
      setTypedChars((prev) => prev.slice(0, -1));
      return;
    }

    if (gameState === "idle") {
      setGameState("typing");
      startTimeRef.current = performance.now();
    }

    const currentIndex = typedChars.length;
    if (currentIndex >= sampleText.length) return;

    if (key === sampleText[currentIndex]) {
      setCorrectChars((prev) => prev + 1);
    } else {
      setIncorrectChars((prev) => prev + 1);
      // Track which key was expected (for heatmap)
      const expectedKey = sampleText[currentIndex].toLowerCase();
      setKeyErrors((prev) => ({
        ...prev,
        [expectedKey]: (prev[expectedKey] || 0) + 1,
      }));
      if (mode === "Sudden Death") {
        setTypedChars((prev) => prev + key);
        setGameState("finished");
        return;
      }
    }

    setTypedChars((prev) => prev + key);

    if (mode === "Words" && typedChars.length + 1 >= sampleText.length) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setTypedChars("");
      setSampleText(wordList[nextIndex] || "");
      if (nextIndex >= wordList.length - 5) {
        setWordList((prev) => [
          ...prev,
          ...generateWordText(difficulty, 20).split(" "),
        ]);
      }
      return;
    }

    if (typedChars.length + 1 >= sampleText.length) {
      setGameState("finished");
      const isCorrect = key === sampleText[typedChars.length];
      const finalCorrect = isCorrect ? correctChars + 1 : correctChars;
      const finalIncorrect = isCorrect ? incorrectChars : incorrectChars + 1;
      // Use precise elapsed for final WPM
      const elapsed = getElapsedSeconds();
      const finalWpm =
        elapsed > 0 ? Math.round(finalCorrect / 5 / (elapsed / 60)) : 0;
      if (finalWpm > highScore) {
        setHighScore(finalWpm);
        setIsNewHighScore(true);
        localStorage.setItem("typingTestHighScore", String(finalWpm));
      }
      const finalAccuracy =
        finalCorrect + finalIncorrect > 0
          ? Math.round((finalCorrect / (finalCorrect + finalIncorrect)) * 100)
          : 100;
      saveSession({
        wpm: finalWpm,
        accuracy: finalAccuracy,
        correctChars: finalCorrect,
        incorrectChars: finalIncorrect,
        mode,
        difficulty,
      });
    }
  };

  const handleRestart = () => {
    setGameState("idle");
    setTimeRemaining(
      mode.startsWith("Timed") || mode === "Words"
        ? getDuration(mode) || 60
        : 0,
    );
    setTypedChars("");
    setCorrectChars(0);
    setIncorrectChars(0);
    setIsNewHighScore(false);
    setKeyErrors({});
    wpmSamplesRef.current = [];
    startTimeRef.current = null;
    setConsistency(100);
    if (mode === "Words") {
      const words = generateWordText(difficulty, 50).split(" ");
      setWordList(words);
      setCurrentWordIndex(0);
      setSampleText(words[0]);
    } else {
      setSampleText(getRandomText(difficulty));
    }
  };

  return (
    <div className="h-screen overflow-auto sm:overflow-auto">
      <Header
        highscore={highScore}
        onResetHighScore={() => {
          setHighScore(0);
          localStorage.removeItem("typingTestHighScore");
        }}
      />

      {gameState !== "finished" ? (
        <SpeedDetails
          wpm={wpm}
          accuracy={accuracy}
          timeLeft={timeRemaining}
          difficulty={difficulty}
          setDifficulty={(value) => {
            setDifficulty(value);
            if (gameState === "idle") {
              if (mode === "Words") {
                const words = generateWordText(value, 50).split(" ");
                setWordList(words);
                setCurrentWordIndex(0);
                setSampleText(words[0]);
              } else {
                setSampleText(getRandomText(value));
              }
            }
          }}
          mode={mode}
          setMode={(value) => {
            setMode(value);
            if (gameState === "idle") {
              setTimeRemaining(
                value.startsWith("Timed") || value === "Words"
                  ? getDuration(value) || 60
                  : 0,
              );
              if (value === "Words") {
                const words = generateWordText(difficulty, 50).split(" ");
                setWordList(words);
                setCurrentWordIndex(0);
                setSampleText(words[0]);
              } else {
                setSampleText(getRandomText(difficulty));
              }
            }
          }}
        />
      ) : (
        <></>
      )}

      {gameState !== "finished" ? (
        <Main
          sampleText={sampleText}
          typedChars={typedChars}
          gameState={gameState}
          onType={handleType}
          onStart={() => setGameState("typing")}
          onRestart={handleRestart}
          upcomingWords={
            mode === "Words" ? wordList.slice(currentWordIndex + 1) : undefined
          }
        />
      ) : isNewHighScore ? (
        <Highscore
          wpm={wpm}
          accuracy={accuracy}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          onRestart={handleRestart}
        />
      ) : (
        <Results
          wpm={wpm}
          accuracy={accuracy}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          keyErrors={keyErrors}
          consistency={consistency}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
