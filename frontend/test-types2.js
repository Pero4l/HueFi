import { useSendTransaction } from "@starknet-react/core";

export default function MyTestComponent() {
  const { sendAsync } = useSendTransaction({});

  const handleClick = () => {
    sendAsync([{ contractAddress: "0x1", entrypoint: "ok" }]);
  };

  return <button onClick={handleClick}>Send Transaction</button>;
}