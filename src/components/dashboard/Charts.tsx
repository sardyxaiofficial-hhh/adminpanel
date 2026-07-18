import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { Invoice, Expense, Appointment } from '../../types';

// Standardized PKR Currency formatter
export const formatPKR = (num: number) => {
  return `₨ ${num.toLocaleString('en-PK')}`;
};

// 1. REVENUE VS EXPENSES LINE/AREA CHART
interface RevenueChartProps {
  invoices: Invoice[];
  expenses: Expense[];
}

export function RevenueChart({ invoices, expenses }: RevenueChartProps) {
  const chartData = useMemo(() => {
    const dailyData: { [key: string]: { date: string; displayDate: string; revenue: number; expenses: number } } = {};
    const today = new Date('2026-07-17T09:53:05-07:00');

    // Initialize past 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
      dailyData[dateStr] = { date: dateStr, displayDate, revenue: 0, expenses: 0 };
    }

    // Populate Invoices
    invoices.forEach(inv => {
      if (inv.status === 'paid') {
        const dateStr = inv.created_at.split('T')[0];
        if (dailyData[dateStr]) {
          dailyData[dateStr].revenue += inv.total_amount;
        }
      }
    });

    // Populate Expenses
    expenses.forEach(exp => {
      const dateStr = exp.date;
      if (dailyData[dateStr]) {
        dailyData[dateStr].expenses += exp.amount;
      }
    });

    return Object.values(dailyData);
  }, [invoices, expenses]);

  return (
    <div className="w-full h-80 bg-[#12121a] border border-[#252535] rounded-2xl p-5 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-bold text-white font-display">Revenue vs Expenses</h3>
          <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Daily overview (Last 30 days)</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4a843]"></span>
            <span className="text-white">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-white">Expenses</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%" id="revenue-chart-container">
          <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4a843" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#d4a843" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#252535" vertical={false} />
            <XAxis 
              dataKey="displayDate" 
              stroke="#55556a" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#55556a" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(v) => `₨ ${v >= 1000 ? (v / 1000) + 'k' : v}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#12121a', borderColor: '#252535', borderRadius: '12px' }}
              labelStyle={{ color: '#8888aa', fontSize: '11px', fontWeight: 'bold' }}
              itemStyle={{ fontSize: '13px', padding: '1px 0' }}
              formatter={(value: any, name: any) => [
                <span className="text-white font-bold">{formatPKR(value as number)}</span>,
                name === 'revenue' ? <span className="text-[#d4a843] font-medium">Revenue</span> : <span className="text-rose-400 font-medium">Expenses</span>
              ]}
            />
            <Area type="monotone" dataKey="revenue" name="revenue" stroke="#d4a843" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
            <Area type="monotone" dataKey="expenses" name="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 2. APPOINTMENT STATUS DONUT CHART
interface AppointmentStatusChartProps {
  appointments: Appointment[];
}

