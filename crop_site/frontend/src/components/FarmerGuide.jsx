import React, { useState } from 'react';
import { Calendar, Sun, CloudRain, Snowflake, Shield, Info, Sprout, Wind } from 'lucide-react';

export default function FarmerGuide() {
  const [guideTab, setGuideTab] = useState('seasonal');

  const FERTILIZERS = [
    { crop: 'Tomato', ratio: '5-10-10 (N-P-K)', timing: 'Apply at transplanting, then shift to high Potassium when flowering.', tip: 'Calcium additions prevent blossom end rot.' },
    { crop: 'Potato', ratio: '10-20-20 (N-P-K)', timing: 'Apply high phosphorus during planting to boost tuber set.', tip: 'Avoid late nitrogen as it triggers vine growth over tubers.' },
    { crop: 'Corn (Maize)', ratio: '24-8-16 (N-P-K)', timing: 'Heavy Nitrogen feeding required during early whorl stage.', tip: 'Zinc zinc-sulfate additions prevent leaf bleaching.' },
    { crop: 'Grapes', ratio: '10-10-20 (N-P-K)', timing: 'Apply potassium during bloom and post-harvest to strengthen wood.', tip: 'Magnesium sprays prevent leaf marginal yellowing.' },
    { crop: 'Rice', ratio: '80-40-40 (kg/acre)', timing: 'Split Nitrogen: 50% basal, 25% tillering, 25% panicle initiation.', tip: 'Silicon fertilizer enhances resistance to Leaf Blast.' },
    { crop: 'Wheat', ratio: '120-60-40 (kg/hectare)', timing: 'Basal application at sowing, top-dress Nitrogen at first irrigation.', tip: 'Sulfur inputs increase grain protein levels.' },
  ];

  const SEASONS = [
    {
      season: 'Spring Outbreaks',
      icon: Sun,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      desc: 'Warm days and cold nights with high morning dew.',
      threats: [
        { disease: 'Apple Scab', notes: 'Ascospores release during spring rain; target capture fungicides at pink bud.' },
        { disease: 'Potato Early Blight', notes: 'Favored by alternating wet/dry foliage. Ensure proper potassium sprays.' }
      ]
    },
    {
      season: 'Summer Outbreaks',
      icon: Wind,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      desc: 'Hot, dry conditions interspersed with sudden heat storms.',
      threats: [
        { disease: 'Tomato Yellow Leaf Curl Virus', notes: 'Whiteflies multiply rapidly in heat. Deploy yellow sticky cards.' },
        { disease: 'Corn Leaf Rust', notes: 'Wind-blown spores infect mid-season fields; avoid overhead spray irrigation.' }
      ]
    },
    {
      season: 'Monsoon Outbreaks',
      icon: CloudRain,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      desc: 'Extremely high humidity (>85%) and continuous leaf wetness.',
      threats: [
        { disease: 'Tomato/Potato Late Blight', notes: 'Catastrophic oomycete spreads in rain. Spray preventatives before rains.' },
        { disease: 'Rice Leaf Blast', notes: 'Over-irrigation combined with high humidity triggers Diamond spots. Suspend N.' }
      ]
    },
    {
      season: 'Winter Outbreaks',
      icon: Snowflake,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      desc: 'Cool days, frost alerts, and minimal wind drying.',
      threats: [
        { disease: 'Wheat Yellow Rust', notes: 'Thrives in cold morning dew (8-15°C). Monitor flag leaves weekly.' },
        { disease: 'Grape Powdery Mildew', notes: 'Can spread in shaded canopies. Ensure heavy pruning during dormancy.' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-slide-up space-y-6">
      
      {/* Title Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold font-display text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
          Farmer's Resource Guide
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
          Access expert agronomic guidelines. Optimize N-P-K fertilizer rates and track crop infection calendars to stay ahead of disease outbreaks.
        </p>
      </div>

      {/* Resource Tab Selector */}
      <div className="flex justify-center max-w-md mx-auto p-1 rounded-2xl bg-dark-900/60 border border-white/5">
        <button
          onClick={() => setGuideTab('seasonal')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
            guideTab === 'seasonal'
              ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Seasonal Outbreaks
        </button>
        <button
          onClick={() => setGuideTab('fertilizer')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
            guideTab === 'fertilizer'
              ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fertilizer Optimizer
        </button>
        <button
          onClick={() => setGuideTab('hygiene')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
            guideTab === 'hygiene'
              ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          General Crop Hygiene
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="mt-4">
        
        {/* Tab 1: Seasonal Outbreaks Timeline */}
        {guideTab === 'seasonal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SEASONS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="glass-panel rounded-3xl p-5 border border-white/5 relative overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-3.5 mb-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white tracking-tight">{item.season}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {item.threats.map((threat, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/5 flex gap-3 text-xs leading-relaxed">
                        <Info className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold text-white block">{threat.disease}</span>
                          <span className="text-slate-400 text-[11px] block mt-0.5">{threat.notes}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Fertilizer Optimizer */}
        {guideTab === 'fertilizer' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FERTILIZERS.map((fertilizer, idx) => (
              <div key={idx} className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-brand-500/5 blur-[30px] pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5 mb-3">
                    <span className="text-sm font-extrabold text-white">{fertilizer.crop}</span>
                    <span className="text-[9px] font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded uppercase tracking-wide">
                      {fertilizer.ratio}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    <span className="text-[8px] block text-slate-500 font-bold uppercase tracking-wider">Application Timing</span>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      {fertilizer.timing}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/5 flex gap-2 text-[10px] leading-relaxed text-slate-400 font-semibold">
                  <Sprout className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>{fertilizer.tip}</span>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Tab 3: General Crop Hygiene */}
        {guideTab === 'hygiene' && (
          <div className="glass-panel rounded-3xl p-6 border border-white/5 max-w-4xl mx-auto space-y-6">
            <h3 className="text-lg font-bold font-display text-white border-b border-white/5 pb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-400" /> Five Pillars of Preventative Crop Hygiene
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-white flex items-center gap-2">
                  <span className="h-5 w-5 bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center rounded-lg font-bold">1</span>
                  Crop Rotation
                </h4>
                <p className="text-slate-400 leading-relaxed pl-7">
                  Never plant members of the same botanical family (e.g. Potatoes, Tomatoes, Peppers) in the same soil year after year. Soil pathogens accumulate and multiply, causing severe early-season infection pressure next season. Rotate with legumes or mustard.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-white flex items-center gap-2">
                  <span className="h-5 w-5 bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center rounded-lg font-bold">2</span>
                  Leaf Canopy Ventilation
                </h4>
                <p className="text-slate-400 leading-relaxed pl-7">
                  Overcrowded crop leaves prevent wind drying and build high humidity micro-pockets within row rows. Prune the bottom mature foliage of tomatoes and space crops appropriately to accelerate dew evaporation.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-white flex items-center gap-2">
                  <span className="h-5 w-5 bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center rounded-lg font-bold">3</span>
                  Outbreak Isolation
                </h4>
                <p className="text-slate-400 leading-relaxed pl-7">
                  Diagnose leaves daily. At first sign of Early/Late Blight target spots, pluck and burn or bury the infected tissue outside the cultivation bounds. Never compost diseased leaves as fungal spores remain active inside the organic compost heap.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-white flex items-center gap-2">
                  <span className="h-5 w-5 bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center rounded-lg font-bold">4</span>
                  Base Irrigation
                </h4>
                <p className="text-slate-400 leading-relaxed pl-7">
                  Drip irrigation or direct soil watering prevents leaf wetness. Spores of Fungal Late Blight require liquid droplets (leaf dew or sprinkler droplets) to germinate and drill inside leaf cell walls. Keeping foliage dry isolates spores.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
