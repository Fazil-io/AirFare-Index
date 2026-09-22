import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Plane,
  X,
  CheckCircle2,
  ExternalLink,
  Shield,
  Settings,
  LogOut,
  Sliders,
  RefreshCw,
  Radio,
  Lock,
  Sparkles,
  CheckCheck,
  Menu
} from 'lucide-react';
import { IndiaEmblem, VayuSuchakLogo } from '../common/BrandAssets';
import { useTheme } from '../../context/ThemeContext';
import { useLiveTracking } from '../../context/LiveTrackingContext';
import {
  getStoredRole,
  setStoredRole,
  isGuestRole,
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
  AppNotification
} from '../../services/storage';

interface HeaderProps {
  onToggleMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const { isLive, totalObservations, isScrapingNow, triggerLiveScrape } = useLiveTracking();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [role, setRole] = useState(getStoredRole());
  const [notifications, setNotifications] = useState<AppNotification[]>(getStoredNotifications());
  const [unreadNotifs, setUnreadNotifs] = useState<number>(getUnreadNotificationsCount());

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Sync notifications state
  useEffect(() => {
    const handleNotifsUpdate = () => {
      setNotifications(getStoredNotifications());
      setUnreadNotifs(getUnreadNotificationsCount());
    };
    window.addEventListener('notifications_updated', handleNotifsUpdate);
    return () => window.removeEventListener('notifications_updated', handleNotifsUpdate);
  }, []);

