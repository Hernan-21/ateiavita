import React from 'react';
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}
export function GlassCard({
  children,
  className = '',
  onClick,
  hoverEffect = false
}: GlassCardProps) {
  return <div onClick={onClick} className={`
        glass-panel rounded-2xl p-6
        ${hoverEffect ? 'glass-panel-hover cursor-pointer' : ''}
        ${className}
      `}>
      {children}
    </div>;
}