import React from 'react';
import { Loader2 } from 'lucide-react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
}
export function Button({
  children,
  variant = 'primary',
  isLoading,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 focus:ring-indigo-500',
    secondary: 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50 focus:ring-slate-200',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    outline: 'bg-transparent border border-indigo-200 text-indigo-600 hover:bg-indigo-50'
  };
  return <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : icon ? <span className="mr-2">{icon}</span> : null}
      {children}
    </button>;
}