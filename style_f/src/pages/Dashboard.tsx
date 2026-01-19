import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, Plus, BookOpen, Clock, Star } from 'lucide-react';
interface DashboardProps {
  onNavigate: (page: string) => void;
}
export function Dashboard({
  onNavigate
}: DashboardProps) {
  return <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Notification Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-indigo-900/20 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white font-serif">
              New feedback available!
            </h2>
            <p className="text-indigo-100 max-w-xl">
              Your professor has reviewed your latest submission. Check out
              their comments to improve your skills.
            </p>
          </div>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-none border-0 whitespace-nowrap" onClick={() => {}}>
            View Feedback <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Classes Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-serif">
              My Classes
            </h2>
            <p className="text-slate-500 mt-1">Continue where you left off</p>
          </div>
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
            Join Class
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Class Card */}
          <GlassCard hoverEffect={true} onClick={() => onNavigate('level')} className="group relative overflow-hidden border-l-4 border-l-amber-400">
            <div className="flex items-start justify-between mb-6">
              <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow-inner">
                🐥
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                Active
              </span>
            </div>

            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Nivel 1
              </h3>
              <p className="text-slate-500">General Level</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-400 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>12 Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>4h 30m</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>;
}