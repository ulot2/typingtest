"use client";

import { Header } from "@/components/Header";
import { Highscore } from "@/components/Highscore";
import { Main } from "@/components/Main";
import { Results } from "@/components/Results";
import { SpeedDetails } from "@/components/SpeedDetails";
import { useEffect, useState } from "react";

import texts from "@/data/texts.json";

function getRandomText(difficulty: string): string {
  const pool = texts[difficulty as keyof typeof texts] || texts["Easy"];
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Home() {
  const [gameState, setGameState] = useState("idle");
  const [timeRemaining, setTimeRemaining] = useState(60);

  const [typedChars, setTypedChars] = useState("");
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const [difficulty, setDifficulty] = useState("Easy");
  const [mode, setMode] = useState("Timed (60s)");

  const [sampleText, setSampleText] = useState(
    () => texts[difficulty as keyof typeof texts][0],
  );

  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("typingTestHighScore");
    // eslint-disable-next-line
    if (saved) setHighScore(Number(saved));
  }, []);

  const elapsedTime =
    mode === "Timed (60s)" ? 60 - timeRemaining : timeRemaining;
  const wpm =
    elapsedTime > 0 ? Math.round(correctChars / 5 / (elapsedTime / 60)) : 0;

  const accuracy =
    correctChars + incorrectChars > 0
      ? Math.round((correctChars / (correctChars + incorrectChars)) * 100)
      : 100;

  useEffect(() => {
    if (gameState !== "typing") return;

    const timer = setInterval(() => {
      if (mode === "Timed (60s)") {
        setTimeRemaining((prev) => Math.max(prev - 1, 0));
      } else {
        setTimeRemaining((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, mode]);

  if (mode === "Timed (60s)" && gameState === "typing" && timeRemaining === 0) {
    setGameState("finished");
    if (wpm > highScore) {
      setHighScore(wpm);
      setIsNewHighScore(true);
      localStorage.setItem("typingTestHighScore", String(wpm));
    }
  }

  const handleType = (key: string) => {
    if (gameState === "finished") return;

    if (gameState === "idle") {
      setGameState("typing");
    }

    const currentIndex = typedChars.length;
    if (currentIndex >= sampleText.length) return;

    if (key === sampleText[currentIndex]) {
      setCorrectChars((prev) => prev + 1);
    } else {
      setIncorrectChars((prev) => prev + 1);
    }

    setTypedChars((prev) => prev + key);

    if (typedChars.length + 1 >= sampleText.length) {
      setGameState("finished");
      const finalCorrect =
        key === sampleText[typedChars.length] ? correctChars + 1 : correctChars;
      const currentElapsed =
        mode === "Timed (60s)" ? 60 - timeRemaining : timeRemaining;
      const finalWpm =
        currentElapsed > 0
          ? Math.round(finalCorrect / 5 / (currentElapsed / 60))
          : 0;
      if (finalWpm > highScore) {
        setHighScore(finalWpm);
        setIsNewHighScore(true);
        localStorage.setItem("typingTestHighScore", String(finalWpm));
      }
    }
  };

  const handleRestart = () => {
    setGameState("idle");
    setTimeRemaining(mode === "Timed (60s)" ? 60 : 0);
    setTypedChars("");
    setCorrectChars(0);
    setIncorrectChars(0);
    setIsNewHighScore(false);
    setSampleText(getRandomText(difficulty));
  };

  return (
    <div className="h-screen overflow-auto sm:overflow-hidden">
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
              setSampleText(getRandomText(value));
            }
          }}
          mode={mode}
          setMode={(value) => {
            setMode(value);
            if (gameState === "idle") {
              setTimeRemaining(value === "Timed (60s)" ? 60 : 0);
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
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
