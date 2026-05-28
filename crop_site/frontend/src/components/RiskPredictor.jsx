import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, CloudRain, ShieldCheck, ShieldAlert, Navigation, HelpCircle, RefreshCw } from 'lucide-react';

export default function RiskPredictor() {
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherRisk = (lat, lon) => {
    setLoading(true);
    setLocationError('');
    
    const token = localStorage.getItem('token');
    fetch(`http://127.0.0.1:8000/api/weather-risk/?latitude=${lat}&longitude=${lon}`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('API server failed to respond.');
        return res.json();
      })
      .then(data => {
        setWeatherData(data);
      })
      .catch(err => {
        setLocationError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCoordinates = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherRisk(latitude, longitude);
      },
      (err) => {
        // Fallback default coordinates (New Delhi / agricultural zone)
        setLocationError('Location access blocked. Showing default agricultural zone (New Delhi).');
        fetchWeatherRisk(28.6139, 77.2090);
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    getCoordinates();
  }, []);

  const getRiskColor = (val) => {
    if (val >= 75) return 'text-rose-500';
    if (val >= 40) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getRiskBg = (val) => {
    if (val >= 75) return 'bg-rose-500/10 border-rose-500/20';
    if (val >= 40) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-emerald-500/10 border-emerald-500/20';
  };

  // SVGs circular calculation
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-slide-up">
      
      {/* Title Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold font-display text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
          Weather-Based Disease Risk Predictor
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
          Leverage real-time micro-climate indicators (relative humidity, temperature, rainfall) at your exact farm GPS coordinates to forecast immediate disease outbreak risks.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Weather Conditions Display (1/3 width) */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/5 relative overflow-hidden">
            {/* Background blur */}
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-brand-500/5 blur-[40px] pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-5">
              <h3 className="text-sm font-bold font-display text-slate-300 uppercase tracking-wider">Local Weather</h3>
              <button
                onClick={getCoordinates}
                disabled={loading}
                className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                title="Refresh Weather Data"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Error indicators */}
            {locationError && (
              <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-medium leading-normal animate-slide-up">
                <Navigation className="h-4 w-4 shrink-0 text-amber-400" />
                <span>{locationError}</span>
              </div>
            )}

            {/* Loading placeholder */}
            {!weatherData && loading && (
              <div className="space-y-5 py-6">
                <div className="h-8 rounded bg-slate-800 shimmer-bg" />
                <div className="h-8 rounded bg-slate-800 shimmer-bg" />
                <div className="h-8 rounded bg-slate-800 shimmer-bg" />
              </div>
            )}

            {/* Weather items display */}
            {weatherData && (
              <div className="space-y-4">
                
                {/* Temperature */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                      <Thermometer className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] block text-slate-500 font-bold uppercase tracking-wider">Air Temp</span>
                      <span className="text-xs font-semibold text-slate-300">Ambient warmth</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">{weatherData.temperature}°C</span>
                </div>

                {/* Humidity */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] block text-slate-500 font-bold uppercase tracking-wider">Humidity</span>
                      <span className="text-xs font-semibold text-slate-300">Leaf foliage wetness</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">{weatherData.humidity}%</span>
                </div>

                {/* Rainfall */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                      <CloudRain className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] block text-slate-500 font-bold uppercase tracking-wider">Rainfall</span>
                      <span className="text-xs font-semibold text-slate-300">Precipitation today</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">{weatherData.rainfall} mm</span>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: Pathogen Risk Gauges and Explanations (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-3xl p-6 border border-white/5 h-full flex flex-col justify-between">
            
            <div>
              <h3 className="text-sm font-bold font-display text-slate-300 uppercase tracking-wider border-b border-white/5 pb-3.5 mb-5">
                Pathogen Spore Outbreak Forecast
              </h3>

              {/* Loading state placeholder */}
              {!weatherData && loading && (
                <div className="space-y-4 my-8">
                  <div className="h-20 rounded-2xl bg-slate-800 shimmer-bg" />
                  <div className="h-20 rounded-2xl bg-slate-800 shimmer-bg" />
                </div>
              )}

              {/* Idle State */}
              {!weatherData && !loading && (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <HelpCircle className="h-10 w-10 text-slate-500/40 mb-3" />
                  <p className="text-xs text-slate-500">Enable GPS location triggers to view disease forecast risk.</p>
                </div>
              )}

              {/* Weather Risks display */}
              {weatherData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {Object.entries(weatherData.risks).map(([riskName, riskVal]) => {
                    const strokeDashoffset = circumference - (riskVal / 100) * circumference;
                    return (
                      <div key={riskName} className={`p-4 rounded-2xl border flex flex-col items-center text-center justify-between ${getRiskBg(riskVal)}`}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{riskName}</span>
                        
                        {/* Circular Progress gauge */}
                        <div className="relative flex items-center justify-center h-20 w-20">
                          <svg className="h-full w-full transform -rotate-90">
                            <circle cx="40" cy="40" r={radius} className="text-white/5" strokeWidth="4" fill="transparent" />
                            <circle
                              cx="40" cy="40" r={radius}
                              className={getRiskColor(riskVal)}
                              strokeWidth="4"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>
                          <div className="absolute text-sm font-extrabold text-white">{riskVal}%</div>
                        </div>

                        <span className={`text-[10px] font-extrabold uppercase mt-3 tracking-wide ${getRiskColor(riskVal)}`}>
                          {riskVal >= 75 ? 'Critical Risk' : riskVal >= 40 ? 'Moderate Risk' : 'Low Risk'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Crop Health Alerts from risk forecast */}
            {weatherData && (
              <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                <span className="text-[9px] block text-slate-500 font-bold uppercase tracking-wider">Agronomist Health Advisories</span>
                {weatherData.summaries.map((summary, idx) => (
                  <div key={idx} className="flex gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] leading-normal font-semibold text-slate-300">
                    {summary.includes('Alert') ? (
                      <ShieldAlert className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <span>{summary}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
