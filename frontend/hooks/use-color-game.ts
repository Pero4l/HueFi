"use client"

import { useState, useCallback, useRef, useEffect } from "react"
// import {
//   playBetPlaced,
//   playCountdownTick,
//   playCountdownUrgent,
//   playRevealSound,
//   playWinSound,
//   playLoseSound,
//   playSelectSound,
// } from "@/lib/sounds"

export type GameColor = "red" | "blue" | "green" | "yellow"
export type GamePhase = "betting" | "countdown" | "revealing" | "result"

export interface GameRound {
  id: number
  selectedColor: GameColor | null
  winningColor: GameColor
  stake: number
  won: boolean
  payout: number
  timestamp: Date
}

export const COLOR_CONFIG: Record<
  GameColor,
  { label: string; multiplier: number; hsl: string; hex: string }
> = {
  red: { label: "Red", multiplier: 2, hsl: "0 85% 55%", hex: "#e02d2d" },
  blue: { label: "Blue", multiplier: 2, hsl: "217 91% 55%", hex: "#2d6ce0" },
  green: { label: "Green", multiplier: 2, hsl: "142 72% 45%", hex: "#22b355" },
  yellow: { label: "Yellow", multiplier: 2, hsl: "47 100% 50%", hex: "#f5c800" },
}

const COUNTDOWN_DURATION = 10

export function useColorGame(initialBalance = 1000) {
  const [balance, setBalance] = useState(initialBalance)
  const [stake, setStake] = useState(10)
  const [selectedColor, setSelectedColor] = useState<GameColor | null>(null)
  const [phase, setPhase] = useState<GamePhase>("betting")
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION)
  const [winningColor, setWinningColor] = useState<GameColor | null>(null)
  const [lastPayout, setLastPayout] = useState(0)
  const [history, setHistory] = useState<GameRound[]>([])
  const [roundId, setRoundId] = useState(1)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const pickWinningColor = useCallback((): GameColor => {
    const rand = Math.random() * 100
    // Weighted: Red ~35%, Blue ~35%, Green ~20%, Yellow ~10%
    if (rand < 35) return "red"
    if (rand < 70) return "blue"
    if (rand < 90) return "green"
    return "yellow"
  }, [])

  const placeBet = useCallback(() => {
    if (!selectedColor || stake <= 0 || stake > balance || phase !== "betting") return

    // playBetPlaced()
    setBalance((prev) => prev - stake)
    setPhase("countdown")
    setCountdown(COUNTDOWN_DURATION)

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimer()
          // playRevealSound()
          // Reveal phase
          setPhase("revealing")
          const winner = pickWinningColor()
          setWinningColor(winner)

          setTimeout(() => {
            const won = winner === selectedColor
            const payout = won ? stake * COLOR_CONFIG[selectedColor].multiplier : 0

            if (won) {
              // playWinSound()
              setBalance((b) => b + payout)
            } else {
              // playLoseSound()
            }

            setLastPayout(payout)
            setPhase("result")

            setHistory((prev) => [
              {
                id: roundId,
                selectedColor,
                winningColor: winner,
                stake,
                won,
                payout,
                timestamp: new Date(),
              },
              ...prev,
            ].slice(0, 20))
            setRoundId((r) => r + 1)
          }, 1500)

          return 0
        }
        if (prev <= 4) {
          // playCountdownUrgent()
        } else {
          // playCountdownTick()
        }
        return prev - 1
      })
    }, 1000)
  }, [selectedColor, stake, balance, phase, clearTimer, pickWinningColor, roundId])

  const resetRound = useCallback(() => {
    setPhase("betting")
    setSelectedColor(null)
    setWinningColor(null)
    setLastPayout(0)
    setCountdown(COUNTDOWN_DURATION)
  }, [])

  const addFunds = useCallback((amount: number) => {
    setBalance((prev) => prev + amount)
  }, [])

  return {
    balance,
    stake,
    setStake,
    selectedColor,
    setSelectedColor,
    phase,
    countdown,
    winningColor,
    lastPayout,
    history,
    placeBet,
    resetRound,
    addFunds,
  }
}