import { NextResponse } from "next/server"

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.cartridge.gg/x/starknet/sepolia"

const STRK_TOKEN_ADDRESS =
    process.env.NEXT_PUBLIC_STRK_TOKEN_ADDRESS ||
    "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"

// selector for starknet standard "balanceOf"
const BALANCE_OF_SELECTOR =
    "0x2e4263afad30923c891518314c3c95dbe830a16874e8abc5777a9a20b54c76e"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
        return NextResponse.json({ error: "address is required" }, { status: 400 })
    }

    // First get the latest block number
    const blockRes = await fetch(RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 0,
            method: "starknet_blockNumber",
            params: [],
        }),
    })
    const blockJson = await blockRes.json()
    const blockNumber = blockJson.result

    // Then call balanceOf with that block number
    const res = await fetch(RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "starknet_call",
            params: [
                {
                    contract_address: STRK_TOKEN_ADDRESS,
                    entry_point_selector: BALANCE_OF_SELECTOR,
                    calldata: [address],
                },
                { block_number: blockNumber },
            ],
        }),
    })

    const json = await res.json()

    if (json.error) {
        return NextResponse.json({ error: json.error }, { status: 502 })
    }

    return NextResponse.json({ result: json.result })
}
