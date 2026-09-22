import {
  AirfareIndexPoint,
  DomesticRoute,
  AnomalyRecord,
  FareObservation,
  AuditRecord,
  SourceHealthMetric,
  IndexContributionNode,
  GeneratedReport
} from '../types';
import cpiOfficialData from '../data/cpiOfficialAnnexures.json';
import nssoData from '../data/nssoTravelData.json';

export const officialCpiAnnexures = cpiOfficialData;
export const officialNssoTravel = nssoData;

// Historical monthly time series for National Airfare Price Index grounded in official MoSPI CPI Annexures
export const mockIndexTimeSeries: AirfareIndexPoint[] = [
  { date: '2025-10-01', month: 'Oct 2025', nationalIndex: 106.4, cpiBaseline: 103.74, laspeyres: 106.8, fisher: 106.4, jevons: 105.9, dutot: 106.1, momChange: 1.8, yoyChange: 6.4, metroMetroSubIndex: 107.2, regionalSubIndex: 104.5 },
  { date: '2025-11-01', month: 'Nov 2025', nationalIndex: 111.8, cpiBaseline: 104.01, laspeyres: 112.5, fisher: 111.8, jevons: 110.9, dutot: 111.2, momChange: 5.1, yoyChange: 9.8, metroMetroSubIndex: 113.1, regionalSubIndex: 108.9 },
  { date: '2025-12-01', month: 'Dec 2025', nationalIndex: 114.2, cpiBaseline: 104.10, laspeyres: 115.0, fisher: 114.2, jevons: 113.1, dutot: 113.6, momChange: 2.1, yoyChange: 10.4, metroMetroSubIndex: 115.8, regionalSubIndex: 111.0 },
  { date: '2026-01-01', month: 'Jan 2026', nationalIndex: 108.6, cpiBaseline: 104.45, laspeyres: 109.1, fisher: 108.6, jevons: 107.8, dutot: 108.2, momChange: -4.9, yoyChange: 5.2, metroMetroSubIndex: 109.4, regionalSubIndex: 107.1 },
  { date: '2026-02-01', month: 'Feb 2026', nationalIndex: 107.9, cpiBaseline: 104.57, laspeyres: 108.3, fisher: 107.9, jevons: 107.2, dutot: 107.5, momChange: -0.6, yoyChange: 4.8, metroMetroSubIndex: 108.2, regionalSubIndex: 107.3 },
  { date: '2026-03-01', month: 'Mar 2026', nationalIndex: 110.4, cpiBaseline: 104.84, laspeyres: 111.0, fisher: 110.4, jevons: 109.7, dutot: 110.1, momChange: 2.3, yoyChange: 6.7, metroMetroSubIndex: 111.2, regionalSubIndex: 108.6 },
  { date: '2026-04-01', month: 'Apr 2026', nationalIndex: 112.8, cpiBaseline: 105.12, laspeyres: 113.4, fisher: 112.8, jevons: 112.0, dutot: 112.4, momChange: 2.2, yoyChange: 7.1, metroMetroSubIndex: 113.9, regionalSubIndex: 110.2 },
  { date: '2026-05-01', month: 'May 2026', nationalIndex: 117.5, cpiBaseline: 105.91, laspeyres: 118.3, fisher: 117.5, jevons: 116.4, dutot: 116.9, momChange: 4.2, yoyChange: 8.9, metroMetroSubIndex: 119.0, regionalSubIndex: 114.3 },
  { date: '2026-06-01', month: 'Jun 2026', nationalIndex: 115.9, cpiBaseline: 107.00, laspeyres: 116.6, fisher: 115.9, jevons: 115.0, dutot: 115.4, momChange: -1.4, yoyChange: 7.9, metroMetroSubIndex: 117.1, regionalSubIndex: 113.2 },
  { date: '2026-07-01', month: 'Jul 2026', nationalIndex: 113.1, cpiBaseline: 107.94, laspeyres: 113.7, fisher: 113.1, jevons: 112.3, dutot: 112.7, momChange: -2.4, yoyChange: 6.8, metroMetroSubIndex: 114.0, regionalSubIndex: 111.2 },
  { date: '2026-08-01', month: 'Aug 2026', nationalIndex: 114.7, cpiBaseline: 108.15, laspeyres: 115.4, fisher: 114.7, jevons: 113.9, dutot: 114.2, momChange: 1.4, yoyChange: 7.2, metroMetroSubIndex: 115.8, regionalSubIndex: 112.5 },
  { date: '2026-09-01', month: 'Sep 2026', nationalIndex: 118.42, cpiBaseline: 108.45, laspeyres: 119.2, fisher: 118.42, jevons: 117.5, dutot: 117.9, momChange: 3.24, yoyChange: 7.82, metroMetroSubIndex: 119.8, regionalSubIndex: 115.4 }
];

