'use client';

/**
 * @file HeroSection.jsx
 * @description Premium glassmorphic Hero section powered by GSAP entrance choreography,
 * staggered typography reveals, and interactive micro-animations.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Sparkles, Route, ShieldCheck, Zap } from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef(null);
  const pillRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const badgesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Choreographed GSAP entrance sequence
      tl.fromTo(
        pillRef.current,
        { y: -24, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 }
      )
        .fromTo(
          headingRef.current,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85 },
          '-=0.35'
        )
        .fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          '-=0.45'
        )
        .fromTo(
          badgesRef.current.children,
          { y: 16, opacity: 0, scale: 0.92 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.5)' },
          '-=0.35'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="text-center pt-2 sm:pt-4 pb-2 px-2 flex flex-col items-center select-none">
      {/* Top Innovation Pill */}
      <div
        ref={pillRef}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl text-[11px] font-medium text-zinc-300 shadow-sm mb-4 transition-all duration-300 hover:border-emerald-400/30 hover:bg-white/[0.07] cursor-default"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span className="tracking-wide">Autonomous Fleet Route Intelligence</span>
      </div>

      {/* Hero Headline / Slogan */}
      <h1
        ref={headingRef}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display max-w-3xl leading-[1.18] sm:leading-[1.15]"
      >
        Untangling Complexity.
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-zinc-200 to-white">
          Finding The Shortest Path.
        </span>
      </h1>

      {/* Slogan Description */}
      <p
        ref={descRef}
        className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-sans"
      >
        OptiTour solves the Travelling Salesperson Problem in real time using 2-Opt local search heuristics. Designed for commercial dispatch in Jaipur—slashing transit hours, fuel expenses, and carbon emissions.
      </p>

      {/* Value Proposition Pills */}
      <div
        ref={badgesRef}
        className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mt-4 text-[11px] text-zinc-400"
      >
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900/40 border border-white/[0.06] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-white/[0.15]">
          <Route className="w-3 h-3 text-emerald-400" />
          <span>2-Opt Edge Inversion</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900/40 border border-white/[0.06] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-white/[0.15]">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Fuel Economics (₹)</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900/40 border border-white/[0.06] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-white/[0.15]">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span>Carbon Abatement</span>
        </div>
      </div>
    </section>
  );
}
