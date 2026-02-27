"use client";
import { ReactNode } from "react";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  voyager,
  argent,
  braavos,
} from "@starknet-react/core";

export function Providers({ children }: { children: ReactNode }) {
  // Define a custom Sepolia chain that ONLY uses our proxy
  const mySepolia = {
    ...sepolia,
    rpcUrls: {
      default: { http: ["/api/rpc"] },
      public: { http: ["/api/rpc"] },
      blast: { http: ["/api/rpc"] },
      infura: { http: ["/api/rpc"] },
      cartridge: { http: ["/api/rpc"] },
    }
  };

  const connectors = [
    argent(),
    braavos(),
  ];

  const provider = jsonRpcProvider({
    rpc: (chain) => {
      // Force all requests through our local proxy
      return { nodeUrl: "/api/rpc" };
    },
  });

  return (
    <StarknetConfig
      chains={[mySepolia, mainnet]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}