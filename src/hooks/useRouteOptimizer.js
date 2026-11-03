'use client';

/**
 * @file useRouteOptimizer.js
 * @description Central state controller and optimization manager for the Travelling Salesperson Problem.
 * Encapsulates execution loops, heuristic mutation policies, telemetry state, and canvas event listeners.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  HillClimbingRunner,
  generateNearestNeighborTour,
  generateRandomTour,
  solveInstantTwoOpt,
} from '../algorithms/hillClimbing';
import { calculateTourDistanceByIndices } from '../algorithms/distance';
import { getDefaultDeliveryMap, generateRandomCities } from '../data/presetCities';

/**
 * Default heuristic hyperparameters
 */
export const DEFAULT_HYPERPARAMETERS = Object.freeze({
  operator: '2opt',
  strategy: 'steepest',
  sampleNeighbors: 50,
  maxPatienceBeforeRestart: 40,
  startWithGreedy: false,
});

const INITIAL_CITIES = getDefaultDeliveryMap(960, 520);
const INITIAL_RUNNER = new HillClimbingRunner(INITIAL_CITIES, DEFAULT_HYPERPARAMETERS);

/**
 * Custom React Hook coordinating simulation state, animation loop, and dispatch workflows.
 *
 * @returns {Object} Route optimizer API and reactive state variables
 */
