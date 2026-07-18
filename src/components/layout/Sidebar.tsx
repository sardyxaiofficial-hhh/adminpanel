import React from 'react';
import { 
  BarChart3, 
  Building2, 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  FileSpreadsheet, 
  CalendarDays, 
  CircleDollarSign, 
  Laptop, 
  KeyRound, 
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { ViewType } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onSignOut: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  userEmail?: string;
}

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'branches', label: 'Branches', icon: Building2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'customers', label: 'Customers', icon: UserSquare2 },
  { id: 'invoices', label: 'Invoices', icon: FileSpreadsheet },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'expenses', label: 'Expenses', icon: CircleDollarSign },
  { id: 'devices', label: 'Devices', icon: Laptop },
  { id: 'activation-keys', label: 'Activation Keys', icon: KeyRound },
  { id: 'audit-logs', label: 'Audit Logs', icon: History },
];

export function Sidebar({
  currentView,
  onViewChange,
  onSignOut,
  isMobileOpen,
  setIsMobileOpen,
  collapsed,
  setCollapsed,
  userEmail = 'admin@nsk-enterprise.com',
}: SidebarProps) {
  
  const handleItemClick = (id: ViewType) => {
    onViewChange(id);
    setIsMobileOpen(false); // Close on mobile navigation
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#08080c] border-r border-[#252535]">
      {/* Brand area */}
      <div className={`p-5 flex items-center justify-between border-b border-[#252535] h-[72px] ${collapsed ? 'justify-center px-2' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#1a1a26] to-[#0c0c12] border border-[#d4a843]/30 flex items-center justify-center shadow-lg">
              <span className="text-[#d4a843] font-black text-xs tracking-tight font-display">NSK</span>
            </div>
            <div>
              <h1 className="text-xs font-bold text-white leading-none tracking-wider font-display flex items-center gap-1.5 uppercase">
                NSK <span className="text-[#d4a843] text-[9px] font-bold bg-[#d4a843]/10 px-2 py-0.5 rounded-md border border-[#d4a843]/20 uppercase tracking-widest">Admin</span>
              </h1>
              <p className="text-[9px] text-[#55556a] font-bold uppercase mt-1 tracking-widest">Enterprise Panel</p>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#1a1a26] to-[#0c0c12] border border-[#d4a843]/30 flex items-center justify-center shadow-lg">
            <span className="text-[#d4a843] font-black text-xs tracking-tight font-display">N</span>
          </div>
        )}

        {/* Collapsible Toggle for Desktop */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 hover:bg-[#1a1a26] text-[#8888aa] hover:text-white rounded-lg border border-transparent hover:border-[#252535] transition-all cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1 select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4a843]/12 to-[#d4a843]/3 text-[#d4a843] border border-[#d4a843]/25 shadow-[0_4px_12px_rgba(212,168,67,0.03)]'
                  : 'text-[#8888aa] hover:text-white hover:bg-[#12121a] hover:border-[#252535]/50 border border-transparent'
              }`}
            >
              <span className={`${isActive ? 'text-[#d4a843]' : 'text-[#8888aa] group-hover:text-[#d4a843] transition-colors duration-200'}`}>
                <Icon size={18} />
              </span>
              
              {!collapsed && (
                <span className="truncate tracking-wide">{item.label}</span>
              )}

              {/* Tooltip on collapse */}
              {collapsed && (
                <div className="absolute left-16 scale-0 group-hover:scale-100 bg-[#12121a] border border-[#252535] text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl font-medium pointer-events-none transition-all z-50 whitespace-nowrap shadow-black/40">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* User profile / bottom actions */}
      <div className="p-4 border-t border-[#252535] flex flex-col gap-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 bg-[#12121a] p-3 rounded-xl border border-[#252535]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#252535] to-[#1a1a26] border border-[#d4a843]/30 flex items-center justify-center text-[#d4a843] font-bold text-sm shadow-md">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">NSK Administrator</p>
              <p className="text-[10px] text-[#8888aa] truncate mt-0.5">{userEmail}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#252535] to-[#1a1a26] border border-[#d4a843]/30 flex items-center justify-center text-[#d4a843] font-bold text-sm shadow-md cursor-pointer hover:border-[#d4a843]" title="NSK Administrator">
              A
            </div>
          </div>
        )}

        <button
          onClick={onSignOut}
          className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
          {collapsed && (
            <div className="absolute left-16 scale-0 group-hover:scale-100 bg-[#12121a] border border-[#252535] text-rose-400 text-xs px-2.5 py-1.5 rounded-lg shadow-xl font-medium pointer-events-none transition-all z-50 whitespace-nowrap shadow-black/40">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static Sidebar */}
      <div className={`hidden md:block h-screen fixed top-0 left-0 transition-all duration-300 z-30 ${collapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-0 bottom-0 left-0 w-64 z-50 md:hidden"
          >
            {/* Close button inside mobile drawer */}
            <div className="absolute right-3 top-3.5 text-[#8888aa] hover:text-white cursor-pointer p-1 rounded-lg bg-[#1a1a26]/80 border border-[#252535] z-50 md:hidden" onClick={() => setIsMobileOpen(false)}>
              <X size={16} />
            </div>
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
