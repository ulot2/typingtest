"use client";

import { useRef, useCallback } from "react";
import html2canvas from "html2canvas";

interface ShareCardProps {
  wpm: number;
  accuracy: number;
  consistency: number;
  mode: string;
  difficulty: string;
}

export function ShareCard({
  wpm,
  accuracy,
  consistency,
  mode,
  difficulty,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Try clipboard first
        if (navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            alert("Result card copied to clipboard!");
            return;
          } catch {
            // Fallback to download
          }
        }

        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `typing-test-${wpm}wpm.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (err) {
      console.error("Failed to capture share card:", err);
    }
  }, [wpm]);

  return (
    <>
      {/* Hidden card for capture */}
      <div className="fixed -left-[9999px] top-0">
        <div
          ref={cardRef}
          style={{
            width: 480,
            height: 280,
            padding: 32,
            fontFamily: "system-ui, -apple-system, sans-serif",
            background:
              "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 70%, #1e1b4b 100%)",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(139, 92, 246, 0.15)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(99, 102, 241, 0.1)",
            }}
          />

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14,
                  opacity: 0.6,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Typing Speed Test
              </div>
              <div style={{ fontSize: 12, opacity: 0.4, marginTop: 4 }}>
                {mode} · {difficulty}
              </div>
            </div>
            <div style={{ fontSize: 11, opacity: 0.4 }}>⌨️</div>
          </div>

          {/* Main stat */}
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-2px",
              }}
            >
              {wpm}
            </div>
            <div
              style={{
                fontSize: 14,
                opacity: 0.6,
                marginTop: 4,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Words Per Minute
            </div>
          </div>

          {/* Bottom stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 40,
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{accuracy}%</div>
              <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>
                Accuracy
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {consistency}%
              </div>
              <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>
                Consistency
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="mt-4 flex items-center gap-2 px-5 py-2 text-sm font-medium text-(--text-dim) border border-(--border) rounded-lg hover:bg-(--surface) hover:text-(--text) transition-colors cursor-pointer"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Share Result
      </button>
    </>
  );
}