export function AppointmentStatusChart({ appointments }: AppointmentStatusChartProps) {
  const statusData = useMemo(() => {
    const counts = {
      completed: 0,
      pending: 0,
      cancelled: 0,
      'no-show': 0,
      'in-service': 0
    };

    appointments.forEach(app => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    });

    return [
      { name: 'Completed', value: counts.completed, color: '#22c55e' },
      { name: 'Pending', value: counts.pending, color: '#f59e0b' },
      { name: 'In Service', value: counts['in-service'], color: '#3b82f6' },
      { name: 'Cancelled', value: counts.cancelled, color: '#ef4444' },
      { name: 'No Show', value: counts['no-show'], color: '#55556a' },
    ].filter(segment => segment.value > 0); // only show segments with values
  }, [appointments]);

  const totalAppts = appointments.length;

  return (
    <div className="w-full h-80 bg-[#12121a] border border-[#252535] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-white font-display">Appointments</h3>
        <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Status breakdown</p>
      </div>

      <div className="flex items-center justify-between gap-2 relative">
        {/* Pie Canvas Wrapper */}
        <div className="w-[150px] h-[150px] relative">
          <ResponsiveContainer width="100%" height="100%" id="appointment-status-chart-container">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Inner Total Metric Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-white leading-none">{totalAppts}</span>
            <span className="text-[9px] font-bold text-[#8888aa] uppercase tracking-wider mt-1.5">Total</span>
          </div>
        </div>

        {/* Legend Segment labels */}
        <div className="flex-1 flex flex-col gap-2.5 max-h-[170px] overflow-y-auto pl-2">
          {statusData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-[#8888aa]">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-white block leading-none">{item.value}</span>
                <span className="text-[9px] text-[#55556a] block mt-0.5">
                  {totalAppts > 0 ? Math.round((item.value / totalAppts) * 100) : 0}%
                </span>
              </div>
            </div>
          ))}
          {statusData.length === 0 && (
            <div className="text-xs text-[#55556a] italic py-4">No appointments scheduled for selected filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. BRANCH COMPARISON BAR CHART
interface BranchCompareChartProps {
  invoices: Invoice[];
}

export function BranchCompareChart({ invoices }: BranchCompareChartProps) {
  const branchData = useMemo(() => {
    const branchSales: { [key: string]: number } = {
      'nsk-abt-gents-0001': 0,
      'nsk-abt-ladies-0002': 0,
      'nsk-msr-gents-0003': 0,
      'nsk-btg-gents-0004': 0,
    };

    invoices.forEach(inv => {
      if (inv.status === 'paid' && branchSales[inv.branch_id] !== undefined) {
        branchSales[inv.branch_id] += inv.total_amount;
      }
    });

    return [
      { name: 'Abbottabad Gents', short: 'ABT G', sales: branchSales['nsk-abt-gents-0001'] },
      { name: 'Abbottabad Ladies', short: 'ABT L', sales: branchSales['nsk-abt-ladies-0002'] },
      { name: 'Mansehra Gents', short: 'MSR G', sales: branchSales['nsk-msr-gents-0003'] },
      { name: 'Battagram Gents', short: 'BTG G', sales: branchSales['nsk-btg-gents-0004'] },
    ];
  }, [invoices]);

  return (
    <div className="w-full h-80 bg-[#12121a] border border-[#252535] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-white font-display">Branch Performance</h3>
        <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Monthly revenue comparison</p>
      </div>

      <div className="w-full h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%" id="branch-compare-chart-container">
          <BarChart data={branchData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252535" vertical={false} />
            <XAxis 
              dataKey="short" 
              stroke="#55556a" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#55556a" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(v) => `₨ ${v >= 1000 ? (v / 1000) + 'k' : v}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#12121a', borderColor: '#252535', borderRadius: '12px' }}
              formatter={(value: any) => [
                <span className="text-white font-bold">{formatPKR(value as number)}</span>,
                <span className="text-[#d4a843] font-medium">Sales</span>
              ]}
              labelStyle={{ color: '#8888aa', fontSize: '11px', fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="sales" 
              fill="#d4a843" 
              radius={[6, 6, 0, 0]}
              maxBarSize={35}
            >
              {branchData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    index === 1 
                      ? 'url(#goldGradientLight)' // Abbottabad Ladies highlight
                      : 'url(#goldGradientNormal)'
                  } 
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="goldGradientNormal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4a843" />
                <stop offset="100%" stopColor="#a07830" />
              </linearGradient>
              <linearGradient id="goldGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f0c060" />
                <stop offset="100%" stopColor="#d4a843" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 4. TOP SERVICES LIST
interface TopServicesChartProps {
  invoices: Invoice[];
}

export function TopServicesChart({ invoices }: TopServicesChartProps) {
  const topServices = useMemo(() => {
    const servicesCount: { [key: string]: { name: string; bookings: number; revenue: number } } = {};

    invoices.forEach(inv => {
      if (inv.status === 'paid') {
        try {
          const items = JSON.parse(inv.services_json);
          if (Array.isArray(items)) {
            items.forEach(item => {
              const name = item.name || 'Haircut';
              if (!servicesCount[name]) {
                servicesCount[name] = { name, bookings: 0, revenue: 0 };
              }
              servicesCount[name].bookings += item.qty || 1;
              servicesCount[name].revenue += (item.price || 0) * (item.qty || 1);
            });
          }
        } catch (e) {
          // Fallback parsing if JSON isn't array
        }
      }
    });

    return Object.values(servicesCount)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [invoices]);

  const maxBookings = useMemo(() => {
    if (topServices.length === 0) return 1;
    return Math.max(...topServices.map(s => s.bookings));
  }, [topServices]);

  return (
    <div className="w-full h-80 bg-[#12121a] border border-[#252535] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-white font-display">Popular Services</h3>
        <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Top 5 by booking frequency</p>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3.5 mt-2 overflow-y-auto">
        {topServices.map((service, idx) => {
          const percentage = Math.round((service.bookings / maxBookings) * 100);
          return (
            <div key={idx} className="flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between text-white font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-[#d4a843]/10 text-[#d4a843] flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="truncate max-w-[150px] md:max-w-xs">{service.name}</span>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="text-[#8888aa]">{service.bookings} bookings</span>
                  <span className="text-white font-bold">{formatPKR(service.revenue)}</span>
                </div>
              </div>
              {/* Relative popularity bar */}
              <div className="w-full h-1.5 bg-[#1a1a26] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#d4a843] to-[#f0c060] rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
        {topServices.length === 0 && (
          <div className="text-xs text-[#55556a] italic text-center py-10">No invoice items found for this branch.</div>
        )}
      </div>
    </div>
  );
}

// 5. LIVE TRANSACTIONS FEED
interface LiveFeedProps {
  invoices: Invoice[];
  onInvoiceClick: (invoice: Invoice) => void;
}

export function LiveFeed({ invoices, onInvoiceClick }: LiveFeedProps) {
  // Get last 10 transactions
  const lastInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 8);
  }, [invoices]);

  const timeAgo = (dateStr: string) => {
    const past = new Date(dateStr).getTime();
    const now = new Date('2026-07-17T09:53:05-07:00').getTime();
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-[#12121a] border border-[#252535] rounded-2xl p-5 shadow-lg w-full">
      <div className="flex justify-between items-center mb-4 border-b border-[#252535] pb-3">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Live Activity Feed
          </h3>
          <p className="text-[11px] text-[#8888aa] font-medium uppercase tracking-wider mt-0.5">Real-time point of sale transactions</p>
        </div>
        <span className="text-[10px] bg-[#1a1a26] text-[#8888aa] border border-[#252535] px-2.5 py-1 rounded-lg font-bold">Auto-updates 30s</span>
      </div>

      <div className="flex flex-col gap-1 divide-y divide-[#252535]/30 max-h-[420px] overflow-y-auto pr-1">
        {lastInvoices.map((inv, idx) => {
          const isPaid = inv.status === 'paid';
          return (
            <div 
              key={`${inv.id}-${idx}`} 
              onClick={() => onInvoiceClick(inv)}
              className="flex items-center justify-between py-3.5 hover:bg-[#1a1a26]/40 px-2 rounded-xl transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center font-bold text-xs shadow-md border ${
                  isPaid 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  ₨
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white group-hover:text-[#d4a843] transition-colors">{inv.invoice_number}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#1a1a26] text-[#8888aa] border border-[#252535] uppercase tracking-wider max-w-[80px] truncate">
                      {inv.branch_name ? inv.branch_name.replace('NSK ', '').replace(' GENTS', '').replace(' LADIES', '') : 'ABT'}
                    </span>
                  </div>
                  <p className="text-xs text-[#8888aa] truncate mt-0.5">{inv.customer_name || 'Walk-in Customer'}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-white block">{formatPKR(inv.total_amount)}</span>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <span className="text-[10px] font-medium text-[#55556a]">{timeAgo(inv.created_at)}</span>
                </div>
              </div>
            </div>
          );
        })}
        {lastInvoices.length === 0 && (
          <div className="text-sm text-[#55556a] italic text-center py-12">No transactions recorded yet.</div>
        )}
      </div>
    </div>
  );
}
