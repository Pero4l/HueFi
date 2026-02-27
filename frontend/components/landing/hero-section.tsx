"use client";

import { COLOR_CONFIG } from "@/hooks/use-color-game";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { ChartColumn, CirclePercent, Globe, LockKeyhole, Shield, Zap } from "lucide-react";

const FEATURES = [
  {
    color: "red" as const,
    label: "2x",
    description: "Red",
  },
  {
    color: "blue" as const,
    label: "2x",
    description: "Blue",
  },
  {
    color: "green" as const,
    label: "2x",
    description: "Green",
  },
  {
    color: "yellow" as const,
    label: "2x",
    description: "Yellow",
  },
];

const WHY_FEATURES = [
  {
    title: "Provably Fair",
    description:
      "Every result is generated using verifiable randomness on-chain.",
    color: "blue" as const,
    icon: Shield,
  },
  {
    title: "Instant Payouts",
    description:
      "Win? Rewards are sent directly to your wallet within seconds.",
    color: "green" as const,
    icon: Zap,
  },
  {
    title: "Fully Decentralized",
    description: "Built on smart contracts with no central authority.",
    color: "red" as const,
    icon: Globe,
  },
  {
    title: "Low Stakes",
    description: "Start small. Play more. Manage your risk.",
    color: "yellow" as const,
    icon: CirclePercent,
  },
  {
    title: "Secure & Audited",
    description: "Contracts designed with safety and transparency in mind.",
    color: "blue" as const,
    icon: LockKeyhole,
  },
  {
    title: "Transparent Stats",
    description: "View game history, odds, and payouts on-chain.",
    color: "green" as const,
    icon: ChartColumn,
  },
];

interface HeroSectionProps {
  onDemoMode?: () => void;
}

