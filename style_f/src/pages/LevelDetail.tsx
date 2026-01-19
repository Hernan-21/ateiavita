import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ChevronLeft, PlayCircle, CheckCircle2, Lock } from 'lucide-react';
interface LevelDetailProps {
  onNavigate: (page: string) => void;
}
export function LevelDetail({
  onNavigate
}: LevelDetailProps) {
  const [activeTab, setActiveTab] = useState('current');
  return <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Yellow Background */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-amber-50 rounded-3xl border border-amber-100/50 shadow-sm">
        <button onClick={() => onNavigate('dashboard')} className="mb-6 flex items-center text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-4xl border border-amber-200">
              🐥
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 font-serif mb-2">
                Nivel 1
              </h1>
              <p className="text-lg text-slate-600">General Level • Beginner</p>
            </div>
          </div>

          <div className="flex p-1 bg-white/80 backdrop-blur-md rounded-xl border border-white shadow-md">
            {['Current', 'Past', 'Media', 'My Picks'].map(tab => <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`
                  px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === tab.toLowerCase() ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
                `}>
                {tab}
              </button>)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Lessons
          </h3>
          <span className="text-sm text-slate-400">1 of 12 Completed</span>
        </div>

        {/* Lesson Card */}
        <GlassCard hoverEffect={true} onClick={() => onNavigate('lesson')} className="flex items-center justify-between group !p-8">
          <div className="flex items-center gap-6">
            <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-serif font-bold text-xl group-hover:scale-110 transition-transform duration-300">
              A
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 tracking-wide uppercase mb-1 block">
                Lesson 1
              </span>
              <h3 className="text-2xl font-bold text-slate-900 font-serif group-hover:text-indigo-600 transition-colors">
                Saludar
              </h3>
              <p className="text-slate-500 mt-1">
                Learn basic greetings and introductions
              </p>
            </div>
          </div>

          <div className="h-10 w-10 rounded-full border-2 border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all duration-300">
            <PlayCircle className="h-6 w-6" />
          </div>
        </GlassCard>

        {/* Locked Lesson */}
        <div className="glass-panel rounded-2xl p-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-500 cursor-not-allowed">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-serif font-bold text-xl">
                B
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 tracking-wide uppercase mb-1 block">
                  Lesson 2
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-serif">
                  Presentarse
                </h3>
                <p className="text-slate-500 mt-1">
                  How to introduce yourself to others
                </p>
              </div>
            </div>
            <Lock className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>
    </div>;
}