export function useRouteOptimizer() {
  // Cities coordinate array (Default primary fleet delivery map)
  const [cities, setCities] = useState(INITIAL_CITIES);

  // Simulation playback state
  const [isRunning, setIsRunning] = useState(false);
  const [speed] = useState(25); // Step interval in milliseconds
  const [hcParams] = useState(DEFAULT_HYPERPARAMETERS);

  // Mutable execution references
  const runnerRef = useRef(INITIAL_RUNNER);
  const timerRef = useRef(null);

  // Telemetry reactive states
  const [bestTour, setBestTour] = useState(INITIAL_RUNNER.bestTour);
  const [currentTour, setCurrentTour] = useState(INITIAL_RUNNER.currentTour);
  const [bestDistance, setBestDistance] = useState(INITIAL_RUNNER.bestDistance);
  const [initialDistance, setInitialDistance] = useState(INITIAL_RUNNER.bestDistance);

  /**
   * Fires a celebratory confetti burst upon major route milestones
   */
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#10b981', '#ffffff', '#a1a1aa', '#38bdf8'],
      });
    } catch {
      // Gracefully handle if canvas-confetti is unsupported
    }
  }, []);

  /**
   * Resets or reinitializes the heuristic runner with new cities or parameters.
   *
   * @param {Array<{x: number, y: number}>} [currentCities=cities]
   * @param {Object} [params=hcParams]
   * @param {number[]} [customTour=null]
   */
  const resetRunner = useCallback(
    (currentCities = cities, params = hcParams, customTour = null) => {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (Array.isArray(currentCities) && currentCities.length >= 3) {
        const hc = new HillClimbingRunner(currentCities, params);
        if (customTour) {
          hc.init(customTour);
        }
        runnerRef.current = hc;
        setBestTour(hc.bestTour);
        setCurrentTour(hc.currentTour);
        setBestDistance(hc.bestDistance);
        setInitialDistance(hc.bestDistance);
      } else {
        runnerRef.current = null;
        const initialOrder = Array.isArray(currentCities) ? currentCities.map((_, i) => i) : [];
        setBestTour(initialOrder);
        setCurrentTour(initialOrder);
        setBestDistance(0);
        setInitialDistance(0);
      }
    },
    [cities, hcParams]
  );

  /**
   * Performs exactly one step of heuristic optimization.
   */
  const stepOptimization = useCallback(() => {
    if (runnerRef.current) {
      const result = runnerRef.current.step();
      setBestTour(result.bestTour);
      setCurrentTour(result.currentTour);
      setBestDistance(result.bestDistance);

      if (result.isLocalOptimum) {
        setIsRunning(false);
        triggerCelebration();
      }
    }
  }, [triggerCelebration]);

  /**
   * Manages the recurring interval timer loop during live execution.
   */
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        stepOptimization();
      }, speed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, speed, stepOptimization]);

  /**
   * Starts iterative local search optimization.
   */
  const handleStart = useCallback(() => {
    if (!cities || cities.length < 3) return;
    setIsRunning(true);
  }, [cities]);

  /**
   * Pauses route search.
   */
  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  /**
   * Steps forward by one optimization cycle.
   */
  const handleStep = useCallback(() => {
    if (!cities || cities.length < 3) return;
    setIsRunning(false);
    stepOptimization();
  }, [cities, stepOptimization]);

  /**
   * Instantly converges 2-Opt local search to completion.
   */
  const handleInstantSolve = useCallback(() => {
    if (!cities || cities.length < 3) return;
    setIsRunning(false);

    const result = solveInstantTwoOpt(cities, bestTour);
    setBestTour(result.tour);
    setCurrentTour(result.tour);
    setBestDistance(result.distance);

    if (runnerRef.current) {
      runnerRef.current.bestTour = result.tour;
      runnerRef.current.bestDistance = result.distance;
      runnerRef.current.currentTour = result.tour;
      runnerRef.current.currentDistance = result.distance;
    }

    triggerCelebration();
  }, [cities, bestTour, triggerCelebration]);

  /**
   * Applies the greedy Nearest Neighbor heuristic baseline.
   */
  const handleApplyGreedyBaseline = useCallback(() => {
    if (!cities || cities.length < 3) return;
    setIsRunning(false);

    const greedyTour = generateNearestNeighborTour(cities, 0);
    const greedyDistance = calculateTourDistanceByIndices(greedyTour, cities);

    setBestTour(greedyTour);
    setCurrentTour(greedyTour);
    setBestDistance(greedyDistance);
    setInitialDistance(greedyDistance);

    if (runnerRef.current) {
      runnerRef.current.bestTour = greedyTour;
      runnerRef.current.bestDistance = greedyDistance;
      runnerRef.current.currentTour = greedyTour;
      runnerRef.current.currentDistance = greedyDistance;
    }
  }, [cities]);

  /**
   * Resets route to initial sequence, or restores the default delivery map if empty.
   */
  const handleReset = useCallback(() => {
    if (!cities || cities.length === 0) {
      setCities(INITIAL_CITIES);
      resetRunner(INITIAL_CITIES);
    } else {
      resetRunner(cities);
    }
  }, [cities, resetRunner]);

  /**
   * Updates heuristic parameters and re-initializes runner.
   *
   * @param {Object} newParams
   */
  const handleUpdateHcParams = useCallback(
    (newParams) => {
      setHcParams(newParams);
      resetRunner(cities, newParams);
    },
    [cities, resetRunner]
  );

  /**
   * Adds a new customer stop at sanitized canvas coordinates.
   *
   * @param {{x: number, y: number}} coords
   */
  const handleAddCity = useCallback(
    (coords) => {
      if (!coords || !Number.isFinite(coords.x) || !Number.isFinite(coords.y)) return;
      if (cities.length >= 50) return;

      const clampedX = Math.max(20, Math.min(Math.round(coords.x), 940));
      const clampedY = Math.max(20, Math.min(Math.round(coords.y), 500));

      const isDepot = cities.length === 0;
      const newCity = {
        id: cities.length + 1,
        name: isDepot ? 'Master Depot Hub [DEPOT]' : `Stop #${cities.length + 1}`,
        type: isDepot ? 'depot' : 'delivery',
        demand: isDepot ? 'Central Dispatch' : `${Math.floor(15 + Math.random() * 30)} Packages`,
        priority: isDepot ? 'High' : 'Medium',
        x: clampedX,
        y: clampedY,
      };

      const updated = [...cities, newCity];
      setCities(updated);
      resetRunner(updated);
    },
    [cities, resetRunner]
  );

  /**
   * Moves a city node during interactive dragging.
   *
   * @param {number} cityIndex
   * @param {{x: number, y: number}} coords
   */
  const handleMoveCity = useCallback(
    (cityIndex, coords) => {
      if (
        cityIndex < 0 ||
        cityIndex >= cities.length ||
        !coords ||
        !Number.isFinite(coords.x) ||
        !Number.isFinite(coords.y)
      ) {
        return;
      }

      const clampedX = Math.max(10, Math.min(Math.round(coords.x), 950));
      const clampedY = Math.max(10, Math.min(Math.round(coords.y), 510));

      const updated = [...cities];
      updated[cityIndex] = {
        ...updated[cityIndex],
        x: clampedX,
        y: clampedY,
      };
      setCities(updated);

      if (runnerRef.current) {
        runnerRef.current.cities = updated;
        const newBestDist = calculateTourDistanceByIndices(runnerRef.current.bestTour, updated);
        setBestDistance(newBestDist);
      }
    },
    [cities]
  );

  /**
   * Clears all cities from the map.
   */
  const handleClearCities = useCallback(() => {
    setIsRunning(false);
    setCities([]);
    resetRunner([]);
  }, [resetRunner]);

  /**
   * Generates a randomized delivery fleet.
   *
   * @param {number} [count=16]
   */
  const handleRandomizeCities = useCallback(
    (count = 16) => {
      const safeCount = Math.max(3, Math.min(Number(count) || 16, 45));
      const randomCities = generateRandomCities(safeCount, 960, 520);
      const randomTour = generateRandomTour(randomCities.length);
      setCities(randomCities);
      resetRunner(randomCities, hcParams, randomTour);
    },
    [hcParams, resetRunner]
  );

  return {
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
  };
}

