/**
 * @file hillClimbing.js
 * @description Hill Climbing (Local Search) algorithm for Travelling Salesperson Problem (TSP) using 2-Opt edge inversion,
 * Nearest-Neighbor greedy baseline construction, and multi-restart heuristics.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

import { calculateTourDistanceByIndices, calculateEuclideanDistance } from './distance.js';

/**
 * Performs a 2-Opt edge inversion move on a tour.
 * Reverses the subsegment of nodes between indices `start` and `end`.
 * This mathematically eliminates intersecting path crossings.
 *
 * @param {number[]} tour Original city indices array
 * @param {number} startIndex First edge boundary index
 * @param {number} endIndex Second edge boundary index
 * @returns {number[]} Modified tour permutation
 */
export function applyTwoOpt(tour, startIndex, endIndex) {
  if (!Array.isArray(tour) || tour.length < 2) return [...(tour || [])];

  const newTour = [...tour];
  let left = Math.min(startIndex, endIndex);
  let right = Math.max(startIndex, endIndex);

  while (left < right) {
    const temp = newTour[left];
    newTour[left] = newTour[right];
    newTour[right] = temp;
    left++;
    right--;
  }

  return newTour;
}

/**
 * Performs a simple point swap between two indices in the tour.
 *
 * @param {number[]} tour Original tour
 * @param {number} indexA First index to swap
 * @param {number} indexB Second index to swap
 * @returns {number[]} New modified tour
 */
export function applySwap(tour, indexA, indexB) {
  if (!Array.isArray(tour) || tour.length < 2) return [...(tour || [])];
  const newTour = [...tour];
  const temp = newTour[indexA];
  newTour[indexA] = newTour[indexB];
  newTour[indexB] = temp;
  return newTour;
}

/**
 * Generates an initial random permutation of city indices using Fisher-Yates shuffle.
 *
 * @param {number} cityCount Number of cities
 * @returns {number[]} Random tour permutation
 */
export function generateRandomTour(cityCount) {
  const tour = Array.from({ length: cityCount }, (_, i) => i);
  for (let i = tour.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = tour[i];
    tour[i] = tour[j];
    tour[j] = temp;
  }
  return tour;
}

/**
 * Constructs a tour using the greedy Nearest Neighbor heuristic.
 * This is the classic real-world logistics industry baseline before 2-Opt refinement.
 *
 * @param {Array<{x: number, y: number}>} cities
 * @param {number} [startCityIndex=0] Index of starting depot
 * @returns {number[]} Greedy tour permutation
 */
export function generateNearestNeighborTour(cities, startCityIndex = 0) {
  if (!Array.isArray(cities) || cities.length < 2) {
    return Array.from({ length: cities ? cities.length : 0 }, (_, i) => i);
  }

  const n = cities.length;
  const visited = new Set();
  const start = Math.max(0, Math.min(startCityIndex, n - 1));
  const tour = [start];
  visited.add(start);

  let current = start;

  while (tour.length < n) {
    let nearestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        const d = calculateEuclideanDistance(cities[current], cities[i]);
        if (d < minDistance) {
          minDistance = d;
          nearestIndex = i;
        }
      }
    }

    if (nearestIndex !== -1) {
      tour.push(nearestIndex);
      visited.add(nearestIndex);
      current = nearestIndex;
    } else {
      break;
    }
  }

  return tour;
}

/**
 * Instantly solves full 2-Opt to convergence (useful for instantaneous dispatch).
 *
 * @param {Array<{x: number, y: number}>} cities
 * @param {number[]} [initialTour]
 * @param {number} [maxIterations=1000]
 * @returns {{tour: number[], distance: number, improvementsCount: number}}
 */
