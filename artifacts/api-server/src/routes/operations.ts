import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";

const router: IRouter = Router();
let chaosMode = false;
let blockHeight = 18492040;
let totalRequests = 142850;
let energy = 88.5;
let frequency = 432;
let lastPulse = new Date().toISOString();

setInterval(() => {
  if (!chaosMode) {
    blockHeight += 1;
    totalRequests += Math.floor(Math.random() * 8) + 1;
    energy = Math.min(100, Math.max(40, energy + Math.random() * 4 - 2));
    frequency = Number((432 + Math.sin(Date.now() / 5000) * 8).toFixed(2));
  }
}, 3000);

function randomHex(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

function checkChaos(req: Request, res: Response, next: NextFunction) {
  if (chaosMode && !req.path.includes("/chaos")) {
    res.status(503).json({
      error: "Backend Service Temporarily Unavailable (Chaos Mode Active)",
      statusCode: 503,
      timestamp: new Date().toISOString(),
      recommendation: "Verify client auto-retry backoff and error boundary resilience",
    });
    return;
  }
  next();
}

router.get("/health", checkChaos, (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: "2.4.0-prod",
    environment: process.env.NODE_ENV || "production",
    vm: { provider: "Azure VM", region: "Southeast Asia (Singapore)", cpuLoadPercent: Number((12 + Math.random() * 8).toFixed(1)), memoryUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), memoryTotalMb: 4096 },
    services: { nginx: "online", apiGateway: "online", anvilNode: "online", rpcProxy: "online" },
  });
});

router.get("/stats", checkChaos, (_req, res) => {
  const seconds = process.uptime();
  res.json({
    node: { status: "online", blockHeight, chainId: 33101, chainName: "MeeChain Mainnet", uptimeFormatted: `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m ${Math.floor(seconds % 60)}s`, peerCount: 48, syncProgress: 100, lastBlockHash: `0x${randomHex(64)}` },
    api: { status: "online", latencyMs: Math.floor(18 + Math.random() * 15), requestsPerMinute: 1240 + Math.floor(Math.random() * 150), totalRequests, errorRatePercent: Number((0.02 + Math.random() * 0.05).toFixed(3)), cacheHitRatio: 94.8, activeSockets: 312 },
    rpc: { status: "online", blockHeight, latencyMs: Math.floor(24 + Math.random() * 20), upstreamUrl: "https://rpc.meechain.live", gasPriceGwei: Number((1.2 + Math.random() * 0.4).toFixed(2)), tps: Number((42.5 + Math.random() * 15).toFixed(1)), pendingTransactions: Math.floor(12 + Math.random() * 25) },
    updatedAt: new Date().toISOString(),
    chaosModeActive: chaosMode,
  });
});

router.get("/magic/orb", checkChaos, (_req, res) => {
  res.json({
    resonanceFrequency: frequency,
    energyLevel: Number(energy.toFixed(1)),
    harmonicState: energy > 80 ? "Resonant" : energy > 60 ? "Stable" : "Supercharging",
    coherenceIndex: Number((0.96 + Math.random() * 0.035).toFixed(4)),
    entropyHash: `0x${randomHex(32)}`,
    activeNodesConnected: 128,
    lastPulseTime: lastPulse,
    contractVerified: true,
    rawPayload: { pulseId: `pls_${Math.random().toString(36).slice(2, 11)}`, orbVersion: "v2.1-genesis-bridge", quantumState: "COHERENT_HARMONIC_MATRIX", signature: `0x3a9f1b...${Math.random().toString(16).slice(2, 10)}` },
  });
});

router.post("/magic/orb/resonate", checkChaos, (_req, res) => {
  lastPulse = new Date().toISOString();
  energy = Math.min(100, energy + 8);
  frequency = Number((frequency + Math.random() * 4 - 2).toFixed(2));
  res.json({ success: true, message: "Orb resonance pulse successfully transmitted across MeeChain nodes", timestamp: lastPulse, newEnergy: Number(energy.toFixed(1)), newFrequency: frequency });
});

router.post("/rpc", checkChaos, (req, res) => {
  const { jsonrpc, id, method } = req.body || {};
  if (!method) {
    res.status(400).json({ jsonrpc: "2.0", id: id || null, error: { code: -32600, message: "Invalid Request: method is missing" } });
    return;
  }
  const result = method === "eth_blockNumber" ? `0x${blockHeight.toString(16)}` : method === "eth_chainId" ? "0x815d" : method === "net_version" ? "33101" : method === "eth_gasPrice" ? "0x59682f00" : method === "eth_syncing" ? false : "0x1";
  res.json({ jsonrpc: jsonrpc || "2.0", id: id ?? 1, result });
});

router.get("/control-plane/comports", checkChaos, (_req, res) => {
  res.json({ ports: [
    { id: "cp_1", name: "Azure Primary Backbone", port: "/dev/ttyUSB0 (Virtual Serial)", baudRate: 115200, status: "connected", deviceType: "Azure VM Bridge", packetsTransferred: 984210, lastPing: new Date().toISOString() },
    { id: "cp_2", name: "Anvil Testnet Node Bridge", port: "TCP/8545 Bridge", baudRate: 921600, status: "connected", deviceType: "Anvil Local Core", packetsTransferred: 482100, lastPing: new Date().toISOString() },
    { id: "cp_3", name: "Vercel Edge Gateway", port: "HTTPS WebSocket Tunnel", baudRate: 1000000, status: "transmitting", deviceType: "Vercel Edge Proxy", packetsTransferred: 1845920, lastPing: new Date().toISOString() },
    { id: "cp_4", name: "Hardware Security Module (HSM)", port: "/dev/ttyACM0", baudRate: 57600, status: "idle", deviceType: "Hardware Secure Module", packetsTransferred: 14209, lastPing: new Date().toISOString() },
  ] });
});

router.post("/control-plane/chaos", (req, res) => {
  chaosMode = req.body?.enabled === undefined ? !chaosMode : Boolean(req.body.enabled);
  res.json({ chaosModeActive: chaosMode, message: chaosMode ? "Chaos mode enabled" : "Chaos mode disabled" });
});

export default router;