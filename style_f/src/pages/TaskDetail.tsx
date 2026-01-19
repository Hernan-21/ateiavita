import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ChevronLeft, FileText, RotateCcw } from 'lucide-react';
interface TaskDetailProps {
  onNavigate: (page: string) => void;
}
export function TaskDetail({
  onNavigate
}: TaskDetailProps) {
  const [letters, setLetters] = useState(['I', 'R', 'P', 'T', 'E', 'V']);
  // Simple shuffle for demo
  const shuffle = () => {
    setLetters([...letters].sort(() => Math.random() - 0.5));
  };
  return <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => onNavigate('lesson')} className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Privet
        </button>
        <Button variant="ghost" className="text-xs">
          <FileText className="mr-2 h-3 w-3" /> PDF Version
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 mb-4">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c7d2fe" alt="Character" className="h-16 w-16" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">
          New drag_drop task
        </h1>
        <p className="text-slate-500">Privet</p>
      </div>

      {/* Task Area */}
      <GlassCard className="min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 opacity-20"></div>

        <div className="w-full max-w-2xl text-center space-y-12 z-10">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              Arrange the letters
            </h2>
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium border border-indigo-100">
              Hint: Hola
            </span>
          </div>

          {/* Draggable Letters Area */}
          <div className="flex flex-wrap items-center justify-center gap-4 p-8 rounded-3xl bg-slate-50/50 border border-slate-100 inner-shadow">
            {letters.map((letter, idx) => <div key={`${letter}-${idx}`} className="
                  h-16 w-16 rounded-xl bg-white shadow-[0_4px_10px_rgb(0,0,0,0.06)] 
                  flex items-center justify-center text-2xl font-bold text-slate-800 font-serif
                  cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-lg transition-all duration-200
                  border border-slate-100 select-none
                ">
                {letter}
              </div>)}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="secondary" onClick={shuffle} icon={<RotateCcw className="h-4 w-4" />}>
              Reset
            </Button>
            <Button className="px-12 py-3 text-lg">Check Answer</Button>
          </div>
        </div>
      </GlassCard>
    </div>;
}