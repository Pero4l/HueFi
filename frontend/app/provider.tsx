"use client";
import { ReactNode } from "react";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";

export function Providers({ children }: { children: ReactNode }) {
  const { connectors } = useInjectedConnectors({
    recommended: [
      argent(),
      braavos(),
    ],
    includeRecommended: "always",
    order: "random"
  });

  return (
    <StarknetConfig 
      chains={[sepolia, mainnet]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}