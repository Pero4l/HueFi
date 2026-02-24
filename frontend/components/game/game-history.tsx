// "use client";

// import { type GameRound, COLOR_CONFIG } from "@/hooks/use-color-game";

// interface GameHistoryProps {
//   history: GameRound[];
// }

// export function GameHistory({ history }: GameHistoryProps) {

//   if (history.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
//         <div className="flex gap-1">
//           {(["red", "blue", "green", "yellow"] as const).map((c) => (
//             <div
//               key={c}
//               className="h-3 w-3 rounded-full opacity-30"
//               style={{ backgroundColor: COLOR_CONFIG[c].hex }}
//             />
//           ))}
//         </div>
//         <p className="text-sm text-muted-foreground">No games played yet</p>
//         <p className="text-xs text-muted-foreground">
//           Place your first bet to get started
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-2">
//       {history.map((round, index) => {
//         const winConfig = COLOR_CONFIG[round.winningColor];
//         const pickConfig = round.selectedColor
//           ? COLOR_CONFIG[round.selectedColor]
//           : null;

//         return (
// <div
//   key={round.id}
//   className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-all
//     ${index === 0 ? "animate-slide-up" : ""}
//     ${
//       round.won
//         ? "border-[hsl(var(--game-green))]/20 bg-[hsl(var(--game-green))]/5"
//         : "border-border bg-card"
//     }`}
// >
//   <div className="flex items-center gap-3">
//     <span className="font-mono text-xs text-muted-foreground">
//       #{round.id}
//     </span>
//     <div className="flex items-center gap-1.5">
//       {pickConfig && (
//         <div
//           className="h-4 w-4 rounded-full"
//           style={{ backgroundColor: pickConfig.hex }}
//           aria-label={`Picked ${pickConfig.label}`}
//         />
//       )}
//       <svg
//         width="12"
//         height="12"
//         viewBox="0 0 12 12"
//         fill="none"
//         className="text-muted-foreground"
//         aria-hidden="true"
//       >
//         <path
//           d="M4 2L8 6L4 10"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//       <div
//         className="h-4 w-4 rounded-full"
//         style={{ backgroundColor: winConfig.hex }}
//         aria-label={`Winning color was ${winConfig.label}`}
//       />
//     </div>
//   </div>
//   <div className="flex items-center gap-3">
//     <span className="font-mono text-xs text-muted-foreground">
//       ${round.stake.toFixed(0)}
//     </span>
//     <span
//       className={`font-mono text-xs font-bold ${
//         round.won
//           ? "text-[hsl(142,72%,45%)]"
//           : "text-[hsl(0,85%,55%)]"
//       }`}
//     >
//       {round.won
//         ? `+$${round.payout.toFixed(0)}`
//         : `-$${round.stake.toFixed(0)}`}
//     </span>
//   </div>
// </div>
//         );
//       })}
//     </div>
//   );
// }
"use client";

import { type GameRound, COLOR_CONFIG } from "@/hooks/use-color-game";

interface GameHistoryProps {
  history: GameRound[];
}

export function GameHistory({ history }: GameHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <div className="flex gap-1">
          {(["red", "blue", "green", "yellow"] as const).map((c) => (
            <div
              key={c}
              className="h-3 w-3 rounded-full opacity-30"
              style={{ backgroundColor: COLOR_CONFIG[c].hex }}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">No games played yet</p>
        <p className="text-xs text-muted-foreground">
          Place your first bet to get started
        </p>
      </div>
    );
  }

  const lastRound = history[history.length - 1];

  return (
    <div className="flex flex-col gap-2">
      {[lastRound].map((round, index) => {
        const winConfig = COLOR_CONFIG[round.winningColor];
        const pickConfig = round.selectedColor
          ? COLOR_CONFIG[round.selectedColor]
          : null;

        return (
          <div
            key={round.id}
            className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-all
              ${index === 0 ? "animate-slide-up" : ""}
              ${
                round.won
                  ? "border-[hsl(var(--game-green))]/20 bg-[hsl(var(--game-green))]/5"
                  : "border-border bg-card"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">
                #{round.id}
              </span>
              <div className="flex items-center gap-1.5">
                {pickConfig && (
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: pickConfig.hex }}
                    aria-label={`Picked ${pickConfig.label}`}
                  />
                )}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="text-muted-foreground"
                  aria-hidden="true"
                >
                  <path
                    d="M4 2L8 6L4 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: winConfig.hex }}
                  aria-label={`Winning color was ${winConfig.label}`}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">
                ${round.stake.toFixed(0)}
              </span>
              <span
                className={`font-mono text-xs font-bold ${
                  round.won
                    ? "text-[hsl(142,72%,45%)]"
                    : "text-[hsl(0,85%,55%)]"
                }`}
              >
                {round.won
                  ? `+$${round.payout.toFixed(0)}`
                  : `-$${round.stake.toFixed(0)}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}