// High-frequency 30-day daily index for current month
export const mockDailyIndexSeries = [
  { date: '15 Aug', index: 115.1, t0: 168.4, t7: 124.0, t15: 108.5, t30: 98.2 },
  { date: '18 Aug', index: 115.4, t0: 171.2, t7: 123.8, t15: 109.1, t30: 97.9 },
  { date: '21 Aug', index: 114.8, t0: 169.5, t7: 122.5, t15: 108.0, t30: 98.0 },
  { date: '24 Aug', index: 115.6, t0: 172.8, t7: 124.1, t15: 109.4, t30: 98.4 },
  { date: '27 Aug', index: 116.2, t0: 175.0, t7: 125.6, t15: 110.2, t30: 98.8 },
  { date: '30 Aug', index: 116.8, t0: 177.3, t7: 126.5, t15: 110.8, t30: 99.1 },
  { date: '02 Sep', index: 117.1, t0: 179.2, t7: 127.3, t15: 111.4, t30: 99.5 },
  { date: '05 Sep', index: 117.5, t0: 181.6, t7: 128.0, t15: 112.0, t30: 100.1 },
  { date: '08 Sep', index: 117.9, t0: 183.4, t7: 129.2, t15: 112.8, t30: 100.4 },
  { date: '11 Sep', index: 118.2, t0: 185.7, t7: 129.8, t15: 113.2, t30: 100.8 },
  { date: '14 Sep', index: 118.42, t0: 187.9, t7: 130.4, t15: 113.9, t30: 101.2 }
];

