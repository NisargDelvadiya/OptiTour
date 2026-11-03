/**
 * @file presetCities.js
 * @description Single primary real-world Jaipur (Pink City) fleet logistics delivery map
 * and random stop generator.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

/**
 * Primary Real-World Jaipur Fleet Logistics Map (13 Key Hubs)
 * Spans Sanganer Airport, Sitapura SEZ, WTP Malviya Nagar, Johari Bazaar,
 * Amer, VKIA Industrial, Vaishali Nagar & Mahindra World City.
 *
 * @param {number} [width=960] Virtual canvas width
 * @param {number} [height=520] Virtual canvas height
 * @returns {Array<{id: number, name: string, type: string, demand: string, priority: string, x: number, y: number}>}
 */
export function getJaipurLogistics(width = 960, height = 520) {
  const scaleX = width / 960;
  const scaleY = height / 520;

  const nodes = [
    {
      id: 1,
      name: 'Sanganer Air Cargo Terminal (JAI) [DEPOT]',
      type: 'depot',
      demand: 'Central Sortation & Air Freight',
      priority: 'High',
      x: 500 * scaleX,
      y: 410 * scaleY,
    },
    {
      id: 2,
      name: 'Sitapura Industrial Area & Gems SEZ',
      type: 'hub',
      demand: '85 Gemstone & Export Crates',
      priority: 'High',
      x: 620 * scaleX,
      y: 460 * scaleY,
    },
    {
      id: 3,
      name: 'Jagatpura Healthcare & Medical Hub',
      type: 'express',
      demand: 'Emergency Medical Supplies',
      priority: 'High',
      x: 680 * scaleX,
      y: 360 * scaleY,
    },
    {
      id: 4,
      name: 'World Trade Park & Malviya Nagar',
      type: 'delivery',
      demand: '42 Retail E-Com Consignments',
      priority: 'Medium',
      x: 520 * scaleX,
      y: 320 * scaleY,
    },
    {
      id: 5,
      name: 'C-Scheme & Civil Lines Corporate Hub',
      type: 'express',
      demand: 'Commercial Banking Documents',
      priority: 'High',
      x: 420 * scaleX,
      y: 240 * scaleY,
    },
    {
      id: 6,
      name: 'Johari Bazaar & Pink City Heritage Core',
      type: 'hub',
      demand: '70 Handloom & Jewelry Shipments',
      priority: 'High',
      x: 490 * scaleX,
      y: 160 * scaleY,
    },
    {
      id: 7,
      name: 'Amer & Jal Mahal Handicrafts Hub',
      type: 'delivery',
      demand: '32 Export Artisan Goods',
      priority: 'Medium',
      x: 520 * scaleX,
      y: 60 * scaleY,
    },
    {
      id: 8,
      name: 'Vishwakarma Industrial Area (VKIA)',
      type: 'hub',
      demand: '95 Heavy Engineering & Stone Crates',
      priority: 'High',
      x: 360 * scaleX,
      y: 70 * scaleY,
    },
    {
      id: 9,
      name: 'Jhotwara Freight & Sikar Road Terminal',
      type: 'delivery',
      demand: '38 Inter-District Cargo Parcels',
      priority: 'Medium',
      x: 250 * scaleX,
      y: 130 * scaleY,
    },
    {
      id: 10,
      name: 'Jaipur Junction & Central Rail Logistics',
      type: 'hub',
      demand: '60 Multi-Modal Rail Shipments',
      priority: 'High',
      x: 400 * scaleX,
      y: 180 * scaleY,
    },
    {
      id: 11,
      name: 'Vaishali Nagar Commercial Delivery Station',
      type: 'delivery',
      demand: '28 Suburban Retail Packages',
      priority: 'Medium',
      x: 270 * scaleX,
      y: 250 * scaleY,
    },
    {
      id: 12,
      name: 'Mahindra World City IT & Manufacturing SEZ',
      type: 'hub',
      demand: '72 Tech Hardware & Auto Freight',
      priority: 'High',
      x: 160 * scaleX,
      y: 350 * scaleY,
    },
    {
      id: 13,
      name: 'Mansarovar E-Commerce Mega Fulfillment Hub',
      type: 'delivery',
      demand: '50 Last-Mile Consumer Orders',
      priority: 'Medium',
      x: 320 * scaleX,
      y: 370 * scaleY,
    },
  ];

  return nodes.map((n) => ({ ...n, x: Math.round(n.x), y: Math.round(n.y) }));
}

/**
 * Aliases for default map export.
 */
export const getDefaultDeliveryMap = getJaipurLogistics;
export const getMumbaiLogistics = getJaipurLogistics;
export const getBayAreaLogistics = getJaipurLogistics;

/**
 * Generates randomly distributed delivery stops across canvas space.
 *
 * @param {number} [count=16]
 * @param {number} [width=960]
 * @param {number} [height=520]
 * @returns {Array<{id: number, name: string, type: string, demand: string, priority: string, x: number, y: number}>}
 */
export function generateRandomCities(count = 16, width = 960, height = 520) {
  const safeCount = Math.max(3, Math.min(count, 50));
  const paddingX = Math.round(width * 0.08);
  const paddingY = Math.round(height * 0.1);
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const nodeTypes = ['delivery', 'express', 'hub'];

  return Array.from({ length: safeCount }, (_, i) => {
    const isDepot = i === 0;
    const type = isDepot ? 'depot' : nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
    const priority = isDepot ? 'High' : (type === 'express' ? 'High' : 'Medium');
    const demand = isDepot ? 'Central Dispatch' : `${Math.floor(12 + Math.random() * 38)} Packages`;

    return {
      id: i + 1,
      name: isDepot ? 'Sanganer Air Cargo Terminal (JAI) [DEPOT]' : `Delivery Stop #${i + 1}`,
      type,
      demand,
      priority,
      x: paddingX + Math.round(Math.random() * usableWidth),
      y: paddingY + Math.round(Math.random() * usableHeight),
    };
  });
}
