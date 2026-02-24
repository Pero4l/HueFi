"use client"
import { Wallet } from "lucide-react"
import Link from "next/link"
import { useAccount, useDisconnect } from "@starknet-react/core"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WalletModal } from "../game/walletmodal"

export function Navbar() {
  const [modalOpen, setModalOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  useEffect(() => {
    if (isConnected && address) {
      // setModalOpen(false);
      router.push("/gameboard");
    }
  }, [isConnected, address, router]);


  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-[#05060a]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#111319]">
                <svg width="28" height="28" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="7" height="7" rx="2" fill="hsl(0 85% 55%)" />
                  <rect x="11" y="2" width="7" height="7" rx="2" fill="hsl(217 91% 55%)" />
                  <rect x="2" y="11" width="7" height="7" rx="2" fill="hsl(142 72% 45%)" />
                  <rect x="11" y="11" width="7" height="7" rx="2" fill="hsl(47 100% 50%)" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight">ColorStack</span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/60 sm:flex">
            <a href="#play"><button className="cursor-pointer transition hover:text-white">Play</button></a>
            <a href="#how-it-works"><button className="cursor-pointer transition hover:text-white">How It Works</button></a>
            <a href="#features"><button className="cursor-pointer transition hover:text-white">Features</button></a>
          </nav>

          {/* Wallet Button */}
          <div className="flex items-center">
            {isConnected ? (
              <button
                onClick={() => disconnect()}
                className="cursor-pointer inline-flex h-11 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 px-6 text-sm font-semibold text-green-400 transition hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
              >
                <Wallet className="w-5 h-5 mr-2" />
                {shortAddress}
              </button>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="cursor-pointer inline-flex h-11 items-center justify-center rounded-xl bg-[#facc15] md:px-8 px-3 md:text-md text-sm font-semibold text-black shadow-md transition hover:bg-[#eab308]"
              >
                <Wallet className="md:w-6 w-4 md:h-6 h-4 mr-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <WalletModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}