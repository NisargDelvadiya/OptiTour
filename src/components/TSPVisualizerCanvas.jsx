'use client';

/**
 * @file TSPVisualizerCanvas.jsx
 * @description Real-World Fleet Logistics Cartographic Canvas with animated delivery fleet vehicle,
 * High-DPI Retina resolution, geo-coordinates grid, and interactive waypoint inspection.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Truck, Navigation, MapPin, Building, Package, ShieldAlert, Sparkles } from 'lucide-react';

const VIRTUAL_WIDTH = 960;
const VIRTUAL_HEIGHT = 520;

export default function TSPVisualizerCanvas({
  cities = [],
  bestTour = [],
  currentTour = [],
  onAddCity,
  onMoveCity,
  isRunning = false,
  bestColor = '#10b981',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [draggedCityIndex, setDraggedCityIndex] = useState(null);
  const [hoveredCityIndex, setHoveredCityIndex] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 960, height: 520 });

  // Animation vehicle position state (0.0 to 1.0 along the tour)
  const vehicleProgressRef = useRef(0);
  const animFrameRef = useRef(null);

  // Map screen pixel coordinate to 960x520 virtual coordinate space
  const getCanvasCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, screenX: 0, screenY: 0, rectWidth: 960, rectHeight: 520 };
    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX;
    const clientY = e.clientY !== undefined ? e.clientY : e.touches?.[0]?.clientY;

    if (clientX === undefined || clientY === undefined) {
      return { x: 0, y: 0, screenX: 0, screenY: 0, rectWidth: rect.width, rectHeight: rect.height };
    }

    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    const scaleX = VIRTUAL_WIDTH / rect.width;
    const scaleY = VIRTUAL_HEIGHT / rect.height;

    return {
      x: Math.round(screenX * scaleX),
      y: Math.round(screenY * scaleY),
      screenX,
      screenY,
      rectWidth: rect.width,
      rectHeight: rect.height,
    };
  }, []);

  // Update canvas dimensions on container resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasDimensions({
          width: Math.round(rect.width) || 960,
          height: Math.round(rect.height) || 480,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle Canvas Click or Tap to place node
  const handleInteractionStart = (e) => {
    if (isRunning) return;

    const coords = getCanvasCoordinates(e);
    const { screenX, screenY, rectWidth, rectHeight } = coords;

    const HIT_RADIUS_SCREEN_PX = 26;

    const cityIndex = cities.findIndex((c) => {
      const cityScreenX = c.x * (rectWidth / VIRTUAL_WIDTH);
      const cityScreenY = c.y * (rectHeight / VIRTUAL_HEIGHT);
      return Math.hypot(cityScreenX - screenX, cityScreenY - screenY) < HIT_RADIUS_SCREEN_PX;
    });

    if (cityIndex !== -1) {
      setDraggedCityIndex(cityIndex);
      if (e.cancelable && e.type.startsWith('touch')) {
        e.preventDefault();
      }
    } else {
      if (onAddCity) {
        onAddCity({ x: coords.x, y: coords.y });
      }
    }
  };

  // Dragging or hover
  const handleInteractionMove = (e) => {
    const coords = getCanvasCoordinates(e);

    if (draggedCityIndex !== null && onMoveCity && !isRunning) {
      if (e.cancelable && e.type.startsWith('touch')) {
        e.preventDefault();
      }
      onMoveCity(draggedCityIndex, { x: coords.x, y: coords.y });
      return;
    }

    const { screenX, screenY, rectWidth, rectHeight } = coords;
    const hoverIndex = cities.findIndex((c) => {
      const cityScreenX = c.x * (rectWidth / VIRTUAL_WIDTH);
      const cityScreenY = c.y * (rectHeight / VIRTUAL_HEIGHT);
      return Math.hypot(cityScreenX - screenX, cityScreenY - screenY) < 22;
    });

    setHoveredCityIndex(hoverIndex !== -1 ? hoverIndex : null);
    setHoverPos({ x: screenX, y: screenY });
  };

  const handleInteractionEnd = () => {
    setDraggedCityIndex(null);
  };

  // Calculate coordinates along the tour at a given fractional progress [0, 1]
  const getPositionAlongTour = useCallback((progress, tour, cityList) => {
    if (!tour || tour.length < 2 || !cityList || cityList.length < 2) return null;

    const totalLegs = tour.length;
    const floatIndex = progress * totalLegs;
    const currentLegIndex = Math.floor(floatIndex) % totalLegs;
    const nextLegIndex = (currentLegIndex + 1) % totalLegs;
    const legFraction = floatIndex - Math.floor(floatIndex);

    const c1 = cityList[tour[currentLegIndex]];
    const c2 = cityList[tour[nextLegIndex]];

    if (!c1 || !c2) return null;

    const x = c1.x + (c2.x - c1.x) * legFraction;
    const y = c1.y + (c2.y - c1.y) * legFraction;
    const angle = Math.atan2(c2.y - c1.y, c2.x - c1.x);

    return { x, y, angle, fromCity: c1, toCity: c2 };
  }, []);

  // Canvas Render Scene Function
  const renderScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 2) : 2;
    const displayWidth = canvasDimensions.width;
    const displayHeight = canvasDimensions.height;

    const targetWidth = Math.round(displayWidth * dpr);
    const targetHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.save();
    ctx.setTransform(
      dpr * (displayWidth / VIRTUAL_WIDTH),
      0,
      0,
      dpr * (displayHeight / VIRTUAL_HEIGHT),
      0,
      0
    );
    ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // 1. High-Tech Tactical Grid & Latitude / Longitude lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 60; x < VIRTUAL_WIDTH; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, VIRTUAL_HEIGHT);
      ctx.stroke();
    }
    for (let y = 50; y < VIRTUAL_HEIGHT; y += 70) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(VIRTUAL_WIDTH, y);
      ctx.stroke();
    }

    // Grid coordinates
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillText('N 37° 46.492\'', 12, 18);
    ctx.fillText('W 122° 25.105\'', 12, 30);
    ctx.fillText('SECTOR LOGISTICS GRID // 1px ≈ 0.45km', 12, VIRTUAL_HEIGHT - 12);
    ctx.fillText('DISPATCH_ZONE: PRIMARY', VIRTUAL_WIDTH - 150, VIRTUAL_HEIGHT - 12);

    // Subtle radar crosshair rings in corner
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.beginPath();
    ctx.arc(VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2, 140, 0, Math.PI * 2);
    ctx.arc(VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2, 280, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Active Candidate Probe Route during optimization (pulsing amber dashed line)
    if (currentTour && currentTour.length > 1 && isRunning) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);

      for (let i = 0; i < currentTour.length; i++) {
        const c1 = cities[currentTour[i]];
        const c2 = cities[currentTour[(i + 1) % currentTour.length]];
        if (c1 && c2) {
          ctx.moveTo(c1.x, c1.y);
          ctx.lineTo(c2.x, c2.y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // 3. Best Route Vector (Neon Emerald Line with Directional Arrows & Laser Glow)
    if (bestTour && bestTour.length > 1) {
      ctx.save();

      // Outer glow laser
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < bestTour.length; i++) {
        const c1 = cities[bestTour[i]];
        if (c1) {
          if (i === 0) ctx.moveTo(c1.x, c1.y);
          else ctx.lineTo(c1.x, c1.y);
        }
      }
      if (cities[bestTour[0]]) {
        ctx.lineTo(cities[bestTour[0]].x, cities[bestTour[0]].y);
      }
      ctx.stroke();

      // Sharp main vector line
      ctx.beginPath();
      ctx.strokeStyle = bestColor;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < bestTour.length; i++) {
        const c1 = cities[bestTour[i]];
        if (c1) {
          if (i === 0) ctx.moveTo(c1.x, c1.y);
          else ctx.lineTo(c1.x, c1.y);
        }
      }
      if (cities[bestTour[0]]) {
        ctx.lineTo(cities[bestTour[0]].x, cities[bestTour[0]].y);
      }
      ctx.stroke();

      // Directional Flow Arrows
      ctx.fillStyle = bestColor;
      for (let i = 0; i < bestTour.length; i++) {
        const c1 = cities[bestTour[i]];
        const c2 = cities[bestTour[(i + 1) % bestTour.length]];
        if (c1 && c2) {
          const midX = (c1.x + c2.x) / 2;
          const midY = (c1.y + c2.y) / 2;
          const angle = Math.atan2(c2.y - c1.y, c2.x - c1.x);

          ctx.save();
          ctx.translate(midX, midY);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(6, 0);
          ctx.lineTo(-4, -3.5);
          ctx.lineTo(-2, 0);
          ctx.lineTo(-4, 3.5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.restore();
    }

    // 4. Animated Fleet Delivery Vehicle
    if (bestTour && bestTour.length >= 2 && cities.length >= 2) {
      const vehicle = getPositionAlongTour(vehicleProgressRef.current, bestTour, cities);
      if (vehicle) {
        ctx.save();
        ctx.translate(vehicle.x, vehicle.y);
        ctx.rotate(vehicle.angle);

        // Vehicle Glow Ring
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fill();

        // Vehicle Body (Sleek Delivery Van / Courier Pod)
        ctx.beginPath();
        ctx.roundRect(-8, -5, 16, 10, 3);
        ctx.fillStyle = '#0284c7';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Front Headlights beam
        ctx.beginPath();
        ctx.moveTo(8, -2);
        ctx.lineTo(20, -7);
        ctx.lineTo(20, 7);
        ctx.lineTo(8, 2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
        ctx.fill();

        // Windshield
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(1, -3.5, 3.5, 7);

        ctx.restore();
      }
    }

    // 5. Waypoints / City Nodes
    cities.forEach((city, idx) => {
      const isDepot = idx === 0 || city.type === 'depot';
      const isExpress = city.type === 'express';
      const isHub = city.type === 'hub';
      const isHovered = hoveredCityIndex === idx;
      const isDragged = draggedCityIndex === idx;

      // Find order sequence in current best tour
      const tourIndex = bestTour ? bestTour.indexOf(idx) : -1;
      const sequenceNumber = tourIndex !== -1 ? tourIndex + 1 : idx + 1;

      ctx.save();

      // Depot Pulsating Radar Halo
      if (isDepot) {
        ctx.beginPath();
        ctx.arc(city.x, city.y, 22, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(city.x, city.y, 16, 0, 2 * Math.PI);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Outer node circle
      const baseRadius = isDepot ? 13 : isHovered || isDragged ? 12 : 10;
      ctx.beginPath();
      ctx.arc(city.x, city.y, baseRadius, 0, 2 * Math.PI);

      let nodeColor = '#3b82f6'; // default
      if (isDepot) nodeColor = '#f59e0b'; // amber gold
      else if (isExpress) nodeColor = '#ec4899'; // pink/magenta
      else if (isHub) nodeColor = '#06b6d4'; // cyan
      else if (isHovered || isDragged) nodeColor = '#38bdf8';

      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Inner Dark Core
      ctx.beginPath();
      ctx.arc(city.x, city.y, isDepot ? 9 : 7, 0, 2 * Math.PI);
      ctx.fillStyle = '#080c14';
      ctx.fill();

      // Sequence Number inside node
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${sequenceNumber}`, city.x, city.y);

      // Stop Label Above Node
      ctx.font = isDepot ? '700 11px "JetBrains Mono", monospace' : '500 10px "JetBrains Mono", monospace';
      ctx.fillStyle = isDepot ? '#fef08a' : isExpress ? '#fbcfe8' : '#e2e8f0';
      const labelText = city.name || `Stop ${idx + 1}`;
      ctx.fillText(labelText, city.x, city.y - (isDepot ? 20 : 16));

      // Cargo / Demand Sub-label Below Node (if available)
      if (city.demand && (isHovered || isDepot || cities.length <= 15)) {
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = isDepot ? 'rgba(245, 158, 11, 0.8)' : 'rgba(148, 163, 184, 0.7)';
        ctx.fillText(city.demand, city.x, city.y + (isDepot ? 22 : 18));
      }

      ctx.restore();
    });

    // 6. Empty State Placeholder
    if (cities.length === 0) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '600 14px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('// CLICK OR TAP MAP TO DISPATCH DELIVERY STOPS', VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2 - 10);
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillText('// or load an enterprise logistics scenario from the controls below', VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2 + 15);
      ctx.restore();
    }

    ctx.restore();
  }, [
    canvasDimensions,
    cities,
    bestTour,
    currentTour,
    isRunning,
    bestColor,
    hoveredCityIndex,
    draggedCityIndex,
    getPositionAlongTour,
  ]);

  // Animation loop for delivery vehicle traveling along the route
  useEffect(() => {
    let lastTime = performance.now();

    const animateVehicle = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Complete 1 loop every 12 seconds
      vehicleProgressRef.current = (vehicleProgressRef.current + delta * 0.08) % 1;

      // Redraw canvas with updated vehicle position
      renderScene();

      animFrameRef.current = requestAnimationFrame(animateVehicle);
    };

    animFrameRef.current = requestAnimationFrame(animateVehicle);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [renderScene]);

  const hoveredCity = hoveredCityIndex !== null && cities[hoveredCityIndex] ? cities[hoveredCityIndex] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] sm:h-[460px] md:h-[530px] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950/40 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] group select-none transition-all touch-none"
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        title="Fleet Logistics Map: Click to add customer delivery stops, drag to re-route"
        aria-label="Interactive Travelling Salesperson fleet delivery canvas"
        className={`block w-full h-full select-none touch-none ${
          hoveredCityIndex !== null
            ? 'cursor-grab active:cursor-grabbing'
            : isRunning
            ? 'cursor-default'
            : 'cursor-crosshair'
        }`}
        onMouseDown={handleInteractionStart}
        onMouseMove={handleInteractionMove}
        onMouseUp={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchMove={handleInteractionMove}
        onTouchEnd={handleInteractionEnd}
      />

      {/* Floating Hover Waypoint Inspector Tooltip */}
      {hoveredCity && (
        <div
          className="absolute pointer-events-none z-30 px-3 py-2 rounded-xl bg-zinc-900/95 border border-white/10 shadow-2xl backdrop-blur-xl text-left font-sans -translate-x-1/2 -translate-y-full mb-4 animate-in fade-in duration-150"
          style={{
            left: `${Math.max(120, Math.min(hoverPos.x, canvasDimensions.width - 120))}px`,
            top: `${Math.max(60, hoverPos.y - 12)}px`,
          }}
        >
          <div className="flex items-center gap-1.5 font-bold text-xs text-white">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{hoveredCity.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-300">
            <span className="px-1.5 py-0.5 rounded bg-white/10 uppercase font-semibold text-zinc-200">
              {hoveredCity.type || 'DELIVERY'}
            </span>
            <span>{hoveredCity.demand || 'Standard Consignment'}</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            Priority: <strong className="text-zinc-200 font-medium">{hoveredCity.priority || 'Normal'}</strong> • <span className="font-mono">({hoveredCity.x}, {hoveredCity.y})</span>
          </div>
        </div>
      )}
    </div>
  );
}