// Major Indian domestic air corridors
export const mockRoutes: DomesticRoute[] = [
  {
    id: 'route-1',
    code: 'DEL-BOM',
    originCity: 'Delhi',
    originIata: 'DEL',
    destCity: 'Mumbai',
    destIata: 'BOM',
    tier: 'Metro-Metro',
    passengerWeight: 0.092, // 9.2% of national domestic volume
    currentFare: 6480,
    previousFare: 6150,
    pctChange7d: 5.37,
    routeIndex: 122.4,
    volatilityScore: 68,
    observationCount: 14280,
    dominantAirline: 'IndiGo',
    airlines: [
      { airline: 'IndiGo', avgFare: 6250, marketShare: 0.54, flightCount: 42 },
      { airline: 'Air India', avgFare: 6850, marketShare: 0.28, flightCount: 22 },
      { airline: 'Akasa Air', avgFare: 5900, marketShare: 0.12, flightCount: 9 },
      { airline: 'SpiceJet', avgFare: 6100, marketShare: 0.06, flightCount: 5 }
    ],
    leadTimeFares: { 'T-0': 11400, 'T-7': 7200, 'T-15': 5800, 'T-30+': 4600 },
    trend30d: [
      { date: '15 Aug', fare: 5980 },
      { date: '22 Aug', fare: 6050 },
      { date: '29 Aug', fare: 6210 },
      { date: '05 Sep', fare: 6340 },
      { date: '14 Sep', fare: 6480 }
    ]
  },
  {
    id: 'route-2',
    code: 'BLR-DEL',
    originCity: 'Bengaluru',
    originIata: 'BLR',
    destCity: 'Delhi',
    destIata: 'DEL',
    tier: 'Metro-Metro',
    passengerWeight: 0.078,
    currentFare: 7250,
    previousFare: 6920,
    pctChange7d: 4.77,
    routeIndex: 120.8,
    volatilityScore: 61,
    observationCount: 11450,
    dominantAirline: 'IndiGo',
    airlines: [
      { airline: 'IndiGo', avgFare: 7100, marketShare: 0.56, flightCount: 36 },
      { airline: 'Air India', avgFare: 7600, marketShare: 0.30, flightCount: 19 },
      { airline: 'Akasa Air', avgFare: 6750, marketShare: 0.14, flightCount: 8 }
    ],
    leadTimeFares: { 'T-0': 12900, 'T-7': 8100, 'T-15': 6400, 'T-30+': 5200 },
    trend30d: [
      { date: '15 Aug', fare: 6800 },
      { date: '22 Aug', fare: 6890 },
      { date: '29 Aug', fare: 7010 },
      { date: '05 Sep', fare: 7120 },
      { date: '14 Sep', fare: 7250 }
    ]
  },
  {
    id: 'route-3',
    code: 'BOM-GOI',
    originCity: 'Mumbai',
    originIata: 'BOM',
    destCity: 'Goa (Dabolim/Mopa)',
    destIata: 'GOI',
    tier: 'Metro-NonMetro',
    passengerWeight: 0.045,
    currentFare: 4850,
    previousFare: 4200,
    pctChange7d: 15.48, // Surge due to holiday
    routeIndex: 129.6,
    volatilityScore: 84,
    observationCount: 7890,
    dominantAirline: 'IndiGo',
    airlines: [
      { airline: 'IndiGo', avgFare: 4700, marketShare: 0.60, flightCount: 24 },
      { airline: 'Air India', avgFare: 5100, marketShare: 0.22, flightCount: 9 },
      { airline: 'Akasa Air', avgFare: 4400, marketShare: 0.18, flightCount: 7 }
    ],
    leadTimeFares: { 'T-0': 9800, 'T-7': 5400, 'T-15': 4100, 'T-30+': 3200 },
    trend30d: [
      { date: '15 Aug', fare: 4100 },
      { date: '22 Aug', fare: 4250 },
      { date: '29 Aug', fare: 4390 },
      { date: '05 Sep', fare: 4600 },
      { date: '14 Sep', fare: 4850 }
    ]
  },
  {
    id: 'route-4',
    code: 'DEL-CCU',
    originCity: 'Delhi',
    originIata: 'DEL',
    destCity: 'Kolkata',
    destIata: 'CCU',
    tier: 'Metro-Metro',
    passengerWeight: 0.058,
    currentFare: 6100,
    previousFare: 5950,
    pctChange7d: 2.52,
    routeIndex: 116.2,
    volatilityScore: 52,
    observationCount: 8900,
    dominantAirline: 'IndiGo',
    airlines: [
      { airline: 'IndiGo', avgFare: 5950, marketShare: 0.58, flightCount: 26 },
      { airline: 'Air India', avgFare: 6400, marketShare: 0.32, flightCount: 14 },
      { airline: 'SpiceJet', avgFare: 5800, marketShare: 0.10, flightCount: 4 }
    ],
    leadTimeFares: { 'T-0': 10500, 'T-7': 6800, 'T-15': 5400, 'T-30+': 4300 },
    trend30d: [
      { date: '15 Aug', fare: 5800 },
      { date: '22 Aug', fare: 5880 },
      { date: '29 Aug', fare: 5940 },
      { date: '05 Sep', fare: 6020 },
      { date: '14 Sep', fare: 6100 }
    ]
  },
  {
    id: 'route-5',
    code: 'HYD-BLR',
    originCity: 'Hyderabad',
    originIata: 'HYD',
    destCity: 'Bengaluru',
    destIata: 'BLR',
    tier: 'Metro-Metro',
    passengerWeight: 0.042,
    currentFare: 3650,
    previousFare: 3750,
    pctChange7d: -2.67,
    routeIndex: 104.2,
    volatilityScore: 35,
    observationCount: 6540,
    dominantAirline: 'IndiGo',
    airlines: [
      { airline: 'IndiGo', avgFare: 3600, marketShare: 0.65, flightCount: 22 },
      { airline: 'Air India', avgFare: 3900, marketShare: 0.25, flightCount: 8 },
      { airline: 'Akasa Air', avgFare: 3450, marketShare: 0.10, flightCount: 4 }
    ],
    leadTimeFares: { 'T-0': 6200, 'T-7': 4100, 'T-15': 3400, 'T-30+': 2800 },
    trend30d: [
      { date: '15 Aug', fare: 3800 },
      { date: '22 Aug', fare: 3780 },
      { date: '29 Aug', fare: 3740 },
      { date: '05 Sep', fare: 3700 },
      { date: '14 Sep', fare: 3650 }
    ]
  },
  {
    id: 'route-6',
    code: 'DEL-GAU',
    originCity: 'Delhi',
    originIata: 'DEL',
    destCity: 'Guwahati',
    destIata: 'GAU',
    tier: 'UDAN-Regional',
    passengerWeight: 0.024,
    currentFare: 6890,
    previousFare: 6300,
    pctChange7d: 9.37,
    routeIndex: 125.1,
    volatilityScore: 74,
    observationCount: 4200,
    dominantAirline: 'IndiGo',
    airlines: [
      { airline: 'IndiGo', avgFare: 6700, marketShare: 0.68, flightCount: 14 },
      { airline: 'Air India', avgFare: 7300, marketShare: 0.32, flightCount: 6 }
    ],
    leadTimeFares: { 'T-0': 13200, 'T-7': 7900, 'T-15': 6200, 'T-30+': 4900 },
    trend30d: [
      { date: '15 Aug', fare: 6100 },
      { date: '22 Aug', fare: 6250 },
      { date: '29 Aug', fare: 6350 },
      { date: '05 Sep', fare: 6600 },
      { date: '14 Sep', fare: 6890 }
    ]
  },
  {
    id: 'route-7',
    code: 'MAA-DEL',
    originCity: 'Chennai',
    originIata: 'MAA',
    destCity: 'Delhi',
    destIata: 'DEL',
    tier: 'Metro-Metro',
    passengerWeight: 0.052,
    currentFare: 6720,
    previousFare: 6510,
    pctChange7d: 3.23,
    routeIndex: 117.8,
    volatilityScore: 48,
    observationCount: 7800,
    dominantAirline: 'IndiGo',
    airlines: [
      { airline: 'IndiGo', avgFare: 6550, marketShare: 0.55, flightCount: 20 },
      { airline: 'Air India', avgFare: 7100, marketShare: 0.35, flightCount: 12 },
      { airline: 'SpiceJet', avgFare: 6300, marketShare: 0.10, flightCount: 4 }
    ],
    leadTimeFares: { 'T-0': 11800, 'T-7': 7500, 'T-15': 6100, 'T-30+': 4800 },
    trend30d: [
      { date: '15 Aug', fare: 6450 },
      { date: '22 Aug', fare: 6490 },
      { date: '29 Aug', fare: 6540 },
      { date: '05 Sep', fare: 6630 },
      { date: '14 Sep', fare: 6720 }
    ]
  }
];

