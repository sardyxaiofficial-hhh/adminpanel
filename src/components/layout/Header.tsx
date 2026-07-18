import React from 'react';
import { Menu, Calendar, Building, Wifi, WifiOff, Settings2, ShieldCheck } from 'lucide-react';
import { useBranchFilter, DateRangeType } from '../../store/useBranchFilter';
import { BRANCHES } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
  onOpenSettings: () => void;
  id?: string;
}

export function Header({
  title,
  onMenuToggle,
  onOpenSettings,
  id = "app-header",
}: HeaderProps) {
  const { 
    selectedBranch, 
    setSelectedBranch, 
    selectedDateRange, 
    setSelectedDateRange 
  } = useBranchFilter();

  const isConnected = isSupabaseConfigured();

  const getBreadcrumb = () => {
    switch (title.toLowerCase()) {
      case 'dashboard':
        return 'Admin / Overview';
      case 'branches':
        return 'Salon Management / Branches';
      case 'analytics':
        return 'Business intelligence / Analytics';
      case 'staff':
        return 'Human Resources / Staff';
      case 'customers':
        return 'CRM / Customers';
      case 'invoices':
        return 'Finance / Invoices';
      case 'appointments':
        return 'Schedules / Appointments';
      case 'expenses':
        return 'Finance / Expenses';
      case 'devices':
        return 'Infrastructure / Devices';
      case 'activation-keys':
        return 'Security / Activation Keys';
      case 'audit-logs':
        return 'Compliance / Audit Logs';
      default:
        return 'Admin / Console';
    }
  };

  return (
    <header
      id={id}
      className="h-[72px] bg-[#08080c]/70 backdrop-blur-xl border-b border-[#252535] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.3)]"
    >
      {/* Left section: Hamburger (mobile) + Page Title & Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 sm:p-2 bg-[#12121a] border border-[#252535] rounded-xl text-[#8888aa] hover:text-white transition-all cursor-pointer flex-shrink-0"
        >
          <Menu size={16} />
        </button>
        <div className="min-w-0">
          <span className="text-[9px] text-[#55556a] uppercase font-bold tracking-widest block mb-0.5 truncate">
            {getBreadcrumb()}
          </span>
          <h2 className="text-sm sm:text-base md:text-xl font-bold text-white tracking-tight font-display truncate">{title}</h2>
        </div>
      </div>

      {/* Right section: Filters & Options */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        
        {/* Connection Status Indicator Button */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold border transition-all cursor-pointer ${
            isConnected
              ? 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/5 hover:bg-amber-500/10 text-[#d4a843] border-[#d4a843]/20'
          }`}
          title="Click to view Database Connection Settings"
        >
          {isConnected ? (
            <>
              <ShieldCheck size={12} className="text-emerald-400 animate-pulse sm:w-3.5 sm:h-3.5" />
              <span className="hidden lg:inline">Supabase Active</span>
            </>
          ) : (
            <>
              <WifiOff size={12} className="text-[#d4a843] animate-pulse sm:w-3.5 sm:h-3.5" />
              <span className="hidden lg:inline">Offline Simulator</span>
            </>
          )}
          <Settings2 size={11} className="text-[#8888aa] hover:text-white sm:w-3.5 sm:h-3.5" />
        </button>

        {/* Global Branch Selector Dropdown */}
        <div className="relative flex items-center bg-[#12121a] border border-[#252535] rounded-xl px-2 sm:px-2.5 py-1.5 sm:py-2 focus-within:border-[#d4a843] transition-all">
          <Building size={12} className="text-[#8888aa] mr-1.5 hidden sm:inline" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-transparent text-white text-[10px] sm:text-xs md:text-sm font-semibold pr-3 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#12121a] text-white">All Branches</option>
            {Object.entries(BRANCHES).map(([id, name]) => (
              <option key={id} value={id} className="bg-[#12121a] text-white">
                {name.replace('NSK ', '')}
              </option>
            ))}
          </select>
          {selectedBranch !== 'all' && (
            <span className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#d4a843] shadow-[0_0_8px_rgba(212,168,67,0.8)]"></span>
          )}
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative flex items-center bg-[#12121a] border border-[#252535] rounded-xl px-2 sm:px-2.5 py-1.5 sm:py-2 focus-within:border-[#d4a843] transition-all">
          <Calendar size={12} className="text-[#8888aa] mr-1.5 hidden sm:inline" />
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value as DateRangeType)}
            className="bg-transparent text-white text-[10px] sm:text-xs md:text-sm font-semibold pr-3 focus:outline-none cursor-pointer"
          >
            <option value="today" className="bg-[#12121a] text-white">Today</option>
            <option value="7days" className="bg-[#12121a] text-white">7 Days</option>
            <option value="30days" className="bg-[#12121a] text-white">30 Days</option>
            <option value="90days" className="bg-[#12121a] text-white">90 Days</option>
          </select>
        </div>

      </div>
    </header>
  );
}
