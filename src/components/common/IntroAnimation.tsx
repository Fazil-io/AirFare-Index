import React, { useState, useEffect } from 'react';
import { Plane, Sparkles } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete, forceShow = false }) => {
  const [phase, setPhase] = useState<'falling' | 'orbiting' | 'emblemReady' | 'lettersFalling' | 'completed'>('falling');
  const [activeLetters, setActiveLetters] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Letter configuration matching the official logo brand typography
  const letters = [
    { char: 'V', color: 'text-[#1e3a8a] dark:text-[#38bdf8]', hasPlume: true },
    { char: 'a', color: 'text-[#1e3a8a] dark:text-[#38bdf8]' },
    { char: 'y', color: 'text-[#1e3a8a] dark:text-[#38bdf8]' },
    { char: 'u', color: 'text-[#1e3a8a] dark:text-[#38bdf8]' },
    { char: 'S', color: 'text-[#0d9488] dark:text-[#2dd4bf]' },
    { char: 'u', color: 'text-[#0d9488] dark:text-[#2dd4bf]' },
    { char: 'c', color: 'text-[#0d9488] dark:text-[#2dd4bf]' },
    { char: 'h', color: 'text-[#0d9488] dark:text-[#2dd4bf]' },
    { char: 'a', color: 'text-[#0d9488] dark:text-[#2dd4bf]' },
    { char: 'k', color: 'text-[#0d9488] dark:text-[#2dd4bf]' },
  ];

  useEffect(() => {
    // Timeline sequence:
    // T = 0ms: Plane falls from top
    // T = 700ms: Plane starts circular orbit with Indian flag contrails
    const orbitTimer = setTimeout(() => {
      setPhase('orbiting');
    }, 600);

    // T = 2000ms: Circle completed, emblem elements lock in
    const emblemTimer = setTimeout(() => {
      setPhase('emblemReady');
    }, 1900);

    // T = 2400ms: Letters start falling letter by letter
    const lettersTimer = setTimeout(() => {
      setPhase('lettersFalling');
      let count = 0;
      const letterInterval = setInterval(() => {
        count++;
        setActiveLetters(count);
        if (count >= letters.length) {
          clearInterval(letterInterval);
        }
      }, 70); // 70ms per letter drop
    }, 2200);

    // T = 3800ms: Start fadeout into the dashboard
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3800);

    // T = 4300ms: Complete and hand over to dashboard
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4300);

    return () => {
      clearTimeout(orbitTimer);
      clearTimeout(emblemTimer);
      clearTimeout(lettersTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050914] select-none transition-all duration-700 overflow-hidden ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Cinematic Deep Atmosphere Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f2347]/60 via-[#060d1d] to-[#02050c] pointer-events-none" />

      {/* Subtle Star / Atmospheric Particles */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* Skip Button for Evaluators / Quick Navigation */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-[11px] sm:text-xs font-mono tracking-wider transition-all duration-200 backdrop-blur-md cursor-pointer flex items-center gap-1.5"
      >
        <span>Skip</span>
        <span className="text-[10px] text-slate-500">ESC ➔</span>
      </button>

      {/* Main Logo Showcase Arena */}
      <div className="relative z-10 flex flex-col items-center justify-center scale-[0.75] sm:scale-90 md:scale-100 origin-center transition-transform">
        {/* Emblem Stage: 280x280 Circle Arena */}
        <div className="relative w-[280px] h-[280px] flex items-center justify-center">
          {/* Circular Orbit Track & Contrail Painting SVG */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 280 280">
            <defs>
              {/* Indian Flag Saffron Contrail Gradient */}
              <linearGradient id="saffronTrail" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff9933" stopOpacity="0" />
                <stop offset="30%" stopColor="#f97316" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ff7700" stopOpacity="1" />
              </linearGradient>

              {/* Indian Flag Green Contrail Gradient */}
              <linearGradient id="greenTrail" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#138808" stopOpacity="0" />
                <stop offset="40%" stopColor="#10b981" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#059669" stopOpacity="1" />
              </linearGradient>

              {/* Core Blue Ring Gradient */}
              <linearGradient id="blueRing" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>

              {/* Glow Filter for High-Altitude Flight Energy */}
              <filter id="contrailGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Backdrop Circle (appears when orbit starts) */}
            <circle
              cx="140"
              cy="140"
              r="105"
              fill="none"
              stroke="#0369a1"
              strokeWidth="2"
              strokeOpacity={phase === 'falling' ? 0.05 : 0.25}
              className="transition-opacity duration-500"
            />

            {/* Dynamic Contrail Trails: Drawn in a complete circle as plane orbits */}
            {phase !== 'falling' && (
              <g filter="url(#contrailGlow)">
                {/* Upper Saffron Ribbon Contrail */}
                <path
                  d="M 140 32 A 108 108 0 1 1 139.9 32"
                  fill="none"
                  stroke="url(#saffronTrail)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  className="intro-contrail-saffron"
                />

                {/* Lower Green Ribbon Contrail */}
                <path
                  d="M 140 40 A 100 100 0 1 1 139.9 40"
                  fill="none"
                  stroke="url(#greenTrail)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="intro-contrail-green"
                />

                {/* White/Cyan Pure Air Stream Core */}
                <path
                  d="M 140 36 A 104 104 0 1 1 139.9 36"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeOpacity="0.85"
                  className="intro-contrail-white"
                />
              </g>
            )}

            {/* Blue Outer Arch (Locks in after orbit completes) */}
            {(phase === 'emblemReady' || phase === 'lettersFalling' || phase === 'completed') && (
              <path
                d="M 50 140 A 90 90 0 1 0 215 80"
                fill="none"
                stroke="url(#blueRing)"
                strokeWidth="12"
                strokeLinecap="round"
                className="animate-fade-in"
              />
            )}
          </svg>

          {/* Center Inner Emblem Elements (4 Rising Blue Bars & Green Arrow) */}
          {(phase === 'emblemReady' || phase === 'lettersFalling' || phase === 'completed') && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Central Bar Charts & Swooping Green Arrow */}
              <div className="relative w-36 h-36 flex items-end justify-center gap-2 pb-8 animate-scale-up">
                {/* Bar 1 */}
                <div
                  className="w-4 bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-sm shadow-sm"
                  style={{ height: '32px', animation: 'barGrow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s forwards' }}
                />
                {/* Bar 2 */}
                <div
                  className="w-4 bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-sm shadow-sm"
                  style={{ height: '48px', animation: 'barGrow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.12s forwards' }}
                />
                {/* Bar 3 */}
                <div
                  className="w-4 bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-sm shadow-sm"
                  style={{ height: '66px', animation: 'barGrow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards' }}
                />
                {/* Bar 4 */}
                <div
                  className="w-4 bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-sm shadow-sm"
                  style={{ height: '84px', animation: 'barGrow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.28s forwards' }}
                />

                {/* Upward Green Arrow Across the Bars */}
                <svg
                  className="absolute -bottom-2 -left-3 w-40 h-28 overflow-visible"
                  viewBox="0 0 160 110"
                >
                  <path
                    d="M 15 95 Q 65 92 115 50"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="intro-arrow-path"
                  />
                  <polygon
                    points="112,42 128,48 118,62"
                    fill="#10b981"
                    className="intro-arrow-head"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* THE AIRPLANE: Falls First -> Moves in 360 Degree Circle -> Docks in Emblem */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {phase === 'falling' ? (
              // Step 1: Flight falls from top
              <div className="intro-flight-fall">
                <svg className="w-14 h-14 text-sky-400 drop-shadow-[0_4px_16px_rgba(56,189,248,0.7)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
            ) : phase === 'orbiting' ? (
              // Step 2: Flight moves in a circle leaving Indian flag air trail
              <div className="intro-orbit-container">
                <div className="intro-orbit-plane">
                  <svg className="w-14 h-14 text-sky-400 drop-shadow-[0_2px_12px_rgba(56,189,248,0.8)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>
              </div>
            ) : (
              // Step 3 & 4: Docked in Final Emblem Position at Top Right
              <div className="absolute top-4 right-5 intro-docked-plane">
                <svg className="w-14 h-14 text-sky-400 drop-shadow-[0_4px_16px_rgba(56,189,248,0.6)] rotate-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Brand Name Typography: VayuSuchak Falling Letter by Letter */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center text-4xl sm:text-5xl font-black tracking-tight font-sans">
            {letters.map((l, index) => {
              const isVisible = activeLetters > index;
              return (
                <div key={index} className="relative inline-flex items-center justify-center overflow-visible">
                  {/* Saffron Plume Wing over letter V */}
                  {l.hasPlume && isVisible && (
                    <div className="absolute -top-3.5 -left-1 w-6 h-3 bg-gradient-to-r from-[#f97316] to-[#fb923c] rounded-full blur-[0.3px] -rotate-12 animate-fade-in shadow-xs shadow-orange-500/50" />
                  )}
                  <span
                    className={`inline-block transition-transform duration-300 font-extrabold ${l.color} ${
                      isVisible
                        ? 'translate-y-0 opacity-100 scale-100 animate-letter-drop'
                        : '-translate-y-16 opacity-0 scale-75'
                    }`}
                    style={{
                      textShadow: isVisible ? '0 4px 20px rgba(56,189,248,0.25)' : 'none',
                      transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    {l.char}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Subtitle & Tagline: Fades In Below Name */}
          <div
            className={`mt-3 flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide transition-all duration-700 ${
              activeLetters >= letters.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <div className="h-px w-6 sm:w-10 bg-slate-600/50" />
            <span className="text-slate-300 font-sans tracking-wider">
              Real-Time Airfare Price Index for India
            </span>
            <div className="h-px w-6 sm:w-10 bg-slate-600/50" />
          </div>

          {/* Government / Institutional Identification Badge */}
          <div
            className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 transition-all duration-700 ${
              activeLetters >= letters.length ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ministry of Statistics & Programme Implementation (MoSPI)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
