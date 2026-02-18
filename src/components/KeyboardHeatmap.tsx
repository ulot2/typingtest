"use client";

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

interface KeyboardHeatmapProps {
  keyErrors: Record<string, number>;
}

function getHeatColor(count: number, max: number): string {
  if (count === 0 || max === 0) return "var(--surface)";
  const intensity = count / max;
  // Gradient from dim to bright red
  if (intensity < 0.33) return "rgba(251, 113, 133, 0.25)";
  if (intensity < 0.66) return "rgba(244, 63, 94, 0.5)";
  return "rgba(225, 29, 72, 0.8)";
}

export const KeyboardHeatmap = ({ keyErrors }: KeyboardHeatmapProps) => {
  const totalErrors = Object.values(keyErrors).reduce((a, b) => a + b, 0);
  if (totalErrors === 0) return null;

  const max = Math.max(...Object.values(keyErrors), 1);

  return (
    <div className="mt-8 w-full max-w-lg">
      <p className="text-(--text-dim) text-xs sm:text-sm mb-3 text-center font-medium tracking-wide uppercase">
        Error Heatmap
      </p>
      <div className="flex flex-col items-center gap-1.5">
        {ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-1.5"
            style={{
              paddingLeft:
                rowIndex === 1 ? "1rem" : rowIndex === 2 ? "2.25rem" : 0,
            }}
          >
            {row.map((key) => {
              const count = keyErrors[key] || 0;
              return (
                <div
                  key={key}
                  className="relative flex items-center justify-center rounded-lg border transition-colors"
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    backgroundColor: getHeatColor(count, max),
                    borderColor:
                      count > 0 ? "rgba(244, 63, 94, 0.3)" : "var(--border)",
                  }}
                >
                  <span
                    className="text-xs font-medium select-none"
                    style={{
                      color: count > 0 ? "#fff" : "var(--text-dim)",
                    }}
                  >
                    {key.toUpperCase()}
                  </span>
                  {count > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                      style={{
                        backgroundColor: "rgba(225, 29, 72, 0.9)",
                        color: "#fff",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* Space bar */}
      <div className="flex justify-center mt-1.5">
        <div
          className="rounded-lg border flex items-center justify-center"
          style={{
            width: "12rem",
            height: "2.25rem",
            backgroundColor: getHeatColor(keyErrors[" "] || 0, max),
            borderColor:
              (keyErrors[" "] || 0) > 0
                ? "rgba(244, 63, 94, 0.3)"
                : "var(--border)",
          }}
        >
          <span
            className="text-[10px] font-medium select-none"
            style={{
              color: (keyErrors[" "] || 0) > 0 ? "#fff" : "var(--text-dim)",
            }}
          >
            SPACE{(keyErrors[" "] || 0) > 0 ? ` (${keyErrors[" "]})` : ""}
          </span>
        </div>
      </div>
    </div>
  );
};
