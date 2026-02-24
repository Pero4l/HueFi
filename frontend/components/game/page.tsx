"use client";

import { GameBoard } from "@/components/game/game-board"; // adjust if path differs
import { useAccount } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GamePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  // protect route: if wallet not connected, go back home
  useEffect(() => {
    if (!isConnected || !address) {
      router.push("/");
    }
  }, [isConnected, address, router]);

  if (!isConnected || !address) {
    return null; // or a small loading / redirect message
  }

  return (
    <main className="min-h-screen bg-[#05060a] pt-20">
      <GameBoard isDemoMode={false} />
    </main>
  );
}