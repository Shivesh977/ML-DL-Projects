import React, { useState, useEffect } from 'react';
import { Calendar, Tag, Shield, Eye, FileText, AlertCircle, RefreshCw, BarChart } from 'lucide-react';

export default function HistoryDashboard() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Fetch stats
      const statsRes = await fetch('http://127.0.0.1:8000/api/history/stats/', {
        headers: { 'Authorization': `Token ${token}` }
      });
      const statsData = await statsRes.json();
      if (!statsRes.ok) throw new Error('Stats api error.');
      setStats(statsData);

      // Fetch history list
      const histRes = await fetch('http://127.0.0.1:8000/api/history/', {
        headers: { 'Authorization': `Token ${token}` }
      });
      const histData = await histRes.json();
      if (!histRes.ok) throw new Error('History api error.');
      setHistory(histData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSeverityStyle = (sev) => {
    if (sev === 'Severe') return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
    if (sev === 'Moderate') return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
  };

  // Custom SVG Bar Chart calculation (Most Common Diseases)
  const renderBarChart = () => {
    if (!stats || !stats.disease_distribution || stats.disease_distribution.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs font-semibold">
          No diagnostic logs recorded yet.
        </div>
      );
    }

    const items = stats.disease_distribution.slice(0, 5); // top 5
    const maxVal = Math.max(...items.map(i => i.value), 1);
    
    return (
      <div className="space-y-3.5 py-2">
        {items.map((item, idx) => {
          const pct = (item.value / maxVal) * 100;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 truncate max-w-[200px]">{item.name}</span>
                <span className="text-brand-400">{item.value} {item.value === 1 ? 'Scan' : 'Scans'}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-dark-900/60 overflow-hidden relative">
                <div
                  className="bg-gradient-to-r from-brand-600 to-brand-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Custom SVG Area Chart calculation (Crop Health Trend - Last 30 Days)
  const renderTrendChart = () => {
    if (!stats || !stats.health_trend || stats.health_trend.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs font-semibold">
          No history scans in the last 30 days.
        </div>
      );
    }

    const data = stats.health_trend;
    const maxVal = Math.max(...data.map(d => d.healthy + d.diseased), 2);
    
    // Draw Area Coordinates
    const width = 500;
    const height = 150;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const pointsHealthy = [];
    const pointsDiseased = [];
    
    data.forEach((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      
      const yH = padding + chartHeight - (d.healthy / maxVal) * chartHeight;
      const yD = padding + chartHeight - (d.diseased / maxVal) * chartHeight;
      
      pointsHealthy.push(`${x},${yH}`);
      pointsDiseased.push(`${x},${yD}`);
    });

    const dH = pointsHealthy.length > 0 ? `M ${pointsHealthy.join(' L ')}` : '';
    const dD = pointsDiseased.length > 0 ? `M ${pointsDiseased.join(' L ')}` : '';

    return (
      <div className="w-full py-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
          {/* Gradients */}
          <defs>
            <linearGradient id="gradH" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
            </linearGradient>
            <linearGradient id="gradD" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0"/>
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1={padding} y1={padding + chartHeight/2} x2={width - padding} y2={padding + chartHeight/2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1={padding} y1={padding + chartHeight} x2={width - padding} y2={padding + chartHeight} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

          {/* Area under Curves */}
          {pointsHealthy.length > 0 && (
            <path
              d={`${dH} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
              fill="url(#gradH)"
            />
          )}
          {pointsDiseased.length > 0 && (
            <path
              d={`${dD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
              fill="url(#gradD)"
            />
          )}

          {/* Lines */}
          {dH && <path d={dH} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />}
          {dD && <path d={dD} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />}
          
          {/* Axis Labels */}
          <text x={padding} y={height - 2} fill="#64748b" fontSize="8" fontWeight="bold">30 Days Ago</text>
          <text x={width - padding} y={height - 2} fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="end">Today</text>
        </svg>
        <div className="flex justify-center gap-4 mt-3 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <div className="h-2 w-5 bg-emerald-500 rounded" /> Healthy Scans
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <div className="h-2 w-5 bg-rose-500 rounded" /> Disease Infections
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-up space-y-8">
      
      {/* Title Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold font-display text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
          Diagnosis History & Dashboard
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
          Monitor your agricultural health statistics. Analyze crop infection trends, most common pathogens, and view complete diagnostic records.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
          <AlertCircle className="h-4.5 w-4.5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. AGGREGATE COUNTER GRID */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] block text-slate-500 font-bold uppercase tracking-wider">Total Leaf Scans</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-white">{stats.total_scans}</span>
              <span className="text-[9px] text-slate-400 font-medium">All recorded crops</span>
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] block text-slate-500 font-bold uppercase tracking-wider">Healthy Leaves</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-emerald-400">{stats.healthy_scans}</span>
              <span className="text-[10px] text-emerald-500/80 font-bold">
                {stats.total_scans > 0 ? Math.round((stats.healthy_scans / stats.total_scans) * 100) : 0}% Healthy Ratio
              </span>
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] block text-slate-500 font-bold uppercase tracking-wider">Diseased Outbreaks</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-rose-400">{stats.diseased_scans}</span>
              <span className="text-[10px] text-rose-500/80 font-bold">
                {stats.total_scans > 0 ? Math.round((stats.diseased_scans / stats.total_scans) * 100) : 0}% Pathogen Ratio
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. DUAL CHART CANVASES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart A: Pathogen Distribution */}
        <div className="glass-panel rounded-3xl p-6 border border-white/5">
          <h3 className="text-sm font-bold font-display text-slate-300 uppercase tracking-wider border-b border-white/5 pb-3.5 mb-4 flex items-center gap-1.5">
            <BarChart className="h-4.5 w-4.5 text-brand-500" /> Top Pathogen Outbreaks
          </h3>
          {renderBarChart()}
        </div>

        {/* Chart B: Health Trend over time */}
        <div className="glass-panel rounded-3xl p-6 border border-white/5">
          <h3 className="text-sm font-bold font-display text-slate-300 uppercase tracking-wider border-b border-white/5 pb-3.5 mb-4 flex items-center gap-1.5">
            <Calendar className="h-4.5 w-4.5 text-brand-500" /> 30-Day Crop Health Trend
          </h3>
          {renderTrendChart()}
        </div>
      </div>

      {/* 3. DETAILED LOG HISTORY TABLE */}
      <div className="glass-panel rounded-3xl p-6 border border-white/5">
        <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-5">
          <h3 className="text-sm font-bold font-display text-slate-300 uppercase tracking-wider">Diagnostic Records Log</h3>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Loading and empty states */}
        {history.length === 0 && !loading && (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <FileText className="h-10 w-10 text-slate-500/40 mb-2.5" />
            <p className="text-xs text-slate-500">Your agricultural prediction log is empty. Try running some leaf diagnoses!</p>
          </div>
        )}

        {loading && history.length === 0 && (
          <div className="space-y-3.5 py-6">
            <div className="h-14 rounded-2xl bg-slate-800 shimmer-bg" />
            <div className="h-14 rounded-2xl bg-slate-800 shimmer-bg" />
            <div className="h-14 rounded-2xl bg-slate-800 shimmer-bg" />
          </div>
        )}

        {/* Table list */}
        {history.length > 0 && (
          <div className="space-y-3">
            {history.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all gap-4"
              >
                <div className="flex items-center gap-4.5">
                  {/* Thumbnail leaf image */}
                  {report.image ? (
                    <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-white/5 shadow-md">
                      <img src={report.image} alt="leaf thumbnail" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-slate-800 shrink-0 flex items-center justify-center text-slate-500">
                      L
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-brand-400 uppercase border border-brand-500/20 bg-brand-500/10 px-2 py-0.5 rounded">
                        {report.crop_type}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border ${getSeverityStyle(report.severity)}`}>
                        {report.severity}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-white tracking-tight">{report.disease_name}</h4>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                  <div className="text-right flex flex-col">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {report.date.split(' ')[0]}
                    </span>
                    <span className="text-xs font-bold text-white mt-0.5">{report.confidence}% Match</span>
                  </div>

                  <button
                    onClick={() => setSelectedReport(report)}
                    className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REPORT MODAL DETAIL PANEL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4 py-8 animate-fade-in">
          <div className="w-full max-w-3xl glass-panel border border-white/10 rounded-3xl p-6 relative max-h-[85vh] overflow-y-auto space-y-6 animate-slide-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-bold rounded uppercase tracking-wider block w-fit mb-1.5">
                  {selectedReport.crop_type} Diagnostic Log
                </span>
                <h3 className="text-2xl font-bold font-display text-white">{selectedReport.disease_name}</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-2.5 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Close Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Thumbnail image and circular score */}
              <div className="md:col-span-1 space-y-4">
                <img
                  src={selectedReport.image}
                  alt="Leaf Diagnose image"
                  className="w-full aspect-square object-cover rounded-2xl border border-white/5 shadow-md"
                />
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Confidence</span>
                  <span className="text-sm font-extrabold text-white">{selectedReport.confidence}%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Infection Severity</span>
                  <span className={`text-xs font-bold uppercase ${
                    selectedReport.severity === 'Severe' 
                      ? 'text-rose-400' 
                      : selectedReport.severity === 'Moderate' 
                        ? 'text-amber-400' 
                        : 'text-emerald-400'
                  }`}>
                    {selectedReport.severity}
                  </span>
                </div>
              </div>

              {/* Agronomic Report Details */}
              <div className="md:col-span-2 space-y-5">
                
                <div>
                  <span className="text-[9px] block text-slate-500 font-bold uppercase tracking-wider mb-1">Pathology Description</span>
                  <p className="text-xs text-slate-400 leading-relaxed bg-white/5 border border-white/5 p-3 rounded-xl">
                    {selectedReport.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] block text-slate-500 font-bold uppercase tracking-wider mb-1">Symptoms Identified</span>
                    <p className="text-xs text-slate-400 leading-normal p-2.5 rounded-xl bg-dark-900/60 border border-white/5">
                      {selectedReport.symptoms}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] block text-slate-500 font-bold uppercase tracking-wider mb-1">Outbreak Causes</span>
                    <p className="text-xs text-slate-400 leading-normal p-2.5 rounded-xl bg-dark-900/60 border border-white/5">
                      {selectedReport.causes}
                    </p>
                  </div>
                </div>

                {/* Treatment medications shelf */}
                {!selectedReport.healthy && selectedReport.medication && selectedReport.medication.length > 0 && (
                  <div>
                    <span className="text-[9px] block text-slate-500 font-bold uppercase tracking-wider mb-1.5">Prescribed Medications</span>
                    <div className="space-y-2">
                      {selectedReport.medication.map((med, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center text-xs gap-3">
                          <div>
                            <span className="font-extrabold text-white block">{med.name}</span>
                            <span className="text-[10px] text-slate-500 font-medium">Dosage: {med.dosage} ({med.frequency})</span>
                          </div>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                            med.type.includes('Chemical') 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {med.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
