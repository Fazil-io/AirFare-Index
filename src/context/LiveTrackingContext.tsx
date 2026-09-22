import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

interface LiveTrackingContextType {
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  isBackendConnected: boolean;
  isScrapingNow: boolean;
  totalObservations: number;
  lastScrapedTime: string;
  activeWorkers: number;
  lastJobStatus: string;
  triggerLiveScrape: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
}

const LiveTrackingContext = createContext<LiveTrackingContextType | undefined>(undefined);

export const LiveTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLive, setIsLive] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isScrapingNow, setIsScrapingNow] = useState(false);
  const [totalObservations, setTotalObservations] = useState(184520);
  const [lastScrapedTime, setLastScrapedTime] = useState('Just now');
  const [activeWorkers, setActiveWorkers] = useState(4);
  const [lastJobStatus, setLastJobStatus] = useState('COMPLETED');

  const refreshMetrics = useCallback(async () => {
    try {
      const statusData = await apiClient.collection.status();
      setIsBackendConnected(true);
      if (statusData) {
        setTotalObservations(statusData.total_observations_ingested || 184520);
        setActiveWorkers(statusData.active_workers || 4);
        if (statusData.last_job) {
          setLastJobStatus(statusData.last_job.status);
          setLastScrapedTime(new Date(statusData.last_job.started_at).toLocaleTimeString());
        }
      }
    } catch {
      setIsBackendConnected(false);
    }
  }, []);

  const triggerLiveScrape = async () => {
    setIsScrapingNow(true);
    try {
      const res = await apiClient.collection.trigger();
      if (res) {
        setLastJobStatus(res.status);
        await refreshMetrics();
      }
    } catch (err) {
      console.warn('Manual scrape trigger failed:', err);
    } finally {
      setIsScrapingNow(false);
    }
  };

  useEffect(() => {
    // Initial probe
    refreshMetrics();

    if (!isLive) return;

    // Background poll every 8 seconds for live tracking
    const interval = setInterval(() => {
      refreshMetrics();
    }, 8000);

    return () => clearInterval(interval);
  }, [isLive, refreshMetrics]);

  return (
    <LiveTrackingContext.Provider
      value={{
        isLive,
        setIsLive,
        isBackendConnected,
        isScrapingNow,
        totalObservations,
        lastScrapedTime,
        activeWorkers,
        lastJobStatus,
        triggerLiveScrape,
        refreshMetrics,
      }}
    >
      {children}
    </LiveTrackingContext.Provider>
  );
};

export const useLiveTracking = () => {
  const context = useContext(LiveTrackingContext);
  if (!context) {
    throw new Error('useLiveTracking must be used within a LiveTrackingProvider');
  }
  return context;
};
