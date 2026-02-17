"use client";

import { Header } from "@/components/Header";
import { Highscore } from "@/components/Highscore";
import { Main } from "@/components/Main";
import { Results } from "@/components/Results";
import { SpeedDetails } from "@/components/SpeedDetails";
import { useEffect, useState } from "react";

const sampleText =
  'The archaeological expedition unearthed artifacts that complicated prevailing theories about Bronze Age trade networks. Obsidian from Anatolia, lapis lazuli from Afghanistan, and amber from the Baltic—all discovered in a single Mycenaean tomb—suggested commercial connections far more extensive than previously hypothesized. "We\'ve underestimated ancient peoples\' navigational capabilities and their appetite for luxury goods," the lead researcher observed. "Globalization isn\'t as modern as we assume."';

export default function Home() {
  const [gameState, setGameState] = useState("idle");
  const [timeRemaining, setTimeRemaining] = useState(60);

  const [typedChars, setTypedChars] = useState("");
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);

  const [difficulty, setDifficulty] = useState("Easy");
  const [mode, setMode] = useState("Timed (60s)");

  const [highScore, setHighScore] = useState(0);

  const elapsedTime = 60 - timeRemaining;
  const wpm =
    elapsedTime > 0 ? Math.round(correctChars / 5 / (elapsedTime / 60)) : 0;

  const accuracy =
    correctChars + incorrectChars > 0
      ? Math.round((correctChars / (correctChars + incorrectChars)) * 100)
      : 100;

  useEffect(() => {
    if (gameState !== "typing") return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameState("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

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
  };

  const isNewHighScore = gameState === "finished" && wpm > highScore;

  return (
    <div>
      <Header highscore={highScore} />
      <SpeedDetails
        wpm={wpm}
        accuracy={accuracy}
        timeLeft={timeRemaining}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        mode={mode}
        setMode={setMode}
      />

      {gameState !== "finished" ? (
        <Main
          sampleText={sampleText}
          typedChars={typedChars}
          gameState={gameState}
          onType={handleType}
          onStart={() => setGameState("typing")}
        />
      ) : isNewHighScore ? (
        <Highscore
          wpm={wpm}
          accuracy={accuracy}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
        />
      ) : (
        <Results
          wpm={wpm}
          accuracy={accuracy}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
        />
      )}
    </div>
  );
}
