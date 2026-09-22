export type IndexMethodology = 'Laspeyres' | 'Fisher' | 'Jevons' | 'Dutot';

export type LeadTimeCategory = 'T-0' | 'T-7' | 'T-15' | 'T-30+';

export type RouteTier = 'Metro-Metro' | 'Metro-NonMetro' | 'UDAN-Regional';

export type AnomalySeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export type AnomalyStatus = 'PENDING_REVIEW' | 'VALIDATED' | 'REJECTED' | 'RESOLVED';

export interface AirfareIndexPoint {
  date: string;
  month: string;
  nationalIndex: number;
  cpiBaseline: number;
  laspeyres: number;
  fisher: number;
  jevons: number;
  dutot: number;
  momChange: number;
  yoyChange: number;
  metroMetroSubIndex: number;
  regionalSubIndex: number;
}

export interface DomesticRoute {
  id: string;
  code: string; // e.g. "DEL-BOM"
  originCity: string;
  originIata: string;
  destCity: string;
  destIata: string;
  tier: RouteTier;
  passengerWeight: number; // e.g. 0.084 (8.4% share)
  currentFare: number;
  previousFare: number;
  pctChange7d: number;
  routeIndex: number;
  volatilityScore: number; // 0-100
  observationCount: number;
  dominantAirline: string;
  airlines: {
    airline: string;
    avgFare: number;
    marketShare: number;
    flightCount: number;
  }[];
  leadTimeFares: Record<LeadTimeCategory, number>;
  trend30d: { date: string; fare: number }[];
}

export interface AnomalyRecord {
  id: string;
  routeCode: string;
  origin: string;
  destination: string;
  airline: string;
  source: string;
  travelDate: string;
  bookingTimestamp: string;
  observedFare: number;
  expectedMin: number;
  expectedMax: number;
  historicalMedian: number;
  zScore: number;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  ruleTriggered: string;
  calendarContext?: string;
  peerComparison: {
    airline: string;
    fare: number;
  }[];
  reviewNotes?: string;
  reviewer?: string;
  updatedAt?: string;
}

export interface FareObservation {
  id: string;
  routeCode: string;
  flightNo: string;
  airline: string;
  source: string; // "MakeMyTrip" | "EaseMyTrip" | "IndiGo Direct" | "Air India Direct"
  cabinClass: string;
  scrapeTimestamp: string;
  travelDate: string;
  leadTimeDays: number;
  leadTimeCategory: LeadTimeCategory;
  baseFare: number;
  surcharges: number;
  taxes: number;
  totalFare: number;
  seatsRemaining?: number;
  qualityFlag: 'VERIFIED' | 'IMPUTED' | 'FLAGGED_ANOMALY';
}

export interface AuditRecord {
  id: string;
  runId: string;
  stage: 'Data Collection' | 'Cleaning & Normalization' | 'Lead-Time Classification' | 'Anomaly Scoring' | 'Statistical Index Engine';
  timestamp: string;
  schemaVersion: string;
  formulaVersion: string;
  inputRecords: number;
  outputRecords: number;
  hash: string;
  operator: string;
  notes: string;
}

export interface SourceHealthMetric {
  id: string;
  sourceName: string;
  type: 'Airline Direct API' | 'OTA Aggregator';
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  successRate24h: number;
  avgLatencyMs: number;
  observations24h: number;
  lastScraped: string;
  errorRate: number;
  adapterVersion: string;
}

export interface IndexContributionNode {
  name: string;
  contributionPoints: number;
  percentageShare: number;
  currentValue: number;
  previousValue: number;
  weight: number;
  children?: IndexContributionNode[];
}

export interface GeneratedReport {
  id: string;
  title: string;
  type: 'Monthly CPI Airfare Bulletin' | 'Route Volatility Dossier' | 'High-Severity Anomaly Audit' | 'Methodology Comparison Report';
  period: string;
  format: 'PDF' | 'XLSX' | 'CSV';
  generatedAt: string;
  fileSize: string;
  checksum: string;
  status: 'READY' | 'GENERATING';
}