// Realistic Anomaly & Alert records
export const mockAnomalies: AnomalyRecord[] = [
  {
    id: 'ANOM-2026-0914-01',
    routeCode: 'BOM-GOI',
    origin: 'Mumbai (BOM)',
    destination: 'Goa (GOI)',
    airline: 'IndiGo',
    source: 'MakeMyTrip API',
    travelDate: '2026-09-15',
    bookingTimestamp: '2026-09-14 14:15:22 IST',
    observedFare: 18450,
    expectedMin: 4800,
    expectedMax: 9200,
    historicalMedian: 6200,
    zScore: 3.84,
    severity: 'HIGH',
    status: 'PENDING_REVIEW',
    ruleTriggered: 'Historical Mean +3.5σ Surge with Low Seat Density',
    calendarContext: 'Pre-long weekend spike; Festival rush observed in Western India',
    peerComparison: [
      { airline: 'IndiGo (6E-512)', fare: 18450 },
      { airline: 'Air India (AI-651)', fare: 9800 },
      { airline: 'Akasa Air (QP-1314)', fare: 9100 }
    ],
    reviewNotes: 'Surge concentrated solely on late evening slot; 3 remaining seats reported.'
  },
  {
    id: 'ANOM-2026-0914-02',
    routeCode: 'DEL-GAU',
    origin: 'Delhi (DEL)',
    destination: 'Guwahati (GAU)',
    airline: 'Air India',
    source: 'Direct GDS',
    travelDate: '2026-09-16',
    bookingTimestamp: '2026-09-14 11:42:10 IST',
    observedFare: 21900,
    expectedMin: 7200,
    expectedMax: 13500,
    historicalMedian: 8400,
    zScore: 3.42,
    severity: 'HIGH',
    status: 'VALIDATED',
    ruleTriggered: 'Bilateral Peer Divergence (>110% above median)',
    calendarContext: 'Monsoon landslide alerts causing rail disruption in NE corridor',
    peerComparison: [
      { airline: 'Air India (AI-889)', fare: 21900 },
      { airline: 'IndiGo (6E-208)', fare: 12400 },
      { airline: 'SpiceJet (SG-169)', fare: 11800 }
    ],
    reviewNotes: 'Rail blockages transferred urgent passenger load to air carriers.',
    reviewer: 'P. Verma (MoSPI Joint Director)',
    updatedAt: '2026-09-14 15:30:00 IST'
  },
  {
    id: 'ANOM-2026-0913-03',
    routeCode: 'DEL-BOM',
    origin: 'Delhi (DEL)',
    destination: 'Mumbai (BOM)',
    airline: 'SpiceJet',
    source: 'EaseMyTrip',
    travelDate: '2026-09-21',
    bookingTimestamp: '2026-09-13 18:05:44 IST',
    observedFare: 1680,
    expectedMin: 3800,
    expectedMax: 8200,
    historicalMedian: 5900,
    zScore: -2.95,
    severity: 'MEDIUM',
    status: 'REJECTED',
    ruleTriggered: 'Negative Outlier Floor Violation (<40% of baseline minimum)',
    calendarContext: 'Standard off-peak weekday',
    peerComparison: [
      { airline: 'SpiceJet (SG-8169)', fare: 1680 },
      { airline: 'IndiGo (6E-2051)', fare: 6200 },
      { airline: 'Air India (AI-805)', fare: 6800 }
    ],
    reviewNotes: 'Scraping defect: Aggregator promo voucher was inadvertently included before checkout.',
    reviewer: 'A. Sharma (Statistical Officer)',
    updatedAt: '2026-09-14 09:15:00 IST'
  },
  {
    id: 'ANOM-2026-0912-04',
    routeCode: 'BLR-DEL',
    origin: 'Bengaluru (BLR)',
    destination: 'Delhi (DEL)',
    airline: 'Akasa Air',
    source: 'Cleartrip',
    travelDate: '2026-09-14',
    bookingTimestamp: '2026-09-12 22:11:05 IST',
    observedFare: 15400,
    expectedMin: 6500,
    expectedMax: 11000,
    historicalMedian: 7800,
    zScore: 2.65,
    severity: 'MEDIUM',
    status: 'RESOLVED',
    ruleTriggered: 'T-0 / T-1 Acceleration Rate Outlier',
    calendarContext: 'Tech conference in New Delhi',
    peerComparison: [
      { airline: 'Akasa (QP-1120)', fare: 15400 },
      { airline: 'IndiGo (6E-5032)', fare: 13900 },
      { airline: 'Air India (AI-506)', fare: 14800 }
    ],
    reviewNotes: 'Market-wide end-of-window surge verified. Reclassified as natural market movement.',
    reviewer: 'K. Sundaram (Economist, RBI)',
    updatedAt: '2026-09-13 11:00:00 IST'
  },
  {
    id: 'ANOM-2026-0911-05',
    routeCode: 'CCU-IXB',
    origin: 'Kolkata (CCU)',
    destination: 'Bagdogra (IXB)',
    airline: 'IndiGo',
    source: 'Yatra API',
    travelDate: '2026-09-18',
    bookingTimestamp: '2026-09-11 16:20:18 IST',
    observedFare: 12500,
    expectedMin: 3200,
    expectedMax: 6800,
    historicalMedian: 4500,
    zScore: 3.10,
    severity: 'HIGH',
    status: 'PENDING_REVIEW',
    ruleTriggered: 'Regional Route Capacity Squeeze',
    calendarContext: 'Early Durga Puja inbound leisure rush',
    peerComparison: [
      { airline: 'IndiGo (6E-6721)', fare: 12500 },
      { airline: 'SpiceJet (SG-321)', fare: 7900 }
    ],
    reviewNotes: 'Under review for potential temporary winsorization in Regional Sub-Index.'
  }
];

