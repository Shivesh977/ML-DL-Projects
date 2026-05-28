import React, { useState } from 'react';
import { Sprout, Compass, HelpCircle, Thermometer, Droplets, CloudRain, AlertCircle, RefreshCw } from 'lucide-react';

export default function CropRecommender() {
  const [formData, setFormData] = useState({
    N: '50',
    P: '50',
    K: '50',
    ph: '6.5',
    temperature: '25',
    humidity: '60',
    rainfall: '100',
  });
  const [loading, setLoading] = useState(false);
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAutofillClimate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setAutofillLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain`);
          const data = await response.json();
          if (!response.ok) throw new Error('Failed to fetch weather.');

          const current = data.current || {};
          setFormData(prev => ({
            ...prev,
            temperature: Math.round(current.temperature_2m ?? 25).toString(),
            humidity: Math.round(current.relative_humidity_2m ?? 60).toString(),
            rainfall: Math.round((current.rain ?? 0) * 10 || 100).toString(),
          }));
        } catch (err) {
          setError('Could not fetch local weather: ' + err.message);
        } finally {
          setAutofillLoading(false);
        }
      },
      (err) => {
        setError('Location access denied. Please enter parameters manually.');
        setAutofillLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const handleRecommend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/predict/recommend-crop/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Crop prediction server error.');
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCropDescription = (crop) => {
    const descriptions = {
      'Rice': 'Thrives in high temperatures and flooded conditions. Requires heavy water (clay soils are ideal).',
      'Wheat': 'A cool-season cereal crop. Grows best in loam soil with moderate moisture and mild climates.',
      'Maize (corn)': 'Highly adaptable. Needs good nitrogen feeding and warm sunlight with moderate rainfall.',
      'Grapes': 'Likes dry, sandy-loamy slopes. Demands very high potassium levels and well-drained roots.',
      'Apple': 'Requires chilling hours in winter. Performs beautifully in clay-loam, phosphorus-rich orchards.',
      'Chickpea': 'A highly drought-tolerant legume. Excellent for dry soils as it fixes nitrogen naturally.',
      'Cotton': 'Demands long frost-free periods, high temperatures, and constant nitrogen during vegetative spurts.',
      'Sugarcane': 'A heavy feeder crop requiring high water inputs, full tropical sun, and rich clayey/loamy soil structures.',
      'Mustard': 'Thrives in cool winter temperatures. Needs optimal sulfur inputs and well-drained sandy-loam soils.',
      'Chilli': 'Requires warm climates, moderate rainfall, organic soil compost, and balanced nitrogen-to-potassium ratios.',
      'Onion': 'Demands well-aerated sandy-loam beds with uniform soil moisture and low early-stage weed competition.'
    };
    return descriptions[crop] || 'Excellent crop selection matching your soil pH, N-P-K profiles, and climate indicators.';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-slide-up">
      
      {/* Title Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold font-display text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
          Soil-Based Crop Advisor
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
          Enter Nitrogen, Phosphorus, Potassium (N-P-K), pH, and climate parameters to predict the most profitable and high-yielding crop to grow using your Random Forest ML model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Form Parameters (3/5 width) */}
        <form onSubmit={handleRecommend} className="lg:col-span-3 glass-panel rounded-3xl p-6 border border-white/5 space-y-6">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-1.5">
              <Sprout className="h-5 w-5 text-brand-500" /> Soil & Climate Matrix
            </h3>
            <button
              type="button"
              onClick={handleAutofillClimate}
              disabled={autofillLoading}
              className="px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {autofillLoading ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" /> Fetching GPS Weather...
                </>
              ) : (
                <>
                  <Compass className="h-3.5 w-3.5" /> Auto-detect Weather via GPS
                </>
              )}
            </button>
          </div>

          {/* Form alert */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium animate-slide-up">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Soil NPK block */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 pl-1">Soil Macronutrients (mg/kg)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Nitrogen */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300 px-1">
                  <span>Nitrogen (N)</span>
                  <span className="text-brand-400">{formData.N}</span>
                </div>
                <input
                  type="range" min="0" max="150" name="N"
                  value={formData.N} onChange={handleInputChange}
                  className="w-full accent-brand-500 bg-dark-900/60 rounded-lg h-2 appearance-none cursor-pointer"
                />
              </div>

              {/* Phosphorus */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300 px-1">
                  <span>Phosphorus (P)</span>
                  <span className="text-brand-400">{formData.P}</span>
                </div>
                <input
                  type="range" min="0" max="150" name="P"
                  value={formData.P} onChange={handleInputChange}
                  className="w-full accent-brand-500 bg-dark-900/60 rounded-lg h-2 appearance-none cursor-pointer"
                />
              </div>

              {/* Potassium */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300 px-1">
                  <span>Potassium (K)</span>
                  <span className="text-brand-400">{formData.K}</span>
                </div>
                <input
                  type="range" min="0" max="250" name="K"
                  value={formData.K} onChange={handleInputChange}
                  className="w-full accent-brand-500 bg-dark-900/60 rounded-lg h-2 appearance-none cursor-pointer"
                />
              </div>

            </div>
          </div>

          <div className="border-t border-white/5 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Soil pH */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300 px-1">
                <span className="flex items-center gap-1">Soil pH <HelpCircle className="h-3 w-3 text-slate-500" title="Ideal range 6.0-7.0" /></span>
                <span className="text-brand-400">{formData.ph}</span>
              </div>
              <input
                type="range" min="3.5" max="9.0" step="0.1" name="ph"
                value={formData.ph} onChange={handleInputChange}
                className="w-full accent-brand-500 bg-dark-900/60 rounded-lg h-2 appearance-none cursor-pointer"
              />
            </div>

            {/* Climate Temp */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300 px-1">
                <span className="flex items-center gap-1"><Thermometer className="h-3 w-3 text-slate-400" /> Temperature (°C)</span>
                <span className="text-brand-400">{formData.temperature}°C</span>
              </div>
              <input
                type="range" min="5" max="45" name="temperature"
                value={formData.temperature} onChange={handleInputChange}
                className="w-full accent-brand-500 bg-dark-900/60 rounded-lg h-2 appearance-none cursor-pointer"
              />
            </div>

            {/* Climate Humidity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300 px-1">
                <span className="flex items-center gap-1"><Droplets className="h-3 w-3 text-slate-400" /> Relative Humidity (%)</span>
                <span className="text-brand-400">{formData.humidity}%</span>
              </div>
              <input
                type="range" min="15" max="95" name="humidity"
                value={formData.humidity} onChange={handleInputChange}
                className="w-full accent-brand-500 bg-dark-900/60 rounded-lg h-2 appearance-none cursor-pointer"
              />
            </div>

            {/* Climate Rainfall */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300 px-1">
                <span className="flex items-center gap-1"><CloudRain className="h-3 w-3 text-slate-400" /> Annual Rainfall (mm)</span>
                <span className="text-brand-400">{formData.rainfall} mm</span>
              </div>
              <input
                type="range" min="20" max="300" name="rainfall"
                value={formData.rainfall} onChange={handleInputChange}
                className="w-full accent-brand-500 bg-dark-900/60 rounded-lg h-2 appearance-none cursor-pointer"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="inline-block h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Interfacing Random Forest Model...
              </>
            ) : (
              'Recommend Optimal Crop'
            )}
          </button>
        </form>

        {/* RIGHT COLUMN: Output Container (2/5 width) */}
        <div className="lg:col-span-2 min-h-[460px] h-full">
          {!result && !loading && (
            <div className="glass-panel rounded-3xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[350px] border border-white/5">
              <div className="h-16 w-16 rounded-2xl bg-brand-500/5 border border-brand-500/10 text-brand-500/40 flex items-center justify-center shadow-inner mb-4">
                <Sprout className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Awaiting Soil Analysis</h3>
              <p className="text-slate-500 text-xs max-w-xs mt-1">
                Configure your Nitrogen, Phosphorus, Potassium (N-P-K) levels and soil variables on the left, then click Recommend to predict the optimal crop.
              </p>
            </div>
          )}

          {loading && (
            <div className="glass-panel rounded-3xl p-6 h-full min-h-[350px] flex flex-col justify-between border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-600 via-emerald-400 to-brand-600 animate-pulse" />
              <div className="space-y-4">
                <div className="w-1/3 h-6 rounded bg-slate-800 shimmer-bg" />
                <div className="w-2/3 h-10 rounded bg-slate-800 shimmer-bg" />
              </div>
              <div className="w-full h-32 rounded-xl bg-slate-800 shimmer-bg my-6" />
              <div className="w-1/2 h-8 rounded-xl bg-slate-800 shimmer-bg" />
            </div>
          )}

          {result && !loading && (
            <div className="glass-panel rounded-3xl p-6 border-l-4 border-l-brand-500 h-full flex flex-col justify-between relative overflow-hidden animate-slide-up">
              
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block mb-1">Recommended Cultivar</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    {result.recommended_crop}
                  </h2>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed bg-white/5 border border-white/5 p-4 rounded-2xl">
                  {getCropDescription(result.recommended_crop)}
                </p>

                {/* Nutrient ratios display */}
                <div className="space-y-2.5">
                  <span className="text-[9px] block text-slate-500 font-bold uppercase tracking-wider">Nutrient Profiles & Environment</span>
                  
                  {/* N bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                      <span>Nitrogen (N)</span>
                      <span>{result.N} mg/kg</span>
                    </div>
                    <div className="w-full bg-dark-900/60 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${(result.N / 150) * 100}%` }} />
                    </div>
                  </div>

                  {/* P bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                      <span>Phosphorus (P)</span>
                      <span>{result.P} mg/kg</span>
                    </div>
                    <div className="w-full bg-dark-900/60 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${(result.P / 150) * 100}%` }} />
                    </div>
                  </div>

                  {/* K bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                      <span>Potassium (K)</span>
                      <span>{result.K} mg/kg</span>
                    </div>
                    <div className="w-full bg-dark-900/60 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${(result.K / 250) * 100}%` }} />
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <span>Accuracy: High</span>
                <span className="text-brand-400">Random Forest active</span>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