export function solveInstantTwoOpt(cities, initialTour = null, maxIterations = 1000) {
  if (!Array.isArray(cities) || cities.length < 3) {
    const defaultTour = Array.isArray(cities) ? cities.map((_, i) => i) : [];
    return {
      tour: defaultTour,
      distance: calculateTourDistanceByIndices(defaultTour, cities),
      improvementsCount: 0,
    };
  }

  let tour = initialTour ? [...initialTour] : generateNearestNeighborTour(cities, 0);
  let bestDistance = calculateTourDistanceByIndices(tour, cities);
  let improved = true;
  let iterations = 0;
  let improvementsCount = 0;
  const n = tour.length;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        // Delta evaluation: 2-Opt edge swap delta
        const candidateTour = applyTwoOpt(tour, i, j);
        const candidateDist = calculateTourDistanceByIndices(candidateTour, cities);

        if (candidateDist < bestDistance - 0.001) {
          tour = candidateTour;
          bestDistance = candidateDist;
          improved = true;
          improvementsCount++;
          break;
        }
      }
      if (improved) break;
    }
  }

  return {
    tour,
    distance: bestDistance,
    improvementsCount,
  };
}

/**
 * HillClimbingRunner class manages iterative step-by-step optimization
 * with Steepest Ascent, First Choice, and Random-Restart heuristics.
 */
export class HillClimbingRunner {
  /**
   * @param {Array<{x: number, y: number}>} cities City coordinates
   * @param {Object} [options]
   * @param {'2opt'|'swap'} [options.operator='2opt'] Neighborhood move operator
   * @param {'steepest'|'first_choice'|'random_restart'} [options.strategy='steepest'] Search strategy
   * @param {number} [options.sampleNeighbors=50] Number of neighbor moves evaluated per step
   * @param {number} [options.maxPatienceBeforeRestart=40] Tries before triggering a random restart
   * @param {boolean} [options.startWithGreedy=false] Initialize from Nearest Neighbor instead of random
   */
  constructor(cities, options = {}) {
    this.cities = Array.isArray(cities) ? cities : [];
    this.operator = options.operator || '2opt';
    this.strategy = options.strategy || 'steepest';
    this.sampleNeighbors = Math.max(5, options.sampleNeighbors || 50);
    this.maxPatienceBeforeRestart = Math.max(10, options.maxPatienceBeforeRestart || 40);
    this.startWithGreedy = Boolean(options.startWithGreedy);

    this.iteration = 0;
    this.currentTour = [];
    this.currentDistance = Infinity;
    this.bestTour = [];
    this.bestDistance = Infinity;

    this.localOptimaCount = 0;
    this.restartsCount = 0;
    this.stuckCounter = 0;
    this.isLocalOptimum = false;
    this.improvementsCount = 0;

    this.init();
  }

  /**
   * Initializes the search with a provided tour, greedy tour, or deterministic sequence.
   * Avoids non-deterministic Math.random() during initial render to prevent SSR hydration mismatch.
   *
   * @param {number[]} [customTour] Optional pre-configured tour permutation
   */
  init(customTour = null) {
    this.iteration = 0;
    this.localOptimaCount = 0;
    this.restartsCount = 0;
    this.stuckCounter = 0;
    this.isLocalOptimum = false;
    this.improvementsCount = 0;

    if (this.cities.length >= 2) {
      if (Array.isArray(customTour) && customTour.length === this.cities.length) {
        this.currentTour = [...customTour];
      } else if (this.startWithGreedy) {
        this.currentTour = generateNearestNeighborTour(this.cities, 0);
      } else {
        // Deterministic natural stop sequence [0, 1, 2, ... N-1] ensures identical SSR and client hydration
        this.currentTour = Array.from({ length: this.cities.length }, (_, i) => i);
      }
      this.currentDistance = calculateTourDistanceByIndices(this.currentTour, this.cities);
      this.bestTour = [...this.currentTour];
      this.bestDistance = this.currentDistance;
    } else {
      this.currentTour = [];
      this.currentDistance = 0;
      this.bestTour = [];
      this.bestDistance = 0;
    }
  }