// Raw & Normalized Observations Sample
export const mockObservations: FareObservation[] = [
  {
    id: 'OBS-7892101',
    routeCode: 'DEL-BOM',
    flightNo: '6E-2051',
    airline: 'IndiGo',
    source: 'MakeMyTrip API',
    cabinClass: 'Economy',
    scrapeTimestamp: '2026-09-14 17:15:00 IST',
    travelDate: '2026-09-14',
    leadTimeDays: 0,
    leadTimeCategory: 'T-0',
    baseFare: 9800,
    surcharges: 950,
    taxes: 650,
    totalFare: 11400,
    seatsRemaining: 2,
    qualityFlag: 'VERIFIED'
  },
  {
    id: 'OBS-7892102',
    routeCode: 'DEL-BOM',
    flightNo: 'AI-805',
    airline: 'Air India',
    source: 'Direct GDS',
    cabinClass: 'Economy',
    scrapeTimestamp: '2026-09-14 17:15:00 IST',
    travelDate: '2026-09-21',
    leadTimeDays: 7,
    leadTimeCategory: 'T-7',
    baseFare: 5800,
    surcharges: 850,
    taxes: 550,
    totalFare: 7200,
    seatsRemaining: 18,
    qualityFlag: 'VERIFIED'
  },
  {
    id: 'OBS-7892103',
    routeCode: 'BOM-GOI',
    flightNo: '6E-512',
    airline: 'IndiGo',
    source: 'EaseMyTrip',
    cabinClass: 'Economy',
    scrapeTimestamp: '2026-09-14 17:10:00 IST',
    travelDate: '2026-09-15',
    leadTimeDays: 1,
    leadTimeCategory: 'T-0',
    baseFare: 16200,
    surcharges: 1200,
    taxes: 1050,
    totalFare: 18450,
    seatsRemaining: 1,
    qualityFlag: 'FLAGGED_ANOMALY'
  },
  {
    id: 'OBS-7892104',
    routeCode: 'BLR-DEL',
    flightNo: 'QP-1120',
    airline: 'Akasa Air',
    source: 'Cleartrip',
    cabinClass: 'Economy',
    scrapeTimestamp: '2026-09-14 17:05:00 IST',
    travelDate: '2026-09-29',
    leadTimeDays: 15,
    leadTimeCategory: 'T-15',
    baseFare: 5200,
    surcharges: 750,
    taxes: 450,
    totalFare: 6400,
    seatsRemaining: 34,
    qualityFlag: 'VERIFIED'
  },
  {
    id: 'OBS-7892105',
    routeCode: 'DEL-CCU',
    flightNo: 'AI-20',
    airline: 'Air India',
    source: 'Direct GDS',
    cabinClass: 'Economy',
    scrapeTimestamp: '2026-09-14 17:00:00 IST',
    travelDate: '2026-10-14',
    leadTimeDays: 30,
    leadTimeCategory: 'T-30+',
    baseFare: 3450,
    surcharges: 550,
    taxes: 300,
    totalFare: 4300,
    seatsRemaining: 55,
    qualityFlag: 'VERIFIED'
  },
  {
    id: 'OBS-7892106',
    routeCode: 'HYD-BLR',
    flightNo: '6E-341',
    airline: 'IndiGo',
    source: 'Yatra API',
    cabinClass: 'Economy',
    scrapeTimestamp: '2026-09-14 16:55:00 IST',
    travelDate: '2026-09-21',
    leadTimeDays: 7,
    leadTimeCategory: 'T-7',
    baseFare: 3100,
    surcharges: 600,
    taxes: 400,
    totalFare: 4100,
    seatsRemaining: 21,
    qualityFlag: 'VERIFIED'
  },
  {
    id: 'OBS-7892107',
    routeCode: 'DEL-GAU',
    flightNo: 'SG-169',
    airline: 'SpiceJet',
    source: 'MakeMyTrip API',
    cabinClass: 'Economy',
    scrapeTimestamp: '2026-09-14 16:45:00 IST',
    travelDate: '2026-09-14',
    leadTimeDays: 0,
    leadTimeCategory: 'T-0',
    baseFare: 9800,
    surcharges: 1100,
    taxes: 900,
    totalFare: 11800,
    seatsRemaining: 4,
    qualityFlag: 'VERIFIED'
  },
  {
    id: 'OBS-7892108',
    routeCode: 'MAA-DEL',
    flightNo: 'AI-542',
    airline: 'Air India',
    source: 'Direct GDS',
    cabinClass: 'Economy',
    scrapeTimestamp: '2026-09-14 16:30:00 IST',
    travelDate: '2026-10-18',
    leadTimeDays: 34,
    leadTimeCategory: 'T-30+',
    baseFare: 3900,
    surcharges: 550,
    taxes: 350,
    totalFare: 4800,
    seatsRemaining: 48,
    qualityFlag: 'VERIFIED'
  }
];

