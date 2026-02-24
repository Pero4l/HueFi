"use client"

// import { cn } from "@/lib/utils"
// import { useWallet } from "@solana/wallet-adapter-react"
import { useCallback } from "react"

interface BalanceHeaderProps {
  balance: number
  onAddFunds: () => void
  isDemoMode?: boolean
  onExitDemo?: () => void
}

// Utility to truncate addresses
// function truncateAddress(address: string) {
//   return `${address.slice(0, 4)}...${address.slice(-4)}`
// }

export function BalanceHeader({ balance, onAddFunds, isDemoMode, onExitDemo }: BalanceHeaderProps) {
  // const { publicKey, disconnect } = useWallet()
  const isLow = balance < 10

  const handleDisconnect = useCallback(() => {
    // disconnect()
  }, [/* disconnect */])

  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="7" height="7" rx="2" fill="hsl(0 85% 55%)" />
              <rect x="11" y="2" width="7" height="7" rx="2" fill="hsl(217 91% 55%)" />
              <rect x="2" y="11" width="7" height="7" rx="2" fill="hsl(142 72% 45%)" />
              <rect x="11" y="11" width="7" height="7" rx="2" fill="hsl(47 100% 50%)" />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">HueFi</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm text-[#70827b]">Balance</span>
            <span
              className={`font-mono text-md font-bold tabular-nums ${
                isLow ? "text-[hsl(0,85%,55%)]" : "text-green-500"
              }`}
            >
              ${balance.toFixed(2)}
            </span>
          </div>

          {isLow && (
            <button
              onClick={onAddFunds}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Wallet info bar (real wallet) */}
      {false /* publicKey && !isDemoMode */ && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[hsl(142,72%,45%)]" aria-hidden="true" />
            <span className="font-mono text-xs text-muted-foreground">
              {/* {truncateAddress(publicKey.toBase58())} */}
              0x12...AB34
            </span>
          </div>
          <button
            onClick={handleDisconnect}
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Demo mode bar */}
      {isDemoMode && (
        <div className="flex items-center justify-between rounded-xl border border-[#a08109] bg-[#1e1d17] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#f0c725] animate-pulse" aria-hidden="true" />
            <span className="text-xs font-medium text-[#f0c725]">Demo Mode</span>
          </div>
          {onExitDemo && (
            <button
              onClick={onExitDemo}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground text-[#70827b] transition-colors"
            >
              Exit Demo
            </button>
          )}
        </div>
      )}
    </header>
  )
}