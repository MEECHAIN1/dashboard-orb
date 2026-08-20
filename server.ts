import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// State for live simulation & chaos testing
let chaosMode = false;
let blockCounter = 18492040;
let requestCounter = 142850;
let lastPulse = new Date().toISOString();
let energy = 88.5;
let frequency = 432.0;

// Increment block height periodically
setInterval(() => {
  if (!chaosMode) {
    blockCounter += 1;
    requestCounter += Math.floor(Math.random() * 8) + 1;
    energy = Math.min(100, Math.max(40, energy + (Math.random() * 4 - 2)));
    frequency = Number((432.0 + (Math.sin(Date.now() / 5000) * 8)).toFixed(2));
  }
}, 3000);

// Middleware for CORS & custom headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-MeeChain-Client');
  res.header('X-MeeChain-Phase', 'Phase-2-Production-Verified');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Chaos simulator middleware
const checkChaos = (req: Request, res: Response, next: () => void) => {
  if (chaosMode && !req.path.includes('/chaos')) {
    return res.status(503).json({
      error: 'Backend Service Temporarily Unavailable (Chaos Mode Active)',
      statusCode: 503,
      timestamp: new Date().toISOString(),
      recommendation: 'Verify client auto-retry backoff and error boundary resilience',
    });
  }
  next();
};

// 1. Health Check Endpoint
app.get('/api/health', checkChaos, (req: Request, res: Response) => {
  const uptime = process.uptime();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(uptime),
    version: '2.4.0-prod',
    environment: process.env.NODE_ENV || 'production',
    vm: {
      provider: 'Azure VM',
      region: 'Southeast Asia (Singapore)',
      cpuLoadPercent: Number((12 + Math.random() * 8).toFixed(1)),
      memoryUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      memoryTotalMb: 4096,
    },
    services: {
      nginx: 'online',
      apiGateway: 'online',
      anvilNode: 'online',
      rpcProxy: 'online',
    },
  });
});

// 2. Stats Aggregation Endpoint
app.get('/api/stats', checkChaos, (req: Request, res: Response) => {
  const uptimeFormatted = `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m ${Math.floor(process.uptime() % 60)}s`;

  res.json({
    node: {
      status: 'online',
      blockHeight: blockCounter,
      chainId: 33101,
      chainName: 'MeeChain Mainnet',
      uptimeFormatted,
      peerCount: 48,
      syncProgress: 100,
      lastBlockHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    },
    api: {
      status: 'online',
      latencyMs: Math.floor(18 + Math.random() * 15),
      requestsPerMinute: 1240 + Math.floor(Math.random() * 150),
      totalRequests: requestCounter,
      errorRatePercent: Number((0.02 + Math.random() * 0.05).toFixed(3)),
      cacheHitRatio: 94.8,
      activeSockets: 312,
    },
    rpc: {
      status: 'online',
      blockHeight: blockCounter,
      latencyMs: Math.floor(24 + Math.random() * 20),
      upstreamUrl: 'https://rpc.meechain.live',
      gasPriceGwei: Number((1.2 + Math.random() * 0.4).toFixed(2)),
      tps: Number((42.5 + Math.random() * 15).toFixed(1)),
      pendingTransactions: Math.floor(12 + Math.random() * 25),
    },
    updatedAt: new Date().toISOString(),
    chaosModeActive: chaosMode,
  });
});

// 3. Magic Orb Endpoint
app.get('/api/magic/orb', checkChaos, (req: Request, res: Response) => {
  const pulseId = 'pls_' + Math.random().toString(36).substring(2, 11);
  const entropy = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  res.json({
    resonanceFrequency: frequency,
    energyLevel: Number(energy.toFixed(1)),
    harmonicState: energy > 80 ? 'Resonant' : energy > 60 ? 'Stable' : 'Supercharging',
    coherenceIndex: Number((0.96 + Math.random() * 0.035).toFixed(4)),
    entropyHash: entropy,
    activeNodesConnected: 128,
    lastPulseTime: lastPulse,
    contractVerified: true,
    rawPayload: {
      pulseId,
      orbVersion: 'v2.1-genesis-bridge',
      quantumState: 'COHERENT_HARMONIC_MATRIX',
      signature: '0x3a9f1b...' + Math.random().toString(16).substring(2, 10),
    },
  });
});