// Audit Trail immutable records
export const mockAuditTrail: AuditRecord[] = [
  {
    id: 'AUD-99120',
    runId: 'RUN-20260914-1700',
    stage: 'Statistical Index Engine',
    timestamp: '2026-09-14 17:30:15 IST',
    schemaVersion: 'mospi.cpi.airfare.v2.4',
    formulaVersion: 'Fisher-Ideal-Laspeyres-Hybrid-2026.04',
    inputRecords: 148290,
    outputRecords: 1,
    hash: 'sha256:7f4c91a0b3e6488d929aa98218171092e01',
    operator: 'AUTOMATED_SCHEDULER',
    notes: 'Hourly Fisher composite calculated. National Index: 118.42 (+3.24% MoM).'
  },
  {
    id: 'AUD-99119',
    runId: 'RUN-20260914-1700',
    stage: 'Anomaly Scoring',
    timestamp: '2026-09-14 17:22:04 IST',
    schemaVersion: 'mospi.cpi.airfare.v2.4',
    formulaVersion: 'ZScore-Rolling30d-PeerDivergence-v3.1',
    inputRecords: 148290,
    outputRecords: 14,
    hash: 'sha256:4b210ae89912f71903bcde349281a81b212',
    operator: 'ANOMALY_DETECTOR',
    notes: '14 observations flagged (>2.5 sigma deviation). Non-destructive tagging.'
  },
  {
    id: 'AUD-99118',
    runId: 'RUN-20260914-1700',
    stage: 'Lead-Time Classification',
    timestamp: '2026-09-14 17:15:40 IST',
    schemaVersion: 'mospi.cpi.airfare.v2.4',
    formulaVersion: 'Standard-T0-T7-T15-T30-Rules',
    inputRecords: 148290,
    outputRecords: 148290,
    hash: 'sha256:8819ab329cd01fe1928477102049182bc81',
    operator: 'PIPELINE_WORKER_04',
    notes: 'Observations classified: T-0 (18%), T-7 (31%), T-15 (27%), T-30+ (24%).'
  },
  {
    id: 'AUD-99117',
    runId: 'RUN-20260914-1700',
    stage: 'Cleaning & Normalization',
    timestamp: '2026-09-14 17:08:12 IST',
    schemaVersion: 'mospi.cpi.airfare.v2.4',
    formulaVersion: 'Aviation-Tax-Fee-Decomposer-v1.8',
    inputRecords: 149020,
    outputRecords: 148290,
    hash: 'sha256:1029ba8814710bc82103498bfe192837482',
    operator: 'NORMALIZATION_SERVICE',
    notes: '730 duplicate scraping hits purged. Base fare and statutory UDF/PSF standardized.'
  },
  {
    id: 'AUD-99116',
    runId: 'RUN-20260914-1700',
    stage: 'Data Collection',
    timestamp: '2026-09-14 17:00:01 IST',
    schemaVersion: 'mospi.cpi.airfare.v2.4',
    formulaVersion: 'MultiSource-Scraper-Coordinator-v2.0',
    inputRecords: 0,
    outputRecords: 149020,
    hash: 'sha256:d817290fa8192873b8812c9840291048123',
    operator: 'INGESTION_COORDINATOR',
    notes: '8 collection adapters executed across 428 routes. Average response: 342ms.'
  }
];

