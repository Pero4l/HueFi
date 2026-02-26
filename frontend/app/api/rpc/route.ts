import { NextResponse } from "next/server"

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.cartridge.gg/x/starknet/sepolia"

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const res = await fetch(RPC_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        const json = await res.json()
        return NextResponse.json(json)
    } catch (err) {
        console.error("[HueFi] RPC Proxy error:", err)
        return NextResponse.json({
            jsonrpc: "2.0",
            id: 0,
            error: { code: -32603, message: "Internal error in RPC proxy" }
        }, { status: 500 })
    }
}
