"use client"

import { useState, useCallback, useEffect } from "react"
import { useAccount, useSendTransaction } from "@starknet-react/core"
import { CallData, uint256 } from "starknet"

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

// Read from env — set in frontend/.env.local after deploy
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_HUEFI_CONTRACT_ADDRESS || "0x0") as `0x${string}`
const STRK_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_STRK_TOKEN_ADDRESS ||
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d") as `0x${string}`

const COUNTDOWN_DURATION = 10
const COLOR_MAP: Record<GameColor, number> = { red: 0, blue: 1, green: 2, yellow: 3 }

export function useColorGame(initialBalance = 1000) {
  const { address, isConnected } = useAccount()

  // ---------- Balance via server-side API route ----------
  // We bypass starknet-react's useBalance and direct browser RPC calls
  // because the Cartridge RPC doesn't handle CORS for browser origins.
  // Instead we call our own /api/balance route which proxies server-side.

  const [balanceDataRaw, setBalanceDataRaw] = useState<bigint | null>(null)
  const [isBalanceLoading, setIsBalanceLoading] = useState(true)
  const [balanceError, setBalanceError] = useState<unknown>(null)

  const fetchBalance = useCallback(async () => {
    if (!address || !isConnected) return
    try {
      const resp = await fetch(`/api/balance?address=${address}`)
      const json = await resp.json()
      if (json.result && json.result.length > 0) {
        const balU256 = { low: json.result[0], high: json.result[1] || "0x0" }
        const bn = uint256.uint256ToBN(balU256)
        setBalanceDataRaw(bn)
        setBalanceError(null)
      } else if (json.error) {
        console.error("[HueFi] Balance API error:", json.error)
        setBalanceError(json.error)
      }
    } catch (err) {
      console.error("[HueFi] Failed to fetch balance:", err)
      setBalanceError(err)
    } finally {
      setIsBalanceLoading(false)
    }
  }, [address, isConnected])

  useEffect(() => {
    if (address && isConnected) {
      setIsBalanceLoading(true)
      fetchBalance()
      const interval = setInterval(fetchBalance, 5000)
      return () => clearInterval(interval)
    } else {
      setIsBalanceLoading(false)
      setBalanceDataRaw(null)
    }
  }, [address, isConnected, fetchBalance])

  // Provide a fake refetch function for the rest of the app
  const refetchBalance = fetchBalance

  const [localBalance, setLocalBalance] = useState<number>(initialBalance)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stake, setStake] = useState(10)
  const [selectedColor, setSelectedColor] = useState<GameColor | null>(null)
  const [phase, setPhase] = useState<GamePhase>("betting")
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION)
  const [winningColor, setWinningColor] = useState<GameColor | null>(null)
  const [lastPayout, setLastPayout] = useState(0)
  const [history, setHistory] = useState<GameRound[]>([])

  // Real on-chain balance (in STRK, formatted). Falls back to local demo balance.
  const realBalance = balanceDataRaw !== null ? Number(balanceDataRaw) / 1e18 : 0

  const isLiveMode = isConnected && CONTRACT_ADDRESS !== "0x0"
  const balance = isConnected ? realBalance : localBalance

  const isLoading = isConnected && isBalanceLoading && balanceDataRaw === null

  // Demo balance is only used when completely disconnected.
  useEffect(() => {
    if (!isConnected && localBalance < 100) {
      setLocalBalance(1000)
    }
  }, [isConnected, localBalance])

  useEffect(() => {
    if (isConnected || balanceError) {
      console.log("[HueFi] Wallet:", { address, balance: balanceDataRaw?.toString(), CONTRACT_ADDRESS, balanceError })
    }
  }, [isConnected, address, balanceDataRaw, balanceError])

  const { sendAsync: sendPlayTransaction } = useSendTransaction({})

  const pickWinningColor = useCallback((): GameColor => {
    const colors: GameColor[] = ["red", "blue", "green", "yellow"]
    return colors[Math.floor(Math.random() * 4)]
  }, [])

  // Countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (phase === "countdown") {
      if (countdown > 0) {
        interval = setInterval(() => setCountdown((p) => p - 1), 1000)
      } else {
        setPhase("revealing")
        setWinningColor(pickWinningColor())
      }
    }
    return () => { if (interval) clearInterval(interval) }
  }, [phase, countdown, pickWinningColor])

  // Reveal → result transition + history
  useEffect(() => {
    if (phase === "revealing" && winningColor && selectedColor) {
      const timer = setTimeout(async () => {
        const won = winningColor === selectedColor
        const payout = won ? stake * COLOR_CONFIG[selectedColor].multiplier : 0

        if (!isLiveMode) {
          // Demo mode: update local balance
          if (won) setLocalBalance((b) => b + payout)
        } else {
          // Live mode: refetch on-chain balance so it reflects the TX result
          try { await refetchBalance() } catch (err) { }
        }

        setLastPayout(payout)
        setPhase("result")

        setHistory((prev) => [
          { id: Date.now(), selectedColor, winningColor, stake, won, payout, timestamp: new Date() },
          ...prev,
        ].slice(0, 20))
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [phase, winningColor, selectedColor, stake, isLiveMode, refetchBalance])

  const placeBet = useCallback(async () => {
    if (isSubmitting || !selectedColor || stake <= 0 || stake > balance || phase !== "betting") return
    setIsSubmitting(true)

    const stakeAmount = BigInt(Math.floor(stake * 1e18))
    const stakeU256 = uint256.bnToUint256(stakeAmount)

    try {
      if (isLiveMode && address) {
        // Multicall: approve STRK → play game
        const calls = [
          {
            contractAddress: STRK_TOKEN_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({ spender: CONTRACT_ADDRESS, amount: stakeU256 }),
          },
          {
            contractAddress: CONTRACT_ADDRESS,
            entrypoint: "play",
            calldata: CallData.compile({
              chosen_color: COLOR_MAP[selectedColor],
              stake: stakeU256,
            }),
          },
        ]
        await sendPlayTransaction(calls)
        // Deduct locally while waiting for chain confirmation
        setLocalBalance((prev) => prev - stake)
      } else {
        // Demo mode: just deduct locally
        setLocalBalance((prev) => prev - stake)
      }

      setPhase("countdown")
      setCountdown(COUNTDOWN_DURATION)
    } catch (e) {
      console.error("[HueFi] Transaction failed:", e)
      // Fallback — still play in demo mode so the UI doesn't get stuck
      setLocalBalance((prev) => prev - stake)
      setPhase("countdown")
      setCountdown(COUNTDOWN_DURATION)
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, selectedColor, stake, balance, phase, address, isLiveMode, sendPlayTransaction])

  const resetRound = useCallback(() => {
    setPhase("betting")
    setSelectedColor(null)
    setWinningColor(null)
    setLastPayout(0)
    setCountdown(COUNTDOWN_DURATION)
  }, [])

  const addFunds = useCallback((amount: number) => {
    setLocalBalance((prev) => prev + amount)
  }, [])

  return {
    balance,
    isBalanceLoading: isLoading,
    isLiveMode,
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