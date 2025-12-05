import React from 'react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  className?: string;
  valueClassName?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, trendDirection, className, valueClassName }) => {
  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col", className)}>
      <span className="text-sm text-slate-500 font-medium uppercase">{title}</span>
      <span className={cn("text-3xl font-bold text-slate-800 mt-2", valueClassName)}>{value}</span>
      {trend && (
        <span className={cn("text-xs mt-2 font-medium", 
          trendDirection === 'up' ? "text-green-600" : 
          trendDirection === 'down' ? "text-red-600" : "text-slate-500"
        )}>
          {trend}
        </span>
      )}
    </div>
  );
};

export default KPICard;
