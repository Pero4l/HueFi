"use client";

import { COLOR_CONFIG } from "@/hooks/use-color-game";

interface CountdownDisplayProps {
  countdown: number;
  maxTime: number;
}

export function CountdownDisplay({
  countdown,
  maxTime,
}: CountdownDisplayProps) {
  const progress = countdown / maxTime;
  const isUrgent = countdown <= 3;

  const colors = ["red", "blue", "green", "yellow"] as const;
  // Cycle through colors based on countdown
  const currentColorKey = colors[countdown % colors.length];
  const currentColor = COLOR_CONFIG[currentColorKey];

  const circumference = 2 * Math.PI * 56;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-40 w-40 items-center justify-center">
        {/* Glow Background */}
        <div 
          className="absolute inset-4 rounded-full blur-2xl opacity-20 transition-colors duration-500"
          style={{ backgroundColor: currentColor.hex }}
        />
        
        <svg
          className="absolute h-full w-full -rotate-90 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
          viewBox="0 0 128 128"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke={currentColor.hex}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
            style={{ 
              filter: `drop-shadow(0 0 6px ${currentColor.hex}80)` 
            }}
          />
        </svg>

        <div className="flex flex-col items-center justify-center z-10">
          <span
            className={`font-mono text-5xl font-black tabular-nums transition-all duration-300 ${
              isUrgent ? "animate-countdown-pulse scale-110" : ""
            }`}
            style={{ color: currentColor.hex }}
          >
            {countdown}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mt-1">
            Sec
          </span>
        </div>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-white/40 animate-pulse">
        {isUrgent ? "Get Ready!" : "Randomizing..."}
      </p>
    </div>
  );
}
