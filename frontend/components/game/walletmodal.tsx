"use client";
import { X, Wallet } from "lucide-react";
import { useConnect } from "@starknet-react/core";
import Image from "next/image";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, connectors, isPending, error } = useConnect();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0f17] p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
            <p className="text-sm text-white/40 mt-1">
              Choose your Starknet wallet
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wallet List */}
        <div className="flex flex-col gap-3">
          {connectors.length > 0 ? (
            connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={async () => {
                  connect({ connector });
                  onClose();
                }}
                disabled={isPending}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/20 hover:bg-white/10 disabled:opacity-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#111319] overflow-hidden p-1 transition-transform group-hover:scale-110">
                  {connector.icon && typeof connector.icon === "string" ? (
                    <Image
                      src={connector.icon as string}
                      alt={connector.name}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  ) : (
                    <Wallet className="h-5 w-5 text-white/40" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-white">{connector.name}</p>
                  <p className="text-xs text-white/40">
                    {isPending ? "Connecting..." : "Detected"}
                  </p>
                </div>
                <span className="text-xs text-white/30 group-hover:text-white transition-colors">→</span>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center gap-2 py-6 rounded-xl border border-dashed border-white/10 bg-white/5">
              <Wallet className="h-8 w-8 text-white/20" />
              <p className="text-sm font-medium text-white/60">No wallets detected</p>
              <p className="text-xs text-white/30 px-6 text-center">
                Install one of the recommended wallets below to play.
              </p>
            </div>
          )}

        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 border border-red-500/20">
            {error.message}
          </p>
        )}

        {/* Install links */}
        <div className="mt-4 flex justify-center gap-6 text-xs text-white/30">
          <a
            href="https://chromewebstore.google.com/detail/ready-wallet-formerly-arg/dlcobpjiigpikoobohmabehhmhfoodbb"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition underline"
          >
            Get Argent X
          </a>
          <a
            href="https://braavos.app/download-braavos-wallet/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition underline"
          >
            Get Braavos
          </a>
        </div>

        <p className="mt-5 text-center text-xs text-white/25">
          By connecting, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
