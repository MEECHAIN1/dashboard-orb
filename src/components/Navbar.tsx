import React from 'react';
import {
  Sparkles,
  Activity,
  ShieldCheck,
  Cpu,
  Terminal,
  Layers,
  Radio,
  AlertOctagon,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'orb' | 'stats' | 'magichall' | 'tests' | 'codehub';
  setActiveTab: (tab: 'orb' | 'stats' | 'magichall' | 'tests' | 'codehub') => void;
  chaosMode: boolean;
  toggleChaosMode: () => void;
  isBackendHealthy: boolean;
  latency: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  chaosMode,
  toggleChaosMode,
  isBackendHealthy,
  latency,
}: NavbarProps) {
  return (
    <header className="border-b border-slate-800 bg-[#050505] sticky top-0 z-50">
      {/* Top Geometric Ticker Bar */}
      <div className="border-b border-slate-800/80 bg-[#080808] px-4 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <div className={`w-1.5 h-1.5 rounded-full ${isBackendHealthy && !chaosMode ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400">
              {isBackendHealthy && !chaosMode ? 'SYSTEM LIVE' : 'SYSTEM DEGRADED'}
            </span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-400 font-serif italic text-xs hidden md:inline">
            "Bridge over walls — decentralized balance without a singular center" 🌱
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Chaos / Fault-Injection switch */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">Fault Test:</span>
            <button
              onClick={toggleChaosMode}
              className={`text-[10px] font-mono px-2 py-0.5 rounded border transition flex items-center gap-1 ${
                chaosMode
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'bg-[#0a0a0a] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle simulated 503 outage"
            >
              {chaosMode ? (
                <>
                  <AlertOctagon className="w-2.5 h-2.5 text-rose-400 animate-spin" />
                  503 ACTIVE
                </>
              ) : (
                'INJECT 503'
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">Deployed via</span>
              <span className="text-[11px] font-mono text-white leading-tight">Vercel Edge</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.8)]" />
          </div>
        </div>
      </div>

      {/* Main Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Mark */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <span className="text-white font-bold text-xl font-mono">M</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white font-bold tracking-tight text-lg sm:text-xl">
                  MEECHAIN <span className="text-indigo-400 font-normal">DASHBOARD</span>
                </h1>
                <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono">
                  v2.0.1
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">
                Phase 2: Production Verified
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Geometric Segments */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0a0a0a] border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('orb')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                activeTab === 'orb'
                  ? 'bg-indigo-600/90 text-white border border-indigo-400/30 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121212]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              MAGIC ORB
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                activeTab === 'stats'
                  ? 'bg-emerald-600/90 text-white border border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121212]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              STATS MONITOR
            </button>

            <button
              onClick={() => setActiveTab('magichall')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                activeTab === 'magichall'
                  ? 'bg-purple-600/90 text-white border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121212]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              COMPORT HALL
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                activeTab === 'tests'
                  ? 'bg-cyan-600/90 text-white border border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121212]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              E2E VERIFICATION
            </button>

            <button
              onClick={() => setActiveTab('codehub')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                activeTab === 'codehub'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121212]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-slate-300" />
              8 PROD FILES
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Pills */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 mt-2 border-t border-slate-800/60 scrollbar-none">
          {[
            { id: 'orb', label: 'MAGIC ORB' },
            { id: 'stats', label: 'STATS MONITOR' },
            { id: 'magichall', label: 'COMPORT HALL' },
            { id: 'tests', label: 'E2E TESTS' },
            { id: 'codehub', label: '8 FILES' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 text-[11px] font-mono rounded-lg whitespace-nowrap border transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-[#0a0a0a] text-slate-400 border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
