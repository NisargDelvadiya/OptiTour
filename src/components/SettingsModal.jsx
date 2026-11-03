'use client';

import React from 'react';
import { X, SlidersHorizontal, RotateCcw, Cpu, Zap, Network } from 'lucide-react';

/**
 * @file SettingsModal.jsx
 * @description Dialog for configuring Hill Climbing heuristics with accessible tooltips and real-world logistics context.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */
export default function SettingsModal({
  isOpen,
  onClose,
  hcParams,
  setHcParams,
  isRunning,
}) {
  if (!isOpen) return null;

  const resetToDefaults = () => {
    setHcParams({
      operator: '2opt',
      strategy: 'steepest',
      sampleNeighbors: 50,
      maxPatienceBeforeRestart: 40,
      startWithGreedy: false,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-zinc-900/95 border border-white/[0.1] shadow-2xl p-4 sm:p-6 text-slate-100 flex flex-col gap-4 font-sans max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 id="settings-modal-title" className="text-sm font-semibold text-white">
                Dispatch Heuristic Parameters
              </h3>
              <p className="text-[11px] text-zinc-400">
                Configure neighborhood search & optimization policy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close parameters dialog"
            aria-label="Close parameters dialog"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 text-xs">
          {/* Operator */}
          <div>
            <label htmlFor="select-operator" className="block text-zinc-300 font-medium mb-1.5">
              Neighborhood Move Operator
            </label>
            <select
              id="select-operator"
              value={hcParams.operator}
              disabled={isRunning}
              title="Select neighborhood mutation operator"
              aria-label="Select neighborhood mutation operator"
              onChange={(e) => setHcParams({ ...hcParams, operator: e.target.value })}
              className="w-full bg-slate-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            >
              <option value="2opt">2-Opt Edge Inversion (Untangles crossing routes - Recommended)</option>
              <option value="swap">Stop Point Swap (Simple node permutation)</option>
            </select>
            <p className="text-[10px] text-zinc-500 mt-1">
              2-Opt reverses subsegments of the tour to eliminate intersecting route paths.
            </p>
          </div>

          {/* Strategy */}
          <div>
            <label htmlFor="select-strategy" className="block text-zinc-300 font-medium mb-1.5">
              Local Search Strategy
            </label>
            <select
              id="select-strategy"
              value={hcParams.strategy}
              disabled={isRunning}
              title="Select search heuristic strategy"
              aria-label="Select search heuristic strategy"
              onChange={(e) => setHcParams({ ...hcParams, strategy: e.target.value })}
              className="w-full bg-slate-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            >
              <option value="steepest">Steepest Ascent (Evaluates sample & picks biggest shortcut)</option>
              <option value="random_restart">Random-Restart (Escapes local dead-ends when plateaued)</option>
              <option value="first_choice">First-Choice (Accepts immediate improvement found)</option>
            </select>
          </div>

          {/* Neighbor Exploration */}
          <div>
            <div className="flex justify-between text-zinc-300 mb-1.5 font-medium">
              <label htmlFor="range-neighbors">Neighbors Sampled Per Cycle</label>
              <span className="font-mono text-amber-400 font-bold">{hcParams.sampleNeighbors}</span>
            </div>
            <input
              id="range-neighbors"
              type="range"
              min={10}
              max={120}
              step={10}
              value={hcParams.sampleNeighbors}
              disabled={isRunning}
              title={`Sample size: ${hcParams.sampleNeighbors} neighbors`}
              aria-label="Neighbor exploration sample size"
              onChange={(e) => setHcParams({ ...hcParams, sampleNeighbors: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              Higher sample sizes improve shortcut accuracy per iteration at minor CPU cost.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs">
          <button
            onClick={resetToDefaults}
            disabled={isRunning}
            title="Reset to default heuristic parameters"
            aria-label="Reset parameters to default"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={onClose}
            title="Save and close dialog"
            aria-label="Close dialog"
            className="px-4 py-2 rounded-xl bg-white text-slate-950 font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
