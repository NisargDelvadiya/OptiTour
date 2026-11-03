'use client';

/**
 * @file MinimalStatsHUD.jsx
 * @description Minimalist Glassmorphic Metrics Deck displaying Distance in km, Drive Time,
 * Fuel Expense in Indian Rupees (₹), and Carbon emissions, enhanced with GSAP entrance
 * and reactive value animations.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Gauge,
  Clock,
  Fuel,
  Leaf,
  ArrowDownRight,
} from 'lucide-react';
import { computeLogisticsMetrics, roundDistance } from '../algorithms/distance';

export default function MinimalStatsHUD({
  bestDistance,
  initialDistance,
  citiesCount = 0,
}) {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const distanceValRef = useRef(null);
  const fuelValRef = useRef(null);
  const isFirstRender = useRef(true);

  const currentMetrics = computeLogisticsMetrics(bestDistance);
  const initialMetrics = computeLogisticsMetrics(initialDistance);

  const roundedBest = bestDistance && bestDistance !== Infinity ? roundDistance(bestDistance) : 0;
  const roundedInitial = initialDistance && initialDistance !== Infinity ? roundDistance(initialDistance) : 0;

  const percentageImprovement =
    roundedInitial > 0 && roundedBest > 0 && roundedBest < roundedInitial
      ? roundDistance(((roundedInitial - roundedBest) / roundedInitial) * 100)
      : 0;

  const fuelSavingsINR =
    initialMetrics.fuelCostINR > currentMetrics.fuelCostINR
      ? roundDistance(initialMetrics.fuelCostINR - currentMetrics.fuelCostINR)
      : 0;

  const co2AvoidedKg =
    initialMetrics.co2EmissionsKg > currentMetrics.co2EmissionsKg
      ? roundDistance(initialMetrics.co2EmissionsKg - currentMetrics.co2EmissionsKg)
      : 0;

  // Staggered GSAP entrance animation on initial mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 22, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Reactive GSAP value pulse whenever distance improves
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (distanceValRef.current) {
      gsap.fromTo(
        distanceValRef.current,
        { scale: 1.07, color: '#34d399' },
        { scale: 1, color: '#ffffff', duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [bestDistance]);

  return (
    <div
      ref={containerRef}
      className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-zinc-900/45 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] font-sans"
    >
      {/* 4 Essential Metrics */}
      <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Distance (Only km) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold tracking-wider">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-zinc-400" />
              DISTANCE
            </span>
            {percentageImprovement > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                <ArrowDownRight className="w-2.5 h-2.5" />
                {percentageImprovement}%
              </span>
            )}
          </div>
          <div
            ref={distanceValRef}
            className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display tabular-nums inline-block origin-left"
          >
            {roundedBest > 0 ? `${currentMetrics.distanceKm.toFixed(1)} km` : '0.0 km'}
          </div>
          <div className="text-[11px] text-zinc-500">
            Total Stops: <strong className="text-zinc-300 font-semibold">{citiesCount}</strong>
          </div>
        </div>

        {/* Metric 2: Est. Drive Time */}
        <div className="space-y-1">
          <div className="text-[11px] text-zinc-400 font-semibold tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            TRANSIT TIME
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 font-display tabular-nums">
            {currentMetrics.driveTimeFormatted}
          </div>
          <div className="text-[11px] text-zinc-500">
            Fleet avg 42 km/h
          </div>
        </div>

        {/* Metric 3: Fuel Expense in Indian Rupees (₹) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold tracking-wider">
            <span className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-zinc-400" />
              EST. FUEL
            </span>
            {fuelSavingsINR > 0 && (
              <span className="text-[10px] font-semibold text-emerald-400 font-mono">
                saved ₹{Math.round(fuelSavingsINR).toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div
            ref={fuelValRef}
            className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 font-display tabular-nums inline-block origin-left"
          >
            ₹{Math.round(currentMetrics.fuelCostINR).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-zinc-500">
            ~{currentMetrics.fuelLiters.toFixed(1)} L consumption
          </div>
        </div>

        {/* Metric 4: Carbon Footprint */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold tracking-wider">
            <span className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-zinc-400" />
              EMISSIONS
            </span>
            {co2AvoidedKg > 0 && (
              <span className="text-[10px] font-semibold text-emerald-400 font-mono">
                -{co2AvoidedKg.toFixed(1)} kg
              </span>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 font-display tabular-nums">
            {currentMetrics.co2EmissionsKg.toFixed(1)} kg
          </div>
          <div className="text-[11px] text-zinc-500">
            Carbon footprint
          </div>
        </div>
      </div>
    </div>
  );
}
