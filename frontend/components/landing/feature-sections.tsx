"use client"

import { COLOR_CONFIG } from "@/hooks/use-color-game"

const STEPS = [
  {
    step: "01",
    title: "Connect Your Wallet",
    description:
      "Link your Phantom, Solflare, or any Solana wallet in one click. Your funds stay in your control at all times.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.5" />
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Pick a Color & Stake",
    description:
      "Choose from Red, Blue, Green, or Yellow. Each color has different odds and multipliers. Set your stake and lock it in.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="15.5" r="2.5" />
        <circle cx="8.5" cy="15.5" r="2.5" />
        <path d="M3 7.5 6 12l3.5-6" />
        <path d="m14 19 3-5.5 3 5.5" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Watch the Countdown",
    description:
      "A 10-second countdown begins. The tension builds as the timer drops. Hear the ticks intensify as it reaches zero.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Win Up to 5x",
    description:
      "The winning color is revealed with a dramatic animation. If you guessed right, your payout is instant -- up to 5x your stake.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
]

export function FeaturesSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            How it Works
          </p>
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Four steps to the stack
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
            ColorStack is designed to be simple, fast, and thrilling. No complex rules, no lengthy waits -- just pure color prediction.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:bg-card/80"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  {s.icon}
                </div>
                <span className="font-mono text-sm font-bold text-muted-foreground/40">
                  {s.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        {/* Live game preview strip */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <div className="h-2 w-2 animate-pulse rounded-full bg-game-green" style={{ backgroundColor: COLOR_CONFIG.green.hex }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Live Game Preview
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 overflow-x-auto px-6 py-6">
            {[
              { color: "red", result: "Win", payout: "+200", time: "2s ago" },
              { color: "yellow", result: "Loss", payout: "-50", time: "15s ago" },
              { color: "blue", result: "Win", payout: "+100", time: "28s ago" },
              { color: "green", result: "Win", payout: "+450", time: "41s ago" },
              { color: "red", result: "Loss", payout: "-75", time: "1m ago" },
              { color: "yellow", result: "Win", payout: "+1,250", time: "1m ago" },
            ].map((round, i) => (
              <div
                key={i}
                className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3"
              >
                <div
                  className="h-5 w-5 rounded-md"
                  style={{ backgroundColor: COLOR_CONFIG[round.color as keyof typeof COLOR_CONFIG].hex }}
                />
                <div className="flex flex-col">
                  <span
                    className={`font-mono text-sm font-bold ${
                      round.result === "Win" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {round.payout}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{round.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}