import { useState } from "react";
import { type GameRound, COLOR_CONFIG } from "@/hooks/use-color-game";

interface GameHistoryProps {
  history: GameRound[];
}

export function GameHistory({ history }: GameHistoryProps) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 5;

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center ring-1 ring-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">
        <div className="flex gap-1">
          {(["red", "blue", "green", "yellow"] as const).map((c) => (
            <div
              key={c}
              className="h-3 w-3 rounded-full opacity-30 animate-pulse"
              style={{ backgroundColor: COLOR_CONFIG[c].hex }}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-white/60">No games played yet</p>
        <p className="text-xs text-white/40">
          Place your first bet to get started
        </p>
      </div>
    );
  }

  const displayedHistory = showAll ? history : history.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {displayedHistory.map((round, index) => {
          const winConfig = COLOR_CONFIG[round.winningColor];
          const pickConfig = round.selectedColor
            ? COLOR_CONFIG[round.selectedColor]
            : null;

          return (
            <div
              key={round.id}
              className={`flex items-center justify-between rounded-xl px-3 py-3 transition-all duration-300
                ${index === 0 ? "animate-slide-up" : ""}
                ${
                  round.won
                    ? "border border-white/5 shadow-[0_0_20px_-5px_hsla(var(--game-green),0.4)]"
                    : "border border-white/5 bg-white/5 hover:bg-white/10"
                }`}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  #{history.length - index}
                </span>
                <div className="flex items-center gap-2">
                  {pickConfig && (
                    <div
                      className="h-5 w-5 rounded-full border border-white/10 shadow-inner"
                      style={{ backgroundColor: pickConfig.hex }}
                      aria-label={`Picked ${pickConfig.label}`}
                    />
                  )}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-white/20"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 2L8 6L4 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div
                    className="h-5 w-5 rounded-full border border-white/10 shadow-inner ring-2 ring-white/5"
                    style={{ backgroundColor: winConfig.hex }}
                    aria-label={`Winning color was ${winConfig.label}`}
                  />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-[11px] text-white/40 mb-0.5">
                  {round.stake.toFixed(0)} STRK
                </span>
                <span
                  className={`font-mono text-xs font-bold tracking-tight ${
                    round.won
                      ? "text-[hsl(142,72%,45%)]"
                      : "text-[hsl(0,85%,55%)]"
                  }`}
                >
                  {round.won
                    ? `+${round.payout.toFixed(0)} STRK`
                    : `-${round.stake.toFixed(0)} STRK`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {history.length > INITIAL_DISPLAY_COUNT && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-[0.98]"
        >
          <span className="text-xs font-semibold text-white/50 group-hover:text-white transition-colors uppercase tracking-widest">
            {showAll ? "Show Less" : `See More (${history.length - INITIAL_DISPLAY_COUNT} more)`}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`text-white/30 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}