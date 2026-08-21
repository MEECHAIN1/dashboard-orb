import React, { useState, useEffect } from 'react';
import { Blocks, ArrowUpRight, Cpu, CheckCircle2, Zap } from 'lucide-react';

interface BlockItem {
  number: number;
  hash: string;
  txCount: number;
  gasUsed: number;
  validator: string;
  timestamp: string;
}

export function LiveBlockStream({ currentHeight }: { currentHeight: number }) {
  const [blocks, setBlocks] = useState<BlockItem[]>([]);

  useEffect(() => {
    if (!currentHeight) return;

    const newBlock: BlockItem = {
      number: currentHeight,
      hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...',
      txCount: Math.floor(Math.random() * 18) + 3,
      gasUsed: Math.floor(21000 + Math.random() * 85000),
      validator: '0xMeeVal' + Math.floor(Math.random() * 90 + 10),
      timestamp: new Date().toLocaleTimeString(),
    };

    setBlocks((prev) => {
      if (prev.some((b) => b.number === newBlock.number)) return prev;
      return [newBlock, ...prev.slice(0, 5)];
    });
  }, [currentHeight]);

  return (
    <div className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-5 text-white shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-lg">
            <Blocks className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
              Live MeeChain Block Ledger Stream
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Autonomous finality & consensus pulse</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          LIVE TICKER
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {blocks.map((block) => (
          <div
            key={block.number}
            className="p-3 bg-[#050505] border border-slate-800 rounded-lg space-y-1.5 text-xs font-mono"
          >
            <div className="flex justify-between items-center">
              <span className="text-indigo-300 font-bold text-xs">#{block.number.toLocaleString()}</span>
              <span className="text-slate-500 text-[10px]">{block.timestamp}</span>
            </div>
            <div className="text-slate-400 flex justify-between text-[11px]">
              <span>Txs:</span>
              <span className="text-slate-200">{block.txCount} txs</span>
            </div>
            <div className="text-slate-400 flex justify-between text-[11px]">
              <span>Gas Used:</span>
              <span className="text-amber-300 font-medium">{block.gasUsed.toLocaleString()}</span>
            </div>
            <div className="text-slate-400 flex justify-between pt-1 border-t border-slate-800/80 text-[10px]">
              <span>Validator:</span>
              <span className="text-purple-400">{block.validator}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
