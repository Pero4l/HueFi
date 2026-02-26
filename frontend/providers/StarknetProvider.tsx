"use client"
import { ReactNode } from "react"
import { sepolia } from "@starknet-react/chains"
import { StarknetConfig, jsonRpcProvider, argent, braavos } from "@starknet-react/core"

const SEPOLIA_RPC = process.env.NEXT_PUBLIC_RPC_URL || "https://api.cartridge.gg/x/starknet/sepolia"

export function Providers({ children }: { children: ReactNode }) {
  const chains = [sepolia]
  const connectors = [argent(), braavos()]

  const provider = jsonRpcProvider({
    rpc: (chain) => {
      // Always return Sepolia RPC
      return { nodeUrl: SEPOLIA_RPC }
    },
  })

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={connectors}
    >
      {children}
    </StarknetConfig>
  )
}