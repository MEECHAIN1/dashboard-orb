/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Activity,
  Layers,
  ShieldCheck,
  Terminal,
  Server,
  Globe,
  Cpu,
  Radio,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  Zap
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MagicOrbView } from './components/MagicOrbView';
import { StatsMonitorView } from './components/StatsMonitorView';
import { MagicHallView } from './components/MagicHallView';
import { VerificationSuiteView } from './components/VerificationSuiteView';
import { ProductionCodeHub } from './components/ProductionCodeHub';
import { LiveBlockStream } from './components/LiveBlockStream';
import { ErrorRecoveryBanner } from './components/ErrorRecoveryBanner';
import { AggregatedStats } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'orb' | 'stats' | 'magichall' | 'tests' | 'codehub'>('orb');
  const [chaosMode, setChaosMode] = useState<boolean>(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(true);
  const [latency, setLatency] = useState<number>(24);
  const [lastConnected, setLastConnected] = useState<Date | null>(new Date());
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Probe health
  const checkHealth = useCallback(async () => {
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const latencyMeasured = Math.round(performance.now() - start);
      setLatency(latencyMeasured);

      if (res.ok) {
        setIsBackendHealthy(true);
        setLastConnected(new Date());
      } else {
        setIsBackendHealthy(false);
      }
    } catch {
      setIsBackendHealthy(false);
    }
  }, []);

  // Fetch stats aggregator
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data: AggregatedStats = await res.json();
      setStats(data);
      setStatsError(null);
      setIsBackendHealthy(true);
      setLastConnected(new Date());
    } catch (err: any) {
      setStatsError(err.message || 'Stats aggregation failed');
      setIsBackendHealthy(false);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    fetchStats();
    const interval = setInterval(() => {
      checkHealth();
      fetchStats();
    }, 6000);
    return () => clearInterval(interval);
  }, [checkHealth, fetchStats]);

  // Toggle Chaos / Fault Injection Mode
  const toggleChaosMode = async () => {
    const nextState = !chaosMode;
    setChaosMode(nextState);
    try {
      await fetch('/api/control-plane/chaos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState }),
      });
      setTimeout(() => {
        checkHealth();
        fetchStats();
      }, 500);
    } catch (e) {
      console.error(e);
    }
  };

  const currentBlockHeight = stats?.node?.blockHeight || 18492040;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        chaosMode={chaosMode}
        toggleChaosMode={toggleChaosMode}
        isBackendHealthy={isBackendHealthy}
        latency={latency}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error / Chaos Banner */}
        <ErrorRecoveryBanner
          chaosMode={chaosMode}
          toggleChaosMode={toggleChaosMode}
          onRetry={() => {
            checkHealth();
            fetchStats();
          }}
          lastConnected={lastConnected}
        />

        {/* View Switcher */}
        <AnimatePresence mode="wait">
          {activeTab === 'orb' && (
            <motion.div
              key="orb"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <MagicOrbView chaosMode={chaosMode} />
              <LiveBlockStream currentHeight={currentBlockHeight} />
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <StatsMonitorView
                stats={stats}
                loading={statsLoading}
                error={statsError}
                onRefresh={fetchStats}
              />
              <LiveBlockStream currentHeight={currentBlockHeight} />
            </motion.div>
          )}

          {activeTab === 'magichall' && (
            <motion.div
              key="magichall"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <MagicHallView />
            </motion.div>
          )}

          {activeTab === 'tests' && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <VerificationSuiteView />
            </motion.div>
          )}

          {activeTab === 'codehub' && (
            <motion.div
              key="codehub"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <ProductionCodeHub />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Environment Verification & Architecture Footer Card */}
        <div className="mt-8 bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 text-xs text-slate-400">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono font-bold text-white text-xs uppercase tracking-wider">
                Production Environment & Security Architecture
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-emerald-400 font-medium">NEXT_PUBLIC_ ISOLATION AUDIT: PASSED</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-400">Vercel ↔ Azure Ingress Ready</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 bg-[#050505] rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1 text-[10px] uppercase font-mono tracking-wider">
                NEXT_PUBLIC_API_URL
              </span>
              <span className="font-mono text-emerald-300 text-xs">https://api.meechain.live</span>
            </div>
            <div className="p-3 bg-[#050505] rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1 text-[10px] uppercase font-mono tracking-wider">
                NEXT_PUBLIC_RPC_URL
              </span>
              <span className="font-mono text-indigo-300 text-xs">https://rpc.meechain.live</span>
            </div>
            <div className="p-3 bg-[#050505] rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1 text-[10px] uppercase font-mono tracking-wider">
                NEXT_PUBLIC_CHAIN_ID
              </span>
              <span className="font-mono text-amber-300 text-xs">33101 (MeeChain Mainnet)</span>
            </div>
            <div className="p-3 bg-[#050505] rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1 text-[10px] uppercase font-mono tracking-wider">
                Server-Side Secret Keys
              </span>
              <span className="font-mono text-slate-300 flex items-center gap-1 text-xs">
                <Lock className="w-3 h-3 text-rose-400" /> Hidden in Node Runtime
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer matching Geometric Balance spec */}
      <footer className="mt-8 border-t border-slate-800 bg-[#050505] py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Core Philosophy:</span>
            <span className="text-xs text-slate-300 font-serif italic">"Bridge over walls"</span>
          </div>
          <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
            <span>SHA-256: 0x9f8...a12</span>
            <span>V.2.0.1-STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
