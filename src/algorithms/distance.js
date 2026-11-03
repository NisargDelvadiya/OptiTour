/**
 * @file distance.js
 * @description Euclidean distance, geographical conversions, and real-world logistics metrics
 * (fuel consumption, carbon footprint, transit time, cost estimation in Indian Rupees ₹).
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

// Default scale: 1 canvas pixel ≈ 0.45 kilometers in regional delivery logistics
export const DEFAULT_PIXEL_TO_KM_RATIO = 0.45;

// Average delivery van speed in suburban/urban mix: 42 km/h
export const DEFAULT_AVG_SPEED_KMH = 42;

// Average commercial delivery van fuel economy: 9.8 Liters / 100 km
export const DEFAULT_FUEL_CONSUMPTION_L_PER_100KM = 9.8;

// Average diesel cost per liter in Rajasthan / Bharat: ₹94.50 / Liter
export const DEFAULT_FUEL_COST_PER_LITER_INR = 94.5;
export const DEFAULT_FUEL_COST_PER_LITER = DEFAULT_FUEL_COST_PER_LITER_INR;

// CO2 emission factor for light commercial delivery vans: 0.245 kg CO2 / km
export const DEFAULT_CO2_KG_PER_KM = 0.245;

/**
 * Calculates the Euclidean distance between two 2D coordinates.
 * Formula: d = sqrt((x2 - x1)^2 + (y2 - y1)^2)
 *
 * @param {{x: number, y: number}} pointA
 * @param {{x: number, y: number}} pointB
 * @returns {number} Distance in canvas units
 */
export function calculateEuclideanDistance(pointA, pointB) {
  if (!pointA || !pointB) return 0;
  const deltaX = Number(pointA.x) - Number(pointB.x);
  const deltaY = Number(pointA.y) - Number(pointB.y);
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

/**
 * Calculates the total length of a closed-loop tour visiting cities in the given index order,
 * returning back to the starting city.
 *
 * @param {number[]} order Array of city indices representing the tour permutation
 * @param {Array<{x: number, y: number}>} cities Array of city coordinate objects
 * @returns {number} Total circular path distance in canvas pixels
 */
export function calculateTourDistanceByIndices(order, cities) {
  if (!order || !cities || order.length < 2 || cities.length < 2) return 0;

  let totalDistance = 0;
  const nodeCount = order.length;

  for (let i = 0; i < nodeCount; i++) {
    const currentCity = cities[order[i]];
    const nextCity = cities[order[(i + 1) % nodeCount]];
    if (currentCity && nextCity) {
      totalDistance += calculateEuclideanDistance(currentCity, nextCity);
    }
  }

  return totalDistance;
}

/**
 * Calculates individual leg details along the tour in kilometers.
 *
 * @param {number[]} order
 * @param {Array<{id: number, name: string, x: number, y: number, type?: string}>} cities
 * @param {number} [pixelToKm=DEFAULT_PIXEL_TO_KM_RATIO]
 * @returns {Array<{legIndex: number, from: any, to: any, distancePx: number, distanceKm: number, timeMins: number}>}
 */
export function calculateTourLegs(order, cities, pixelToKm = DEFAULT_PIXEL_TO_KM_RATIO) {
  if (!order || !cities || order.length < 2) return [];
  const legs = [];
  const count = order.length;

  for (let i = 0; i < count; i++) {
    const fromCity = cities[order[i]];
    const toCity = cities[order[(i + 1) % count]];
    if (fromCity && toCity) {
      const pxDist = calculateEuclideanDistance(fromCity, toCity);
      const kmDist = pxDist * pixelToKm;
      const timeMins = (kmDist / DEFAULT_AVG_SPEED_KMH) * 60;
      legs.push({
        legIndex: i + 1,
        from: fromCity,
        to: toCity,
        distancePx: roundDistance(pxDist),
        distanceKm: roundDistance(kmDist),
        timeMins: Math.round(timeMins),
      });
    }
  }

  return legs;
}

/**
 * Computes realistic logistics and fleet management business metrics from tour distance (in km and ₹ INR).
 *
 * @param {number} distancePx Distance in virtual canvas units
 * @param {number} [pixelToKm=DEFAULT_PIXEL_TO_KM_RATIO]
 * @returns {{
 *   distanceKm: number,
 *   driveTimeHours: number,
 *   driveTimeFormatted: string,
 *   fuelLiters: number,
 *   fuelCostINR: number,
 *   co2EmissionsKg: number
 * }}
 */
export function computeLogisticsMetrics(distancePx, pixelToKm = DEFAULT_PIXEL_TO_KM_RATIO) {
  if (!Number.isFinite(distancePx) || distancePx <= 0) {
    return {
      distanceKm: 0,
      driveTimeHours: 0,
      driveTimeFormatted: '0h 0m',
      fuelLiters: 0,
      fuelCostINR: 0,
      co2EmissionsKg: 0,
    };
  }

  const distanceKm = distancePx * pixelToKm;

  // Drive time
  const totalHours = distanceKm / DEFAULT_AVG_SPEED_KMH;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  const driveTimeFormatted = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} mins`;

  // Fuel & Operating Costs in Indian Rupees (₹)
  const fuelLiters = (distanceKm / 100) * DEFAULT_FUEL_CONSUMPTION_L_PER_100KM;
  const fuelCostINR = fuelLiters * DEFAULT_FUEL_COST_PER_LITER_INR;

  // ESG / Carbon footprint
  const co2EmissionsKg = distanceKm * DEFAULT_CO2_KG_PER_KM;

  return {
    distanceKm: roundDistance(distanceKm),
    driveTimeHours: roundDistance(totalHours),
    driveTimeFormatted,
    fuelLiters: roundDistance(fuelLiters),
    fuelCostINR: roundDistance(fuelCostINR),
    co2EmissionsKg: roundDistance(co2EmissionsKg),
  };
}

/**
 * Normalizes a floating-point distance to 2 decimal places.
 *
 * @param {number} distance Raw distance value
 * @returns {number} Rounded distance
 */
export function roundDistance(distance) {
  if (!Number.isFinite(distance) || distance < 0) return 0;
  return Math.round(distance * 100) / 100;
}
