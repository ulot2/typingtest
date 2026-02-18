"use client";

import { useMemo } from "react";
import { SessionRecord } from "@/lib/history";

interface WpmChartProps {
  sessions: SessionRecord[];
}

export const WpmChart = ({ sessions }: WpmChartProps) => {
  const data = useMemo(() => sessions.slice(-20), [sessions]);

  if (data.length < 2) return null;

  const wpmValues = data.map((s) => s.wpm);
  const maxWpm = Math.max(...wpmValues);
  const minWpm = Math.min(...wpmValues);
  const range = maxWpm - minWpm || 1;

  const chartW = 100;
  const chartH = 40;
  const padY = 4;

  const points = data.map((s, i) => {
    const x = (i / (data.length - 1)) * chartW;
    const y = chartH - padY - ((s.wpm - minWpm) / range) * (chartH - padY * 2);
    return { x, y, wpm: s.wpm, accuracy: s.accuracy, date: s.date };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartH} L ${points[0].x} ${chartH} Z`;

  const avgWpm = Math.round(
    wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length,
  );

  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-(--text)">WPM History</h3>
        <span className="text-xs text-(--text-dim)">
          Avg: <span className="text-(--text) font-medium">{avgWpm} WPM</span>
          {" · "}Last {data.length} tests
        </span>
      </div>

      <div className="bg-(--surface) border border-(--border) rounded-xl p-4">
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          className="w-full h-24"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = padY + frac * (chartH - padY * 2);
            return (
              <line
                key={frac}
                x1={0}
                y1={y}
                x2={chartW}
                y2={y}
                stroke="var(--border)"
                strokeWidth="0.3"
              />
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="var(--accent)" opacity="0.1" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Dots */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.2" fill="var(--accent)" />
          ))}
        </svg>

        {/* Y-axis labels */}
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-(--text-dim)">{minWpm} WPM</span>
          <span className="text-[10px] text-(--text-dim)">{maxWpm} WPM</span>
        </div>
      </div>
    </div>
  );
};
