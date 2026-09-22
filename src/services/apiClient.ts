/**
 * MoSPI Airfare Intelligence - Typed API Client Layer
 * Full integration with FastAPI /api/v1 REST contract
 */

const API_BASE = '/api/v1';

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
    }
    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    console.warn(`API request failed for ${endpoint}:`, err);
    throw err;
  }
}

export const apiClient = {
  // Health & System
  health: {
    check: () => fetchJson<{ status: string; service: string }>('/health'),
    ready: () => fetchJson<{ status: string; database: string }>('/health/ready'),
    version: () => fetchJson<any>('/system/version'),
  },

  // Auth & Users
  auth: {
    login: (email: string, password: string) =>
      fetchJson<{ access_token: string; role: string; email: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => fetchJson<any>('/auth/me'),
    users: () => fetchJson<any[]>('/users'),
  },

  // Dashboard
  dashboard: {
    getSummary: () =>
      fetchJson<{
        national_index: number;
        mom_change_pct: number;
        yoy_change_pct: number;
        routes_monitored: number;
        observations_24h: number;
        open_anomalies: number;
        high_alerts: number;
        data_freshness_minutes: number;
      }>('/dashboard/summary'),
    getTrend: () => fetchJson<any[]>('/dashboard/trend'),
    getContributions: () => fetchJson<any[]>('/dashboard/contributions'),
    getHeatmap: () => fetchJson<any[]>('/dashboard/heatmap'),
    getLeadTime: () => fetchJson<{ buckets: any[] }>('/dashboard/lead-time'),
    getFreshness: () => fetchJson<any[]>('/dashboard/freshness'),
  },

  // Fares
  fares: {
    search: (params?: Record<string, any>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchJson<any[]>(`/fares${query}`);
    },
    get: (id: string) => fetchJson<any>(`/fares/${id}`),
    create: (payload: any) =>
      fetchJson<any>('/fares', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    exportUrl: (route?: string) => `${API_BASE}/fares/export${route ? `?route=${route}` : ''}`,
  },

  // Routes, Airlines & Sources
  routes: {
    list: () => fetchJson<any[]>('/routes'),
    get: (routeKey: string) => fetchJson<any>(`/routes/${routeKey}`),
    trend: (routeKey: string) => fetchJson<any>(`/routes/${routeKey}/trend`),
    airlines: (routeKey?: string) =>
      routeKey ? fetchJson<any[]>(`/routes/${routeKey}/airlines`) : fetchJson<any[]>('/airlines'),
    sources: () => fetchJson<any[]>('/sources'),
    sourcesHealth: () => fetchJson<any>('/sources/health'),
  },

  // Indexes & Calculation Runs
  indexes: {
    list: () => fetchJson<any[]>('/indexes'),
    national: () => fetchJson<any>('/indexes/national'),
    routes: () => fetchJson<any[]>('/indexes/routes'),
    runs: () => fetchJson<any[]>('/indexes/runs'),
    triggerRun: (payload: { methodology: string; period?: string; geography_level?: string }) =>
      fetchJson<any>('/indexes/runs', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    contributions: (runId: string) => fetchJson<any>(`/indexes/${runId}/contributions`),
    methodology: (runId: string) => fetchJson<any>(`/indexes/${runId}/methodology`),
  },

  // Weights & Methodology
  weights: {
    routes: () => fetchJson<any[]>('/weights/routes'),
    versions: () => fetchJson<any[]>('/weights/versions'),
    methodologies: () => fetchJson<any[]>('/methodologies'),
  },

  // Anomalies & Alerts
  anomalies: {
    list: (params?: { status?: string; severity?: string; limit?: number }) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return fetchJson<any[]>(`/anomalies${query}`);
    },
    get: (id: string) => fetchJson<any>(`/anomalies/${id}`),
    review: (id: string, status: string, review_note?: string) =>
      fetchJson<any>(`/anomalies/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({ status, review_note }),
      }),
    acknowledgeAll: (review_note?: string) =>
      fetchJson<any>('/anomalies/acknowledge-all', {
        method: 'POST',
        body: JSON.stringify({ review_note }),
      }),
    alerts: () => fetchJson<any[]>('/alerts'),
    acknowledgeAlert: (id: string) =>
      fetchJson<any>(`/alerts/${id}/acknowledge`, { method: 'POST' }),
    resolveAlert: (id: string) =>
      fetchJson<any>(`/alerts/${id}/resolve`, { method: 'POST' }),
  },

  // Explainability & Audit
  explainability: {
    index: (id: string) => fetchJson<any>(`/explainability/index/${id}`),
    route: (routeKey: string) => fetchJson<any>(`/explainability/route/${routeKey}`),
    auditEvents: () => fetchJson<any[]>('/audit/events'),
    entityLineage: (type: string, id: string) =>
      fetchJson<any[]>(`/audit/entities/${type}/${id}`),
  },

  // Reports
  reports: {
    templates: () => fetchJson<any[]>('/reports/templates'),
    jobs: () => fetchJson<any[]>('/reports/jobs'),
    export: (payload: { title: string; report_type: string; format: string; period: string }) =>
      fetchJson<any>('/reports/export', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    downloadUrl: (jobId: string) => `${API_BASE}/reports/jobs/${jobId}/download`,
  },

  // Collection & Scraping Orchestrator
  collection: {
    status: () => fetchJson<any>('/collection/status'),
    jobs: () => fetchJson<any[]>('/collection/jobs'),
    trigger: (payload?: any) =>
      fetchJson<any>('/collection/jobs', {
        method: 'POST',
        body: JSON.stringify(payload || {}),
      }),
    retry: (jobId: string) =>
      fetchJson<any>(`/collection/jobs/${jobId}/retry`, {
        method: 'POST',
      }),
    sourceMetrics: (sourceId: string) =>
      fetchJson<any>(`/collection/sources/${sourceId}/metrics`),
  },
};
