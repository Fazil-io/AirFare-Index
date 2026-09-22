import React, { useState } from 'react';
import {
  Database,
  Search,
  Download,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Landmark,
  PieChart,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { mockObservations, officialCpiAnnexures, officialNssoTravel } from '../services/mockData';

type DatasetKey =
  | 'OBSERVATIONS'
  | 'CPI_TIME_SERIES'
  | 'CPI_DIVISIONS'
  | 'CPI_STATES'
  | 'NSSO_EXPENDITURE'
  | 'NSSO_DEMOGRAPHICS';

export const DataExplorer: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<DatasetKey>('OBSERVATIONS');
  const [searchTerm, setSearchTerm] = useState('');
  const [carrierFilter, setCarrierFilter] = useState('ALL');
  const [qualityFilter, setQualityFilter] = useState('ALL');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // 1. Observations
  const filteredObservations = mockObservations.filter(item => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.flightNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCarrier = carrierFilter === 'ALL' || item.airline === carrierFilter;
    const matchesQuality = qualityFilter === 'ALL' || item.qualityFlag === qualityFilter;
    return matchesSearch && matchesCarrier && matchesQuality;
  });

  // 2. CPI Monthly
  const filteredMonthly = (officialCpiAnnexures.monthlyGeneralCpi || []).filter(item =>
    item.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. CPI Divisions & Subgroup 07.3
  const filteredDivisions = (officialCpiAnnexures.divisions || []).filter(item =>
    item.divisionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.divisionCode.includes(searchTerm)
  );

  // 4. CPI States
  const filteredStates = (officialCpiAnnexures.stateCpi || []).filter(item =>
    item.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 5. NSSO Expenditure Table 5
  const filteredNssoExpenditure = (officialNssoTravel.stateExpenditure || []).filter(item =>
    item.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 6. NSSO Demographics & Purpose Table 1 & 2
  const filteredNssoVolumes = (officialNssoTravel.stateTravelVolumesTable1 || []).filter(item =>
    item.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    let csvContent = '';
    let filename = '';

    if (activeDataset === 'OBSERVATIONS') {
      const headers = ['Observation ID,Route,Flight No,Airline,Source,Lead Time,Base Fare (INR),Surcharges (INR),Taxes (INR),Total Fare (INR),Seats Remaining,Quality Flag,Timestamp\n'];
      const rows = filteredObservations.map(r =>
        `${r.id},${r.routeCode},${r.flightNo},${r.airline},${r.source},${r.leadTimeCategory},${r.baseFare},${r.surcharges},${r.taxes},${r.totalFare},${r.seatsRemaining || 'N/A'},${r.qualityFlag},${r.scrapeTimestamp}`
      );
      csvContent = headers.concat(rows.join('\n')).join('');
      filename = `mospi_airfare_observations_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeDataset === 'CPI_TIME_SERIES') {
      const headers = ['Month,Rural Index,Urban Index,Combined Index,Rural Inflation (%),Urban Inflation (%),Combined Inflation (%)\n'];
      const rows = filteredMonthly.map(r =>
        `${r.month},${r.ruralIndex ?? ''},${r.urbanIndex ?? ''},${r.combinedIndex ?? ''},${r.ruralInflation ?? ''},${r.urbanInflation ?? ''},${r.combinedInflation ?? ''}`
      );
      csvContent = headers.concat(rows.join('\n')).join('');
      filename = `mospi_cpi_annexure_iv_timeseries.csv`;
    } else if (activeDataset === 'CPI_DIVISIONS') {
      const headers = ['Division Code,Division Name,Rural Index,Urban Index,Combined Index,Combined Inflation (%)\n'];
      const rows = filteredDivisions.map(r =>
        `"${r.divisionCode}","${r.divisionName}",${r.ruralIndex ?? ''},${r.urbanIndex ?? ''},${r.combinedIndex ?? ''},${r.combinedInflation ?? ''}`
      );
      csvContent = headers.concat(rows.join('\n')).join('');
      filename = `mospi_cpi_annexure_i_divisions.csv`;
    } else if (activeDataset === 'CPI_STATES') {
      const headers = ['State/UT,Rural Index,Urban Index,Combined Index,Inflation (%)\n'];
      const rows = filteredStates.map(r =>
        `"${r.state}",${r.ruralIndex ?? ''},${r.urbanIndex ?? ''},${r.combinedIndex ?? ''},${r.inflation ?? ''}`
      );
      csvContent = headers.concat(rows.join('\n')).join('');
      filename = `mospi_cpi_annexure_iii_states.csv`;
    } else if (activeDataset === 'NSSO_EXPENDITURE') {
      const headers = ['State/UT,Holiday (INR),Medical (INR),Shopping (INR),Business (INR),Social (INR),Pilgrimage (INR),Education (INR)\n'];
      const rows = filteredNssoExpenditure.map(r =>
        `"${r.state}",${r.holiday ?? ''},${r.medical ?? ''},${r.shopping ?? ''},${r.business ?? ''},${r.social ?? ''},${r.pilgrimage ?? ''},${r.education ?? ''}`
      );
      csvContent = headers.concat(rows.join('\n')).join('');
      filename = `nsso_table5_travel_expenditure.csv`;
    } else if (activeDataset === 'NSSO_DEMOGRAPHICS') {
      const headers = ['State/UT,Urban Households (00),Total Persons (00),Overnight Visitors (00),Avg Household Size\n'];
      const rows = filteredNssoVolumes.map(r =>
        `"${r.state}",${r.urbanHouseholds ?? ''},${r.totalPersons ?? ''},${r.overnightVisitors ?? ''},${r.avgHouseholdSize ?? ''}`
      );
      csvContent = headers.concat(rows.join('\n')).join('');
      filename = `nsso_table1_travel_demographics.csv`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Institutional Banner */}
      <div className="ui-card p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
              OFFICIAL PROBLEM DATASET INTEGRATION
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              MoSPI CPI Annexures (Feb–Jul 2026) & NSSO Domestic Tourism Survey (Tables 1–7)
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Data Explorer & Grounded Statistical Repositories
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl mt-1">
            Explore live normalized airfare observation scrapes cross-referenced against the official problem statement dataset: MoSPI Consumer Price Index (Annexures I–IV) and NSSO 79th Round Domestic Tourism Survey tables.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all flex items-center gap-2 shadow-md cursor-pointer shrink-0"
        >
          {downloadSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          <span>{downloadSuccess ? 'Exported CSV' : 'Export Active Dataset (CSV)'}</span>
        </button>
      </div>

      {/* Dataset Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap pb-1 select-none shrink-0">
        <button
          onClick={() => { setActiveDataset('OBSERVATIONS'); setSearchTerm(''); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeDataset === 'OBSERVATIONS'
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'ui-card border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Scraped Airfare Observations</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">Lakehouse</span>
        </button>

        <button
          onClick={() => { setActiveDataset('CPI_TIME_SERIES'); setSearchTerm(''); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeDataset === 'CPI_TIME_SERIES'
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'ui-card border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>MoSPI CPI Time-Series</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">Annex-IV</span>
        </button>

        <button
          onClick={() => { setActiveDataset('CPI_DIVISIONS'); setSearchTerm(''); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeDataset === 'CPI_DIVISIONS'
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'ui-card border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Divisions & Sub-Group 07.3</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">Annex-I & II</span>
        </button>

        <button
          onClick={() => { setActiveDataset('CPI_STATES'); setSearchTerm(''); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeDataset === 'CPI_STATES'
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'ui-card border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>MoSPI State/UT CPI</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">Annex-III</span>
        </button>

        <button
          onClick={() => { setActiveDataset('NSSO_EXPENDITURE'); setSearchTerm(''); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeDataset === 'NSSO_EXPENDITURE'
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'ui-card border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>NSSO Travel Spend</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">Table 5</span>
        </button>

        <button
          onClick={() => { setActiveDataset('NSSO_DEMOGRAPHICS'); setSearchTerm(''); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeDataset === 'NSSO_DEMOGRAPHICS'
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'ui-card border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>NSSO Travel Volumes</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">Table 1 & 2</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="ui-card p-4 border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={
              activeDataset === 'OBSERVATIONS'
                ? 'Search Observation ID, Route, Flight (6E-2051)...'
                : 'Search State, Month, Division, or Region...'
            }
            className="w-full bg-slate-50 dark:bg-[#060b17] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {activeDataset === 'OBSERVATIONS' && (
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar flex-nowrap pb-1 md:pb-0 shrink-0 select-none">
            <div className="flex items-center bg-slate-50 dark:bg-[#060b17] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 shrink-0">
              <span className="text-slate-400 text-[11px] mr-1.5 font-mono">Carrier:</span>
              <select
                value={carrierFilter}
                onChange={e => setCarrierFilter(e.target.value)}
                className="bg-transparent text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Carriers</option>
                <option value="IndiGo">IndiGo</option>
                <option value="Air India">Air India</option>
                <option value="Akasa Air">Akasa Air</option>
                <option value="SpiceJet">SpiceJet</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-50 dark:bg-[#060b17] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 shrink-0">
              <span className="text-slate-400 text-[11px] mr-1.5 font-mono">Quality:</span>
              <select
                value={qualityFilter}
                onChange={e => setQualityFilter(e.target.value)}
                className="bg-transparent text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Quality Flags</option>
                <option value="VERIFIED">Verified</option>
                <option value="FLAGGED_ANOMALY">Flagged Outlier</option>
                <option value="IMPUTED">Imputed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Dataset 1: Scraped Observations */}
      {activeDataset === 'OBSERVATIONS' && (
        <div className="ui-card p-5 border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Ingested Price Records</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Granular price decomposition with statutory tax breakdown</p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Showing {filteredObservations.length} of {mockObservations.length} observations
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">ID / Route</th>
                  <th className="p-3">Flight / Carrier</th>
                  <th className="p-3">Window</th>
                  <th className="p-3">Base Fare</th>
                  <th className="p-3">Surcharges</th>
                  <th className="p-3">Taxes</th>
                  <th className="p-3 font-bold">Total Fare</th>
                  <th className="p-3">Quality</th>
                  <th className="p-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {filteredObservations.map(obs => (
                  <tr key={obs.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-medium">
                      <span className="text-blue-600 dark:text-blue-400 font-bold block">{obs.routeCode}</span>
                      <span className="text-[10px] text-slate-400">{obs.id}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 dark:text-white">{obs.flightNo}</span>
                      <span className="text-[10px] text-slate-400 block">{obs.airline}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                        {obs.leadTimeCategory}
                      </span>
                    </td>
                    <td className="p-3">₹{obs.baseFare.toLocaleString()}</td>
                    <td className="p-3 text-slate-400">₹{obs.surcharges.toLocaleString()}</td>
                    <td className="p-3 text-slate-400">₹{obs.taxes.toLocaleString()}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">₹{obs.totalFare.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        obs.qualityFlag === 'VERIFIED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : obs.qualityFlag === 'FLAGGED_ANOMALY'
                          ? 'bg-rose-500/10 text-rose-500 font-bold'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {obs.qualityFlag}
                      </span>
                    </td>
                    <td className="p-3 text-[10px] text-slate-400">{obs.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dataset 2: MoSPI CPI Time Series (Annexure-IV) */}
      {activeDataset === 'CPI_TIME_SERIES' && (
        <div className="ui-card p-5 border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">MoSPI All-India Combined General CPI (Annexure-IV)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Official monthly headline indices and year-on-year inflation series (Jan 2025 – Jul 2026)</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold">
              Base: 2024=100 / MoSPI Press Release
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3 font-mono">Period / Month</th>
                  <th className="p-3">Rural Index</th>
                  <th className="p-3">Urban Index</th>
                  <th className="p-3 font-bold">Combined Index</th>
                  <th className="p-3">Rural Inflation</th>
                  <th className="p-3">Urban Inflation</th>
                  <th className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Combined Inflation (YoY %)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {filteredMonthly.map(item => (
                  <tr key={item.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{item.month}</td>
                    <td className="p-3">{item.ruralIndex != null ? item.ruralIndex.toFixed(2) : '—'}</td>
                    <td className="p-3">{item.urbanIndex != null ? item.urbanIndex.toFixed(2) : '—'}</td>
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{item.combinedIndex != null ? item.combinedIndex.toFixed(2) : '—'}</td>
                    <td className="p-3 text-slate-400">{item.ruralInflation != null ? `+${item.ruralInflation.toFixed(2)}%` : 'Base'}</td>
                    <td className="p-3 text-slate-400">{item.urbanInflation != null ? `+${item.urbanInflation.toFixed(2)}%` : 'Base'}</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {item.combinedInflation != null ? `+${item.combinedInflation.toFixed(2)}%` : 'Base Year'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dataset 3: CPI Divisions (Annexure-I) & Subgroup 07.3 (Annexure-II) */}
      {activeDataset === 'CPI_DIVISIONS' && (
        <div className="space-y-6">
          {/* Sub-Group 07.3 Highlight Card */}
          <div className="ui-card p-5 border border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 via-blue-500/5 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                  CPI SUB-GROUP 07.3
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Passenger Transport Services Official Index Evolution</h4>
              </div>
              <span className="text-xs text-slate-500 font-mono">Annexure-II Release Series</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Official MoSPI CPI Sub-group 07.3 (Passenger Transport Services) tracks air, railway, and passenger bus movements. The High-Frequency Airfare Index directly augments this series with real-time lead-time sensitivity.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {officialCpiAnnexures.passengerTransportGroup.map(pt => (
                <div key={pt.month} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono block">{pt.month}</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{pt.combinedIndex.toFixed(2)}</div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">+{pt.inflation.toFixed(2)}% YoY</span>
                </div>
              ))}
            </div>
          </div>

          {/* Division-Wise Table */}
          <div className="ui-card p-5 border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">All-India Division-Wise Indices (Annexure-I: July 2026)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">All 12 CPI Divisions with Rural, Urban, and Combined weights</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold">
                Division 07: Transport
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 font-mono">Code</th>
                    <th className="p-3">Division Name</th>
                    <th className="p-3">Rural Index</th>
                    <th className="p-3">Urban Index</th>
                    <th className="p-3 font-bold">Combined Index</th>
                    <th className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Combined Inflation (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {filteredDivisions.map(div => {
                    const isTransport = div.divisionCode === '07';
                    return (
                      <tr key={div.divisionCode} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${isTransport ? 'bg-blue-50/50 dark:bg-blue-950/20 font-bold' : ''}`}>
                        <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{div.divisionCode}</td>
                        <td className="p-3 font-sans">
                          {div.divisionName}
                          {isTransport && (
                            <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-600 dark:text-blue-300 uppercase">
                              Target Domain
                            </span>
                          )}
                        </td>
                        <td className="p-3">{div.ruralIndex != null ? div.ruralIndex.toFixed(2) : '—'}</td>
                        <td className="p-3">{div.urbanIndex != null ? div.urbanIndex.toFixed(2) : '—'}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{div.combinedIndex != null ? div.combinedIndex.toFixed(2) : '—'}</td>
                        <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                          {div.combinedInflation != null ? `+${div.combinedInflation.toFixed(2)}%` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dataset 4: MoSPI State-wise CPI (Annexure-III) */}
      {activeDataset === 'CPI_STATES' && (
        <div className="ui-card p-5 border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">State/UT-wise General Index & Inflation (Annexure-III)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Official geographical CPI disaggregation across all 36 Indian States and Union Territories</p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Showing {filteredStates.length} States/UTs
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">State / Union Territory</th>
                  <th className="p-3">Rural CPI</th>
                  <th className="p-3">Urban CPI</th>
                  <th className="p-3 font-bold">Combined CPI</th>
                  <th className="p-3">Inflation Rate (%)</th>
                  <th className="p-3">Primary Hub Airport</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {filteredStates.map(s => (
                  <tr key={s.state} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-slate-900 dark:text-white font-sans">{s.state}</td>
                    <td className="p-3">{s.ruralIndex != null ? s.ruralIndex.toFixed(2) : '—'}</td>
                    <td className="p-3">{s.urbanIndex != null ? s.urbanIndex.toFixed(2) : '—'}</td>
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{s.combinedIndex != null ? s.combinedIndex.toFixed(2) : '—'}</td>
                    <td className="p-3 font-bold">
                      {s.inflation != null ? (
                        <span className={s.inflation > 5.0 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}>
                          +{s.inflation.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="p-3 text-[10px] text-slate-400 font-sans">
                      {s.state.includes('Delhi') ? 'DEL (Indira Gandhi Intl)' :
                       s.state.includes('Maharashtra') ? 'BOM, PNQ' :
                       s.state.includes('Karnataka') ? 'BLR, IXE' :
                       s.state.includes('Tamil Nadu') ? 'MAA, CJB' :
                       s.state.includes('Telangana') ? 'HYD (Rajiv Gandhi)' :
                       s.state.includes('West Bengal') ? 'CCU (Netaji Subhash)' :
                       s.state.includes('Chandigarh') ? 'IXC (Shaheed Bhagat)' : 'Regional / UDAN Tier'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dataset 5: NSSO Travel Expenditure (Table 5) */}
      {activeDataset === 'NSSO_EXPENDITURE' && (
        <div className="ui-card p-5 border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">NSSO Domestic Tourism Travel Expenditure Survey (Table 5)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Average expenditure (₹) per overnight trip across primary leading trip purposes</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold">
              NSSO Survey Grounding
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">State / Union Territory</th>
                  <th className="p-3 font-bold text-indigo-600 dark:text-indigo-400">Holidaying & Leisure</th>
                  <th className="p-3 font-bold text-blue-600 dark:text-blue-400">Business Travel</th>
                  <th className="p-3">Shopping</th>
                  <th className="p-3">Health & Medical</th>
                  <th className="p-3">Social Trips</th>
                  <th className="p-3">Pilgrimage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {filteredNssoExpenditure.map(item => (
                  <tr key={item.state} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-slate-900 dark:text-white font-sans">{item.state}</td>
                    <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">
                      {item.holiday != null ? `₹${item.holiday.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">
                      {item.business != null ? `₹${item.business.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-3">{item.shopping != null ? `₹${item.shopping.toLocaleString()}` : '—'}</td>
                    <td className="p-3">{item.medical != null ? `₹${item.medical.toLocaleString()}` : '—'}</td>
                    <td className="p-3 text-slate-400">{item.social != null ? `₹${item.social.toLocaleString()}` : '—'}</td>
                    <td className="p-3 text-slate-400">{item.pilgrimage != null ? `₹${item.pilgrimage.toLocaleString()}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dataset 6: NSSO Travel Demographics (Table 1 & Table 2) */}
      {activeDataset === 'NSSO_DEMOGRAPHICS' && (
        <div className="space-y-6">
          {/* National Urban Share Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="ui-card p-4 border">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Leisure & Holidaying</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">58.9%</div>
              <p className="text-[11px] text-slate-500 mt-1">National urban trip share (Avg spend ₹13,026). Major driver of Goa, Srinagar, Bagdogra surge.</p>
            </div>
            <div className="ui-card p-4 border">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Business Corridors</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">12.9%</div>
              <p className="text-[11px] text-slate-500 mt-1">High-yield corporate travel (Avg spend ₹8,420). Drives last-minute T-0 premium on DEL-BOM.</p>
            </div>
            <div className="ui-card p-4 border">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Social & Visiting Friends</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">25.0%</div>
              <p className="text-[11px] text-slate-500 mt-1">Stable demographic baseline (Avg spend ₹3,820) across all domestic corridors.</p>
            </div>
          </div>

          {/* Table 1: Demographics by State */}
          <div className="ui-card p-5 border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">State/UT Estimated Travel Volumes (Table 1: Urban)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Urban households, total persons, overnight visitors, and average household size</p>
              </div>
              <span className="text-xs text-slate-500 font-mono">NSSO 79th Round</span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">State / Union Territory</th>
                    <th className="p-3">Urban Households (00)</th>
                    <th className="p-3">Total Population (00)</th>
                    <th className="p-3 font-bold text-blue-600 dark:text-blue-400">Overnight Visitors (00)</th>
                    <th className="p-3">Avg Household Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {filteredNssoVolumes.map(vol => (
                    <tr key={vol.state} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white font-sans">{vol.state}</td>
                      <td className="p-3">{vol.urbanHouseholds != null ? vol.urbanHouseholds.toLocaleString() : '—'}</td>
                      <td className="p-3">{vol.totalPersons != null ? vol.totalPersons.toLocaleString() : '—'}</td>
                      <td className="p-3 font-bold text-blue-600 dark:text-blue-400">
                        {vol.overnightVisitors != null ? vol.overnightVisitors.toLocaleString() : '—'}
                      </td>
                      <td className="p-3">{vol.avgHouseholdSize != null ? vol.avgHouseholdSize.toFixed(2) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
