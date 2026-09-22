import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  MapPin,
  PieChart,
  AlertTriangle,
  FileText,
  Download
} from 'lucide-react';
import { SidebarCloudAirplane } from '../common/BrandAssets';
import { useTheme } from '../../context/ThemeContext';
import { getPendingAnomaliesBadgeCount, markAnomaliesAsSeen } from '../../services/storage';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const [anomalyBadge, setAnomalyBadge] = useState<number>(getPendingAnomaliesBadgeCount());

  useEffect(() => {
    if (location.pathname === '/anomalies') {
      markAnomaliesAsSeen();
      setAnomalyBadge(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleBadgeUpdate = () => {
      if (location.pathname === '/anomalies') {
        setAnomalyBadge(0);
      } else {
        setAnomalyBadge(getPendingAnomaliesBadgeCount());
      }
    };
    window.addEventListener('anomalies_badge_updated', handleBadgeUpdate);
    return () => window.removeEventListener('anomalies_badge_updated', handleBadgeUpdate);
  }, [location.pathname]);

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/', icon: Home },
    { label: 'Airfare Trends', path: '/index-analysis', icon: TrendingUp },
    { label: 'Route Heatmap', path: '/routes', icon: MapPin },
    { label: 'Inflation Breakdown', path: '/explainability', icon: PieChart },
    {
      label: 'Anomaly & Alerts',
      path: '/anomalies',
      icon: AlertTriangle,
      badge: anomalyBadge > 0 ? anomalyBadge : undefined
    },
    { label: 'Audit Trail', path: '/audit', icon: FileText },
    { label: 'Reports & Export', path: '/reports', icon: Download }
  ];

  return (
    <aside
      className={`w-56 min-w-56 flex flex-col justify-between h-[calc(100vh-4.5rem)] sticky top-18 select-none z-20 border-r transition-colors duration-200 ${
        isDark ? 'bg-[#080e1e] border-[#16223e]' : 'bg-[#fcfdff] border-[#e6ecf5]'
      }`}
    >
      {/* Top Navigation Links */}
      <nav className="p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-[#0d274c] to-[#0f1f3a] text-[#38bdf8] border border-[#0284c7]/50 shadow-sm'
                      : 'bg-[#eeedfd] text-[#4338ca] shadow-2xs font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-[#0d162a]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#f8fafc]'
                }`
              }
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && Number(item.badge) > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Floating Cloud + Airplane Graphic from Reference Design */}
      <div className="mt-auto w-full overflow-hidden select-none">
        <SidebarCloudAirplane isDark={isDark} />
      </div>
    </aside>
  );
};