  // Sync role state when changed from storage or other components
  useEffect(() => {
    const handleRoleChanged = () => {
      setRole(getStoredRole());
    };
    window.addEventListener('role_changed', handleRoleChanged);
    window.addEventListener('storage', handleRoleChanged);
    return () => {
      window.removeEventListener('role_changed', handleRoleChanged);
      window.removeEventListener('storage', handleRoleChanged);
    };
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setMobileSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isGuest = isGuestRole(role);

  // Keyboard shortcut ⌘K or Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setStoredRole(newRole);
    setProfileOpen(false);
  };

  const sampleSearchResults = [
    { title: 'DEL-BOM (Delhi - Mumbai)', subtitle: 'Route • Metro Corridor • Index: 122.4', path: '/routes' },
    { title: 'BLR-IXC (Bengaluru - Chandigarh)', subtitle: 'Route • Holiday Surge (+18.6%)', path: '/routes' },
    { title: 'IndiGo (6E)', subtitle: 'Carrier • 54% Domestic Volume Share', path: '/routes' },
    { title: 'Air India (AI)', subtitle: 'Carrier • 28% Domestic Volume Share', path: '/routes' },
    { title: 'T-0 to T-30+ Yield Analysis', subtitle: 'Lead Time Window Dynamic Pricing', path: '/lead-time' },
    { title: 'Laspeyres vs Fisher Ideal', subtitle: 'Statistical Methodology Comparison', path: '/index-analysis' }
  ].filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header
      className={`h-16 sm:h-18 px-3 sm:px-6 flex items-center justify-between border-b transition-colors duration-200 select-none sticky top-0 z-30 ${
        isDark
          ? 'bg-[#091022] border-[#16223e] text-slate-100'
          : 'bg-white border-[#e6ecf5] text-slate-800 shadow-xs'
      }`}
    >
      {/* Left: Hamburger Button (Mobile) + Ministry Brand & MoSPI Logo */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMenu}
          className={`p-2 rounded-xl lg:hidden transition-colors cursor-pointer ${
            isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
          }`}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Emblem & Ministry Info (Hidden on very small screens, compact on mid) */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <IndiaEmblem className={`w-5 h-7 sm:w-7 sm:h-9 ${isDark ? 'text-slate-200' : 'text-slate-800'} shrink-0`} />
          <div className="hidden xl:flex flex-col text-[11px] leading-tight font-semibold">
            <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
              Ministry of Statistics &
            </span>
            <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
              Programme Implementation
            </span>
            <span className={`text-[9px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Government of India
            </span>
          </div>
        </Link>

        {/* Vertical Divider */}
        <div className={`h-7 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'} mx-0.5 hidden xl:block`} />

        {/* VayuSuchak Crest */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 hover:opacity-90 transition-opacity group">
            <VayuSuchakLogo className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0" />
            <span className={`text-sm sm:text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Vayu<span className="text-blue-500">Suchak</span>
            </span>
          </Link>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('replay-intro'))}
            title="Replay Logo Flight Intro Animation"
            className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center text-xs opacity-60 hover:opacity-100 cursor-pointer ${
              isDark
                ? 'hover:bg-slate-800/80 text-slate-400 hover:text-sky-400'
                : 'hover:bg-slate-100 text-slate-400 hover:text-blue-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Desktop Search Bar with ⌘K + Interactive Dropdown */}
      <div ref={searchRef} className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8 relative">
        <div
          className={`relative w-full flex items-center rounded-xl border px-3.5 py-2 transition-all cursor-text ${
            isDark
              ? 'bg-[#060b17] border-[#1a2745] text-slate-200 focus-within:border-blue-500'
              : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-700 focus-within:border-blue-500 focus-within:bg-white'
          }`}
          onClick={() => setSearchOpen(true)}
        >
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            placeholder="Search routes, airlines, regions..."
            className="w-full bg-transparent text-xs focus:outline-none placeholder:text-slate-400 font-sans"
          />
          <kbd
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ml-2 shrink-0 ${
              isDark
                ? 'bg-[#0f172a] border-slate-700 text-slate-400'
                : 'bg-white border-slate-200 text-slate-500 shadow-2xs'
            }`}
          >
            ⌘ K
          </kbd>
        </div>

        {/* Search Results Dropdown */}
        {searchOpen && (
          <div
            className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 overflow-hidden ${
              isDark ? 'bg-[#0d172e] border-[#1f3056]' : 'bg-white border-[#e2e8f0]'
            }`}
          >
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3">
              Quick Suggestions
            </div>
            <div className="max-h-60 overflow-y-auto p-1 divide-y divide-slate-100 dark:divide-slate-800/60">
              {sampleSearchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    navigate(res.path);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{res.title}</div>
                  <div className="text-[10px] text-slate-400">{res.subtitle}</div>
                </div>
              ))}
              {sampleSearchResults.length === 0 && (
                <div className="p-4 text-xs text-center text-slate-400">
                  No matching corridors or records found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions, Notifications, Profile, Theme Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Mobile Search Button */}
        <div ref={mobileSearchRef} className="relative md:hidden">
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-[#0d172e] border-[#1f3056] text-slate-300 hover:bg-[#132244]'
                : 'bg-[#f1f5f9] border-[#e2e8f0] text-slate-700 hover:bg-[#e2e8f0]'
            }`}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Mobile Search Modal Dropdown */}
          {mobileSearchOpen && (
            <div
              className={`fixed inset-x-2 top-18 rounded-2xl border shadow-2xl z-50 p-3 ${
                isDark ? 'bg-[#0d172e] border-[#1f3056]' : 'bg-white border-[#e2e8f0]'
              }`}
            >
              <div className="flex items-center gap-2 border-b pb-2 mb-2 border-slate-200 dark:border-slate-800">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search routes, airlines, regions..."
                  className="w-full bg-transparent text-xs focus:outline-none placeholder:text-slate-400 font-sans"
                />
                <button
                  onClick={() => setMobileSearchOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {sampleSearchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      navigate(res.path);
                      setMobileSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className={`p-2.5 rounded-lg cursor-pointer ${
                      isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-800 dark:text-slate-200">{res.title}</div>
                    <div className="text-[10px] text-slate-400">{res.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Tracking Pulse Badge */}
        <div
          className={`hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-full border text-[10px] sm:text-[11px] font-semibold tracking-wide shadow-xs ${
            isLive
              ? isDark
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden md:inline">LIVE OTA FEED</span>
          <span className="text-[10px] font-mono opacity-80">({totalObservations.toLocaleString()} obs)</span>
        </div>

        {/* Live Scrape Action Trigger */}
        <button
          onClick={isGuest ? undefined : triggerLiveScrape}
          disabled={isScrapingNow || isGuest}
          title={
            isGuest
              ? 'Guest Mode: Scraper control restricted to VayuSuchak Statistical Officers'
              : 'Scrape realtime airfares from OTA & airline sources'
          }
          className={`flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            isGuest
              ? 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-75'
              : isScrapingNow
              ? 'bg-blue-600 text-white opacity-80 cursor-wait'
              : isDark
              ? 'bg-blue-950/50 border-blue-800/60 text-blue-400 hover:bg-blue-900/60 cursor-pointer'
              : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 cursor-pointer'
          }`}
        >
          {isGuest ? (
            <Lock className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <RefreshCw className={`w-3.5 h-3.5 ${isScrapingNow ? 'animate-spin' : ''}`} />
          )}
          <span className="hidden lg:inline">
            {isGuest ? 'Read-Only' : isScrapingNow ? 'Scraping...' : 'Scrape Live'}
          </span>
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            isDark
              ? 'bg-[#0d172e] border-[#1f3056] text-amber-300 hover:bg-[#132244]'
              : 'bg-[#f1f5f9] border-[#e2e8f0] text-slate-700 hover:bg-[#e2e8f0]'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell with Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className={`p-2 rounded-xl border relative transition-all cursor-pointer ${
              isDark
                ? 'bg-[#0d172e] border-[#1f3056] text-slate-300 hover:bg-[#132244]'
                : 'bg-[#f1f5f9] border-[#e2e8f0] text-slate-700 hover:bg-[#e2e8f0]'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#091022] animate-pulse"></span>
            )}
          </button>

          {notifOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] sm:w-80 max-w-sm rounded-2xl border shadow-2xl z-50 overflow-hidden ${
                isDark ? 'bg-[#0d172e] border-[#1f3056]' : 'bg-white border-[#e2e8f0]'
              }`}
            >
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Live Surveillance Alerts</span>
                  {unreadNotifs > 0 ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold">
                      {unreadNotifs} New
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                      All Read
                    </span>
                  )}
                </div>
                {unreadNotifs > 0 && (
                  <button
                    onClick={() => markAllNotificationsAsRead()}
                    className="text-[11px] text-blue-500 hover:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
              <div className="p-2 space-y-1.5 max-h-72 overflow-y-auto text-xs">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      navigate(n.link);
                      setNotifOpen(false);
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors relative ${
                      !n.read
                        ? isDark
                          ? 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60'
                          : 'bg-blue-50/70 hover:bg-blue-50 border border-blue-100'
                        : isDark
                        ? 'hover:bg-slate-800/40 opacity-70'
                        : 'hover:bg-slate-50 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <div className="flex items-center gap-1.5">
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />}
                        <span className={n.severity === 'rose' ? 'text-rose-500' : 'text-amber-500'}>
                          {n.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{n.subtitle}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => {
                    navigate('/anomalies');
                    setNotifOpen(false);
                  }}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Open Anomaly Triage Center →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Statistical Officer User Profile Pill + Menu */}
        <div ref={profileRef} className="relative">
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-[#0d172e] border-[#1f3056] hover:bg-[#132244]'
                : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc] shadow-2xs'
            }`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shrink-0 ${
              isGuest
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-500 dark:text-amber-400'
                : 'bg-blue-600/15 border-blue-500/30 text-blue-600 dark:text-blue-400'
            }`}>
              {isGuest ? <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight min-w-0">
              <span className={`text-xs font-bold truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {isGuest ? 'Guest User' : `${role.split(' ')[0]} Officer`}
              </span>
              <span className={`text-[10px] truncate ${isGuest ? 'text-amber-500 font-semibold' : 'text-slate-400'}`}>
                {isGuest ? 'Read-Only Mode' : 'VayuSuchak Active'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 hidden sm:inline" />
          </div>

          {profileOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border shadow-2xl z-50 overflow-hidden ${
                isDark ? 'bg-[#0d172e] border-[#1f3056]' : 'bg-white border-[#e2e8f0]'
              }`}
            >
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Active Persona</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{role}</span>
                  {isGuest && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-400">
                      View Only
                    </span>
                  )}
                </div>
              </div>

              <div className="p-1 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase">Switch Perspective</div>
                {[
                  { name: 'VayuSuchak Statistical Officer', isRestricted: false },
                  { name: 'Guest (Read-Only)', isRestricted: true }
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => handleRoleChange(item.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                      role === item.name
                        ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.isRestricted ? (
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      <span>{item.name}</span>
                    </div>
                    {role === item.name && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>

              <div className="p-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>System Preferences</span>
                </Link>
                <Link
                  to="/audit"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Audit Logs</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

