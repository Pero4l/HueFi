"use client";

// import { cn } from "@/lib/utils"

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

  const circumference = 2 * Math.PI * 56;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-36 w-36 items-center justify-center">
        <svg
          className="absolute h-full w-full -rotate-90"
          viewBox="0 0 128 128"
          aria-hidden="true"
        >
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="6"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke={
              isUrgent ? "hsl(var(--destructive))" : "hsl(var(--primary))"
            }
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span
          className={`font-mono text-5xl font-bold tabular-nums text-foreground ${
            isUrgent ? "animate-countdown-pulse text-destructive" : ""
          }`}
        >
          {countdown}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        {isUrgent ? "Almost there..." : "Drawing color..."}
      </p>
    </div>
  );
}
