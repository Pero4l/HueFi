"use client"

// import { cn } from "@/lib/utils"
import { type GameColor, COLOR_CONFIG, type GamePhase } from "@/hooks/use-color-game"

interface RevealDisplayProps {
  winningColor: GameColor | null
  selectedColor: GameColor | null
  phase: GamePhase
  lastPayout: number
  stake: number
}

export function RevealDisplay({
  winningColor,
  selectedColor,
  phase,
  lastPayout,
  stake,
}: RevealDisplayProps) {
  if (!winningColor) return null

  const config = COLOR_CONFIG[winningColor]
  const won = winningColor === selectedColor
  const isRevealing = phase === "revealing"

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Color Orb */}
      <div className="relative flex items-center justify-center">
        <div
          className={`h-28 w-28 rounded-full transition-all duration-500 ${isRevealing ? "animate-reveal-spin" : ""}`}
          style={{
            backgroundColor: config.hex,
            boxShadow: `0 0 40px ${config.hex}60, 0 0 80px ${config.hex}30`,
          }}
        />
        {!isRevealing && phase === "result" && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 60px ${config.hex}40, 0 0 120px ${config.hex}20`,
            }}
          />
        )}
      </div>

      {/* Result text */}
      {phase === "result" && (
        <div className="flex flex-col items-center gap-2 animate-slide-up">
          <p className="text-md font-semibold text-white">
            Winning color: <span style={{ color: config.hex }}>{config.label}</span>
          </p>
          {won ? (
            <div className="flex flex-col items-center gap-1">
              <p className="text-xl font-black uppercase tracking-tighter" style={{ color: "#20c45d" }}>
                You won!
              </p>
              <p className="font-mono text-xl font-bold" style={{ color: "#20c45d" }}>
                +${lastPayout.toFixed(2)}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <p className="text-xl font-bold" style={{ color: "#d82829" }}>
                Better luck next time
              </p>
              <p className="font-mono text-xl font-bold" style={{ color: "#d82829" }}>
                -${stake.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}

      {isRevealing && (
        <p className="text-sm text-muted-foreground animate-pulse-glow">
          Revealing...
        </p>
      )}
    </div>
  )
}