'use client';

/**
 * @file page.js
 * @description Main application entry for OptiTour — Intelligent Route Architecture.
 * Renders the centered floating brand navbar, executive metrics deck, cartographic canvas,
 * minimal control dock, and expandable route manifest.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

import React from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import MinimalStatsHUD from '../components/MinimalStatsHUD';
import MinimalControls from '../components/MinimalControls';
import TSPVisualizerCanvas from '../components/TSPVisualizerCanvas';
import DispatchManifest from '../components/DispatchManifest';
import Footer from '../components/Footer';
import { useRouteOptimizer } from '../hooks/useRouteOptimizer';

export default function Home() {
  const {
    cities,
    isRunning,
    bestTour,
    currentTour,
    bestDistance,
    initialDistance,
    handleStart,
    handlePause,
    handleReset,
    handleAddCity,
    handleMoveCity,
    handleClearCities,
    handleRandomizeCities,
  } = useRouteOptimizer();

  return (
    <div className="relative min-h-screen text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black">
      {/* 
        Full-bleed background image with subtle cinematic blur and grey-tinted atmosphere
      */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <Image
          fill
          priority
          src="/bgm.jpg"
          alt="OptiTour Atmospheric Background"
          className="object-cover scale-105 filter blur-[6px] opacity-65 brightness-90 contrast-105"
        />
        {/* Grey tint overlay for refined grey glassmorphism */}
        <div className="absolute inset-0 bg-zinc-950/45 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-zinc-950/75" />
      </div>

      {/* Centered Floating Island Navbar (Logo & Name Big at Center) */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12 flex flex-col gap-5 sm:gap-6">
        {/* Brand Hero Slogan & Description */}
        <HeroSection />

        {/* Minimalist Metrics Deck */}
        <MinimalStatsHUD
          bestDistance={bestDistance}
          initialDistance={initialDistance}
          citiesCount={cities.length}
        />

        {/* Grey-tinted Glassmorphic Map Canvas */}
        <TSPVisualizerCanvas
          cities={cities}
          bestTour={bestTour}
          currentTour={currentTour}
          onAddCity={handleAddCity}
          onMoveCity={handleMoveCity}
          isRunning={isRunning}
          bestColor="#10b981"
        />

        {/* Floating Minimalist Control Dock */}
        <MinimalControls
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onClearCities={handleClearCities}
          onRandomizeCities={handleRandomizeCities}
        />

        {/* Expandable Turn-by-Turn Manifest */}
        <DispatchManifest
          cities={cities}
          tour={bestTour}
        />
      </main>

      {/* Minimalist Branded Footer */}
      <Footer />
    </div>
  );
}
