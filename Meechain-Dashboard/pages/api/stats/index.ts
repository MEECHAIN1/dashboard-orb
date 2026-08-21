import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [health, blockNumber] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_RPC_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 })
      }).then(r => r.json())
    ]);

    res.status(200).json({
      node: {
        status: health?.status || "unknown",
        blockHeight: parseInt(blockNumber?.result, 16),
        chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
        uptime: health?.uptime || null,
      },
      api: {
        status: health?.status,
        latency: health?.latency,
        requests: health?.requests,
        errorRate: health?.errorRate,
      },
      rpc: {
        status: blockNumber?.result ? "connected" : "offline",
        blockHeight: parseInt(blockNumber?.result, 16),
        upstream: process.env.NEXT_PUBLIC_RPC_URL,
      }
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
}