const { Account, json, RpcProvider, Signer, hash, CallData } = require("starknet");
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

    if (!rpcUrl || !accountAddress || !privateKey) {
        console.error("Error: Missing environment variables in .env file.");
        process.exit(1);
    }

    const provider = new RpcProvider({ nodeUrl: rpcUrl });

    try {
        const chainId = await provider.getChainId();
        console.log("Connected to chain:", chainId);
    } catch (e) {
        console.error("Could not connect to RPC:", e.message);
        process.exit(1);
    }

    // starknet.js v9.2.1: options-object with Signer instance
    const signer = new Signer(privateKey);
    const account = new Account({ provider, address: accountAddress, signer });
    console.log("Account:", account.address);

    // 2. Read Sierra and CASM artifacts (from dev build)
    const sierraPath = path.join(__dirname, "../target/dev/huefi_HueFi.contract_class.json");
    const casmPath = path.join(__dirname, "../target/dev/huefi_HueFi.compiled_contract_class.json");

    const sierra = json.parse(fs.readFileSync(sierraPath).toString("ascii"));
    const casm = json.parse(fs.readFileSync(casmPath).toString("ascii"));

    // Compute hashes explicitly from dev-built CASM
    const compiledClassHash = hash.computeCompiledClassHash(casm);
    const classHash = hash.computeContractClassHash(sierra);
    console.log("\nSierra class hash:", classHash);
    console.log("CASM compiled hash:", compiledClassHash);

    // 3. Declare
    console.log("\nDeclaring HueFi...");
    let declaredClassHash;
    try {
        const declareResponse = await account.declare({
            contract: sierra,
            casm: casm,
        });
        console.log("Declare tx hash:", declareResponse.transaction_hash);
        console.log("Waiting for declare to be accepted...");
        await provider.waitForTransaction(declareResponse.transaction_hash);
        declaredClassHash = declareResponse.class_hash;
        console.log("Declared class hash:", declaredClassHash);
    } catch (e) {
        // Contract may already be declared — extract class hash from error or use computed
        if (e.message && e.message.includes("already declared")) {
            console.log("Contract already declared. Using computed class hash:", classHash);
            declaredClassHash = classHash;
        } else {
            throw e;
        }
    }

    // 4. Deploy
    const strkAddress = process.env.STRK_TOKEN_ADDRESS;
    if (!strkAddress) {
        console.error("Error: STRK_TOKEN_ADDRESS not set in .env");
        process.exit(1);
    }
    console.log("\nStaking Token (STRK):", strkAddress);
    console.log("Deploying HueFi...");

    const deployResponse = await account.deploy({
        classHash: declaredClassHash,
        constructorCalldata: CallData.compile({ usdc_address: strkAddress }),
        salt: "0x1",
    });

    console.log("Deploy tx hash:", deployResponse.transaction_hash);
    console.log("Waiting for deploy to be accepted...");
    await provider.waitForTransaction(deployResponse.transaction_hash);

    console.log("\n✅ Deployment successful!");
    console.log("Contract Address:", deployResponse.contract_address);
    console.log("Transaction Hash:", deployResponse.transaction_hash);
    console.log("\nAdd this to frontend/.env.local:");
    console.log(`NEXT_PUBLIC_HUEFI_CONTRACT_ADDRESS=${deployResponse.contract_address}`);
    console.log(`NEXT_PUBLIC_STRK_TOKEN_ADDRESS=${strkAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
