"use client"

import { useState, useCallback, useEffect } from "react"
import { useAccount, useSendTransaction, useTransactionReceipt } from "@starknet-react/core"
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
const REVERSE_COLOR_MAP: Record<number, GameColor> = { 0: "red", 1: "blue", 2: "green", 3: "yellow" }

export function useColorGame(initialBalance = 1000) {
  const { address, isConnected } = useAccount()

  // ---------- Balance via server-side API route ----------
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

  // ---------- Persistence ----------
  // Load history from localStorage on mount/address change
  useEffect(() => {
    if (typeof window === "undefined") return
    const key = address ? `huefi_history_${address}` : "huefi_history_demo"
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const formatted = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        setHistory(formatted)
      } catch (err) {
        console.error("[HueFi] Failed to parse saved history:", err)
        setHistory([])
      }
    } else {
      setHistory([])
    }
  }, [address])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined" || history.length === 0) return
    const key = address ? `huefi_history_${address}` : "huefi_history_demo"
    localStorage.setItem(key, JSON.stringify(history))
  }, [history, address])

  // Transaction Tracking
  const [lastTxHash, setLastTxHash] = useState<string | undefined>(undefined)
  const { data: receipt, isSuccess: isTxAccepted } = useTransactionReceipt({ hash: lastTxHash })

  // Manual fallback for hang prevention
  const [revealStartedAt, setRevealStartedAt] = useState<number | null>(null)

  useEffect(() => {
    if (phase === "revealing" && !revealStartedAt) {
      setRevealStartedAt(Date.now())
    } else if (phase !== "revealing") {
      setRevealStartedAt(null)
    }
  }, [phase, revealStartedAt])

  const isTimedOut = revealStartedAt !== null && (Date.now() - revealStartedAt > 25000)

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
        // In live mode, we wait for tx confirmation. In demo mode, we just spin.
        if (!isLiveMode) {
          setWinningColor(pickWinningColor())
        }
      }
    }
    return () => { if (interval) clearInterval(interval) }
  }, [phase, countdown, pickWinningColor, isLiveMode])

  // Reveal → result transition + history
  useEffect(() => {
    // We proceed if: 
    // 1. We are in demo mode
    // 2. OR Transaction is accepted
    // 3. OR we've waited too long (fallback)
    const shouldProceedToResult = !isLiveMode || (isTxAccepted && phase === "revealing") || isTimedOut

    if (phase === "revealing" && shouldProceedToResult && selectedColor) {
      console.log("[HueFi] Proceeding to result...", { isLiveMode, isTxAccepted, isTimedOut, lastTxHash })
      const handleResult = async () => {
        let won = false
        let winner: GameColor = "red" // fallback

        if (isLiveMode && address) {
          // console.log("[HueFi] Fetching live result from API for", address)
          try {
            // Wait slightly more to ensure contract state is updated
            await new Promise(r => setTimeout(r, 2000))
            // Fetch result from contract
            const resp = await fetch(`/api/game-result?address=${address}`)
            const json = await resp.json()
            // console.log("[HueFi] Game result API response:", json)

            if (json.result && json.result.length > 0) {
              const resU256 = json.result[0]
              won = Number(resU256) === 1
              console.log("[HueFi] Game result determined:", won ? "WON" : "LOST")

              if (won) {
                winner = selectedColor
              } else {
                // If lost, pick a color that is NOT the selected one
                const others = (["red", "blue", "green", "yellow"] as GameColor[]).filter(c => c !== selectedColor)
                winner = others[Math.floor(Math.random() * 3)]
              }
            } else {
              console.warn("[HueFi] Invalid API response format, falling back to random", json)
              throw new Error("Invalid result format")
            }
          } catch (err) {
            console.error("[HueFi] Failed to fetch game result:", err)
            // fallback to random if API fails
            winner = pickWinningColor()
            won = winner === selectedColor
          }
        } else {
          // Demo mode
          winner = winningColor || pickWinningColor()
          won = winner === selectedColor
        }

        const payout = won ? stake * COLOR_CONFIG[selectedColor].multiplier : 0
        console.log("[HueFi] Final result summary:", { winner, won, payout })
        setWinningColor(winner)
        setLastPayout(payout)

        if (!isLiveMode) {
          if (won) setLocalBalance((b) => b + payout)
        } else {
          console.log("[HueFi] Refreshing balance from on-chain data...")
          await refetchBalance()
        }

        setPhase("result")
        setHistory((prev) => {
          const newEntry = { id: Date.now(), selectedColor, winningColor: winner, stake, won, payout, timestamp: new Date() }
          const updatedHistory = [newEntry, ...prev].slice(0, 20)
          console.log("[HueFi] History updated. Total items:", updatedHistory.length)
          return updatedHistory
        })
      }

      const timer = setTimeout(handleResult, 1500)
      return () => clearTimeout(timer)
    }
  }, [phase, isTxAccepted, isTimedOut, selectedColor, stake, isLiveMode, address, winningColor, pickWinningColor, refetchBalance, lastTxHash])

  const placeBet = useCallback(async () => {
    if (isSubmitting || !selectedColor || stake <= 0 || stake > balance || phase !== "betting") return
    setIsSubmitting(true)
    console.log("[HueFi] Placing bet...", { selectedColor, stake })

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
        const txRes = await sendPlayTransaction(calls)
        console.log("[HueFi] Transaction sent. Hash:", txRes.transaction_hash)
        setLastTxHash(txRes.transaction_hash)
        // Deduct locally while waiting for chain confirmation
        setLocalBalance((prev) => prev - stake)
      } else {
        // Demo mode: just deduct locally
        console.log("[HueFi] Demo mode: deducting stake locally.")
        setLocalBalance((prev) => prev - stake)
      }

      setPhase("countdown")
      setCountdown(COUNTDOWN_DURATION)
    } catch (e) {
      console.error("[HueFi] Transaction failed:", e)
      setIsSubmitting(false)
      // If live mode failed, don't move forward to countdown
      if (!isLiveMode) {
        setLocalBalance((prev) => prev - stake)
        setPhase("countdown")
        setCountdown(COUNTDOWN_DURATION)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, selectedColor, stake, balance, phase, address, isLiveMode, sendPlayTransaction])

  const resetRound = useCallback(() => {
    console.log("[HueFi] Resetting round.")
    setPhase("betting")
    setSelectedColor(null)
    setWinningColor(null)
    setLastPayout(0)
    setCountdown(COUNTDOWN_DURATION)
    setLastTxHash(undefined)
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