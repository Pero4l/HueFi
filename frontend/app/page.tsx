"use client"

import { useState } from "react"
import { GameBoard } from "@/components/game/game-board"
import { HeroSection } from "@/components/landing/hero-section"

export default function Home() {
  // const { connected } = useWallet()
  const [demoMode, setDemoMode] = useState(false)

  const isPlaying = demoMode

  return (
    <main className="min-h-dvh bg-[#121317]">
      {isPlaying ? (
        <GameBoard
          isDemoMode={demoMode}
          onExitDemo={demoMode ? () => setDemoMode(false) : undefined}
        />
      ) : (
        <HeroSection onDemoMode={() => setDemoMode(true)} />
      )}
    </main>
  )
}