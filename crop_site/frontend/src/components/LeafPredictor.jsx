import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, AlertTriangle, CheckCircle, Zap, Shield, HelpCircle, Activity, Sparkles } from 'lucide-react';

const CROPS = [
  { id: 'Tomato', name: 'Tomato', icon: '🍅', desc: 'Early/Late Blight, Yellow Curl' },
  { id: 'Potato', name: 'Potato', icon: '🥔', desc: 'Early/Late Blight' },
  { id: 'Corn (Maize)', name: 'Corn (Maize)', icon: '🌽', desc: 'Common Leaf Rust' },
  { id: 'Apple', name: 'Apple', icon: '🍎', desc: 'Apple Scab, Black Rot' },
  { id: 'Grape', name: 'Grape', icon: '🍇', desc: 'Black Rot, Blight' },
  { id: 'Rice', name: 'Rice', icon: '🌾', desc: 'Leaf Blast, Brown Spot' },
  { id: 'Wheat', name: 'Wheat', icon: '🌱', desc: 'Yellow Rust, Mildew' },
  { id: 'Cotton', name: 'Cotton', icon: '☁️', desc: 'Leaf Curl Virus' },
  { id: 'Sugarcane', name: 'Sugarcane', icon: '🎋', desc: 'Red Rot Outbreaks' },
  { id: 'Mustard', name: 'Mustard', icon: '🌼', desc: 'White Rust, staghead' },
  { id: 'Chilli', name: 'Chilli', icon: '🌶️', desc: 'Leaf Curl Complex' },
  { id: 'Onion', name: 'Onion', icon: '🧅', desc: 'Purple Blotch disease' },
];

