import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { IndiaEmblem, IndianFlag, VayuSuchakLogo } from '../common/BrandAssets';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';
import { ErrorBoundary } from '../common/ErrorBoundary';

const LayoutContent: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#060b17] text-slate-100' : 'bg-[#f4f7fb] text-slate-800'
    }`}>
      {/* Top Header */}
      <Header />

      {/* Main Container with Sidebar + Page View */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Persistent Left Sidebar */}
        <Sidebar />

        {/* Scrollable Main View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 max-w-full">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>

          {/* Global Institutional Footer Bar */}
          <footer className={`mt-8 pt-4 pb-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] select-none ${
            isDark ? 'border-[#14203a] text-slate-400' : 'border-[#e4ebf5] text-slate-500'
          }`}>
            {/* Left */}
            <div className="flex items-center gap-2.5">
              <IndiaEmblem className={`w-4 h-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
              <VayuSuchakLogo className="w-5 h-5 object-contain" />
              <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                VayuSuchak
              </span>
              <span className="opacity-40">|</span>
              <span>Real-Time Airfare Intelligence Platform</span>
            </div>

            {/* Center */}
            <div className="flex items-center gap-2 font-mono text-[10px] opacity-80">
              <span>Real-time</span>
              <span>•</span>
              <span>Transparent</span>
              <span>•</span>
              <span>Explainable</span>
              <span>•</span>
              <span>Auditable</span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <span>Powered by Data</span>
              <span className="opacity-40">|</span>
              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Built for a Stronger India
              </span>
              <IndianFlag className="w-5 h-3.5 inline-block" />
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export const Layout: React.FC = () => {
  return (
    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  );
};