// Pipeline Source Health Statuses
export const mockSourceHealth: SourceHealthMetric[] = [
  {
    id: 'src-1',
    sourceName: 'IndiGo Direct GDS API',
    type: 'Airline Direct API',
    status: 'OPERATIONAL',
    successRate24h: 99.85,
    avgLatencyMs: 245,
    observations24h: 62400,
    lastScraped: '2 mins ago',
    errorRate: 0.15,
    adapterVersion: 'v3.4.1'
  },
  {
    id: 'src-2',
    sourceName: 'Air India NDC Connection',
    type: 'Airline Direct API',
    status: 'OPERATIONAL',
    successRate24h: 99.40,
    avgLatencyMs: 310,
    observations24h: 38200,
    lastScraped: '3 mins ago',
    errorRate: 0.60,
    adapterVersion: 'v2.8.0'
  },
  {
    id: 'src-3',
    sourceName: 'MakeMyTrip Enterprise Feed',
    type: 'OTA Aggregator',
    status: 'OPERATIONAL',
    successRate24h: 99.12,
    avgLatencyMs: 420,
    observations24h: 21500,
    lastScraped: '1 min ago',
    errorRate: 0.88,
    adapterVersion: 'v4.1.0'
  },
  {
    id: 'src-4',
    sourceName: 'EaseMyTrip Web Adapter',
    type: 'OTA Aggregator',
    status: 'OPERATIONAL',
    successRate24h: 98.65,
    avgLatencyMs: 540,
    observations24h: 12400,
    lastScraped: '4 mins ago',
    errorRate: 1.35,
    adapterVersion: 'v2.1.2'
  },
  {
    id: 'src-5',
    sourceName: 'Akasa Air Direct API',
    type: 'Airline Direct API',
    status: 'OPERATIONAL',
    successRate24h: 99.70,
    avgLatencyMs: 280,
    observations24h: 8900,
    lastScraped: '2 mins ago',
    errorRate: 0.30,
    adapterVersion: 'v1.9.4'
  },
  {
    id: 'src-6',
    sourceName: 'Cleartrip Search Adapter',
    type: 'OTA Aggregator',
    status: 'DEGRADED',
    successRate24h: 94.20,
    avgLatencyMs: 1150,
    observations24h: 4200,
    lastScraped: '8 mins ago',
    errorRate: 5.80,
    adapterVersion: 'v2.0.1'
  },
  {
    id: 'src-7',
    sourceName: 'SpiceJet Booking Interface',
    type: 'Airline Direct API',
    status: 'OPERATIONAL',
    successRate24h: 97.80,
    avgLatencyMs: 620,
    observations24h: 3100,
    lastScraped: '5 mins ago',
    errorRate: 2.20,
    adapterVersion: 'v1.4.0'
  },
  {
    id: 'src-8',
    sourceName: 'Yatra Public Search',
    type: 'OTA Aggregator',
    status: 'OPERATIONAL',
    successRate24h: 98.10,
    avgLatencyMs: 580,
    observations24h: 2800,
    lastScraped: '6 mins ago',
    errorRate: 1.90,
    adapterVersion: 'v1.7.0'
  }
];

