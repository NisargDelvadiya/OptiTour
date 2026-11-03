'use client';

/**
 * @file MinimalControls.jsx
 * @description Floating glassmorphic control dock with accessible tooltips, aria labels, and cursor pointers.
 * Simplified strictly to Optimize, Reset, Randomize, and Clear actions with GSAP entrance.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  Trash2,
} from 'lucide-react';

export default function MinimalControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onClearCities,
  onRandomizeCities,
}) {
  const dockRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        dockRef.current,
        { y: 18, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 }
      );
    }, dockRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={dockRef}
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl sm:rounded-3xl bg-zinc-900/50 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] font-sans"
    >
      {/* Primary Optimization Actions */}
      <div className="flex items-center gap-2">
        {/* Play / Pause Action */}
        {!isRunning ? (
          <button
            onClick={onStart}
            title="Start iterative 2-Opt route optimization"
            aria-label="Start route optimization"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs bg-white text-zinc-950 font-bold hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer shadow-lg shadow-white/5 tracking-wide"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>OPTIMIZE</span>
          </button>
        ) : (
          <button
            onClick={onPause}
            title="Pause route optimization"
            aria-label="Pause route optimization"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-400/10 tracking-wide"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>PAUSE</span>
          </button>
        )}

        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset route to unoptimized initial state"
          aria-label="Reset route"
          className="p-2.5 rounded-xl text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Map Actions: Randomize & Clear */}
      <div className="flex items-center gap-2 justify-end">
        {/* Random Stops */}
        <button
          onClick={() => onRandomizeCities(16)}
          disabled={isRunning}
          title="Generate 16 random delivery stops"
          aria-label="Generate random stops"
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] disabled:opacity-40 transition-all cursor-pointer font-medium hover:scale-105 active:scale-95"
        >
          <Shuffle className="w-3.5 h-3.5 text-zinc-400" />
          <span>Randomize</span>
        </button>

        {/* Clear Map */}
        <button
          onClick={onClearCities}
          disabled={isRunning}
          title="Clear all stops from canvas"
          aria-label="Clear all stops"
          className="p-2.5 rounded-xl text-zinc-400 hover:text-rose-400 bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.06] disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
