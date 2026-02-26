const { RpcProvider } = require("starknet");

async function main() {
    const rpcUrl = "https://api.cartridge.gg/x/starknet/sepolia";
    const provider = new RpcProvider({ nodeUrl: rpcUrl });

    const accounts = {
        "Main Argent": "0x009CfE7E934869D5DE8C37C09417738d01a0a8cE529F601ff1aCB99Dc87C60Bb",
        "Braavos Deployer": "0x006283c8344b4f568903eef536855ef34a4ae607b065bb2253505ecd5cf0f90c",
        "HueFi Contract": "0x36dfaa48f44d75fc47b4782418f5a1ec0d13ac19c95f92de0ec8e0dbf44fb89"
    };

    const strkAddress = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

    for (const [name, address] of Object.entries(accounts)) {
        try {
            const res = await provider.callContract({
                contractAddress: strkAddress,
                entrypoint: "balanceOf",
                calldata: [address]
            });
            const balanceInt = BigInt(res[0]);
            console.log(`${name} STRK Balance:`, (Number(balanceInt) / 1e18).toFixed(4));
        } catch (e) {
            console.error(`Failed to get balance for ${name}:`, e.message);
        }
    }
}
main();
