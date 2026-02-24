"use client"
import { ReactNode } from "react"
import { mainnet, sepolia } from "@starknet-react/chains"
import { StarknetConfig, publicProvider, argent, braavos } from "@starknet-react/core"

export function Providers({ children }: { children: ReactNode }) {
  const chains = [mainnet, sepolia]
  const connectors = [argent(), braavos()]

  return (
    <StarknetConfig
      chains={chains}
      provider={publicProvider()}
      connectors={connectors}
    >
      {children}
    </StarknetConfig>
  )
}