/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  Award, 
  DollarSign, 
  Building2, 
  Key, 
  Laptop, 
  Activity, 
  Search, 
  Plus, 
  TrendingUp, 
  CreditCard, 
  Sparkles, 
  CalendarDays, 
  Copy, 
  ShieldCheck, 
  FileSpreadsheet, 
  UserSquare2, 
  History, 
  CircleDollarSign, 
  X, 
  Check, 
  TrendingDown, 
  Database,
  RefreshCw,
  HelpCircle,
  Clock,
  Lock,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBranchFilter } from './store/useBranchFilter';
import { db, isSupabaseConfigured, getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig } from './lib/supabaseClient';
import { 
  Branch, 
  Staff, 
  Customer, 
  Invoice, 
  Appointment, 
  Expense, 
  Device, 
  ActivationKey, 
  AuditLog, 
  ViewType, 
  BRANCHES 
} from './types';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StatCard } from './components/dashboard/StatCard';
import { DataTable, ColumnDef } from './components/tables/DataTable';
import { 
  RevenueChart, 
  AppointmentStatusChart, 
  BranchCompareChart, 
  TopServicesChart, 
  LiveFeed,
  formatPKR 
} from './components/dashboard/Charts';

// Modals
import { 
  ConnectionSettingsModal, 
  StaffModal, 
  ExpenseModal, 
  ActivationKeyModal, 
  InvoiceDetailModal, 
  CustomerDetailDrawer, 
  BranchDetailModal, 
  AuditLogDetailModal,
  ConfirmationModal
} from './components/dashboard/Modals';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nsk_admin_logged') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // App core states
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Database lists
  const [branches, setBranches] = useState<Branch[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [activationKeys, setActivationKeys] = useState<ActivationKey[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // UI state loadings
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Modals visibility toggles
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // Selected entities for drawers & detail modals
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedBranchDetail, setSelectedBranchDetail] = useState<Branch | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(null);

  // Search & custom filters (on top of global branch filter)
  const [staffSearch, setStaffSearch] = useState('');
  const [staffStatusFilter, setStaffStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [customerSearch, setCustomerSearch] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceMethodFilter, setInvoiceMethodFilter] = useState<'all' | 'cash' | 'card'>('all');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<'all' | 'paid' | 'refunded'>('all');
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState<string>('all');
  const [appointmentViewMode, setAppointmentViewMode] = useState<'list' | 'calendar'>('list');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('all');
  const [auditActionFilter, setAuditActionFilter] = useState('all');

  // Global filters
  const { selectedBranch, selectedDateRange } = useBranchFilter();

  // Deduplication helpers
  const deduplicate = <T extends { id: string }>(arr: T[]): T[] => {
    if (!Array.isArray(arr)) return [];
    const seen = new Set<string>();
    return arr.filter(item => {
      if (!item || !item.id) return false;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  const deduplicateKeys = <T extends { key: string }>(arr: T[]): T[] => {
    if (!Array.isArray(arr)) return [];
    const seen = new Set<string>();
    return arr.filter(item => {
      if (!item || !item.key) return false;
      if (seen.has(item.key)) return false;
      seen.add(item.key);
      return true;
    });
  };

  // Load and refresh core data from db
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        bData, 
        sData, 
        cData, 
        iData, 
        aData, 
        eData, 
        dData, 
        kData, 
        lData
      ] = await Promise.all([
        db.getBranches(),
        db.getStaff(),
        db.getCustomers(),
        db.getInvoices(),
        db.getAppointments(),
        db.getExpenses(),
        db.getDevices(),
        db.getActivationKeys(),
        db.getAuditLogs()
      ]);

      setBranches(deduplicate(bData));
      setStaff(deduplicate(sData));
      setCustomers(deduplicate(cData));
      setInvoices(deduplicate(iData));
      setAppointments(deduplicate(aData));
      setExpenses(deduplicate(eData));
      setDevices(deduplicate(dData));
      setActivationKeys(deduplicateKeys(kData));
      setAuditLogs(deduplicate(lData));
    } catch (err) {
      console.error('Failed to load data from database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Periodic Refresh simulation for live activity feed
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      // Refresh invoices and audit logs
      db.getInvoices().then(data => setInvoices(deduplicate(data)));
      db.getAuditLogs().then(data => setAuditLogs(deduplicate(data)));
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Filters application helpers
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchBranch = selectedBranch === 'all' || inv.branch_id === selectedBranch;
      
      // Date range calculation
      const invDate = new Date(inv.created_at);
      const today = new Date('2026-07-17T09:53:05-07:00');
      let matchDate = true;

      if (selectedDateRange === 'today') {
        matchDate = invDate.toDateString() === today.toDateString();
      } else if (selectedDateRange === '7days') {
        const threshold = new Date(today);
        threshold.setDate(today.getDate() - 7);
        matchDate = invDate >= threshold;
      } else if (selectedDateRange === '30days') {
        const threshold = new Date(today);
        threshold.setDate(today.getDate() - 30);
        matchDate = invDate >= threshold;
      } else if (selectedDateRange === '90days') {
        const threshold = new Date(today);
        threshold.setDate(today.getDate() - 90);
        matchDate = invDate >= threshold;
      }

      const matchSearch = !invoiceSearch || 
        inv.invoice_number.toLowerCase().includes(invoiceSearch.toLowerCase()) || 
        (inv.customer_name || '').toLowerCase().includes(invoiceSearch.toLowerCase());

      const matchMethod = invoiceMethodFilter === 'all' || inv.payment_method === invoiceMethodFilter;
      const matchStatus = invoiceStatusFilter === 'all' || inv.status === invoiceStatusFilter;

      return matchBranch && matchDate && matchSearch && matchMethod && matchStatus;
    });
  }, [invoices, selectedBranch, selectedDateRange, invoiceSearch, invoiceMethodFilter, invoiceStatusFilter]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const matchBranch = selectedBranch === 'all' || app.branch_id === selectedBranch;
      
      const appDate = new Date(app.start_time);
      const today = new Date('2026-07-17T09:53:05-07:00');
      let matchDate = true;

      if (selectedDateRange === 'today') {
        matchDate = appDate.toDateString() === today.toDateString();
      } else if (selectedDateRange === '7days') {
        const threshold = new Date(today);
        threshold.setDate(today.getDate() - 7);
        matchDate = appDate >= threshold;
      } else if (selectedDateRange === '30days') {
        const threshold = new Date(today);
        threshold.setDate(today.getDate() - 30);
        matchDate = appDate >= threshold;
      } else if (selectedDateRange === '90days') {
        const threshold = new Date(today);
        threshold.setDate(today.getDate() - 90);
        matchDate = appDate >= threshold;
      }

      const matchSearch = !appointmentSearch || 
        (app.customer_name || '').toLowerCase().includes(appointmentSearch.toLowerCase()) || 
        (app.service_name || '').toLowerCase().includes(appointmentSearch.toLowerCase());

      const matchStatus = appointmentStatusFilter === 'all' || app.status === appointmentStatusFilter;

      return matchBranch && matchDate && matchSearch && matchStatus;
    });
  }, [appointments, selectedBranch, selectedDateRange, appointmentSearch, appointmentStatusFilter]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchBranch = selectedBranch === 'all' || exp.branch_id === selectedBranch;
      
      const expDate = new Date(exp.date);
      const today = new Date('2026-07-17T09:53:05-07:00');
      let matchDate = true;

      if (selectedDateRange === 'today') {
        matchDate = expDate.toDateString() === today.toDateString();
      } else if (selectedDateRange === '7days') {
        const threshold = new Date(today);
        threshold.setDate(today.getDate() - 7);
        matchDate = expDate >= threshold;
      } else if (selectedDateRange === '30days') {
        const threshold = new Date(today);
        threshold.setDate(today.getDate() - 30);
        matchDate = expDate >= threshold;
      } else if (selectedDateRange === '90days') {
        const threshold = new Date(today);
        threshold.setDate(today.getDate() - 90);
        matchDate = expDate >= threshold;
      }

      const matchCategory = expenseCategoryFilter === 'all' || exp.category === expenseCategoryFilter;

      return matchBranch && matchDate && matchCategory;
    });
  }, [expenses, selectedBranch, selectedDateRange, expenseCategoryFilter]);

  // LOGIN ACTIONS
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'admin@nsk-enterprise.com' && loginPassword === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nsk_admin_logged', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator credentials. Please verify your Email and Password.');
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nsk_admin_logged');
  };

  // STAFF ACTIONS
  const handleSaveStaff = async (staffData: Omit<Staff, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => {
    setIsActionLoading(true);
    try {
      if (staffData.id) {
        // Edit Mode
        const updated = await db.editStaff(staffData.id, staffData);
        setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
      } else {
        // Add Mode
        const added = await db.addStaff(staffData);
        setStaff(prev => [added, ...prev]);
      }
      setSelectedStaff(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleStaffStatus = async (staffMember: Staff) => {
    const newStatus = staffMember.status === 'active' ? 'inactive' : 'active';
    try {
      const updated = await db.editStaff(staffMember.id, { status: newStatus });
      setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this staff member? This operation cannot be undone.')) {
      try {
        const success = await db.deleteStaff(id);
        if (success) {
          setStaff(prev => prev.filter(s => s.id !== id));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // EXPENSE ACTIONS
  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
    setIsActionLoading(true);
    try {
      const added = await db.addExpense(expenseData);
      setExpenses(prev => [added, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  // INVOICE REFUND ACTIONS
  const handleRefundInvoice = async (id: string) => {
    try {
      const refunded = await db.refundInvoice(id);
      setInvoices(prev => prev.map(inv => inv.id === refunded.id ? refunded : inv));
      setSelectedInvoice(null);
    } catch (e) {
      console.error(e);
    }
  };

  // APPOINTMENT STATUS ACTIONS
  const handleUpdateApptStatus = async (id: string, status: Appointment['status']) => {
    try {
      const updated = await db.updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(app => app.id === updated.id ? updated : app));
    } catch (e) {
      console.error(e);
    }
  };

  // DEVICE REVOACTION
  const handleRevokeDevice = async (id: string) => {
    if (confirm('Are you sure you want to revoke system clearance for this device terminal? Once revoked, the local cash POS will be locked.')) {
      try {
        const updated = await db.revokeDevice(id);
        setDevices(prev => prev.map(d => d.id === updated.id ? updated : d));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // ACTIVATION KEY ACTIONS
  const handleGenerateKey = async (branchId: string, customKey?: string) => {
    setIsActionLoading(true);
    try {
      const added = await db.generateActivationKey(branchId, customKey);
      setActivationKeys(prev => [added, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeactivateKey = async (keyStr: string) => {
    if (confirm('Are you sure you want to invalidate this activation key? Devices using this key will no longer be authorized.')) {
      try {
        const updated = await db.deactivateActivationKey(keyStr);
        setActivationKeys(prev => prev.map(k => k.key === updated.key ? updated : k));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // SUPABASE CREDENTIALS PERSISTENCE
  const handleSaveConnection = (url: string, key: string) => {
    saveSupabaseConfig(url, key);
    setIsSettingsOpen(false);
  };

  const handleClearConnection = () => {
    clearSupabaseConfig();
    setIsSettingsOpen(false);
  };

  // EXPORT CSV UTILITY
  const exportToCSV = (dataList: any[], filename: string) => {
    if (dataList.length === 0) return;
    const keys = Object.keys(dataList[0]);
    const csvContent = [
      keys.join(','), // header
      ...dataList.map(row => 
        keys.map(key => {
          let cell = row[key];
          if (cell === null || cell === undefined) cell = '';
          const str = String(cell).replace(/"/g, '""');
          return str.includes(',') || str.includes('\n') ? `"${str}"` : str;
        }).join(',')
      )
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render individual page components dynamically
  const renderDashboard = () => {
    // Math indicators
    const currentMonthRevenue = filteredInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total_amount, 0);

    const activeCustomers = customers.length;
    const activeStaff = staff.filter(s => s.status === 'active').length;

    const todayStr = new Date('2026-07-17T09:53:05-07:00').toDateString();
    const todayAppointments = appointments.filter(app => new Date(app.start_time).toDateString() === todayStr);
    const completedToday = todayAppointments.filter(app => app.status === 'completed').length;

    return (
      <div className="flex flex-col gap-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={formatPKR(currentMonthRevenue)}
            trend={{ value: 12.4, isPositive: true, text: 'vs last month' }}
            icon={<DollarSign size={20} />}
            iconBgColor="bg-amber-500/10 text-amber-400"
          />
          <StatCard
            title="Appointments Today"
            value={todayAppointments.length}
            trend={{ value: 8, isPositive: true, text: `${completedToday} completed` }}
            icon={<Calendar size={20} />}
            iconBgColor="bg-blue-500/10 text-blue-400"
          />
          <StatCard
            title="Active Customers"
            value={activeCustomers}
            trend={{ value: 4.2, isPositive: true, text: 'new this month' }}
            icon={<Users size={20} />}
            iconBgColor="bg-purple-500/10 text-purple-400"
          />
          <StatCard
            title="Staff Strength"
            value={`${activeStaff} Active`}
            subtitle="Across all branches"
            icon={<Award size={20} />}
            iconBgColor="bg-emerald-500/10 text-emerald-400"
          />
        </div>

        {/* Row 2: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8">
            <RevenueChart invoices={filteredInvoices} expenses={filteredExpenses} />
          </div>
          <div className="lg:col-span-4">
            <AppointmentStatusChart appointments={filteredAppointments} />
          </div>
        </div>

        {/* Row 3: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6">
            <BranchCompareChart invoices={filteredInvoices} />
          </div>
          <div className="lg:col-span-6">
            <TopServicesChart invoices={filteredInvoices} />
          </div>
        </div>

        {/* Row 4: Live Activity Feed */}
        <div className="grid grid-cols-1">
          <LiveFeed invoices={invoices} onInvoiceClick={setSelectedInvoice} />
        </div>
      </div>
    );
  };

  const renderBranches = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {branches.map(branch => {
          const bStaff = staff.filter(s => s.branch_id === branch.id);
          const bInvoices = invoices.filter(inv => inv.branch_id === branch.id && inv.status === 'paid');
          const bRevenue = bInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
          const bDevices = devices.filter(d => d.branch_id === branch.id && d.status === 'active');
          const bKeys = activationKeys.filter(k => k.branch_id === branch.id);
          const activeKey = bKeys.find(k => k.status === 'used');

          return (
            <motion.div
              key={branch.id}
              whileHover={{ scale: 1.01, borderColor: '#d4a843' }}
              className="bg-[#12121a] border border-[#252535] rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white font-display tracking-wide">{branch.name}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                    activeKey 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-[#d4a843] border-[#d4a843]/20'
                  }`}>
                    {activeKey ? 'Licensed' : 'No Active Key'}
                  </span>
                </div>
                <p className="text-xs text-[#8888aa] mb-5 leading-relaxed">{branch.address}</p>

                {/* Branch KPI row */}
                <div className="grid grid-cols-3 gap-3 bg-[#0d0d15] p-3 rounded-xl border border-[#252535] mb-5 text-center">
                  <div>
                    <span className="text-[9px] text-[#55556a] uppercase font-bold tracking-wider">Staff</span>
                    <span className="text-sm font-extrabold text-white block mt-0.5">{bStaff.length}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#55556a] uppercase font-bold tracking-wider">Devices</span>
                    <span className="text-sm font-extrabold text-white block mt-0.5">{bDevices.length} Active</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#55556a] uppercase font-bold tracking-wider">Revenue</span>
                    <span className="text-xs font-black text-[#d4a843] block mt-1 truncate">{formatPKR(bRevenue)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedBranchDetail(branch)}
                  className="flex-1 py-2.5 bg-[#1a1a26] hover:bg-[#252535] border border-[#252535] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderAnalytics = () => {
    // Expense categories aggregation
    const categoriesSum = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as { [key: string]: number });

    const expenseCategoryData = Object.entries(categoriesSum).map(([name, value]) => ({ name, value }));

    // Payment methods
    const cashTotal = filteredInvoices.filter(i => i.payment_method === 'cash' && i.status === 'paid').reduce((s, i) => s + i.total_amount, 0);
    const cardTotal = filteredInvoices.filter(i => i.payment_method === 'card' && i.status === 'paid').reduce((s, i) => s + i.total_amount, 0);
    const paymentData = [
      { name: 'Cash', value: cashTotal, color: '#d4a843' },
      { name: 'Card', value: cardTotal, color: '#3b82f6' }
    ].filter(item => item.value > 0);

    // Grid Columns definitions for Analytics Summary Stats Table
    const summaryColumns: ColumnDef<any>[] = [
      { 
        header: "Branch", 
        cell: (row) => <span className="font-bold text-white">{row.name}</span> 
      },
      { 
        header: "Revenue", 
        cell: (row) => <span className="font-bold text-[#d4a843]">{formatPKR(row.revenue)}</span> 
      },
      { 
        header: "Expenses", 
        cell: (row) => <span className="text-rose-400 font-medium">{formatPKR(row.expenses)}</span> 
      },
      { 
        header: "Net Profit", 
        cell: (row) => <span className={`font-extrabold ${row.profit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{formatPKR(row.profit)}</span> 
      },
      { header: "Total Invoices", accessorKey: "invoices" },
      { header: "Appointments", accessorKey: "appointments" },
    ];

    const summaryTableData = branches.map(b => {
      const bInvs = invoices.filter(i => i.branch_id === b.id);
      const bExps = expenses.filter(e => e.branch_id === b.id);
      const bAppts = appointments.filter(a => a.branch_id === b.id);

      const revenue = bInvs.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0);
      const expenseAmount = bExps.reduce((s, e) => s + e.amount, 0);

      return {
        name: b.name.replace('NSK ', ''),
        revenue,
        expenses: expenseAmount,
        profit: revenue - expenseAmount,
        invoices: bInvs.length,
        appointments: bAppts.length,
      };
    });

    // Compute Totals Row
    const totalRev = summaryTableData.reduce((s, i) => s + i.revenue, 0);
    const totalExp = summaryTableData.reduce((s, i) => s + i.expenses, 0);
    const totalsRow = {
      name: "TOTAL SYSTEM",
      revenue: totalRev,
      expenses: totalExp,
      profit: totalRev - totalExp,
      invoices: summaryTableData.reduce((s, i) => s + i.invoices, 0),
      appointments: summaryTableData.reduce((s, i) => s + i.appointments, 0),
    };

    const combinedSummaryData = [...summaryTableData, totalsRow];

    return (
      <div className="flex flex-col gap-6">
        {/* Full Width Area Chart */}
        <RevenueChart invoices={filteredInvoices} expenses={filteredExpenses} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Payment Method Distribution Card */}
          <div className="bg-[#12121a] border border-[#252535] rounded-2xl p-5 shadow-lg flex flex-col justify-between h-80">
            <div>
              <h3 className="text-base font-bold text-white font-display">Payment Distribution</h3>
              <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Cash vs Credit card volume</p>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="w-[140px] h-[140px]">
                <ResponsiveContainer width="100%" height="100%" id="payment-distribution-chart-container">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 flex flex-col gap-3 pl-4">
                {paymentData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 font-semibold text-[#8888aa]">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-white font-bold">{formatPKR(item.value)}</span>
                  </div>
                ))}
                {paymentData.length === 0 && (
                  <div className="text-xs text-[#55556a] italic">No transaction sales record found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Expense Categories Distribution Card */}
          <div className="bg-[#12121a] border border-[#252535] rounded-2xl p-5 shadow-lg flex flex-col justify-between h-80">
            <div>
              <h3 className="text-base font-bold text-white font-display">Expenses Categories</h3>
              <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Operations cost breakdown</p>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-3 mt-4 overflow-y-auto pr-1">
              {expenseCategoryData.map((cat: { name: string; value: number }, idx: number) => {
                const maxVal = Math.max(...expenseCategoryData.map((c: { name: string; value: number }) => c.value), 1);
                const percent = Math.round((cat.value / maxVal) * 100);
                return (
                  <div key={idx} className="flex flex-col gap-1 text-xs">
                    <div className="flex justify-between text-white font-semibold">
                      <span>{cat.name}</span>
                      <span className="text-rose-400 font-bold">{formatPKR(cat.value)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1a1a26] rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
              {expenseCategoryData.length === 0 && (
                <div className="text-xs text-[#55556a] italic text-center py-6">No operational expense logged.</div>
              )}
            </div>
          </div>
        </div>

        {/* Analytical Aggregated Summary Table */}
        <div className="bg-[#12121a] border border-[#252535] rounded-2xl p-5 shadow-lg flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">Financial Balance Table</h3>
            <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Aggregated metrics per operations branch</p>
          </div>
          
          <DataTable
            data={combinedSummaryData}
            columns={summaryColumns}
            searchable={false}
            id="analytics-summary-table"
          />
        </div>
      </div>
    );
  };

  const renderStaff = () => {
    // Filter staff list
    const list = staff.filter(member => {
      const matchBranch = selectedBranch === 'all' || member.branch_id === selectedBranch;
      const matchStatus = staffStatusFilter === 'all' || member.status === staffStatusFilter;
      const matchSearch = !staffSearch || 
        member.name.toLowerCase().includes(staffSearch.toLowerCase()) || 
        member.role.toLowerCase().includes(staffSearch.toLowerCase());

      return matchBranch && matchStatus && matchSearch;
    });

    const columns: ColumnDef<Staff>[] = [
      { 
        header: "Name", 
        cell: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1a1a26] border border-[#252535] text-[#d4a843] flex items-center justify-center font-bold text-xs shadow">
              {row.name.charAt(0)}
            </div>
            <span className="font-bold text-white group-hover:text-[#d4a843] transition-colors">{row.name}</span>
          </div>
        ) 
      },
      { header: "Role", accessorKey: "role" },
      { 
        header: "Branch", 
        cell: (row) => (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1a1a26] border border-[#252535] text-[#8888aa] max-w-[120px] truncate block">
            {BRANCHES[row.branch_id as keyof typeof BRANCHES]?.replace('NSK ', '') || 'Unassigned'}
          </span>
        )
      },
      { header: "Phone", accessorKey: "phone" },
      { header: "Email", accessorKey: "email" },
      { 
        header: "Status", 
        cell: (row) => (
          <button 
            onClick={(e) => { e.stopPropagation(); handleToggleStaffStatus(row); }}
            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full cursor-pointer transition-all hover:scale-105 border ${
              row.status === 'active' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
            }`}
            title="Click to toggle status"
          >
            {row.status}
          </button>
        )
      },
      { 
        header: "Actions", 
        cell: (row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSelectedStaff(row); setIsStaffModalOpen(true); }}
              className="text-xs font-semibold bg-[#1a1a26] hover:bg-[#252535] hover:text-[#d4a843] text-white px-2.5 py-1.5 rounded-lg border border-[#252535] transition-all cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteStaff(row.id)}
              className="text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-2.5 py-1.5 rounded-lg border border-rose-500/10 transition-all cursor-pointer"
            >
              Delete
            </button>
          </div>
        )
      }
    ];

    return (
      <div className="flex flex-col gap-5 bg-[#12121a] border border-[#252535] rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252535] pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">Staff Registry</h3>
            <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Manage branch operator credentials</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={staffStatusFilter}
              onChange={(e) => setStaffStatusFilter(e.target.value as any)}
              className="bg-[#1a1a26] border border-[#252535] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#d4a843]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={() => { setSelectedStaff(null); setIsStaffModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4a843] to-[#f0c060] text-black font-semibold rounded-xl text-xs shadow-md hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Plus size={14} />
              Add Staff
            </button>
          </div>
        </div>

        <DataTable
          data={list}
          columns={columns}
          searchPlaceholder="Search staff name or role..."
          searchable={true}
          searchKeys={['name', 'role', 'phone', 'email']}
          id="staff-registry-table"
        />
      </div>
    );
  };

  const renderCustomers = () => {
    const columns: ColumnDef<Customer>[] = [
      { 
        header: "Customer", 
        cell: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1a1a26] border border-[#252535] text-white flex items-center justify-center font-bold text-xs">
              {row.name.charAt(0)}
            </div>
            <span className="font-bold text-white group-hover:text-[#d4a843] transition-colors">{row.name}</span>
          </div>
        )
      },
      { header: "Phone", accessorKey: "phone" },
      { header: "Email", accessorKey: "email" },
      { 
        header: "Registered Branch", 
        cell: (row) => (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1a1a26] border border-[#252535] text-[#8888aa] max-w-[120px] truncate block">
            {BRANCHES[row.branch_id as keyof typeof BRANCHES]?.replace('NSK ', '') || 'All Branches'}
          </span>
        )
      },
      { header: "Visits", accessorKey: "totalVisits", sortable: true },
      { 
        header: "Total Spend", 
        cell: (row) => <span className="font-bold text-[#d4a843]">{formatPKR(row.totalSpend || 0)}</span>,
        sortable: true
      },
      { 
        header: "Last Visit", 
        cell: (row) => (
          <span>{row.lastVisit ? new Date(row.lastVisit).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}</span>
        )
      },
    ];

    return (
      <div className="flex flex-col gap-5 bg-[#12121a] border border-[#252535] rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#252535] pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">Customer CRM</h3>
            <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Manage guest visits and spent logs</p>
          </div>
        </div>

        <DataTable
          data={customers}
          columns={columns}
          searchPlaceholder="Search customers by name or phone..."
          searchable={true}
          searchKeys={['name', 'phone', 'email']}
          onExportCsv={() => exportToCSV(customers, 'customer_crm_export')}
          exportLabel="CSV Export"
          id="customer-crm-table"
        />
      </div>
    );
  };

  const renderInvoices = () => {
    const columns: ColumnDef<Invoice>[] = [
      { header: "Invoice #", accessorKey: "invoice_number" },
      { 
        header: "Date/Time", 
        cell: (row) => (
          <span>{new Date(row.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        ) 
      },
      { header: "Customer", accessorKey: "customer_name" },
      { 
        header: "Branch", 
        cell: (row) => (
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#1a1a26] border border-[#252535] text-[#8888aa] truncate max-w-[100px] block">
            {row.branch_name?.replace('NSK ', '') || 'POS'}
          </span>
        )
      },
      { header: "Operator Staff", accessorKey: "staff_name" },
      { 
        header: "Total", 
        cell: (row) => <span className="font-extrabold text-[#d4a843]">{formatPKR(row.total_amount)}</span>,
        sortable: true
      },
      { 
        header: "Payment", 
        cell: (row) => <span className="text-xs font-semibold uppercase">{row.payment_method}</span> 
      },
      { 
        header: "Status", 
        cell: (row) => (
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
            row.status === 'paid' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>{row.status}</span>
        )
      },
      { 
        header: "Receipt", 
        cell: (row) => (
          <button
            onClick={() => setSelectedInvoice(row)}
            className="px-2.5 py-1.5 bg-[#1a1a26] hover:bg-[#252535] text-[#d4a843] text-xs font-bold border border-[#252535] rounded-lg transition-all cursor-pointer"
          >
            Invoice details
          </button>
        ) 
      }
    ];

    return (
      <div className="flex flex-col gap-5 bg-[#12121a] border border-[#252535] rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252535] pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">Invoices Ledger</h3>
            <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Finance and transactions journal</p>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={invoiceMethodFilter}
              onChange={(e) => setInvoiceMethodFilter(e.target.value as any)}
              className="bg-[#1a1a26] border border-[#252535] text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#d4a843]"
            >
              <option value="all">All Payments</option>
              <option value="cash">Cash Only</option>
              <option value="card">Card Only</option>
            </select>
            <select
              value={invoiceStatusFilter}
              onChange={(e) => setInvoiceStatusFilter(e.target.value as any)}
              className="bg-[#1a1a26] border border-[#252535] text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#d4a843]"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <DataTable
          data={filteredInvoices}
          columns={columns}
          searchPlaceholder="Search invoice # or customer..."
          searchable={true}
          searchKeys={['invoice_number', 'customer_name']}
          onExportCsv={() => exportToCSV(filteredInvoices, 'invoices_ledger_export')}
          id="invoices-ledger-table"
        />
      </div>
    );
  };

  const renderAppointments = () => {
    const columns: ColumnDef<Appointment>[] = [
      { 
        header: "Start Time", 
        cell: (row) => (
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-[#8888aa]" />
            <span className="font-semibold text-white">{new Date(row.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )
      },
      { 
        header: "Date", 
        cell: (row) => (
          <span>{new Date(row.start_time).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        )
      },
      { header: "Customer Name", accessorKey: "customer_name" },
      { header: "Selected Service", accessorKey: "service_name" },
      { 
        header: "Branch Location", 
        cell: (row) => (
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1a1a26] border border-[#252535] text-[#8888aa] truncate max-w-[100px] block">
            {row.branch_name?.replace('NSK ', '')}
          </span>
        )
      },
      { header: "Staff Operator", accessorKey: "operator_name" },
      { 
        header: "Price", 
        cell: (row) => <span className="font-bold text-white">{formatPKR(row.price)}</span> 
      },
      { 
        header: "Duration", 
        cell: (row) => <span className="text-[#8888aa]">{row.price / 10 >= 30 ? '30m' : '20m'}</span> 
      },
      { 
        header: "Appt Status", 
        cell: (row) => (
          <div className="relative inline-block group/status">
            <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full block border cursor-pointer select-none transition-all ${
              row.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              row.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              row.status === 'in-service' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
              row.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
              'bg-[#252535] text-[#8888aa] border-[#252535]'
            }`}>
              {row.status}
            </span>
            
            {/* Quick action drop list */}
            <div className="absolute right-0 top-full mt-1 hidden group-hover/status:flex flex-col bg-[#12121a] border border-[#252535] rounded-xl py-1.5 shadow-2xl z-40 min-w-[110px]">
              {['pending', 'in-service', 'completed', 'cancelled', 'no-show'].map(statusVal => (
                <button
                  key={statusVal}
                  onClick={() => handleUpdateApptStatus(row.id, statusVal as any)}
                  className="w-full text-left px-3 py-1.5 text-[10px] uppercase font-bold text-[#8888aa] hover:text-white hover:bg-white/5 transition-all"
                >
                  {statusVal}
                </button>
              ))}
            </div>
          </div>
        )
      },
    ];

    // Simple Interactive Calendar Visual representation for current date 2026-07-17 week
    const renderCalendarView = () => {
      const today = new Date('2026-07-17T09:53:05-07:00');
      // Calculate start of week (Sunday)
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay());

      const weekDays = Array.from({ length: 7 }).map((_, idx) => {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + idx);
        return d;
      });

      return (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 select-none">
            {weekDays.map((day, idx) => {
              const dayStr = day.toDateString();
              const isToday = dayStr === today.toDateString();
              const dayAppts = filteredAppointments.filter(app => new Date(app.start_time).toDateString() === dayStr);

              return (
                <div 
                  key={idx} 
                  className={`border rounded-2xl p-3 min-h-[160px] flex flex-col justify-between transition-colors bg-[#0d0d15] ${
                    isToday ? 'border-[#d4a843] bg-[#d4a843]/5' : 'border-[#252535] hover:border-[#8888aa]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 border-b border-[#252535] pb-2">
                    <span className="text-[10px] font-bold text-[#55556a] uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className={`text-xs font-bold leading-none w-5 h-5 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-gradient-to-r from-[#d4a843] to-[#f0c060] text-black' : 'text-white'
                    }`}>{day.getDate()}</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto max-h-[120px] pr-1.5 scrollbar-thin">
                    {dayAppts.slice(0, 3).map((appt, aIdx) => (
                      <div 
                        key={`${appt.id}-${aIdx}`} 
                        onClick={() => {
                          const associatedInvoice = invoices.find(inv => inv.appointment_id === appt.id);
                          if (associatedInvoice) setSelectedInvoice(associatedInvoice);
                        }}
                        className={`p-1.5 rounded-lg border text-[9px] font-semibold leading-normal truncate cursor-pointer transition-all hover:scale-102 ${
                          appt.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          appt.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          appt.status === 'in-service' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}
                        title={`${appt.customer_name} - ${appt.service_name}`}
                      >
                        <p className="truncate font-bold text-white">{new Date(appt.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                        <p className="truncate opacity-90">{appt.customer_name}</p>
                      </div>
                    ))}
                    {dayAppts.length > 3 && (
                      <span className="text-[9px] text-[#55556a] font-bold text-center mt-1">+{dayAppts.length - 3} more</span>
                    )}
                    {dayAppts.length === 0 && (
                      <span className="text-[9px] text-[#55556a] italic text-center py-6">No schedules</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-5 bg-[#12121a] border border-[#252535] rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252535] pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">Appointments Schedules</h3>
            <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Manage operator client timetables</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={appointmentStatusFilter}
              onChange={(e) => setAppointmentStatusFilter(e.target.value)}
              className="bg-[#1a1a26] border border-[#252535] text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#d4a843]"
            >
              <option value="all">All Appointments</option>
              <option value="pending">Pending</option>
              <option value="in-service">In-service</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>

            <div className="flex bg-[#1a1a26] border border-[#252535] p-1 rounded-xl gap-1">
              <button
                onClick={() => setAppointmentViewMode('list')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  appointmentViewMode === 'list' ? 'bg-[#d4a843] text-black font-bold' : 'text-[#8888aa] hover:text-white'
                }`}
              >
                List Table
              </button>
              <button
                onClick={() => setAppointmentViewMode('calendar')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  appointmentViewMode === 'calendar' ? 'bg-[#d4a843] text-black font-bold' : 'text-[#8888aa] hover:text-white'
                }`}
              >
                Weekly Grid
              </button>
            </div>
          </div>
        </div>

        {appointmentViewMode === 'list' ? (
          <DataTable
            data={filteredAppointments}
            columns={columns}
            searchPlaceholder="Search customer or service name..."
            searchable={true}
            searchKeys={['customer_name', 'service_name']}
            id="appointments-timetable-table"
          />
        ) : (
          renderCalendarView()
        )}
      </div>
    );
  };

  const renderExpenses = () => {
    const totalExpensesSum = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const columns: ColumnDef<Expense>[] = [
      { 
        header: "Date", 
        cell: (row) => (
          <span>{new Date(row.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        )
      },
      { 
        header: "Branch", 
        cell: (row) => (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#1a1a26] border border-[#252535] text-[#8888aa] truncate max-w-[120px] block">
            {BRANCHES[row.branch_id as keyof typeof BRANCHES]?.replace('NSK ', '')}
          </span>
        )
      },
      { header: "Category", accessorKey: "category" },
      { header: "Description / Memo", accessorKey: "description" },
      { 
        header: "Amount", 
        cell: (row) => <span className="font-extrabold text-rose-400">{formatPKR(row.amount)}</span>,
        sortable: true
      },
    ];

    return (
      <div className="flex flex-col gap-6">
        {/* Summaries Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#12121a] border border-[#252535] p-5 rounded-2xl flex justify-between items-center relative overflow-hidden group">
            <div>
              <span className="text-[10px] text-[#8888aa] uppercase font-bold tracking-wider">Operational Cost</span>
              <p className="text-2xl font-black text-rose-400 font-display mt-2">{formatPKR(totalExpensesSum)}</p>
              <p className="text-[10px] text-[#55556a] mt-0.5">Total across filtered criteria</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <CircleDollarSign size={20} />
            </div>
          </div>

          <div className="bg-[#12121a] border border-[#252535] p-5 rounded-2xl flex justify-between items-center relative overflow-hidden group">
            <div>
              <span className="text-[10px] text-[#8888aa] uppercase font-bold tracking-wider">Entries</span>
              <p className="text-2xl font-black text-white font-display mt-2">{filteredExpenses.length} Records</p>
              <p className="text-[10px] text-[#55556a] mt-0.5">Logged in selection range</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#1a1a26] text-white border border-[#252535] flex items-center justify-center">
              <Plus size={16} />
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="flex flex-col gap-5 bg-[#12121a] border border-[#252535] rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#252535] pb-4">
            <div>
              <h3 className="text-base font-bold text-white font-display">Business Expenses</h3>
              <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Log and audit supplier / rent payments</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={expenseCategoryFilter}
                onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                className="bg-[#1a1a26] border border-[#252535] text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#d4a843]"
              >
                <option value="all">All Categories</option>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Supplies">Supplies</option>
                <option value="Staff Tea/Meals">Staff Tea/Meals</option>
                <option value="Marketing">Marketing</option>
                <option value="Repairs">Repairs</option>
                <option value="Other">Other</option>
              </select>

              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4a843] to-[#f0c060] text-black font-semibold rounded-xl text-xs shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Plus size={14} />
                Record Expense
              </button>
            </div>
          </div>

          <DataTable
            data={filteredExpenses}
            columns={columns}
            searchable={false}
            onExportCsv={() => exportToCSV(filteredExpenses, 'expenses_ledger_export')}
            id="expenses-journal-table"
          />
        </div>
      </div>
    );
  };

  const renderDevices = () => {
    const list = devices.filter(d => selectedBranch === 'all' || d.branch_id === selectedBranch);

    const formatRelativeTime = (dateStr: string) => {
      const past = new Date(dateStr).getTime();
      const now = new Date('2026-07-17T09:53:05-07:00').getTime();
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'Just seen';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHrs < 24) return `${diffHrs} hours ago`;
      return new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const columns: ColumnDef<Device>[] = [
      { header: "Terminal UUID", accessorKey: "device_uuid" },
      { header: "PC Hostname", accessorKey: "computer_name" },
      { header: "OS Runtime", accessorKey: "operating_system" },
      { header: "Windows Login User", accessorKey: "windows_username" },
      { 
        header: "Associated Branch", 
        cell: (row) => (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#1a1a26] border border-[#252535] text-[#8888aa] truncate max-w-[120px] block">
            {BRANCHES[row.branch_id as keyof typeof BRANCHES]?.replace('NSK ', '')}
          </span>
        )
      },
      { header: "App Version", accessorKey: "application_version" },
      { 
        header: "Last Seen Node", 
        cell: (row) => <span className="font-semibold text-emerald-400">{formatRelativeTime(row.last_seen)}</span> 
      },
      { 
        header: "Status", 
        cell: (row) => (
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
            row.status === 'active' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>{row.status}</span>
        )
      },
      { 
        header: "Revoke", 
        cell: (row) => (
          row.status === 'active' ? (
            <button
              onClick={() => handleRevokeDevice(row.id)}
              className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/10 rounded-lg transition-all cursor-pointer"
            >
              Revoke Node
            </button>
          ) : (
            <span className="text-xs text-[#55556a] italic font-medium">Clearance Revoked</span>
          )
        )
      }
    ];

    return (
      <div className="flex flex-col gap-5 bg-[#12121a] border border-[#252535] rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#252535] pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">Authorized Workstations</h3>
            <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">POS Desktop client registers node audit</p>
          </div>
        </div>

        <DataTable
          data={list}
          columns={columns}
          searchPlaceholder="Search computer hostnames or OS..."
          searchable={true}
          searchKeys={['computer_name', 'device_uuid', 'operating_system']}
          id="authorized-devices-table"
        />
      </div>
    );
  };

  const renderActivationKeys = () => {
    const list = activationKeys.filter(k => selectedBranch === 'all' || k.branch_id === selectedBranch);

    const columns: ColumnDef<ActivationKey>[] = [
      { 
        header: "Activation Key", 
        cell: (row) => (
          <span className="font-mono text-xs font-bold text-white tracking-wider select-all">{row.key}</span>
        )
      },
      { 
        header: "Branch", 
        cell: (row) => (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#1a1a26] border border-[#252535] text-[#8888aa] truncate max-w-[120px] block">
            {BRANCHES[row.branch_id as keyof typeof BRANCHES]?.replace('NSK ', '')}
          </span>
        )
      },
      { 
        header: "License Status", 
        cell: (row) => (
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
            row.status === 'active' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            row.status === 'used' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
            'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>{row.status}</span>
        )
      },
      { header: "Registered Node PC", accessorKey: "device_id" },
      { 
        header: "Created Date", 
        cell: (row) => (
          <span>{new Date(row.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        )
      },
      { 
        header: "Activated Timestamp", 
        cell: (row) => (
          <span>{row.activated_at ? new Date(row.activated_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
        )
      },
      { 
        header: "Actions", 
        cell: (row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(row.key);
                alert('License serial key copied to clipboard!');
              }}
              className="p-1.5 bg-[#1a1a26] border border-[#252535] text-[#8888aa] hover:text-white rounded-lg transition-all cursor-pointer"
              title="Copy key"
            >
              <Copy size={13} />
            </button>
            {row.status === 'active' && (
              <button
                onClick={() => handleDeactivateKey(row.key)}
                className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/10 rounded-lg transition-all cursor-pointer"
              >
                Revoke Key
              </button>
            )}
          </div>
        )
      }
    ];

    return (
      <div className="flex flex-col gap-5 bg-[#12121a] border border-[#252535] rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252535] pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">Serial Activation Keys</h3>
            <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Issue licensing serial registers to terminal clients</p>
          </div>
          
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="flex items-center gap-2 justify-center px-4 py-2 bg-gradient-to-r from-[#d4a843] to-[#f0c060] text-black font-semibold rounded-xl text-xs shadow-md hover:scale-[1.02] transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus size={14} />
            Generate Key
          </button>
        </div>

        <DataTable
          data={list}
          columns={columns}
          searchPlaceholder="Search serial numbers..."
          searchable={true}
          searchKeys={['key']}
          id="activation-keys-ledger-table"
        />
      </div>
    );
  };

  const renderAuditLogs = () => {
    const list = auditLogs.filter(l => {
      const matchBranch = selectedBranch === 'all' || l.branch_id === selectedBranch;
      const matchAction = auditActionFilter === 'all' || l.action === auditActionFilter;
      return matchBranch && matchAction;
    });

    const columns: ColumnDef<AuditLog>[] = [
      { 
        header: "Timestamp", 
        cell: (row) => (
          <span>{new Date(row.created_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        )
      },
      { 
        header: "Branch", 
        cell: (row) => (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#1a1a26] border border-[#252535] text-[#8888aa] truncate max-w-[120px] block">
            {BRANCHES[row.branch_id as keyof typeof BRANCHES]?.replace('NSK ', '')}
          </span>
        )
      },
      { header: "Operator Account", accessorKey: "operator_name" },
      { 
        header: "Initiated Action", 
        cell: (row) => (
          <span className="font-bold text-white">{row.action}</span>
        )
      },
      { header: "Entity Class", accessorKey: "entity" },
      { header: "Record Key ID", accessorKey: "entity_id" },
      { 
        header: "Clearance Audit", 
        cell: (row) => (
          <button
            onClick={() => setSelectedAuditLog(row)}
            className="px-2.5 py-1.5 bg-[#1a1a26] hover:bg-[#252535] text-[#d4a843] text-xs font-bold border border-[#252535] rounded-lg transition-all cursor-pointer"
          >
            Check JSON
          </button>
        )
      }
    ];

    return (
      <div className="flex flex-col gap-5 bg-[#12121a] border border-[#252535] rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252535] pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">System Audit Ledger</h3>
            <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Compliant transaction trace state registers</p>
          </div>

          <div>
            <select
              value={auditActionFilter}
              onChange={(e) => setAuditActionFilter(e.target.value)}
              className="bg-[#1a1a26] border border-[#252535] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#d4a843]"
            >
              <option value="all">All Logs Actions</option>
              <option value="Created Staff">Created Staff</option>
              <option value="Updated Staff">Updated Staff</option>
              <option value="Created Expense">Created Expense</option>
              <option value="Refunded Invoice">Refunded Invoice</option>
              <option value="Revoked Device">Revoked Device</option>
              <option value="Generated Activation Key">Generated Activation Key</option>
            </select>
          </div>
        </div>

        <DataTable
          data={list}
          columns={columns}
          searchPlaceholder="Search operators or actions..."
          searchable={true}
          searchKeys={['operator_name', 'action', 'entity_id']}
          id="system-audit-logs-table"
        />
      </div>
    );
  };

  const renderActiveViewContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'branches':
        return renderBranches();
      case 'analytics':
        return renderAnalytics();
      case 'staff':
        return renderStaff();
      case 'customers':
        return renderCustomers();
      case 'invoices':
        return renderInvoices();
      case 'appointments':
        return renderAppointments();
      case 'expenses':
        return renderExpenses();
      case 'devices':
        return renderDevices();
      case 'activation-keys':
        return renderActivationKeys();
      case 'audit-logs':
        return renderAuditLogs();
      default:
        return renderDashboard();
    }
  };

  const getPageTitleStr = () => {
    if (currentView === 'activation-keys') return 'Activation Keys';
    if (currentView === 'audit-logs') return 'System Audit Logs';
    return currentView.charAt(0).toUpperCase() + currentView.slice(1);
  };

  // RENDER APP SHELL OR LOGIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
        
        {/* Sleek architectural light glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#d4a843]/3 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4a3ca0]/3 rounded-full blur-[150px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-[#0d0d14]/90 backdrop-blur-2xl border border-[#252535] rounded-3xl p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] relative"
        >
          {/* Subtle gold line accent */}
          <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-3xl bg-gradient-to-r from-transparent via-[#d4a843] to-transparent opacity-80"></div>

          <div className="flex flex-col items-center mb-9 text-center">
            {/* Elegant Shield badge */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#1a1a26] to-[#0d0d15] border border-[#d4a843]/30 flex items-center justify-center shadow-[0_0_20px_rgba(212,168,67,0.05)] mb-4">
              <ShieldCheck className="text-[#d4a843]" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">NSK Enterprise</h1>
            <p className="text-[10px] text-[#8888aa] uppercase tracking-[0.2em] mt-1.5 font-semibold">Security Clearance Portal</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-[#8888aa] uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a]">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@nsk-enterprise.com"
                  className="w-full bg-[#12121a] border border-[#252535] text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#d4a843] focus:ring-1 focus:ring-[#d4a843]/30 transition-all font-medium placeholder-[#3a3a4e]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-[#8888aa] uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a]">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#12121a] border border-[#252535] text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#d4a843] focus:ring-1 focus:ring-[#d4a843]/30 transition-all font-mono placeholder-[#3a3a4e]"
                />
              </div>
            </div>

            {loginError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3.5 rounded-xl leading-relaxed text-center"
              >
                {loginError}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#bfa254] via-[#d4a843] to-[#bfa254] hover:brightness-110 text-black font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-[#d4a843]/5 transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Secure Portal Indicator */}
          <div className="mt-8 pt-6 border-t border-[#1f1f2e]/60 text-center flex flex-col items-center justify-center">
            <span className="text-[9px] text-[#55556a] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843]/70 animate-ping"></span>
              Encrypted Administrator Console
            </span>
            <p className="text-[9px] text-[#55556a] leading-relaxed mt-2 max-w-[280px]">
              Access restricted to authorized personnel only. All access attempts, database changes, and logs are persistently tracked.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // CORE APP SHELL HTML RENDER
  const configKeys = getSupabaseConfig();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f8] flex font-sans">
      
      {/* Dynamic responsive sidebar component */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onSignOut={handleSignOut}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        userEmail={loginEmail}
      />

      {/* Main app viewport */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Header
          title={getPageTitleStr()}
          onMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Outer content padding panel wrapper */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {isLoading ? (
            <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center gap-4 text-center">
              <RefreshCw className="text-[#d4a843] animate-spin" size={32} />
              <p className="text-sm text-[#8888aa] font-medium tracking-wide">Syncing clearance registers across system nodes...</p>
            </div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveViewContent()}
            </motion.div>
          )}
        </main>
      </div>

      {/* Reusable system popups and drawers mounting portal */}
      <AnimatePresence>
        
        {/* 1. Connection settings */}
        <ConnectionSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveConnection}
          onClear={handleClearConnection}
          currentUrl={configKeys.url}
          currentKey={configKeys.key}
        />

        {/* 2. Staff Modal (add/edit) */}
        <StaffModal
          isOpen={isStaffModalOpen}
          onClose={() => { setIsStaffModalOpen(false); setSelectedStaff(null); }}
          onSave={handleSaveStaff}
          staff={selectedStaff}
        />

        {/* 3. Expense Modal (record expense) */}
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSave={handleAddExpense}
        />

        {/* 4. Activation Key creation */}
        <ActivationKeyModal
          isOpen={isKeyModalOpen}
          onClose={() => setIsKeyModalOpen(false)}
          onSave={handleGenerateKey}
        />

        {/* 5. Invoice receipt details */}
        <InvoiceDetailModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
          onRefund={handleRefundInvoice}
        />

        {/* 6. Customer details drawer */}
        <CustomerDetailDrawer
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          customer={selectedCustomer}
          invoices={invoices}
        />

        {/* 7. Branch statistics detail portal */}
        <BranchDetailModal
          isOpen={!!selectedBranchDetail}
          onClose={() => setSelectedBranchDetail(null)}
          branch={selectedBranchDetail}
          staff={staff}
          invoices={invoices}
          devices={devices}
        />

        {/* 8. Audit log JSON inspect */}
        <AuditLogDetailModal
          isOpen={!!selectedAuditLog}
          onClose={() => setSelectedAuditLog(null)}
          log={selectedAuditLog}
        />

      </AnimatePresence>
    </div>
  );
}
