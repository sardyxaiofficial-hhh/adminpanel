import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    text?: string;
  };
  id?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-[#d4a843]/10 text-[#d4a843]',
  trend,
  id = 'stat-card',
}: StatCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015, borderColor: '#d4a843' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-[#12121a] border border-[#252535] rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group transition-colors duration-300 hover:shadow-[#d4a843]/5 hover:shadow-2xl"
    >
      {/* Decorative Gold Backdrop Glow on Hover */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#d4a843]/5 rounded-full blur-3xl group-hover:bg-[#d4a843]/10 transition-colors duration-500"></div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${iconBgColor} flex items-center justify-center shadow-md shadow-black/10 transition-transform duration-300 group-hover:scale-105`}>
          {icon}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 z-10">
        <h3 className="text-2xl font-bold text-white tracking-tight font-display">{value}</h3>
        
        {trend && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-md ${
                trend.isPositive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              {trend.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {trend.value}%
            </span>
            {trend.text && <span className="text-xs text-[#55556a] font-medium">{trend.text}</span>}
          </div>
        )}

        {!trend && subtitle && (
          <span className="text-xs text-[#55556a] font-medium">{subtitle}</span>
        )}
      </div>
    </motion.div>
  );
}
