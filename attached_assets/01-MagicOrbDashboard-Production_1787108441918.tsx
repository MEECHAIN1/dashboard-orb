// pages/components/MagicOrbDashboard.tsx
// Production-ready MagicOrb with error handling, loading state, and retry logic

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface OrbData {
  chainEnergy?: {
    status: string;
    label: string;
    detail: string;
  };
  rpcSpirit?: {
    status: string;
    label: string;
    detail: string;
  };
  treasuryAura?: {
    status: string;
    label: string;
    detail: string;
  };
  validatorForce?: {
    status: string;
    label: string;
    detail: string;
  };
}

interface MagicOrbState {
  status: 'loading' | 'connected' | 'offline';
  data: OrbData | null;
  error: string | null;
  lastUpdate: number | null;
  retryCount: number;
  maxRetries: number;
}

export default function MagicOrbDashboard() {
  const [state, setState] = useState<MagicOrbState>({
    status: 'loading',
    data: null,
    error: null,
    lastUpdate: null,
    retryCount: 0,
    maxRetries: 3,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const RETRY_DELAY = 2000; // 2 seconds
  const REFRESH_INTERVAL = 10000; // 10 seconds

  // Main fetch function with retry logic
  const fetchOrbData = useCallback(async (retryAttempt = 0) => {
    try {
      setState(prev => ({
        ...prev,
        status: 'loading',
        error: null,
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await axios.get(
        `${API_URL}/api/magic/orb`,
        {
          signal: controller.signal,
          timeout: 10000,
        }
      );

      clearTimeout(timeoutId);

      // Verify response structure
      if (!response.data?.result) {
        throw new Error('Invalid response structure from API');
      }

      setState({
        status: 'connected',
        data: response.data.result,
        error: null,
        lastUpdate: Date.now(),
        retryCount: 0,
        maxRetries: 3,
      });

      console.log('✅ MagicOrb connected:', response.data.result);
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown error';
      console.error('❌ MagicOrb error:', errorMessage);

      // Retry logic
      if (retryAttempt < state.maxRetries) {
        console.log(`🔄 Retry attempt ${retryAttempt + 1}/${state.maxRetries}`);
        setState(prev => ({
          ...prev,
          retryCount: retryAttempt + 1,
          status: 'loading',
        }));

        // Schedule retry
        setTimeout(() => {
          fetchOrbData(retryAttempt + 1);
        }, RETRY_DELAY * (retryAttempt + 1)); // Exponential backoff
      } else {
        // Max retries exceeded
        setState({
          status: 'offline',
          data: null,
          error: `Backend Offline — ${errorMessage}`,
          lastUpdate: state.lastUpdate,
          retryCount: retryAttempt,
          maxRetries: 3,
        });
      }
    }
  }, [API_URL, state.maxRetries]);

  // Initial fetch and polling
  useEffect(() => {
    fetchOrbData();

    // Set up polling interval
    const interval = setInterval(() => {
      fetchOrbData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchOrbData]);

  // Format timestamp
  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // Loading state
  if (state.status === 'loading' && !state.data) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="inline-block animate-spin text-6xl mb-4">🔮</div>
        <p className="text-gray-400 text-lg">Loading Magic Orb...</p>
        {state.retryCount > 0 && (
          <p className="text-yellow-400 text-sm mt-2">
            Retry attempt {state.retryCount}/{state.maxRetries}
          </p>
        )}
      </div>
    );
  }

  // Offline state
  if (state.status === 'offline') {
    return (
      <div className="col-span-full">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🔴</div>
          <h3 className="text-red-400 text-xl font-bold mb-2">Backend Offline</h3>
          <p className="text-red-300 mb-4">{state.error}</p>
          {state.lastUpdate && (
            <p className="text-gray-400 text-sm mb-6">
              Last connected: {formatTime(state.lastUpdate)}
            </p>
          )}
          <button
            onClick={() => {
              setState(prev => ({
                ...prev,
                retryCount: 0,
              }));
              fetchOrbData(0);
            }}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
          >
            🔄 Retry Now
          </button>
        </div>
      </div>
    );
  }

  // Connected state - show orb cards
  const orbCards = [
    {
      key: 'chainEnergy',
      icon: '⛓️',
      label: 'Chain Energy',
      defaultStatus: '🟢',
      color: 'green',
    },
    {
      key: 'rpcSpirit',
      icon: '🌐',
      label: 'RPC Spirit',
      defaultStatus: '🟢',
      color: 'green',
    },
    {
      key: 'treasuryAura',
      icon: '💰',
      label: 'Treasury Aura',
      defaultStatus: '⚪',
      color: 'yellow',
    },
    {
      key: 'validatorForce',
      icon: '⚡',
      label: 'Validator Force',
      defaultStatus: '⚪',
      color: 'blue',
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orbCards.map((card) => {
          const cardData = state.data?.[card.key as keyof OrbData];
          const status = (cardData as any)?.status || card.defaultStatus;
          const detail = (cardData as any)?.detail || 'Checking...';

          return (
            <div
              key={card.key}
              className="bg-gradient-to-br from-purple-900/50 to-black/50 border border-purple-500/30 rounded-lg p-6 hover:border-purple-400/50 transition"
            >
              <div className="text-4xl mb-2">{card.icon}</div>
              <h3 className="text-gray-300 text-sm font-medium">{card.label}</h3>
              <div className="mt-4">
                <div className="text-2xl font-bold mb-2">{status}</div>
                <p className="text-gray-400 text-xs">{detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status footer */}
      <div className="mt-8 flex justify-between items-center bg-black/30 border border-purple-500/20 rounded-lg p-4">
        <div className="text-sm">
          <p className="text-green-400 font-medium">🟢 Connected</p>
          <p className="text-gray-400 text-xs mt-1">
            Last update: {formatTime(state.lastUpdate)}
          </p>
        </div>
        <button
          onClick={() => fetchOrbData(0)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-500 hover:to-green-500 text-white font-medium rounded transition text-sm"
        >
          🔄 Refresh
        </button>
      </div>
    </>
  );
}
