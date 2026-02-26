const { Account, RpcProvider, Signer, uint256 } = require("starknet");

async function main() {
    // 1. Setup Provider and Account
    const rpcUrl = "https://api.cartridge.gg/x/starknet/sepolia";

    // Braavos Deployer Account
    const accountAddress = "0x006283c8344b4f568903eef536855ef34a4ae607b065bb2253505ecd5cf0f90c";
    const privateKey = "0x02d18daa37632eb21186925e57fcf74ffc933058df3e3c05a291288e4baab8ce";
    const strkAddress = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

    // HueFi Contract 
    const huefiAddress = "0x36dfaa48f44d75fc47b4782418f5a1ec0d13ac19c95f92de0ec8e0dbf44fb89";

    console.log("Funding HueFi Contract");
    console.log("From Account:", accountAddress);
    console.log("To Contract:", huefiAddress);

    const provider = new RpcProvider({ nodeUrl: rpcUrl });
    const signer = new Signer(privateKey);
    // Standard initialization for Braavos
    const account = new Account({ provider, address: accountAddress, signer });

    // Fund with 50 STRK
    console.log("\nTransferring 50 STRK to HueFi Contract...");
    const amountToTransfer = uint256.bnToUint256(50n * 10n ** 18n);

    try {
        const tx = await account.execute({
            contractAddress: strkAddress,
            entrypoint: "transfer",
            calldata: [huefiAddress, amountToTransfer.low, amountToTransfer.high]
        });

        console.log("Tx hash:", tx.transaction_hash);
        console.log("Waiting for confirmation...");
        await provider.waitForTransaction(tx.transaction_hash);
        console.log("✅ Contract successfully funded with 50 STRK.");
    } catch (e) {
        console.error("Funding failed:", e.message || e);
        process.exit(1);
    }
}

main();
