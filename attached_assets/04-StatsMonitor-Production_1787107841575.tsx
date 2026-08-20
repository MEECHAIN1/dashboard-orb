// pages/components/StatsMonitor.tsx
// Production-ready StatsMonitor component using real data

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface StatsData {
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

interface StatsState {
  loading: boolean;
  data: StatsData | null;
  error: string | null;
  lastUpdate: number | null;
}

export default function StatsMonitor() {
  const [state, setState] = useState<StatsState>({
    loading: true,
    data: null,
    error: null,
    lastUpdate: null,
  });

  const REFRESH_INTERVAL = 15000; // 15 seconds

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats', {
        timeout: 10000,
      });

      setState({
        loading: false,
        data: response.data,
        error: null,
        lastUpdate: Date.now(),
      });

      console.log('✅ Stats updated:', response.data);
    } catch (err: any) {
      console.error('❌ Stats fetch error:', err.message);

      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to fetch stats',
      }));
    }
  };

  // Fetch stats on mount and set up polling
  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Format time
  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // Format latency
  const formatLatency = (ms: number) => {
    return `${Math.round(ms)}ms`;
  };

  if (state.loading && !state.data) {
    return (
      <div className="bg-gradient-to-br from-purple-900/50 to-black/50 border border-purple-500/30 rounded-lg p-8 text-center">
        <div className="animate-spin text-4xl mb-4">📊</div>
        <p className="text-gray-400">Loading system stats...</p>
      </div>
    );
  }

  if (state.error && !state.data) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-8">
        <p className="text-red-400 mb-4">Error loading stats: {state.error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!state.data) {
    return null;
  }

  const data = state.data;

  return (
    <div className="space-y-6">
      {/* Node Stats */}
      <div className="bg-gradient-to-br from-purple-900/50 to-black/50 border border-purple-500/30 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-400 mb-6">
          ⛓️ Node Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Status</p>
            <p className="text-xl font-bold">{data.node.status}</p>
          </div>

          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Block Height</p>
            <p className="text-xl font-bold text-green-400">#{data.node.blockHeight}</p>
          </div>

          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Chain ID</p>
            <p className="text-xl font-bold text-blue-400">{data.node.chainId}</p>
          </div>

          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Uptime</p>
            <p className="text-xl font-bold">{data.node.uptime || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* API Stats */}
      <div className="bg-gradient-to-br from-purple-900/50 to-black/50 border border-purple-500/30 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
          🌐 API Gateway
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Status</p>
            <p className="text-xl font-bold">{data.api.status}</p>
          </div>

          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Latency</p>
            <p className="text-xl font-bold text-yellow-400">
              {formatLatency(data.api.latency)}
            </p>
          </div>

          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Requests</p>
            <p className="text-xl font-bold">{data.api.requests || '0'}</p>
          </div>

          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Error Rate</p>
            <p className="text-xl font-bold">{data.api.errorRate || '0'}%</p>
          </div>
        </div>
      </div>

      {/* RPC Stats */}
      <div className="bg-gradient-to-br from-purple-900/50 to-black/50 border border-purple-500/30 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-6">
          📡 RPC Endpoint
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Status</p>
            <p className="text-xl font-bold">{data.rpc.status}</p>
          </div>

          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Block Height</p>
            <p className="text-xl font-bold text-green-400">#{data.rpc.blockHeight}</p>
          </div>

          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Latency</p>
            <p className="text-xl font-bold text-yellow-400">
              {formatLatency(data.rpc.latency)}
            </p>
          </div>

          <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Endpoint</p>
            <p className="text-xs font-mono text-blue-300 truncate">
              {data.rpc.upstream}
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {data.errors && data.errors.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-6">
          <h4 className="text-yellow-400 font-bold mb-3">⚠️ Warnings</h4>
          <ul className="space-y-2">
            {data.errors.map((err, idx) => (
              <li key={idx} className="text-yellow-300 text-sm">
                • {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center bg-black/30 border border-purple-500/20 rounded-lg p-4">
        <p className="text-gray-400 text-sm">
          Last updated: {formatTime(state.lastUpdate)}
        </p>
        <button
          onClick={fetchStats}
          disabled={state.loading}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-500 hover:to-green-500 disabled:opacity-50 text-white font-medium rounded transition text-sm"
        >
          {state.loading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>
    </div>
  );
}
