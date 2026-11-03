'use client';

import React from 'react';

/**
 * @file Footer.jsx
 * @description Clean, minimalist footer formatted according to design reference.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */
export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto py-4 sm:py-5 px-4 border-t border-white/[0.06] bg-zinc-950/50 backdrop-blur-xl text-center font-sans text-xs sm:text-sm text-zinc-400 select-none">
      <div className="max-w-4xl mx-auto flex items-center justify-center flex-wrap gap-x-2 gap-y-1 leading-relaxed">
        <span>© 2026 • Made with ❤️ in Bharat 🇮🇳</span>
        <span className="text-zinc-600">|</span>
        <span className="font-semibold text-zinc-100 tracking-wide">OptiTour</span>
        <span>• All Rights Reserved</span>
      </div>
    </footer>
  );
}
