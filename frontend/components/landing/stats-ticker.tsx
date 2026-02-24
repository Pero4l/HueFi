"use client"

import { useEffect, useState } from "react"

const STATS = [
  { label: "Total Rounds Played", value: 128_453, suffix: "+" },
  { label: "Total SOL Won", value: 42_891, suffix: " SOL", prefix: "" },
  { label: "Active Players", value: 3_247, suffix: "+" },
  { label: "Biggest Win", value: 500, suffix: "x", prefix: "" },
]

function AnimatedNumber({ target, suffix, prefix }: { target: number; suffix: string; prefix?: string }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setValue(target)
        clearInterval(timer)
      } else {
        setValue(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])

  return (
    <span className="font-mono text-2xl font-bold text-foreground sm:text-3xl">
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatsTicker() {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 sm:py-12 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 text-center">
            <AnimatedNumber
              target={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
            />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}