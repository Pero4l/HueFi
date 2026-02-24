"use client";
import { ReactNode } from "react";
import {sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  argent,
  braavos,
} from "@starknet-react/core";

export function Providers({ children }: { children: ReactNode }) {
//   const chains = [mainnet, sepolia];
//   const connectors = [argent(), braavos()];

  //   const provider = jsonRpcProvider({
  //     rpc: (chain) => {
  //       if (chain.id === sepolia.id) {
  //         return { nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7" }
  //       }
  //     //   return { nodeUrl: "https://starknet-mainnet.public.blastapi.io/rpc/v0_7" }
  //     },
  //   })

  const provider = jsonRpcProvider({
    rpc: () => ({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    }),
  });

  return (
    <StarknetConfig chains={[sepolia]}
      provider={provider}
      connectors={[argent(), braavos()]}>
      {children}
    </StarknetConfig>
  );
}