export function HeroSection({ onDemoMode }: HeroSectionProps) {
  return (
    <>
      <Navbar />
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#05060a] px-4 lg:py-10 text-white">
        {/* Background orbs */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute -left-10 -top-22 h-80 w-80 rounded-full bg-red-600/40 blur-3xl"
            style={{ backgroundColor: COLOR_CONFIG.red.hex }}
          />
          <div
            className="absolute -right-40 bottom-190 h-80 w-80 rounded-full bg-yellow-400/40 blur-3xl"
            style={{ backgroundColor: COLOR_CONFIG.yellow.hex }}
          />
          <div
            className="absolute -left-10 -bottom-62 h-80 w-80 rounded-full bg-green-500/30 blur-3xl"
            style={{ backgroundColor: COLOR_CONFIG.green.hex }}
          />
          <div
            className="absolute -right-20 top-85 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl"
            style={{ backgroundColor: COLOR_CONFIG.blue.hex }}
          />
        </div>

        {/* Centered card content */}
        <main id="play" className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center mt-54">
          {/* Heading */}
          <section className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/60">
              Predict the color.
            </p>
            <h1 className="text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
              Predict the color.{" "}
              <span className="text-[#facc15]">Win the stack.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/60 sm:text-base">
              A fast-paced color prediction game on Starknet. Pick your color,
              place your bet, and watch the countdown. Will fortune favor your
              choice?
            </p>
          </section>

          {/* Multiplier cards */}
          <section className="mt-8 w-full max-w-xl justify-center gap-3 grid md:grid-cols-4 grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.color}
                className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#111319] px-3 py-3 text-center shadow-sm"
              >
                <div
                  className="h-8 w-8 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.6)]"
                  style={{ backgroundColor: COLOR_CONFIG[f.color].hex }}
                />
                <span className="text-sm font-semibold">{f.label}</span>
                <span className="text-[11px] text-white/55">
                  {f.description}
                </span>
              </div>
            ))}
          </section>

          {/* Select wallet + demo */}
          <section className="mt-12 flex flex-col items-center gap-3">
            {onDemoMode && (
              <button
                onClick={onDemoMode}
                className="rounded-lg border-white/10 bg-[#111319] px-4 py-4 bg-card text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Try Demo Mode (no wallet required)
              </button>
            )}
          </section>

          {/* How it works card */}
          <section id="how-it-works" className="relative z-10 w-full max-w-6xl px-4 mt-26">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              {/* Title */}
              <div className="mb-16 flex flex-col items-center gap-2">
                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  How it Works
                </h2>
                <div className="h-px w-20 bg-linear-to-r from-transparent via-white/30 to-transparent" />
              </div>

              {/* Steps */}
              <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-4">
                {/* Step 1 */}
                <div className="group flex flex-col items-center gap-4 rounded-2xl bg-[#111319]/50 p-6 text-center transition-all hover:bg-[#111319] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 via-blue-400 to-indigo-500 shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:scale-105">
                    <span className="text-sm font-bold text-black">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Connect Wallet
                  </h3>
                  <p className="text-sm text-white/60">
                    Connect your wallet to get started.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="group flex flex-col items-center gap-4 rounded-2xl bg-[#111319]/50 p-6 text-center transition-all hover:bg-[#111319] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 via-green-400 to-teal-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] group-hover:scale-105">
                    <span className="text-sm font-bold text-black">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Pick Color
                  </h3>
                  <p className="text-sm text-white/60">
                    Choose your color and set your stake.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="group flex flex-col items-center gap-4 rounded-2xl bg-[#111319]/50 p-6 text-center transition-all hover:bg-[#111319] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 via-yellow-400 to-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.4)] group-hover:scale-105">
                    <span className="text-sm font-bold text-black">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Stake & Play
                  </h3>
                  <p className="text-sm text-white/60">
                    Stake your bet and watch the 10s countdown.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="group flex flex-col items-center gap-4 rounded-2xl bg-[#111319]/50 p-6 text-center transition-all hover:bg-[#111319] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-red-400 via-red-400 to-rose-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-105">
                    <span className="text-sm font-bold text-black">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Win Big</h3>
                  <p className="text-sm text-white/60">
                    Win up to 2x your bet instantly!
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Why ColorStake */}
        <section id="features" className="relative z-10 mt-24 w-full max-w-6xl px-4 pb-24">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            {/* Title */}
            <div className="mb-16 flex flex-col items-center gap-3">
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Why <span className="text-[#facc15]">HueFi?</span>
              </h2>
              <p className="max-w-xl text-sm text-white/60 sm:text-base">
                Built for fairness, speed, and transparency.
              </p>
              <div className="h-px w-20 bg-linear-to-r from-transparent via-white/30 to-transparent" />
            </div>

            {/* Grid */}
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {WHY_FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border border-white/10 bg-[#111319]/60 p-6 text-left transition-all duration-300 hover:bg-[#111319] hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                >
                  {/* Icon circle */}
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: COLOR_CONFIG[feature.color].hex,
                    }}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-white/60">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ready To Win CTA */}
        <section className="relative z-10 w-full px-4 pb-32">
          <div className="relative flex flex-col items-center overflow-hidden rounded-3xl px-6 py-16 text-center ">
            {/* Glow Background */}
            <div
              className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full blur-3xl opacity-40"
              style={{ backgroundColor: COLOR_CONFIG.blue.hex }}
            />
            <div
              className="pointer-events-none absolute -right-32 -bottom-32 h-72 w-72 rounded-full blur-3xl opacity-40"
              style={{
                backgroundColor:
                  COLOR_CONFIG.yellow?.hex || COLOR_CONFIG.red.hex,
              }}
            />

            {/* Heading */}
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              Ready to{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${COLOR_CONFIG.yellow.hex}, ${COLOR_CONFIG.yellow.hex})`,
                }}
              >
                Win?
              </span>
            </h2>

            {/* Subtext */}
            <p className="mt-6 max-w-xl text-sm text-white/60 sm:text-base">
              Join thousands of players already predicting and winning on
              ColorStake. Connect your wallet and start playing in under a
              minute.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={onDemoMode}
                className="rounded-xl md:px-12 px-6 md:py- py-4 text-sm font-semibold text-black shadow-[0_0_25px_rgba(0,0,0,0.5)] transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(to right, ${COLOR_CONFIG.yellow.hex})`,
                }}
              >
                Start Playing Now →
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/60">
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLOR_CONFIG.green.hex }}
                />
                Audited Smart Contracts
              </span>

              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLOR_CONFIG.blue.hex }}
                />
                Verifiable Randomness
              </span>

              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLOR_CONFIG.red.hex }}
                />
                Multi-Chain Support
              </span>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
