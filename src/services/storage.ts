import { AnomalyRecord, IndexMethodology } from '../types';
import { mockAnomalies } from './mockData';

const ANOMALIES_KEY = 'mospi_airfare_anomalies';
const METHODOLOGY_KEY = 'mospi_airfare_methodology';
const USER_ROLE_KEY = 'mospi_user_role';

export const getStoredAnomalies = (): AnomalyRecord[] => {
  const data = localStorage.getItem(ANOMALIES_KEY);
  if (!data) {
    localStorage.setItem(ANOMALIES_KEY, JSON.stringify(mockAnomalies));
    return mockAnomalies;
  }
  try {
    return JSON.parse(data);
  } catch {
    return mockAnomalies;
  }
};

export const updateAnomalyStatus = (
  id: string,
  status: AnomalyRecord['status'],
  notes?: string,
  reviewer: string = 'Statistical Officer (MoSPI)'
): AnomalyRecord[] => {
  const current = getStoredAnomalies();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status,
        reviewNotes: notes !== undefined ? notes : item.reviewNotes,
        reviewer,
        updatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
      };
    }
    return item;
  });
  localStorage.setItem(ANOMALIES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('anomalies_badge_updated'));
  return updated;
};

const NOTIFICATIONS_KEY = 'mospi_notifications_list';
const ANOMALIES_SEEN_KEY = 'mospi_anomalies_seen';

export interface AppNotification {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  severity: 'rose' | 'amber' | 'blue';
  link: string;
  read: boolean;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'BLR → IXC Surge (+18.6%)',
    subtitle: 'Unusual quote spike reported on T-7 window.',
    time: '2h ago',
    severity: 'rose',
    link: '/anomalies',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'DEL → BOM Higher Range (+15.2%)',
    subtitle: 'Exceeds 30d rolling average by +3.2σ.',
    time: '4h ago',
    severity: 'rose',
    link: '/anomalies',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Cleartrip Adapter Degraded',
    subtitle: 'Latency spike: 1,150ms. Fallback scraper active.',
    time: '8h ago',
    severity: 'amber',
    link: '/collection-health',
    read: false,
  },
];

export const getStoredNotifications = (): AppNotification[] => {
  const data = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!data) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
    return DEFAULT_NOTIFICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
};

export const markNotificationAsRead = (id: string): AppNotification[] => {
  const list = getStoredNotifications();
  const updated = list.map(n => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notifications_updated'));
  return updated;
};

export const markAllNotificationsAsRead = (): AppNotification[] => {
  const list = getStoredNotifications();
  const updated = list.map(n => ({ ...n, read: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notifications_updated'));
  return updated;
};

export const getUnreadNotificationsCount = (): number => {
  return getStoredNotifications().filter(n => !n.read).length;
};

export const areAnomaliesSeen = (): boolean => {
  return localStorage.getItem(ANOMALIES_SEEN_KEY) === 'true';
};

export const markAnomaliesAsSeen = (): void => {
  localStorage.setItem(ANOMALIES_SEEN_KEY, 'true');
  window.dispatchEvent(new Event('anomalies_badge_updated'));
};

export const resetAnomaliesSeen = (): void => {
  localStorage.removeItem(ANOMALIES_SEEN_KEY);
  window.dispatchEvent(new Event('anomalies_badge_updated'));
};

export const getPendingAnomaliesBadgeCount = (): number => {
  if (areAnomaliesSeen()) return 0;
  const anomalies = getStoredAnomalies();
  return anomalies.filter(a => a.status === 'PENDING_REVIEW').length;
};

export const getStoredMethodology = (): IndexMethodology => {
  return (localStorage.getItem(METHODOLOGY_KEY) as IndexMethodology) || 'Fisher';
};

export const setStoredMethodology = (m: IndexMethodology) => {
  localStorage.setItem(METHODOLOGY_KEY, m);
};

export const getStoredRole = (): string => {
  return localStorage.getItem(USER_ROLE_KEY) || 'VayuSuchak Statistical Officer';
};

export const setStoredRole = (role: string) => {
  localStorage.setItem(USER_ROLE_KEY, role);
  window.dispatchEvent(new Event('role_changed'));
};

export const isGuestRole = (role?: string): boolean => {
  const current = role || getStoredRole();
  return current.toLowerCase().includes('guest');
};
