// pages/api/stats/index.ts
// Next.js API Route to aggregate stats from Node, API, and RPC

import type { NextApiRequest, NextApiResponse } from 'next';

interface StatsResponse {
  timestamp: number;
  node: {
    status: string;
    blockHeight: number;
    chainId: string;
    uptime?: string;
  };
  api: {
    status: string;
    latency: number;
    requests?: number;
    errorRate?: number;
  };
  rpc: {
    status: string;
    blockHeight: number;
    latency: number;
    upstream: string;
  };
  errors?: string[];
}

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || '13390';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse | { error: string }>
) {
  const startTime = Date.now();
  const errors: string[] = [];

  try {
    // Parallel requests with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // 1. Fetch API health
    const apiStartTime = Date.now();
    const apiHealthPromise = fetch(`${BACKEND_API_URL}/health`, {
      signal: controller.signal,
      timeout: 10000,
    })
      .then(r => r.json())
      .catch((err) => {
        errors.push(`API health check failed: ${err.message}`);
        return null;
      });

    // 2. Fetch RPC block number
    const rpcStartTime = Date.now();
    const rpcBlockPromise = fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
      signal: controller.signal,
      timeout: 10000,
    })
      .then(r => r.json())
      .catch((err) => {
        errors.push(`RPC block check failed: ${err.message}`);
        return null;
      });

    // 3. Fetch RPC gas price (optional, for latency check)
    const gasPricePromise = fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 2,
      }),
      signal: controller.signal,
      timeout: 10000,
    })
      .then(() => Date.now() - rpcStartTime)
      .catch(() => 0);

    // Wait for all requests
    const [apiHealth, rpcBlock, rpcLatency] = await Promise.all([
      apiHealthPromise,
      rpcBlockPromise,
      gasPricePromise,
    ]);

    const apiLatency = Date.now() - apiStartTime;
    clearTimeout(timeoutId);

    // Parse data with fallbacks
    const nodeBlockHeight = apiHealth?.blockNumber || 0;
    const rpcBlockHeight = rpcBlock?.result ? parseInt(rpcBlock.result, 16) : 0;
    const apiOk = apiHealth?.status === 'ok';
    const rpcOk = rpcBlock?.result !== undefined;

    const response: StatsResponse = {
      timestamp: Date.now(),
      node: {
        status: apiOk ? '🟢 Running' : '🔴 Offline',
        blockHeight: nodeBlockHeight,
        chainId: CHAIN_ID,
        uptime: apiHealth?.uptime || 'unknown',
      },
      api: {
        status: apiOk ? '🟢 Connected' : '🔴 Offline',
        latency: apiLatency,
        requests: apiHealth?.requests || 0,
        errorRate: apiHealth?.errorRate || 0,
      },
      rpc: {
        status: rpcOk ? '🟢 Connected' : '🔴 Offline',
        blockHeight: rpcBlockHeight,
        latency: rpcLatency as number,
        upstream: RPC_URL,
      },
    };

    // Add errors if any
    if (errors.length > 0) {
      response.errors = errors;
    }

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Stats aggregation error:', error.message);

    res.status(500).json({
      error: `Stats collection failed: ${error.message}`,
    });
  }
}
