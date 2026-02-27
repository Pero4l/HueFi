import { useCallback } from "react"
import { useAccount, useDisconnect, useConnect } from "@starknet-react/core"
import { useStarknetkitConnectModal } from "starknetkit"

interface BalanceHeaderProps {
  balance: number
  isLoading?: boolean
  onAddFunds: () => void
  isDemoMode?: boolean
  onExitDemo?: () => void
}

export function BalanceHeader({ balance, isLoading, isDemoMode, onExitDemo }: BalanceHeaderProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect } = useConnect()

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    modalMode: "canAsk",
    modalTheme: "dark",
  })
  const isLow = balance < 10

  const shortenAddress = (addr?: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  const handleConnect = useCallback(async () => {
    try {
      const { connector } = await starknetkitConnectModal()
      if (connector) {
        connect({ connector })
      }
    } catch (error) {
      console.error("Connection error:", error)
    }
  }, [starknetkitConnectModal, connect])

  const handleDisconnect = useCallback(() => {
    disconnect()
  }, [disconnect])

  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 shadow-inner">
            <svg
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            >
              <rect x="2" y="2" width="7" height="7" rx="2" fill="hsl(0 85% 55%)" />
              <rect x="11" y="2" width="7" height="7" rx="2" fill="hsl(217 91% 55%)" />
              <rect x="2" y="11" width="7" height="7" rx="2" fill="hsl(142 72% 45%)" />
              <rect x="11" y="11" width="7" height="7" rx="2" fill="hsl(47 100% 50%)" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-white uppercase italic leading-none">HueFi</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`h-1.5 w-1.5 rounded-full ${isConnected ? (isLoading ? "bg-yellow-500 animate-ping" : "bg-green-500 animate-pulse") : "bg-red-500"}`} />
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">
                {!isConnected ? "Disconnected" : isLoading ? "Fetching Data..." : "Live Network"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="h-5 w-20 animate-pulse rounded-md bg-white/10" />
              ) : (
                <div className="flex flex-col items-end">
                  <span
                    className={`font-mono text-xl font-black tabular-nums tracking-tighter ${isLow ? "text-red-500" : "text-green-500"
                      } drop-shadow-[0_0_10px_rgba(34,197,94,0.2)]`}
                  >
                    {balance.toFixed(2)}
                  </span>
                  {address && (
                    <span className="text-[8px] font-mono text-white/20 mt-[-2px]">
                      {shortenAddress(address)}
                    </span>
                  )}
                </div>
              )}
              <span className="text-[10px] font-bold text-white/40 mb-0.5">STRK</span>
            </div>
          </div>

          {!isConnected && (
            <button
              onClick={handleConnect}
              className="h-8 rounded-lg bg-[#facc15] px-4 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#eab308] active:scale-95 shadow-[0_0_15px_-3px_rgba(250,204,21,0.3)]"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Wallet info bar */}
      {isConnected && address && (
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
            <span className="font-mono text-sm font-bold text-white/60 tracking-tight">
              {shortenAddress(address)}
            </span>
          </div>
          <button
            onClick={handleDisconnect}
            className="rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30 transition-all hover:bg-white/10 hover:text-white"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Demo mode bar */}
      {isDemoMode && !isConnected && (
        <div className="flex items-center justify-between rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">Demo Environment</span>
          </div>
          {onExitDemo && (
            <button
              onClick={onExitDemo}
              className="rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-all"
            >
              Exit Demo
            </button>
          )}
        </div>
      )}
    </header>
  )
}