// Explainability Tree
export const mockExplainabilityTree: IndexContributionNode = {
  name: 'National Airfare Price Index',
  contributionPoints: 3.24,
  percentageShare: 100,
  currentValue: 118.42,
  previousValue: 114.70,
  weight: 1.0,
  children: [
    {
      name: 'Delhi - Mumbai (DEL-BOM)',
      contributionPoints: 0.82,
      percentageShare: 25.3,
      currentValue: 122.4,
      previousValue: 116.1,
      weight: 0.092,
      children: [
        {
          name: 'IndiGo (Market Share: 54%)',
          contributionPoints: 0.44,
          percentageShare: 13.6,
          currentValue: 6250,
          previousValue: 5900,
          weight: 0.050,
          children: [
            { name: 'T-0 (Same Day)', contributionPoints: 0.28, percentageShare: 8.6, currentValue: 11400, previousValue: 9800, weight: 0.015 },
            { name: 'T-7 (1-Week Advance)', contributionPoints: 0.11, percentageShare: 3.4, currentValue: 7200, previousValue: 6900, weight: 0.020 },
            { name: 'T-15 (2-Week Advance)', contributionPoints: 0.04, percentageShare: 1.2, currentValue: 5800, previousValue: 5650, weight: 0.010 },
            { name: 'T-30+ (Advance Booking)', contributionPoints: 0.01, percentageShare: 0.3, currentValue: 4600, previousValue: 4550, weight: 0.005 }
          ]
        },
        {
          name: 'Air India (Market Share: 28%)',
          contributionPoints: 0.26,
          percentageShare: 8.0,
          currentValue: 6850,
          previousValue: 6450,
          weight: 0.026
        },
        {
          name: 'Akasa Air (Market Share: 12%)',
          contributionPoints: 0.08,
          percentageShare: 2.5,
          currentValue: 5900,
          previousValue: 5650,
          weight: 0.011
        },
        {
          name: 'SpiceJet (Market Share: 6%)',
          contributionPoints: 0.04,
          percentageShare: 1.2,
          currentValue: 6100,
          previousValue: 5950,
          weight: 0.005
        }
      ]
    },
    {
      name: 'Bengaluru - Delhi (BLR-DEL)',
      contributionPoints: 0.65,
      percentageShare: 20.1,
      currentValue: 120.8,
      previousValue: 115.3,
      weight: 0.078
    },
    {
      name: 'Mumbai - Goa (BOM-GOI)',
      contributionPoints: 0.58,
      percentageShare: 17.9,
      currentValue: 129.6,
      previousValue: 112.2,
      weight: 0.045
    },
    {
      name: 'Delhi - Guwahati (DEL-GAU)',
      contributionPoints: 0.42,
      percentageShare: 13.0,
      currentValue: 125.1,
      previousValue: 114.4,
      weight: 0.024
    },
    {
      name: 'Chennai - Delhi (MAA-DEL)',
      contributionPoints: 0.31,
      percentageShare: 9.6,
      currentValue: 117.8,
      previousValue: 114.1,
      weight: 0.052
    },
    {
      name: 'All Other 423 Domestic Routes',
      contributionPoints: 0.46,
      percentageShare: 14.1,
      currentValue: 114.2,
      previousValue: 113.8,
      weight: 0.709
    }
  ]
};

// Official generated reports
export const mockReports: GeneratedReport[] = [
  {
    id: 'DOC-2026-ALGO-SPEC',
    title: 'Airfare Price Index (API) Engine & Algorithmic Framework Specification',
    type: 'Methodology Comparison Report',
    period: 'MoSPI & DGCA Standard v2.4.1',
    format: 'PDF',
    generatedAt: '17 Sep 2026 11:40 IST',
    fileSize: '851 KB',
    checksum: '7f4c91a0b3e6488d',
    status: 'READY'
  },
  {
    id: 'REP-2026-09-01',
    title: 'Monthly CPI Airfare Augmentation Bulletin - August 2026',
    type: 'Monthly CPI Airfare Bulletin',
    period: 'Aug 01 - Aug 31, 2026',
    format: 'PDF',
    generatedAt: '01 Sep 2026 10:00 IST',
    fileSize: '4.8 MB',
    checksum: 'a89f7b1029cde882',
    status: 'READY'
  },
  {
    id: 'REP-2026-09-14-VOL',
    title: 'Domestic Route Volatility Dossier (Top 50 Corridors)',
    type: 'Route Volatility Dossier',
    period: 'Trailing 30 Days (15 Aug - 14 Sep 2026)',
    format: 'XLSX',
    generatedAt: '14 Sep 2026 06:00 IST',
    fileSize: '12.4 MB',
    checksum: '31fe982acb789120',
    status: 'READY'
  },
  {
    id: 'REP-2026-09-14-ANOM',
    title: 'MoSPI Statistical Anomaly & Outlier Triage Audit',
    type: 'High-Severity Anomaly Audit',
    period: 'Sep 01 - Sep 14, 2026',
    format: 'CSV',
    generatedAt: '14 Sep 2026 17:00 IST',
    fileSize: '1.2 MB',
    checksum: 'ef902187cc8192ab',
    status: 'READY'
  }
];