  /**
   * Advances the local search by exactly one optimization step.
   *
   * @returns {{
   *   iteration: number,
   *   currentTour: number[],
   *   bestTour: number[],
   *   currentDistance: number,
   *   bestDistance: number,
   *   isLocalOptimum: boolean,
   *   improvementsCount: number,
   *   foundImprovement: boolean
   * }}
   */
  step() {
    const totalCities = this.cities.length;
    if (totalCities < 3) {
      return {
        iteration: this.iteration,
        currentTour: this.currentTour,
        bestTour: this.bestTour,
        currentDistance: this.currentDistance,
        bestDistance: this.bestDistance,
        isLocalOptimum: true,
        improvementsCount: this.improvementsCount,
        foundImprovement: false,
      };
    }

    this.iteration++;
    let foundImprovement = false;

    if (this.strategy === 'first_choice') {
      // First-choice: probe random neighbors until an improvement is found
      const maxProbes = Math.min(60, Math.floor((totalCities * (totalCities - 1)) / 2));
      for (let probe = 0; probe < maxProbes; probe++) {
        const i = Math.floor(Math.random() * totalCities);
        let j = Math.floor(Math.random() * totalCities);
        while (j === i) {
          j = Math.floor(Math.random() * totalCities);
        }

        const candidateTour =
          this.operator === '2opt'
            ? applyTwoOpt(this.currentTour, i, j)
            : applySwap(this.currentTour, i, j);

        const candidateDist = calculateTourDistanceByIndices(candidateTour, this.cities);

        if (candidateDist < this.currentDistance) {
          this.currentTour = candidateTour;
          this.currentDistance = candidateDist;
          foundImprovement = true;
          this.stuckCounter = 0;
          this.isLocalOptimum = false;
          this.improvementsCount++;
          break;
        }
      }

      if (!foundImprovement) {
        this.stuckCounter++;
      }
    } else {
      // Steepest ascent: examine a sample of neighborhood moves and select the best shortcut
      let bestNeighbor = null;
      let bestNeighborDist = this.currentDistance;

      const neighborLimit = Math.min(
        this.sampleNeighbors,
        Math.floor((totalCities * (totalCities - 1)) / 2)
      );

      for (let s = 0; s < neighborLimit; s++) {
        const i = Math.floor(Math.random() * totalCities);
        let j = Math.floor(Math.random() * totalCities);
        while (j === i) {
          j = Math.floor(Math.random() * totalCities);
        }

        const neighborTour =
          this.operator === '2opt'
            ? applyTwoOpt(this.currentTour, i, j)
            : applySwap(this.currentTour, i, j);

        const neighborDist = calculateTourDistanceByIndices(neighborTour, this.cities);

        if (neighborDist < bestNeighborDist) {
          bestNeighborDist = neighborDist;
          bestNeighbor = neighborTour;
        }
      }

      if (bestNeighbor && bestNeighborDist < this.currentDistance) {
        this.currentTour = bestNeighbor;
        this.currentDistance = bestNeighborDist;
        foundImprovement = true;
        this.stuckCounter = 0;
        this.isLocalOptimum = false;
        this.improvementsCount++;
      } else {
        this.stuckCounter++;
      }
    }

    // Update global best tour if a new shortest distance is uncovered
    if (this.currentDistance < this.bestDistance) {
      this.bestDistance = this.currentDistance;
      this.bestTour = [...this.currentTour];
    }

    // Check for local optimum condition
    if (this.stuckCounter >= 20) {
      this.isLocalOptimum = true;
      this.localOptimaCount++;

      // Trigger random restart if stuck threshold reached
      if (
        this.strategy === 'random_restart' ||
        this.stuckCounter >= this.maxPatienceBeforeRestart
      ) {
        this.currentTour = generateRandomTour(this.cities.length);
        this.currentDistance = calculateTourDistanceByIndices(this.currentTour, this.cities);
        this.restartsCount++;
        this.stuckCounter = 0;
        this.isLocalOptimum = false;
      }
    }

    return {
      iteration: this.iteration,
      currentTour: this.currentTour,
      bestTour: this.bestTour,
      currentDistance: this.currentDistance,
      bestDistance: this.bestDistance,
      isLocalOptimum: this.isLocalOptimum,
      improvementsCount: this.improvementsCount,
      foundImprovement,
    };
  }
}
