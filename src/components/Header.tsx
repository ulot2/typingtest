import { Keyboard, Trophy, X } from "lucide-react";

interface HeaderProps {
  highscore: number;
  onResetHighScore: () => void;
}

export const Header = ({ highscore, onResetHighScore }: HeaderProps) => {
  return (
    <header className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Keyboard className="w-6 h-6 text-white/60" />
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight sm:block hidden">
              Typing Speed Test
            </h1>
            <p className="text-sm text-white/40 sm:block hidden">
              Type as fast as you can in 60 seconds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/50">
          <Trophy className="w-4 h-4 text-amber-400/70" />
          <span className="text-sm">
            Personal best:{" "}
            <span className="text-white/80 font-medium">{highscore} WPM</span>
          </span>
          {highscore > 0 && (
            <button
              onClick={onResetHighScore}
              className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              title="Reset high score"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
