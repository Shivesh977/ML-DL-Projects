import React from 'react';
import { Leaf, LogOut, User, BarChart2, Sprout, ShieldAlert } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  const tabs = [
    { id: 'predict', label: 'Leaf Diagnosis', icon: ShieldAlert },
    { id: 'recommender', label: 'Crop Advisor', icon: Sprout },
    { id: 'dashboard', label: 'Dashboard Logs', icon: BarChart2 },
    { id: 'guide', label: 'Farmer\'s Guide', icon: Leaf },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 bg-dark-900/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('predict')}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse-slow">
            <Leaf className="h-5 w-5 fill-brand-500/20" />
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-brand-400 border border-dark-900" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-lg font-bold tracking-tight text-white bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
              AgroVision
            </span>
            <span className="font-sans text-xs block -mt-1 font-semibold text-brand-500 tracking-wider uppercase">
              AI Health Hub
            </span>
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <nav className="hidden md:flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/15 text-brand-400 border border-brand-500/30 shadow-[0_4px_15px_rgba(16,185,129,0.08)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
            <div className="h-6 w-6 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
              {user?.username || 'Farmer'}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-300"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex border-t border-white/5 overflow-x-auto py-2 px-3 bg-dark-900/40 gap-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                isActive
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