// POST Magic Orb Resonate (trigger harmonic pulse)
app.post('/api/magic/orb/resonate', checkChaos, (req: Request, res: Response) => {
  lastPulse = new Date().toISOString();
  energy = Math.min(100, energy + 8);
  frequency = Number((frequency + (Math.random() * 4 - 2)).toFixed(2));
  
  res.json({
    success: true,
    message: 'Orb resonance pulse successfully transmitted across MeeChain nodes',
    timestamp: lastPulse,
    newEnergy: Number(energy.toFixed(1)),
    newFrequency: frequency,
  });
});

// 4. JSON-RPC Proxy Endpoint (Ethereum / MeeChain standard)
app.post('/api/rpc', checkChaos, (req: Request, res: Response) => {
  const { jsonrpc, id, method, params } = req.body || {};

  if (!method) {
    return res.status(400).json({
      jsonrpc: '2.0',
      id: id || null,
      error: { code: -32600, message: 'Invalid Request: method is missing' },
    });
  }

  let result: any = null;

  switch (method) {
    case 'eth_blockNumber':
      result = '0x' + blockCounter.toString(16);
      break;
    case 'eth_chainId':
      result = '0x' + (33101).toString(16);
      break;
    case 'net_version':
      result = '33101';
      break;
    case 'eth_gasPrice':
      result = '0x' + Math.floor(1500000000).toString(16); // 1.5 Gwei
      break;
    case 'eth_syncing':
      result = false;
      break;
    case 'eth_getBlockByNumber':
      result = {
        number: '0x' + blockCounter.toString(16),
        hash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        parentHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        timestamp: '0x' + Math.floor(Date.now() / 1000).toString(16),
        transactions: ['0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')],
        gasUsed: '0x5208',
      };
      break;
    case 'meechain_nodeInfo':
      result = {
        name: 'MeeChain Azure Node 01',
        version: 'v2.4.0',
        peers: 48,
        magicHallProtocol: 'v2-ready',
      };
      break;
    default:
      result = '0x1';
  }

  res.json({
    jsonrpc: jsonrpc || '2.0',
    id: id !== undefined ? id : 1,
    result,
  });
});

// 5. ComPort & Magic Hall Hardware Bridge endpoint
app.get('/api/control-plane/comports', checkChaos, (req: Request, res: Response) => {
  res.json({
    ports: [
      {
        id: 'cp_1',
        name: 'Azure Primary Backbone',
        port: '/dev/ttyUSB0 (Virtual Serial)',
        baudRate: 115200,
        status: 'connected',
        deviceType: 'Azure VM Bridge',
        packetsTransferred: 984210,
        lastPing: new Date().toISOString(),
      },
      {
        id: 'cp_2',
        name: 'Anvil Testnet Node Bridge',
        port: 'TCP/8545 Bridge',
        baudRate: 921600,
        status: 'connected',
        deviceType: 'Anvil Local Core',
        packetsTransferred: 482100,
        lastPing: new Date().toISOString(),
      },
      {
        id: 'cp_3',
        name: 'Vercel Edge Gateway',
        port: 'HTTPS WebSocket Tunnel',
        baudRate: 1000000,
        status: 'transmitting',
        deviceType: 'Vercel Edge Proxy',
        packetsTransferred: 1845920,
        lastPing: new Date().toISOString(),
      },
      {
        id: 'cp_4',
        name: 'Hardware Security Module (HSM)',
        port: '/dev/ttyACM0',
        baudRate: 57600,
        status: 'idle',
        deviceType: 'Hardware Secure Module',
        packetsTransferred: 14209,
        lastPing: new Date().toISOString(),
      },
    ],
  });
});

// 6. Chaos switch toggle
app.post('/api/control-plane/chaos', (req: Request, res: Response) => {
  const { enabled } = req.body || {};
  chaosMode = enabled !== undefined ? !!enabled : !chaosMode;
  res.json({
    chaosModeActive: chaosMode,
    message: chaosMode
      ? '🔴 Chaos mode ENABLED: API and stats endpoints will return 503 errors to test UI resilience and retry logic.'
      : '🟢 Chaos mode DISABLED: API restored to normal live operation.',
  });
});

// Start Server & Integrate Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MeeChain Phase 2 Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
