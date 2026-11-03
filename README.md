# OptiTour 🚚
### Intelligent Route Architecture & Fleet Dispatch Heuristics

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-20232a?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![ESLint](https://img.shields.io/badge/ESLint-v9-4b32c3?style=flat&logo=eslint)](https://eslint.org/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Low--Pass_Filter-emerald)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

**OptiTour** is an interactive, real-world fleet logistics optimizer and algorithmic laboratory. Powered by **Steepest Ascent Hill Climbing** and the **2-Opt Edge Inversion Heuristic**, OptiTour untangles complex Travelling Salesperson Problem (TSP) networks in real time, translating theoretical NP-hard computer science into tangible fleet logistics savings: fuel expense reduction, transit time minimization, and ESG carbon abatement.

Designed with a smoked-grey glassmorphic UI, real-time cartographic rendering, and warm low-pass ambient background audio, OptiTour delivers an executive-grade mission control experience.

---

## 🌟 Key Features

### 1. Minimalist Glassmorphic Mission Control
- **Floating Island Navbar:** Centered, translucent glass capsule housing strictly the glowing OptiTour brand mark and bold project name with smart scroll-detection.
- **Brand Hero Section:** High-impact slogan (*"Untangling Complexity. Finding The Shortest Path."*), dispatch overview, and real-time logistics badges.
- **Atmospheric Visuals:** Full-bleed cinematic backdrop with a Gaussian blur and smoked-grey glass tint overlay (`bg-zinc-900/45`, `backdrop-blur-2xl`).

### 2. Algorithmic Optimization Suite
- **2-Opt Edge Inversion:** Systematic subsegment reversals that geometrically eliminate intersecting edges and untangle crisscrossing delivery paths.
- **Steepest Ascent Local Search:** Evaluates the entire $O(N^2)$ 2-Opt neighborhood to select the greatest single improvement.
- **Greedy Nearest Neighbor Baseline:** Real-world delivery dispatch heuristic providing an initial baseline for local search refinement.
- **Jaipur (Pink City) Fleet Logistics Map:** Real-world logistics network spanning Sanganer Airport, Sitapura SEZ, Johari Bazaar, Amer, and Mahindra World City with dynamic waypoint manipulation.

### 3. Cartographic Retina Canvas
- **High-DPI Scaling:** Automatic device-pixel-ratio scaling for ultra-crisp display on Retina and 4K screens.
- **Dynamic Delivery Simulation:** Smooth delivery truck vehicle animated along the currently calculated optimal closed-loop route.
- **Direct Waypoint Interaction:** Click anywhere on the cartographic canvas to add new delivery consignments; drag and drop existing stops with live coordinate and distance recalculations.
- **Interactive Waypoint Inspector:** Hover tooltips displaying node types (`DEPOT`, `HUB`, `EXPRESS`, `DELIVERY`), cargo demands, priority levels, and coordinates.

### 4. Real-World Logistics & ESG Telemetry
- **Dynamic Distance Tracking:** Instant calculations in both Metric (`km`) and Imperial (`mi`) systems.
- **Transit Duration:** Route travel time projections calculated at commercial fleet speeds (42 km/h suburban/urban blended average).
- **Fleet Fuel Economy:** Fuel volume (Liters) and operating cost ($USD) modeling at commercial van efficiency standards (9.8 L / 100 km, $1.25/L).
- **Carbon Abatement (ESG):** Quantified CO₂ emissions mitigation based on Light Commercial Vehicle emission factors (0.245 kg CO₂ / km).

### 5. Turn-by-Turn Dispatch Manifest
- **Detailed Route Ledger:** Sequential leg breakdown showing origin, destination, leg distance, transit time, and cumulative delivery ETAs.
- **Collapsible Schedule View:** Minimalist accordion ledger designed for clean dispatch viewing without unnecessary export clutter.

---

## 🧮 Mathematical & Algorithmic Foundations

### 1. The Travelling Salesperson Problem (TSP)
Given a set of nodes $C = \{c_1, c_2, \dots, c_N\}$ in 2D Cartesian space, find a cyclic permutation $\pi \in S_N$ that minimizes total closed-loop Euclidean path distance:

$$L(\pi) = \sum_{k=1}^{N-1} d(c_{\pi(k)}, c_{\pi(k+1)}) + d(c_{\pi(N)}, c_{\pi(1)})$$

Where Euclidean distance between coordinates $c_i = (x_i, y_i)$ and $c_j = (x_j, y_j)$ is defined as:

$$d(c_i, c_j) = \sqrt{(x_i - x_j)^2 + (y_i - y_j)^2}$$

### 2. 2-Opt Edge Inversion Heuristic
For a tour $\pi = (\dots, c_i, c_{i+1}, \dots, c_j, c_{j+1}, \dots)$, replacing directed edges $(c_i, c_{i+1})$ and $(c_j, c_{j+1})$ with $(c_i, c_j)$ and $(c_{i+1}, c_{j+1})$ yields a change in tour length $\Delta$:

$$\Delta = \left[ d(c_i, c_j) + d(c_{i+1}, c_{j+1}) \right] - \left[ d(c_i, c_{i+1}) + d(c_j, c_{j+1}) \right]$$

If $\Delta < 0$, the subsegment between $i+1$ and $j$ is reversed:

$$\pi' = (c_1, \dots, c_i, \mathbf{c_j, c_{j-1}, \dots, c_{i+1}}, c_{j+1}, \dots, c_N)$$

### 3. Logistics & Emissions Metrics
- **Transit Duration:** $T = \frac{D_{\text{km}}}{42\text{ km/h}}$
- **Fuel Volume:** $V_{\text{fuel}} = \frac{D_{\text{km}}}{100} \times 9.8\text{ L}$
- **Fuel Cost:** $\text{Cost}_{\text{USD}} = V_{\text{fuel}} \times \$1.25$
- **Emissions:** $\text{CO}_2 = D_{\text{km}} \times 0.245\text{ kg CO}_2\text{/km}$

---

## 📁 Project Architecture & Directory Layout

```text
OptiTour/
├── public/                         # Static web assets
│   ├── bgm.jpg                     # Atmospheric background visual
│   └── favicon.ico                 # Application tab icon
├── src/
│   ├── algorithms/                 # Pure algorithmic core modules
│   │   ├── distance.js             # Euclidean geometry, conversions & ESG formulas
│   │   └── hillClimbing.js         # 2-Opt, Steepest Ascent, Nearest-Neighbor & Hill Climbing runner
│   ├── app/                        # Next.js App Router
│   │   ├── globals.css             # Tailwind CSS v4 styling & dark theme tokens
│   │   ├── layout.js               # Root layout, metadata & web typography
│   │   └── page.js                 # Pure declarative application landing page
│   ├── components/                 # Declarative React UI components
│   │   ├── DispatchManifest.jsx    # Turn-by-turn route ledger & schedule view
│   │   ├── Footer.jsx              # Sleek branded footer
│   │   ├── HeroSection.jsx         # Slogan, headline & brand value proposition
│   │   ├── Logo.jsx                # Vector brand emblem
│   │   ├── MinimalControls.jsx     # Floating glassmorphic control dock
│   │   ├── MinimalStatsHUD.jsx     # Executive logistics metrics deck
│   │   ├── Navbar.jsx              # Centered floating glass brand navbar
│   │   └── TSPVisualizerCanvas.jsx # Cartographic High-DPI canvas & animation engine
│   ├── data/
│   │   └── presetCities.js         # Jaipur (Pink City) logistics fleet network
│   └── hooks/
│       └── useRouteOptimizer.js    # Dedicated state controller & simulation manager
├── next.config.mjs                 # Network security headers, compression & caching config
├── postcss.config.mjs              # PostCSS Tailwind plugin bridge
├── package.json                    # Dependencies and automation scripts
└── README.md                       # Architectural guide & documentation
```

---

## 🔒 Network Security & Performance

OptiTour is engineered with enterprise-grade network security and low-latency delivery practices:

- **Strict Content Security Policy (CSP):** Restricts script, style, and media execution to trusted origins (`'self'`), preventing cross-site scripting (XSS) and code injection.
- **HTTP Strict Transport Security (HSTS):** Enforces HTTPS with `max-age=63072000; includeSubDomains; preload`.
- **Anti-Clickjacking:** Configured with `X-Frame-Options: DENY` to defend against iframe UI redress attacks.
- **MIME Sniffing Protection:** Armed with `X-Content-Type-Options: nosniff`.
- **DNS Prefetching:** Enabled via `X-DNS-Prefetch-Control: on` for accelerated name resolution.
- **Zero Hydration Mismatch:** Initial server and client states use deterministic seed sequences, completely eliminating React 19 SSR hydration errors.
- **Clean In-Process Bundling:** Configured with Webpack in Next.js 16 to guarantee stability across sandboxed environments and restricted network ports.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.17.0 or higher
- **npm:** v9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nisargdelvadiya/OptiTour.git
   cd OptiTour
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 🛠️ Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with hot module reloading |
| `npm run build` | Compiles optimized production bundle |
| `npm run start` | Boots production server |
| `npm run lint` | Runs ESLint 9 validation across all project files |

---

## 👥 Authors & Credits

- **Nisarg Jayesh Delvadiya**
- **Rishan Mazumdar**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for academic, personal, and commercial utilization.