export default function LeafPredictor() {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageRaw, setImageRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError('');
      setResult(null);

      const base64Str = await convertToBase64(file);
      setImageRaw(base64Str);
    } catch (err) {
      setError('Failed to process image file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const runPrediction = async () => {
    if (!selectedCrop) {
      setError('Please select a plant/crop category first.');
      return;
    }
    if (!imageRaw) {
      setError('Please upload an image of a leaf to diagnose.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/predict/disease/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          crop_type: selectedCrop,
          image: imageRaw
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Diagnostic server error.');
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFields = () => {
    setImagePreview('');
    setImageRaw('');
    setResult(null);
    setError('');
  };

  // SVGs Circular Graph Calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = result ? circumference - (result.confidence / 100) * circumference : circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-up">
      
      {/* Page Title Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold font-display text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
          AI Leaf Disease Diagnosis
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2">
          Select a plant category, upload an image of an infected leaf, and receive premium real-time diagnosis, smart severity estimations, yield impacts, and detailed medication suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Input configurations */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Step 1: Multi-Plant category selector */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-500/10 text-brand-400 text-xs font-bold">1</span>
              Select Crop Category
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {CROPS.map((crop) => {
                const isSelected = selectedCrop === crop.id;
                return (
                  <button
                    key={crop.id}
                    onClick={() => { setSelectedCrop(crop.id); setResult(null); }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-500/10 border-brand-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-white'
                        : 'bg-dark-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-2xl mb-1 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">{crop.icon}</span>
                    <span className="text-xs font-bold font-display">{crop.name}</span>
                    <span className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{crop.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Leaf Image Upload Drag-Drop box */}
          <div className="glass-panel rounded-2xl p-5 relative">
            <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-500/10 text-brand-400 text-xs font-bold">2</span>
              Upload Leaf Image
            </h3>
            
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={imagePreview ? undefined : onButtonClick}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
                dragActive 
                  ? 'border-brand-500 bg-brand-500/5' 
                  : imagePreview 
                    ? 'border-white/10 bg-dark-900/20' 
                    : 'border-white/5 hover:border-white/10 bg-dark-900/40 hover:bg-white/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />

              {imagePreview ? (
                <div className="relative w-full h-[180px] rounded-lg overflow-hidden group">
                  <img
                    src={imagePreview}
                    alt="Leaf preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={onButtonClick}
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mr-2"
                    >
                      Change
                    </button>
                    <button
                      onClick={resetFields}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-3">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-300">Drag & drop your leaf image here</p>
                  <p className="text-[10px] text-slate-500 mt-1">or click to browse files</p>
                  <p className="text-[9px] text-slate-600 mt-3">Supports JPG, PNG (Max 5MB)</p>
                </>
              )}
            </div>

            {/* Error alerts */}
            {error && (
              <div className="flex items-start gap-2 p-3 mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium animate-slide-up">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Inference Action trigger */}
            <button
              onClick={runPrediction}
              disabled={loading || !selectedCrop || !imageRaw}
              className="w-full mt-4 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Plant Tissue...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4" /> Run AI Diagnosis
                </>
              )}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Diagnostic output and smart recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Default idle dashboard placeholder */}
          {!result && !loading && (
            <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[460px] border border-white/5">
              <div className="relative mb-4">
                <div className="h-20 w-20 rounded-2xl bg-brand-500/5 border border-brand-500/10 text-brand-400 flex items-center justify-center shadow-inner">
                  <ImageIcon className="h-10 w-10 text-brand-500/40" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-slate-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-200">Awaiting Leaf Diagnosis</h3>
              <p className="text-slate-500 text-xs max-w-sm mt-1.5">
                Complete steps 1 and 2 in the left sidebar, and click "Run AI Diagnosis" to leverage the deep learning diagnostic model.
              </p>
            </div>
          )}

          {/* Loading Glassmorphic Shimmer */}
          {loading && (
            <div className="glass-panel rounded-3xl p-8 min-h-[460px] flex flex-col justify-between border border-white/5 overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-600 via-emerald-400 to-brand-600 animate-pulse" />
              
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-full bg-slate-800 shimmer-bg" />
                <div className="space-y-2.5 flex-1 pt-3">
                  <div className="w-1/3 h-5 rounded bg-slate-800 shimmer-bg" />
                  <div className="w-2/3 h-4 rounded bg-slate-800 shimmer-bg" />
                </div>
              </div>

              <div className="space-y-3 my-8">
                <div className="w-full h-8 rounded-xl bg-slate-800 shimmer-bg" />
                <div className="w-full h-24 rounded-xl bg-slate-800 shimmer-bg" />
              </div>

              <div className="flex justify-between">
                <div className="w-1/4 h-8 rounded-xl bg-slate-800 shimmer-bg" />
                <div className="w-1/4 h-8 rounded-xl bg-slate-800 shimmer-bg" />
              </div>
            </div>
          )}

          {/* DIAGNOSIS REPORTS AREA */}
          {result && !loading && (
            <div className="space-y-6">
              
              {/* Card 1: Core Diagnostic Outcome details */}
              <div className="glass-panel rounded-3xl p-6 border-l-4 border-l-brand-500 relative overflow-hidden">
                {/* Background glowing pattern */}
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-brand-500/5 blur-[50px] pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Plant and disease name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-brand-500/10 text-brand-400 text-[10px] font-bold rounded-lg border border-brand-500/20 uppercase tracking-wider">
                        {result.crop_type}
                      </span>
                      {result.healthy ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          <CheckCircle className="h-3.5 w-3.5 fill-emerald-500/10" /> Healthy Plant
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                          <AlertTriangle className="h-3.5 w-3.5 fill-rose-500/10" /> Pathogen Detected
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      {result.disease_name}
                    </h2>
                    
                    <p className="text-xs text-slate-400 max-w-md">
                      {result.description}
                    </p>
                  </div>

                  {/* Circular Confidence Score & Severity gauges */}
                  <div className="flex items-center gap-5 shrink-0 self-center md:self-auto">
                    
                    {/* SVG circular confidence gauge */}
                    <div className="relative flex items-center justify-center h-24 w-24">
                      <svg className="h-full w-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          className="text-slate-800"
                          strokeWidth="6"
                          stroke="currentColor"
                          fill="transparent"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          className="text-brand-500"
                          strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-base font-extrabold text-white tracking-tighter">{result.confidence}%</span>
                        <span className="text-[8px] font-bold text-slate-500 tracking-wide uppercase">Confidence</span>
                      </div>
                    </div>

                    {/* Severity and Yield Impact Box */}
                    <div className="space-y-2">
                      <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[9px] block text-slate-500 font-bold uppercase tracking-wider">Severity</span>
                        <span className={`text-xs font-bold uppercase ${
                          result.severity === 'Severe' 
                            ? 'text-rose-400' 
                            : result.severity === 'Moderate' 
                              ? 'text-amber-400' 
                              : 'text-emerald-400'
                        }`}>
                          {result.severity}
                        </span>
                      </div>

                      {!result.healthy && (
                        <div className="px-3.5 py-1.5 rounded-xl bg-rose-500/5 border border-rose-500/10">
                          <span className="text-[9px] block text-slate-500 font-bold uppercase tracking-wider">Est. Yield Loss</span>
                          <span className="text-xs font-bold text-rose-400">
                            {result.yield_impact}
                          </span>
                        </div>
                      )}
                    </div>

                  </div>

                </div>

                {/* Card 1 Tabs: Symptoms and Causes list */}
                {!result.healthy && (
                  <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Symptoms list */}
                    <div className="p-4 rounded-2xl bg-dark-900/60 border border-white/5">
                      <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase mb-2.5 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-brand-400" />
                        Visible Symptoms
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {result.symptoms}
                      </p>
                    </div>

                    {/* Causes list */}
                    <div className="p-4 rounded-2xl bg-dark-900/60 border border-white/5">
                      <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase mb-2.5 flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-brand-400" />
                        Outbreak Causes
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {result.causes}
                      </p>
                    </div>

                  </div>
                )}

              </div>

              {/* Card 2: Smart Recommendation System (Medication details) */}
              {!result.healthy && result.medication && result.medication.length > 0 && (
                <div className="glass-panel rounded-3xl p-6 relative">
                  <h3 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-brand-500" /> Smart Medication Treatment Shelf
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.medication.map((med, index) => (
                      <div key={index} className="p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden flex flex-col justify-between">
                        
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-extrabold text-white line-clamp-1">{med.name}</span>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase border shrink-0 ${
                              med.type.includes('Chemical') 
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              {med.type}
                            </span>
                          </div>
                          
                          <div className="space-y-1.5 my-3">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">Application Method:</span>
                              <span className="text-slate-300 font-bold">{med.usage}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">Dosage Quantity:</span>
                              <span className="text-brand-400 font-bold">{med.dosage}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">Spraying Frequency:</span>
                              <span className="text-slate-300 font-bold">{med.frequency}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/5">
                          <span className="text-[8px] block text-slate-500 font-bold uppercase tracking-wider mb-1">Safety Precaution</span>
                          <p className="text-[10px] text-rose-300 leading-normal">
                            {med.precautions}
                          </p>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card 3: Precautions and prevention guidelines */}
              {result.precautions && result.precautions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Immediate Action (Precautions) */}
                  <div className="glass-panel rounded-3xl p-6">
                    <h3 className="text-base font-bold font-display text-white mb-3.5 flex items-center gap-1.5">
                      <Shield className="h-4.5 w-4.5 text-rose-400" /> What should the farmer do next?
                    </h3>
                    <ul className="space-y-2.5">
                      {result.precautions.map((prec, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                          <span className="h-4 w-4 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{prec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention measures */}
                  <div className="glass-panel rounded-3xl p-6">
                    <h3 className="text-base font-bold font-display text-white mb-3.5 flex items-center gap-1.5">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-400" /> Preventative Tips to Avoid Recurrence
                    </h3>
                    <ul className="space-y-2.5">
                      {result.prevention.map((prev, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                          <span className="h-4 w-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span>{prev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
