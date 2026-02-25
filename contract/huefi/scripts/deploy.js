const { Account, Contract, json, RpcProvider } = require("starknet");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

async function main() {
    // 1. Setup Provider and Account
    const rpcUrl = (process.env.RPC_URL || "").trim();
    const accountAddress = (process.env.ACCOUNT_ADDRESS || "").trim();
    const privateKey = (process.env.PRIVATE_KEY || "").trim();

    console.log("Environment Variables:");
    console.log("- RPC_URL:", rpcUrl);
    console.log("- ACCOUNT_ADDRESS length:", accountAddress.length);
    console.log("- PRIVATE_KEY present:", !!privateKey);

    if (!rpcUrl || !accountAddress || !privateKey || accountAddress.includes("your_")) {
        console.error("Error: Missing or invalid environment variables in .env file.");
        process.exit(1);
    }

    // Initialize Provider
    // In starknet.js v6+, RpcProvider can take a string or an object { nodeUrl: ... }
    const provider = new RpcProvider({ nodeUrl: rpcUrl });

    // Quick check if provider is responsive
    try {
        const chainId = await provider.getChainId();
        console.log("Connected to chain:", chainId);
    } catch (e) {
        console.warn("Could not fetch chainId, provider might be misconfigured.");
    }

    // Initialize Account
    console.log("Attempting to create Account object...");
    // The library version installed (starknet.js v6+) expects an options object
    const account = new Account({
        provider: provider,
        address: accountAddress,
        signer: privateKey
    });
    console.log("Account object created successfully for:", account.address);

    // 2. Read Sierra and CASM artifacts
    const sierraPath = path.join(__dirname, "../target/dev/huefi_HueFi.contract_class.json");
    const casmPath = path.join(__dirname, "../target/dev/huefi_HueFi.compiled_contract_class.json");

    const sierra = json.parse(fs.readFileSync(sierraPath).toString("ascii"));
    const casm = json.parse(fs.readFileSync(casmPath).toString("ascii"));

    // 3. Declare and Deploy
    const strkAddress = process.env.STRK_TOKEN_ADDRESS;
    console.log("Staking Token (STRK):", strkAddress);

    console.log("Declaring and deploying HueFi...");
    const deployResponse = await account.declareAndDeploy({
        contract: sierra,
        casm: casm,
        constructorCalldata: [strkAddress],
    });

    console.log("Deployment successful!");
    console.log("Contract Address:", deployResponse.deploy.contract_address);
    console.log("Transaction Hash:", deployResponse.deploy.transaction_hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
