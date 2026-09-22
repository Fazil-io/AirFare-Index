import React from 'react';
import { Plane } from 'lucide-react';
import { VayuSuchakLogo } from './BrandAssets';

interface HeroBannerProps {
  isDark?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ isDark = false }) => {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden shadow-sm transition-all duration-300 border ${
        isDark
          ? 'bg-[#060b17] border-[#182647]'
          : 'bg-[#edf4fe] border-[#d4e4f7]'
      }`}
    >
      <div className="relative w-full flex flex-col md:flex-row items-stretch justify-between min-h-[185px] overflow-hidden">
        {/* Left Informational Content */}
        <div className="p-4 sm:p-6 lg:p-7 z-10 flex flex-col justify-between max-w-xl">
          {/* Top Tagline */}
          <div className="flex items-center gap-2.5 mb-2">
            <VayuSuchakLogo className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm shrink-0 hover:scale-105 transition-transform duration-200" />
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs sm:text-sm font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  Vayu<span className="text-blue-500">Suchak</span>
                </span>
              </div>
              <p className={`text-[10px] sm:text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Real-Time Airfare Intelligence for Transport CPI Augmentation
              </p>
            </div>
          </div>

          {/* Large Title */}
          <div className="my-1">
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-[#0f172a]'
            }`}>
              From Flight Fares <br className="hidden sm:inline" />
              to a <span className={isDark ? 'text-[#38bdf8]' : 'text-[#1e40af]'}>Stronger Economy</span>
            </h1>
            <p className={`text-xs mt-1.5 sm:mt-2 max-w-md ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
              Real-time airfare insights for accurate inflation measurement, predictive policy analytics, and transparent index governance.
            </p>
          </div>
        </div>

        {/* Right Section: Photorealistic Commercial Aircraft Wing with Left Blend */}
        <div className="relative md:absolute md:right-0 md:top-0 md:bottom-0 h-44 sm:h-52 md:h-full w-full md:w-[58%] flex items-center justify-end overflow-hidden">
          {/* High-Resolution Clean Wing Photography */}
          <div className="relative w-full h-full flex items-center justify-end">
            <img
              src={isDark ? '/assets/vayusuchak_hero_dark.jpg' : '/assets/vayusuchak_hero_light.jpg'}
              alt="VayuSuchak Aircraft In Flight"
              className="w-full h-full object-cover object-center select-none"
            />
            {/* Smooth Gradient Blend into the background on left/top */}
            <div
              className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r pointer-events-none ${
                isDark
                  ? 'from-[#060b17] via-[#060b17]/70 to-transparent'
                  : 'from-[#edf4fe] via-[#edf4fe]/70 to-transparent'
              }`}
            />
          </div>

          {/* Floating Graphics & Wording Card */}
          <div className="absolute right-3 sm:right-4 lg:right-6 bottom-3 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-20 max-w-[calc(100%-1.5rem)]">
            <div
              className={`p-2.5 sm:p-3.5 sm:pr-4.5 rounded-xl sm:rounded-2xl border backdrop-blur-xl flex items-center gap-2.5 sm:gap-3.5 shadow-2xl transition-all max-w-[360px] ${
                isDark
                  ? 'bg-[#060f26]/90 border-[#1f3566] text-slate-100 shadow-blue-950/60'
                  : 'bg-white/92 border-[#bfdbfe] text-slate-800 shadow-blue-200/50'
              }`}
            >
              {/* Graphic: Glowing India Flight Radar & Telemetry Nodes */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-blue-500/30 bg-gradient-to-br from-blue-600/25 via-cyan-500/15 to-indigo-600/25 shadow-inner">
                <svg viewBox="0 0 48 48" className="w-9 h-9 sm:w-11 sm:h-11 text-cyan-400" fill="none">
                  <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
                  <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
                  <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="1.1" opacity="0.75" />
                  <line x1="24" y1="3" x2="24" y2="45" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
                  <line x1="3" y1="24" x2="45" y2="24" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
                  <circle cx="21" cy="14" r="2.2" fill="#38bdf8" />
                  <circle cx="15" cy="25" r="1.8" fill="#38bdf8" />
                  <circle cx="33" cy="27" r="1.8" fill="#38bdf8" />
                  <circle cx="24" cy="35" r="1.8" fill="#38bdf8" />
                  <path d="M21 14 Q17 20 15 25" stroke="#38bdf8" strokeWidth="1" strokeDasharray="1.5 1.5" />
                  <path d="M21 14 Q27 21 33 27" stroke="#38bdf8" strokeWidth="1" strokeDasharray="1.5 1.5" />
                  <path d="M15 25 Q20 30 24 35" stroke="#38bdf8" strokeWidth="1" strokeDasharray="1.5 1.5" />
                </svg>
                <Plane className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white absolute -rotate-45 drop-shadow-md" />
              </div>

              {/* Text Wording */}
              <div className="flex flex-col text-left leading-tight min-w-0">
                <p className={`text-[11px] sm:text-xs font-semibold leading-snug sm:leading-relaxed ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  Turning dynamic airfare data into a transparent, explainable and auditable index for India's CPI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

