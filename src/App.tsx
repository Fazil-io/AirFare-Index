import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LiveTrackingProvider } from './context/LiveTrackingContext';
import { IntroAnimation } from './components/common/IntroAnimation';
import { Dashboard } from './pages/Dashboard';
import { IndexPage } from './pages/IndexPage';
import { RouteIntelligence } from './pages/RouteIntelligence';
import { LeadTimeAnalysis } from './pages/LeadTimeAnalysis';
import { Anomalies } from './pages/Anomalies';
import { DataExplorer } from './pages/DataExplorer';
import { Explainability } from './pages/Explainability';
import { AuditTrail } from './pages/AuditTrail';
import { Reports } from './pages/Reports';
import { CollectionHealth } from './pages/CollectionHealth';
import { Settings } from './pages/Settings';

export function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);

  useEffect(() => {
    const handleReplay = () => setShowIntro(true);
    window.addEventListener('replay-intro', handleReplay);
    return () => window.removeEventListener('replay-intro', handleReplay);
  }, []);

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <BrowserRouter>
        <LiveTrackingProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="index-analysis" element={<IndexPage />} />
              <Route path="routes" element={<RouteIntelligence />} />
              <Route path="lead-time" element={<LeadTimeAnalysis />} />
              <Route path="anomalies" element={<Anomalies />} />
              <Route path="data-explorer" element={<DataExplorer />} />
              <Route path="explainability" element={<Explainability />} />
              <Route path="audit" element={<AuditTrail />} />
              <Route path="reports" element={<Reports />} />
              <Route path="collection-health" element={<CollectionHealth />} />
              <Route path="settings" element={<Settings />} />
              {/* Catch-all redirect to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </LiveTrackingProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
