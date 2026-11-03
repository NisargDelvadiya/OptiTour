import "./globals.css";

/**
 * @file layout.js
 * @description Root layout, SEO metadata, and typography configuration for OptiTour.
 * Enforces overscroll-none to disable rubber-band bouncing on max scroll.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */
export const metadata = {
  title: "OptiTour — Intelligent Route Architecture",
  description:
    "OptiTour is an interactive Travelling Salesperson Route Visualizer powered by Hill Climbing and 2-Opt local search heuristics. Created by Nisarg Jayesh Delvadiya and Rishan Mazumdar.",
  keywords: [
    "Travelling Salesperson Problem",
    "TSP",
    "Hill Climbing",
    "2-Opt Heuristic",
    "Route Optimization",
    "Artificial Intelligence",
    "Local Search",
    "Graph Theory",
    "Computer Science Mini Project",
    "Nisarg Jayesh Delvadiya",
    "Rishan Mazumdar",
  ],
  authors: [
    { name: "Nisarg Jayesh Delvadiya" },
    { name: "Rishan Mazumdar" },
  ],
  creator: "Nisarg Jayesh Delvadiya & Rishan Mazumdar",
  publisher: "OptiTour",
  applicationName: "OptiTour",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark overscroll-none">
      <body className="min-h-full flex flex-col font-sans text-zinc-100 antialiased selection:bg-white selection:text-black overscroll-none overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
