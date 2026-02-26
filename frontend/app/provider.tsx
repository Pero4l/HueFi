"use client";
import { ReactNode } from "react";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";

export function Providers({ children }: { children: ReactNode }) {
  // Define a custom Sepolia chain that ONLY uses our proxy
  // We sanitize ALL rpcUrls to prevent the library from falling back to external nodes
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

  const { connectors } = useInjectedConnectors({
    recommended: [
      argent(),
      braavos(),
    ],
    includeRecommended: "always",
    order: "random"
  });

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