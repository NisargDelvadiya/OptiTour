'use client';

/**
 * @file DispatchManifest.jsx
 * @description Turn-by-turn route dispatch manifest with animated leg expansion.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { calculateTourLegs } from '../algorithms/distance';

export default function DispatchManifest({
  cities = [],
  tour = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef(null);
  const legs = calculateTourLegs(tour, cities);

  // Calculate cumulative ETA without mutating outer variables
  const legsWithEta = legs.reduce((acc, leg) => {
    const prevCumulative = acc.length > 0 ? acc[acc.length - 1].cumulativeTimeMins : 0;
    const cumulativeTimeMins = prevCumulative + leg.timeMins;
    const hours = Math.floor(cumulativeTimeMins / 60);
    const mins = cumulativeTimeMins % 60;
    const etaFormatted = hours > 0 ? `+${hours}h ${mins}m` : `+${mins}m`;
    acc.push({
      ...leg,
      cumulativeTimeMins,
      etaFormatted,
    });
    return acc;
  }, []);

  // Animate manifest rows with GSAP on open
  useEffect(() => {
    if (isOpen && listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.03, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-zinc-900/45 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] font-sans transition-all">
      {/* Header Bar */}
      <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          title={isOpen ? 'Collapse dispatch manifest table' : 'Expand dispatch manifest table'}
          aria-label={isOpen ? 'Collapse manifest' : 'Expand manifest'}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
              Route Schedule & Manifest
            </span>
            <span className="text-[10px] text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
              {cities.length} stops
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
          )}
        </button>
      </div>

      {/* Expandable Manifest List */}
      {isOpen && (
        <div
          ref={listRef}
          className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-white/[0.06] pt-3 max-h-[300px] overflow-y-auto space-y-1.5 custom-scrollbar"
        >
          {legsWithEta.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-xs">
              {"// Place at least 2 stops on the map to display manifest"}
            </div>
          ) : (
            legsWithEta.map((leg) => (
              <div
                key={leg.legIndex}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-white/[0.06] text-zinc-400 text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
                    {leg.legIndex}
                  </span>
                  <div className="flex items-center gap-1.5 truncate text-zinc-300">
                    <span className="truncate">{leg.from.name}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                    <span className="truncate text-white font-medium">{leg.to.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right text-[11px] flex-shrink-0">
                  <span className="text-zinc-400 font-mono">
                    {leg.distanceKm} km
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 text-[10px]">
                    {leg.etaFormatted}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
