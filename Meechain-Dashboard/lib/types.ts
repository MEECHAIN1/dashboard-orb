export interface NodeHealth {
  status: 'healthy' | 'degraded' | 'offline';
  timestamp: string;
  uptimeSeconds: number;
  version: string;
  environment: string;
  vm: {
    provider: 'Azure VM';
    region: string;
    cpuLoadPercent: number;
    memoryUsedMb: number;
    memoryTotalMb: number;
  };
  services: {
    nginx: 'online' | 'offline';
    apiGateway: 'online' | 'offline';
    anvilNode: 'online' | 'offline';
    rpcProxy: 'online' | 'offline';
  };
}

export interface NodeStats {
  status: 'online' | 'offline' | 'syncing';
  blockHeight: number;
  chainId: number;
  chainName: string;
  uptimeFormatted: string;
  peerCount: number;
  syncProgress: number; // 0 - 100
  lastBlockHash: string;
}

export interface ApiStats {
  status: 'online' | 'offline' | 'degraded';
  latencyMs: number;
  requestsPerMinute: number;
  totalRequests: number;
  errorRatePercent: number;
  cacheHitRatio: number;
  activeSockets: number;
}

export interface RpcStats {
  status: 'online' | 'offline' | 'degraded';
  blockHeight: number;
  latencyMs: number;
  upstreamUrl: string;
  gasPriceGwei: number;
  tps: number;
  pendingTransactions: number;
}

export interface AggregatedStats {
  node: NodeStats;
  api: ApiStats;
  rpc: RpcStats;
  updatedAt: string;
  chaosModeActive: boolean;
}

export interface MagicOrbPayload {
  resonanceFrequency: number;
  energyLevel: number; // 0 - 100
  harmonicState: 'Stable' | 'Supercharging' | 'Resonant' | 'Calibrating';
  coherenceIndex: number;
  entropyHash: string;
  activeNodesConnected: number;
  lastPulseTime: string;
  contractVerified: boolean;
  rawPayload: {
    pulseId: string;
    orbVersion: string;
    quantumState: string;
    signature: string;
  };
}

export interface ComPortBridgeItem {
  id: string;
  name: string;
  port: string;
  baudRate: number;
  status: 'connected' | 'transmitting' | 'idle' | 'disconnected';
  deviceType: 'Azure VM Bridge' | 'Anvil Local Core' | 'Vercel Edge Proxy' | 'Hardware Secure Module' | 'IoT Sensor Gateway';
  packetsTransferred: number;
  lastPing: string;
}

export interface TestItem {
  id: string;
  name: string;
  suite: 'Playwright E2E' | 'Cypress Integration' | 'API Contract' | 'CORS & Security';
  status: 'passed' | 'failed' | 'running' | 'pending';
  durationMs: number;
  error?: string;
  details: string;
}
