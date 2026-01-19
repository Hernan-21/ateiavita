import React from 'react';
import { Lightbulb, MessageSquare, MonitorPlay, Bell, ChevronDown, Megaphone } from 'lucide-react';
interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
}
export function Layout({
  children,
  onNavigate,
  currentPage
}: LayoutProps) {
  return <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-purple-50/50 to-slate-100 text-slate-800 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-500 transition-transform group-hover:scale-110">
                <Lightbulb className="h-6 w-6 fill-current" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">
                ANNA
              </span>
            </button>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => onNavigate('dashboard')} className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentPage === 'dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>
                <MonitorPlay className="h-4 w-4" />
                Courses
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                <MessageSquare className="h-4 w-4" />
                Feedback
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="h-9 w-9 rounded-full ring-2 ring-white shadow-sm" />
              <div className="hidden sm:flex items-center gap-2 cursor-pointer group">
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  Hernan
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative mt-auto w-full bg-amber-400 border-t-4 border-amber-500">
        {/* Decorative wave border */}
        <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
          <svg className="absolute w-full h-full" viewBox="0 0 1200 40" preserveAspectRatio="none" style={{
          transform: 'translateY(-50%)'
        }}>
            <path d="M0,20 Q300,0 600,20 T1200,20 L1200,40 L0,40 Z" fill="white" opacity="0.1" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left side - Decorative megaphone */}
            <div className="hidden md:block">
              <Megaphone className="h-8 w-8 text-amber-600 opacity-50" />
            </div>

            {/* Center - Links and Copyright */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-6 text-sm">
                <button className="font-medium text-amber-900 hover:text-amber-950 transition-colors flex items-center gap-1.5">
                  <Megaphone className="h-3.5 w-3.5" />
                  Terms of Use
                </button>
                <span className="text-amber-700">•</span>
                <button className="font-medium text-amber-900 hover:text-amber-950 transition-colors flex items-center gap-1.5">
                  <span className="inline-block w-3.5 h-3.5 rounded-full bg-amber-600"></span>
                  Privacy Policy
                </button>
              </div>
              <p className="text-sm font-medium text-amber-900">
                © 2025 Privet LatAm. All rights reserved.
              </p>
            </div>

            {/* Right side - Decorative megaphone */}
            <div className="hidden md:block">
              <Megaphone className="h-8 w-8 text-amber-600 opacity-50 scale-x-[-1]" />
            </div>
          </div>
        </div>
      </footer>
    </div>;
}