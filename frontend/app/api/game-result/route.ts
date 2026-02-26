import { NextResponse } from "next/server"

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.cartridge.gg/x/starknet/sepolia"
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_HUEFI_CONTRACT_ADDRESS || "0x0"

// selector for "get_last_result"
// Computed via sn_keccak("get_last_result")
const GET_LAST_RESULT_SELECTOR = "0x24b1cabf2dc57e7fe876cca6e201e8e5c8b579e6a6c01ba574cdcc9b8610a7c"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
        return NextResponse.json({ error: "address is required" }, { status: 400 })
    }

    if (CONTRACT_ADDRESS === "0x0") {
        return NextResponse.json({ error: "contract address not configured" }, { status: 500 })
    }

    try {
        const res = await fetch(RPC_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "starknet_call",
                params: [
                    {
                        contract_address: CONTRACT_ADDRESS,
                        entry_point_selector: GET_LAST_RESULT_SELECTOR,
                        calldata: [address],
                    },
                    "latest",
                ],
            }),
        })

        const json = await res.json()

        if (json.error) {
            console.error("[HueFi] Result API error:", json.error)
            return NextResponse.json({ error: json.error }, { status: 502 })
        }

        // result[0] will be the u8 (0 or 1)
        return NextResponse.json({ result: json.result })
    } catch (err) {
        console.error("[HueFi] Failed to fetch result:", err)
        return NextResponse.json({ error: "internal error" }, { status: 500 })
    }
}
