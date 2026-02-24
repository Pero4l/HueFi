"use client";

// import { cn } from "@/lib/utils"
import { type GameColor, COLOR_CONFIG } from "@/hooks/use-color-game";

interface ColorCardProps {
  color: GameColor;
  selected: boolean;
  disabled: boolean;
  onSelect: (color: GameColor) => void;
}

export function ColorCard({
  color,
  selected,
  disabled,
  onSelect,
}: ColorCardProps) {
  const config = COLOR_CONFIG[color];

  return (
    <button
      onClick={() => onSelect(color)}
      disabled={disabled}
      aria-label={`Select ${config.label} - ${config.multiplier}x payout`}
      className={`relative flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-all duration-200
        border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${disabled && !selected ? "opacity-40 cursor-not-allowed" : ""}
        ${!disabled ? "cursor-pointer hover:scale-105 active:scale-95" : ""}
        ${
          selected
            ? "border-foreground shadow-lg scale-105"
            : "border-[#292c32] hover:border-muted-foreground"
      }`}
      style={{
        backgroundColor: selected
          ? `hsl(${config.hsl} / 0.2)`
          : `hsl(${config.hsl} / 0.08)`,
      }}
    >
      <div
        className={`h-14 w-14 rounded-full transition-all duration-200",
          ${selected && "animate-pulse-glow"}`}
        style={{ backgroundColor: config.hex }}
      />
      <span className="text-sm font-semibold text-foreground">
        {config.label}
      </span>
      <span
        className="font-mono text-xs font-bold"
        style={{ color: config.hex }}
      >
        {config.multiplier}x
      </span>
      {selected && (
        <div
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
          style={{
            backgroundColor: config.hex,
            color: color === "yellow" ? "hsl(228 12% 8%)" : "hsl(210 20% 95%)",
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 5L4.5 7.5L8 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
