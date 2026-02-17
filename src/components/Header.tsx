import { Keyboard, Trophy } from "lucide-react";

export const Header = ({ highscore }: { highscore: number }) => {
  return (
    <header className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Keyboard className="w-6 h-6 text-white/60" />
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Typing Speed Test
            </h1>
            <p className="text-sm text-white/40">
              Type as fast as you can in 60 seconds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/50">
          <Trophy className="w-4 h-4 text-amber-400/70" />
          <span className="text-sm">
            Personal best:{" "}
            <span className="text-white/80 font-medium">0 WPM</span>
          </span>
        </div>
      </div>
    </header>
  );
};
