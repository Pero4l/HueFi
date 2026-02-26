"use client";

import { GameBoard } from "@/components/game/game-board";
import { useAccount } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GamePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected || !address) {
      router.push("/");
    }
  }, [isConnected, address, router]);

  if (!isConnected || !address) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0e1016] pt-">
      <GameBoard isDemoMode={false} />
    </main>
  );
}