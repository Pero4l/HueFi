"use client";

import {
  useColorGame,
  type GameColor,
  COLOR_CONFIG,
} from "@/hooks/use-color-game";
import { BalanceHeader } from "./balance-header";
import { ColorCard } from "./color-card";
import { CountdownDisplay } from "./countdown-display";
import { RevealDisplay } from "./reveal-display";
import { StakeInput } from "./stake-input";
import { GameHistory } from "./game-history";
import { useCallback } from "react";
import { useAccount, useDisconnect } from "@starknet-react/core";
import { useRouter } from "next/navigation";

const COLORS: GameColor[] = ["red", "blue", "green", "yellow"];

interface GameBoardProps {
  isDemoMode?: boolean;
  onExitDemo?: () => void;
}

export function GameBoard({ isDemoMode, onExitDemo }: GameBoardProps) {
  const {
    balance,
    stake,
    setStake,
    selectedColor,
    setSelectedColor: setColor,
    phase,
    countdown,
    winningColor,
    lastPayout,
    history,
    placeBet,
    resetRound,
    addFunds,
  } = useColorGame();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const setSelectedColor = useCallback(
    (color: GameColor) => {
      // playSelectSound()
      setColor(color);
    },
    [setColor],
  );

  const handleExit = () => {
    disconnect();
    router.push("/");
  };

  const shortenAddress = (addr?: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isBetting = phase === "betting";
  const canBet =
    isBetting && selectedColor !== null && stake > 0 && stake <= balance;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 md:mt-0">
      <div className="flex items-center justify-between rounded-xl bg-[#191a1f] border border-[#1f2025] px-4 py-3 mt-12">
        {isConnected && address ? (
          <>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-white">
                {shortenAddress(address)}
              </span>
            </div>
            <button
              onClick={handleExit}
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition"
            >
              Disconnect
            </button>
          </>
        ) : (
          <span className="text-sm text-[#7a889a]">Wallet not connected</span>
        )}
      </div>

      {/* Header */}
      <BalanceHeader
        balance={balance}
        onAddFunds={() => addFunds(500)}
        isDemoMode={isDemoMode}
        onExitDemo={onExitDemo}
      />

      {/* Game Area */}
      <div className="flex flex-1 flex-col gap-6">
        {/* Central Display */}
        <div className="flex min-h-55 flex-col items-center justify-center rounded-2xl border-2 border-[#1f2025] bg-[#191a1f] p-6">
          {phase === "betting" && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <div
                    key={c}
                    className="h-4 w-4 rounded-full opacity-50"
                    style={{ backgroundColor: COLOR_CONFIG[c].hex }}
                  />
                ))}
              </div>
              <p className="text-[#6f8595] text-center text-md text-muted-foreground">
                Select a color and place your bet
              </p>
              {selectedColor && (
                <div className="flex items-center gap-2 animate-slide-up">
                  <div
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundColor: COLOR_CONFIG[selectedColor].hex }}
                  />
                  <span className="text-sm font-medium text-white">
                    {COLOR_CONFIG[selectedColor].label} selected
                  </span>
                  <span
                    className="font-mono text-xs font-bold text-white"
                    style={{ color: COLOR_CONFIG[selectedColor].hex }}
                  >
                    ({COLOR_CONFIG[selectedColor].multiplier}x)
                  </span>
                </div>
              )}
            </div>
          )}

          {phase === "countdown" && (
            <CountdownDisplay countdown={countdown} maxTime={10} />
          )}

          {(phase === "revealing" || phase === "result") && (
            <RevealDisplay
              winningColor={winningColor}
              selectedColor={selectedColor}
              phase={phase}
              lastPayout={lastPayout}
              stake={stake}
            />
          )}
        </div>

        {/* Color Selection */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground text-[#74899d]">
            Pick a Color
          </p>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
            {COLORS.map((color) => (
              <ColorCard
                key={color}
                color={color}
                selected={selectedColor === color}
                disabled={!isBetting}
                onSelect={setSelectedColor}
              />
            ))}
          </div>
        </div>

        {/* Stake + Action */}
        {isBetting ? (
          <div className="flex flex-col gap-4">
            <StakeInput
              stake={stake}
              setStake={setStake}
              balance={balance}
              disabled={!isBetting}
            />
            <button
              onClick={placeBet}
              disabled={!canBet}
              className={`h-12 w-full rounded-xl font-semibold transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                ${
                  canBet
                    ? "bg-[#ffc800] text-black hover:bg-primary/90 active:scale-[0.98]"
                    : "cursor-not-allowed bg-[#25262f] text-muted-foreground text-[#7a889a]"
                }`}
            >
              {!selectedColor
                ? "Select a color"
                : stake <= 0
                  ? "Enter stake amount"
                  : stake > balance
                    ? "Insufficient balance"
                    : `Place Bet - $${stake.toFixed(2)}`}
            </button>
          </div>
        ) : phase === "result" ? (
          <button
            onClick={resetRound}
            className="h-12 w-full rounded-xl bg-[#ffc800] font-semibold text-black transition-all hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Play Again
          </button>
        ) : null}

        {/* History */}
        <div className="mt-2">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Game History
          </p>
          <GameHistory history={history} />
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-center pb-2">
        <p className="text-xs text-muted-foreground">
          ColorStack -- For entertainment purposes only
        </p>
      </footer>
    </div>
  );
}
