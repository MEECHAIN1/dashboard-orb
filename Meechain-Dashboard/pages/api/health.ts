// pages/api/health.ts
// Next.js API Route to check backend health status

import type { NextApiRequest, NextApiResponse } from 'next';

interface HealthResponse {
  status: 'connected' | 'offline';
  timestamp: number;
  api?: {
    status: string;
    blockNumber?: number;
    chainId?: string;
  };
  rpc?: {
    status: string;
    blockNumber?: number;
  };
  error?: string;
  lastConnected?: number;
}

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  try {
    // Set timeout for all requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // Fetch API health
    const apiHealthPromise = fetch(`${BACKEND_API_URL}/health`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .catch((err) => {
        console.error('API health check failed:', err.message);
        return null;
      })

  .finally(() => {
    clearTimeout(timeoutId);
  });
  
    // Fetch RPC block number
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
    })
      .then(r => r.json())
      .catch((err) => {
        console.error('RPC block check failed:', err.message);
        return null;
      });

    // Wait for both requests
    const [apiHealth, rpcBlock] = await Promise.all([
      apiHealthPromise,
      rpcBlockPromise,
    ]);

    clearTimeout(timeoutId);

    // Validate responses
    const apiOk = apiHealth?.status === 'ok';
    const rpcOk = rpcBlock?.result !== undefined;

    if (!apiOk || !rpcOk) {
      throw new Error('Backend not fully healthy');
    }

    // Success response
    res.status(200).json({
      status: 'connected',
      timestamp: Date.now(),
      api: {
        status: apiHealth?.status,
        blockNumber: apiHealth?.blockNumber,
        chainId: apiHealth?.chainId,
      },
      rpc: {
        status: 'connected',
        blockNumber: parseInt(rpcBlock?.result || '0', 16),
      },
    });
  } catch (error: unknown) {
  const message = error instanceof Error
    ? error.message
    : 'Backend connection failed';

  console.error('Health check error:', message);

    // Error response
    res.status(503).json({
      status: 'offline',
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Backend connection failed',
    });
  }
}
