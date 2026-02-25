"use client"

import { useState, useCallback, useEffect } from "react"
import { useAccount, useBalance, useSendTransaction } from "@starknet-react/core"
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

const COUNTDOWN_DURATION = 10
export function useColorGame(initialBalance = 1000) {
  const { address, isConnected } = useAccount()
  const STRK_TOKEN_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({ 
    address, 
    token: STRK_TOKEN_ADDRESS, 
    watch: true,
    enabled: !!address 
  })

  const [localBalance, setLocalBalance] = useState<number>(initialBalance)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stake, setStake] = useState(10)
  const [selectedColor, setSelectedColor] = useState<GameColor | null>(null)
  const [phase, setPhase] = useState<GamePhase>("betting")
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION)
  const [winningColor, setWinningColor] = useState<GameColor | null>(null)
  const [lastPayout, setLastPayout] = useState(0)
  const [history, setHistory] = useState<GameRound[]>([])

  // Derive balance: 
  // For the hackathon demo, we want to ensure any connected user can play.
  // We prioritize real on-chain balance if it's > 0.1, otherwise fallback to our 1000 STRK gift.
  const realBalance = balanceData ? parseFloat(balanceData.formatted) : 0;
  
  // If connected but no real funds, we show the local demo balance (default 1000)
  const balance = isConnected 
    ? (realBalance > 0.1 ? realBalance : localBalance)
    : localBalance

  // Enhanced loading state
  const isLoading = isConnected && isBalanceLoading && !balanceData;

  // Initialize welcome balance only if the user is connected and has no on-chain funds
  useEffect(() => {
    if (isConnected && realBalance <= 0.1 && localBalance < 100) {
      setLocalBalance(1000);
    }
  }, [isConnected, realBalance, localBalance]);

  useEffect(() => {
    if (isConnected) {
      console.log("Wallet info:", { address, balance: balanceData?.formatted });
    }
  }, [isConnected, address, balanceData]);

  // TODO: Replace with the actual deployed contract address
  const CONTRACT_ADDRESS = "0x0" 
  const { sendAsync: sendPlayTransaction } = useSendTransaction({})

  const pickWinningColor = useCallback((): GameColor => {
    const rand = Math.random() * 100
    if (rand < 35) return "red"
    if (rand < 70) return "blue"
    if (rand < 90) return "green"
    return "yellow"
  }, [])

  // Handle countdown timer and phase transitions
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (phase === "countdown") {
      if (countdown > 0) {
        interval = setInterval(() => {
          setCountdown((prev) => prev - 1)
        }, 1000)
      } else {
        setPhase("revealing")
        setWinningColor(pickWinningColor())
      }
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [phase, countdown, pickWinningColor])

  // Handle revealing to result transition and history update
  useEffect(() => {
    if (phase === "revealing" && winningColor && selectedColor) {
      const timer = setTimeout(() => {
        const won = winningColor === selectedColor
        const payout = won ? stake * COLOR_CONFIG[selectedColor].multiplier : 0
        
        if (won) {
          setLocalBalance((b) => (b ?? initialBalance) + payout)
        }
        
        setLastPayout(payout)
        setPhase("result")
        
        setHistory((prev) => [
          {
            id: Date.now(),
            selectedColor,
            winningColor,
            stake,
            won,
            payout,
            timestamp: new Date(),
          },
          ...prev,
        ].slice(0, 20))
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [phase, winningColor, selectedColor, stake, initialBalance])

  const placeBet = useCallback(async () => {
    if (isSubmitting || !selectedColor || stake <= 0 || stake > balance || phase !== "betting") return
    setIsSubmitting(true)
    
    const colorMap: Record<GameColor, number> = { red: 0, blue: 1, green: 2, yellow: 3 };
    const chosenColorId = colorMap[selectedColor];
    const stakeAmount = BigInt(Math.floor(stake * 1e18));
    const stakeU256 = uint256.bnToUint256(stakeAmount);

    try {
      if (CONTRACT_ADDRESS !== "0x0" && address) {
        const calls = [
          {
            contractAddress: STRK_TOKEN_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({ spender: CONTRACT_ADDRESS, amount: stakeU256 })
          },
          {
            contractAddress: CONTRACT_ADDRESS,
            entrypoint: "play",
            calldata: CallData.compile({ chosen_color: chosenColorId, stake: stakeU256 })
          }
        ];
        await sendPlayTransaction(calls);
      }
      
      // Always update local balance so the game doesn't get "stuck" if the transaction takes time or if we're in welcome-balance mode
      setLocalBalance((prev) => prev - stake)
      setPhase("countdown")
      setCountdown(COUNTDOWN_DURATION)
    } catch (e) {
      console.error("Transaction failed: ", e);
      // Fallback for demo: proceed with the game even if TX fails on-chain (very common in hackathon demos)
      setLocalBalance((prev) => prev - stake)
      setPhase("countdown")
      setCountdown(COUNTDOWN_DURATION)
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, selectedColor, stake, balance, phase, address, sendPlayTransaction])

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