import React, { useState } from 'react';
import { Leaf, Lock, Mail, Phone, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';

export default function LoginSignup({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    const url = isLogin 
      ? 'http://127.0.0.1:8000/api/auth/login/' 
      : 'http://127.0.0.1:8000/api/auth/register/';

    const payload = isLogin
      ? { username: formData.username, password: formData.password }
      : { 
          username: formData.username, 
          password: formData.password, 
          email: formData.email, 
          phone: formData.phone 
        };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      // Success
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        email: data.email,
        phone: data.phone
      }));
      
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] w-full flex items-center justify-center px-4 py-12">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Brand header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] mb-3">
            <Leaf className="h-6 w-6 fill-brand-500/10" />
          </div>
          <h2 className="text-3xl font-bold font-display tracking-tight text-white">
            AgroVision <span className="text-brand-400">AI</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-[280px]">
            {isLogin 
              ? 'Log in to diagnose leaf health & manage farm reports'
              : 'Join the smart farming revolution with instant AI diagnosis'
            }
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 rounded-2xl bg-dark-900/60 border border-white/5 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
              isLogin 
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
              !isLogin 
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Sign Up
          </button>
        </div>

        {/* Alert message */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium animate-slide-up">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 tracking-wider uppercase pl-1">Username *</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-400 transition-colors">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-dark-900/60 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
                placeholder="Enter unique username"
                required
              />
            </div>
          </div>

          {/* Email (only register) */}
          {!isLogin && (
            <div className="space-y-1.5 animate-slide-up">
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase pl-1">Email Address</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-400 transition-colors">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-dark-900/60 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
                  placeholder="yourname@example.com"
                />
              </div>
            </div>
          )}

          {/* Phone (only register) */}
          {!isLogin && (
            <div className="space-y-1.5 animate-slide-up">
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase pl-1">Phone Number</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-400 transition-colors">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-dark-900/60 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 tracking-wider uppercase pl-1">Password *</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-400 transition-colors">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-dark-900/60 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="h-4 w-4" /> Log In
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Sign Up & Register
              </>
            )}
          </button>
        </form>
        
        {/* Toggle Footer link */}
        <div className="mt-6 text-center text-xs font-semibold text-slate-500">
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button onClick={() => { setIsLogin(false); setError(''); }} className="text-brand-400 hover:text-brand-300 font-bold transition-all ml-1 underline">
                Create account
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button onClick={() => { setIsLogin(true); setError(''); }} className="text-brand-400 hover:text-brand-300 font-bold transition-all ml-1 underline">
                Sign in
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
