'use client';

/**
 * @file Navbar.jsx
 * @description Floating smart-scroll glassmorphic navbar.
 * Automatically slides up and hides when scrolling down, and slides back down into view when scrolling up.
 * Boundary-clamped to prevent any bounce / jitter when reaching maximum scroll boundaries.
 * Displays strictly the project logo and brand name, big and centered.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollYRef.current;

      // Ignore negative scroll values (overscroll bounce at top)
      if (currentScrollY <= 0) {
        setIsVisible(true);
        lastScrollYRef.current = 0;
        return;
      }

      // Ignore overscroll bounce at the bottom of the page
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (currentScrollY >= maxScroll - 15) {
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // Always show near top of page
      if (currentScrollY < 30) {
        setIsVisible(true);
      } else if (currentScrollY > prevScrollY && currentScrollY - prevScrollY > 8) {
        // Scrolling down -> slide up and hide
        setIsVisible(false);
      } else if (currentScrollY < prevScrollY && prevScrollY - currentScrollY > 8) {
        // Scrolling up -> slide down and show
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-4 sm:top-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 transition-all duration-300 ease-in-out ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-28 opacity-0 pointer-events-none'
      }`}
    >
      <nav
        title="OptiTour — Intelligent Route Architecture"
        aria-label="OptiTour navigation header"
        className="pointer-events-auto rounded-full bg-zinc-900/70 backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.18)] px-8 sm:px-10 py-3 sm:py-3.5 flex items-center justify-center gap-3.5 hover:border-white/[0.22] hover:bg-zinc-900/80 transition-all duration-300 select-none"
      >
        {/* Project Logo - Big & Glowing */}
        <Logo className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-400 flex-shrink-0 drop-shadow-[0_0_16px_rgba(16,185,129,0.5)]" />

        {/* Project Name - Big, Bold & Centered */}
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          OptiTour
        </span>
      </nav>
    </header>
  );
}
