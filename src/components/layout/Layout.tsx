import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Menu,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { IndiaEmblem, IndianFlag, VayuSuchakLogo } from '../common/BrandAssets';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { getPendingAnomaliesBadgeCount } from '../../services/storage';

const LayoutContent: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [anomalyBadge, setAnomalyBadge] = useState<number>(getPendingAnomaliesBadgeCount());

  const quickNavItems = [
    { label: 'Overview', path: '/', icon: Home },
    { label: 'Trends', path: '/index-analysis', icon: TrendingUp },
    { label: 'Routes', path: '/routes', icon: MapPin },
    {
      label: 'Alerts',
      path: '/anomalies',
      icon: AlertTriangle,
      badge: anomalyBadge > 0 ? anomalyBadge : undefined
    }
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#060b17] text-slate-100' : 'bg-[#f4f7fb] text-slate-800'
    }`}>
      {/* Top Header with Hamburger Toggle */}
      <Header onToggleMenu={() => setMobileDrawerOpen(prev => !prev)} />

      {/* Mobile Drawer (Off-Canvas) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Container */}
          <div
            className={`relative w-72 max-w-[82vw] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300 ${
              isDark ? 'bg-[#080e1e] border-r border-[#16223e]' : 'bg-[#fcfdff] border-r border-[#e6ecf5]'
            }`}
          >
            {/* Drawer Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'border-[#16223e]' : 'border-[#e6ecf5]'
            }`}>
              <div className="flex items-center gap-2">
                <VayuSuchakLogo className="w-6 h-6" />
                <span className="text-sm font-black tracking-tight">
                  Vayu<span className="text-blue-500">Suchak</span>
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Sidebar Menu */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar isMobileDrawer={true} onNavigate={() => setMobileDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Container with Desktop Sidebar + Page View */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Persistent Left Sidebar for Desktop (lg+) */}
        <Sidebar />

        {/* Scrollable Main View */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-7 pb-20 lg:pb-7 max-w-full">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>

          {/* Global Institutional Footer Bar */}
          <footer className={`mt-8 pt-4 pb-4 sm:pb-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] select-none text-center sm:text-left ${
            isDark ? 'border-[#14203a] text-slate-400' : 'border-[#e4ebf5] text-slate-500'
          }`}>
            {/* Left */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-2.5">
              <IndiaEmblem className={`w-4 h-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
              <VayuSuchakLogo className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
              <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                VayuSuchak
              </span>
              <span className="opacity-40 hidden sm:inline">|</span>
              <span className="text-[10px] sm:text-[11px]">Real-Time Airfare Intelligence</span>
            </div>

            {/* Center */}
            <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[9px] sm:text-[10px] opacity-80 flex-wrap justify-center">
              <span>Real-time</span>
              <span>•</span>
              <span>Transparent</span>
              <span>•</span>
              <span>Explainable</span>
              <span>•</span>
              <span>Auditable</span>
            </div>

            {/* Right */}
            <div className="flex items-center justify-center gap-2">
              <span className="hidden sm:inline">Powered by Data |</span>
              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Built for a Stronger India
              </span>
              <IndianFlag className="w-4 h-3 sm:w-5 sm:h-3.5 inline-block shrink-0" />
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar (Sticky at bottom on < lg) */}
      <nav
        aria-label="Mobile Navigation"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex items-center justify-around py-1.5 px-2 backdrop-blur-lg transition-colors select-none ${
          isDark
            ? 'bg-[#080e1e]/92 border-[#16223e] text-slate-400'
            : 'bg-white/95 border-[#e6ecf5] text-slate-600 shadow-lg'
        }`}
      >
        {quickNavItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-semibold transition-all relative ${
                  isActive
                    ? isDark
                      ? 'text-[#38bdf8] font-bold'
                      : 'text-[#4338ca] font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge !== undefined && Number(item.badge) > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] truncate max-w-[60px]">{item.label}</span>
            </NavLink>
          );
        })}

        {/* More / Menu Drawer trigger in bottom bar */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
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

