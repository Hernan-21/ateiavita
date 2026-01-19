import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ChevronLeft, FileText, MessageCircle, Move, CheckCircle2 } from 'lucide-react';
interface LessonDetailProps {
  onNavigate: (page: string) => void;
}
export function LessonDetail({
  onNavigate
}: LessonDetailProps) {
  return <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Blue Background */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50 rounded-3xl border border-blue-100/50 shadow-sm">
        <button onClick={() => onNavigate('level')} className="mb-6 flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-900 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Practice Material Level 1
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-6 mb-4">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-lg flex items-center justify-center font-serif font-bold text-3xl text-indigo-600 border border-indigo-100">
                A
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 font-serif">
                  Saludar
                </h1>
                <p className="text-slate-600 mt-1">
                  Lo primero que hacemos al interactuar con una persona es:
                  Saludar
                </p>
              </div>
            </div>
          </div>

          <GlassCard className="bg-indigo-600/10 border-indigo-200 flex items-center justify-between !p-6">
            <div>
              <p className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-1">
                Final Score
              </p>
              <p className="text-4xl font-bold text-indigo-600 font-serif">
                0%
              </p>
            </div>
            <div className="h-16 w-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-600">0/3</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Units List */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/40">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
              Unit 1
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-serif mt-1">
              Privet
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-9 px-4 text-xs">
              <FileText className="mr-2 h-3 w-3" /> Guide PDF
            </Button>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              0/3 Completed
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {[{
          title: 'Dialogo 1',
          type: 'Lesson',
          icon: <MessageCircle className="h-5 w-5" />
        }, {
          title: 'Ddialogo 2',
          type: 'Lesson',
          icon: <MessageCircle className="h-5 w-5" />
        }, {
          title: 'New drag_drop task',
          type: 'Practice',
          icon: <Move className="h-5 w-5" />,
          action: true
        }].map((item, idx) => <div key={idx} onClick={item.action ? () => onNavigate('task') : undefined} className={`
                p-6 flex items-center justify-between transition-colors
                ${item.action ? 'hover:bg-indigo-50/50 cursor-pointer group' : 'hover:bg-slate-50/50 cursor-pointer'}
              `}>
              <div className="flex items-center gap-4">
                <div className={`
                  h-10 w-10 rounded-full flex items-center justify-center border
                  ${item.action ? 'bg-white border-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600' : 'bg-white border-slate-200 text-slate-400'}
                  transition-all duration-300
                `}>
                  {item.icon}
                </div>
                <div>
                  <h4 className={`font-medium ${item.action ? 'text-indigo-900 group-hover:text-indigo-700' : 'text-slate-900'}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500">{item.type}</p>
                </div>
              </div>

              <div className={`
                h-6 w-6 rounded-full border-2 flex items-center justify-center
                ${item.action ? 'border-indigo-200 group-hover:border-indigo-400' : 'border-slate-200'}
              `}>
                {/* Checkmark would go here if completed */}
              </div>
            </div>)}
        </div>
      </GlassCard>
    </div>;
}