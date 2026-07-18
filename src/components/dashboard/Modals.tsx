import React, { useState } from 'react';
import { X, Check, Copy, RefreshCw, AlertTriangle, Building, ShieldCheck, Key, Eye, HelpCircle } from 'lucide-react';
import { Staff, Customer, Invoice, Expense, Device, ActivationKey, AuditLog, Branch, BRANCHES } from '../../types';
import { formatPKR } from './Charts';

// --- CONNECTION SETTINGS MODAL ---
interface ConnectionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string, key: string) => void;
  onClear: () => void;
  currentUrl: string;
  currentKey: string;
}

export function ConnectionSettingsModal({
  isOpen,
  onClose,
  onSave,
  onClear,
  currentUrl,
  currentKey,
}: ConnectionSettingsModalProps) {
  const [url, setUrl] = useState(currentUrl);
  const [key, setKey] = useState(currentKey);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#12121a] border border-[#252535] rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-[#252535] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="text-[#d4a843]" size={20} />
            <h3 className="text-lg font-bold text-white font-display">Database Connection</h3>
          </div>
          <button onClick={onClose} className="text-[#8888aa] hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 overflow-y-auto flex-1">
          <p className="text-xs text-[#8888aa] leading-relaxed">
            By default, the admin panel operates in a <strong className="text-[#d4a843]">Simulated Offline Mode</strong> using local storage. To connect to your live production <strong>Supabase</strong> database, enter your credentials below.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Supabase Project URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-3 focus:outline-none focus:border-[#d4a843]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Supabase Anon Key</label>
            <textarea
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              rows={3}
              className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-3 focus:outline-none focus:border-[#d4a843] resize-none font-mono"
            />
          </div>

          <div className="bg-[#1a1a26] border border-[#252535] p-3 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <span className="text-[11px] text-[#8888aa] leading-relaxed">
              These credentials will be stored securely in your browser's local storage and used only to authorize client requests to your Supabase tables.
            </span>
          </div>
        </div>

        <div className="p-6 bg-[#0d0d15] border-t border-[#252535] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClear();
              setUrl('');
              setKey('');
            }}
            disabled={!currentUrl}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 cursor-pointer"
          >
            Clear Settings
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#252535] hover:bg-[#1a1a26] text-[#8888aa] hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(url, key)}
              className="px-5 py-2 bg-gradient-to-r from-[#d4a843] to-[#f0c060] text-black font-semibold rounded-xl text-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              Save & Reconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CONFIRMATION MODAL ---
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  type?: 'danger' | 'warning';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm Action",
  type = 'danger',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#12121a] border border-[#252535] rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-[#252535] flex items-center gap-3">
          <AlertTriangle className={type === 'danger' ? 'text-rose-500' : 'text-amber-500'} size={20} />
          <h3 className="text-base font-bold text-white font-display">{title}</h3>
        </div>
        <div className="p-5">
          <p className="text-sm text-[#8888aa] leading-relaxed">{message}</p>
        </div>
        <div className="p-5 bg-[#0d0d15] border-t border-[#252535] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#252535] text-[#8888aa] hover:text-white rounded-xl text-xs font-bold hover:bg-[#1a1a26] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
              type === 'danger'
                ? 'bg-rose-500 hover:bg-rose-600'
                : 'bg-amber-500 hover:bg-amber-600 text-black'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- STAFF MODAL (ADD / EDIT) ---
interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => void;
  staff?: Staff | null; // if present, Edit mode
}

export function StaffModal({ isOpen, onClose, onSave, staff }: StaffModalProps) {
  const [name, setName] = useState(staff?.name || '');
  const [phone, setPhone] = useState(staff?.phone || '');
  const [email, setEmail] = useState(staff?.email || '');
  const [role, setRole] = useState<Staff['role']>(staff?.role || 'Stylist');
  const [branchId, setBranchId] = useState(staff?.branch_id || 'nsk-abt-gents-0001');
  const [status, setStatus] = useState<Staff['status']>(staff?.status || 'active');

  React.useEffect(() => {
    if (staff) {
      setName(staff.name);
      setPhone(staff.phone);
      setEmail(staff.email);
      setRole(staff.role);
      setBranchId(staff.branch_id);
      setStatus(staff.status);
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setRole('Stylist');
      setBranchId('nsk-abt-gents-0001');
      setStatus('active');
    }
  }, [staff, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: staff?.id,
      name,
      phone,
      email,
      role,
      branch_id: branchId,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#12121a] border border-[#252535] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-[#252535] flex items-center justify-between shrink-0">
          <h3 className="text-base font-bold text-white font-display">
            {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h3>
          <button type="button" onClick={onClose} className="text-[#8888aa] hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Asif Khan"
              className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Staff['role'])}
                className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843]"
              >
                <option value="Stylist">Stylist</option>
                <option value="Manager">Manager</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="asif@nsk.com"
              className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Assigned Branch</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="bg-[#1a1a26] border border-[#252535] text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843]"
              >
                {Object.entries(BRANCHES).map(([id, name]) => (
                  <option key={id} value={id}>{name.replace('NSK ', '')}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Employment Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Staff['status'])}
                className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-5 bg-[#0d0d15] border-t border-[#252535] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#252535] text-[#8888aa] hover:text-white rounded-xl text-xs font-bold hover:bg-[#1a1a26] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-[#d4a843] to-[#f0c060] text-black font-semibold rounded-xl text-xs transition-all hover:scale-[1.02]"
          >
            {staff ? 'Update Staff' : 'Add Staff Member'}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- EXPENSE MODAL (ADD) ---
interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => void;
}

export function ExpenseModal({ isOpen, onClose, onSave }: ExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Rent');
  const [description, setDescription] = useState('');
  const [branchId, setBranchId] = useState('nsk-abt-gents-0001');
  const [date, setDate] = useState(new Date('2026-07-17T09:53:05-07:00').toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    onSave({
      amount: Number(amount),
      category,
      description,
      branch_id: branchId,
      date,
    });
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#12121a] border border-[#252535] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-[#252535] flex items-center justify-between shrink-0">
          <h3 className="text-base font-bold text-white font-display">Record Business Expense</h3>
          <button type="button" onClick={onClose} className="text-[#8888aa] hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Amount (PKR) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="45000"
                className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843]"
              >
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Supplies">Supplies</option>
                <option value="Staff Tea/Meals">Staff Tea/Meals</option>
                <option value="Marketing">Marketing</option>
                <option value="Repairs">Repairs & Maintenance</option>
                <option value="Other">Other Expenses</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Branch</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="bg-[#1a1a26] border border-[#252535] text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843]"
            >
              {Object.entries(BRANCHES).map(([id, name]) => (
                <option key={id} value={id}>{name.replace('NSK ', '')}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Description / Notes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the items purchased or reason..."
              rows={3}
              className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843] resize-none"
            />
          </div>
        </div>

        <div className="p-5 bg-[#0d0d15] border-t border-[#252535] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#252535] text-[#8888aa] hover:text-white rounded-xl text-xs font-bold hover:bg-[#1a1a26] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-[#d4a843] to-[#f0c060] text-black font-semibold rounded-xl text-xs transition-all hover:scale-[1.02]"
          >
            Save Expense
          </button>
        </div>
      </form>
    </div>
  );
}

// --- ACTIVATION KEY MODAL ---
interface ActivationKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (branchId: string, customKey?: string) => void;
}

export function ActivationKeyModal({ isOpen, onClose, onSave }: ActivationKeyModalProps) {
  const [branchId, setBranchId] = useState('nsk-abt-gents-0001');
  const [customKey, setCustomKey] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(branchId, useCustom && customKey.trim() ? customKey.trim() : undefined);
    setCustomKey('');
    setUseCustom(false);
    onClose();
  };

  const generatePreview = () => {
    const code = branchId.split('-')[1]?.toUpperCase() || 'ABT';
    return `NSK-${code}-${new Date().getFullYear()}-XXXXX`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#12121a] border border-[#252535] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-[#252535] flex items-center justify-between shrink-0">
          <h3 className="text-base font-bold text-white font-display">Generate Activation Key</h3>
          <button type="button" onClick={onClose} className="text-[#8888aa] hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Target Branch</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="bg-[#1a1a26] border border-[#252535] text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843]"
            >
              {Object.entries(BRANCHES).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 py-1 select-none">
            <input
              type="checkbox"
              id="customCheck"
              checked={useCustom}
              onChange={(e) => setUseCustom(e.target.checked)}
              className="accent-[#d4a843]"
            />
            <label htmlFor="customCheck" className="text-xs font-bold text-[#8888aa] cursor-pointer">Define a Custom Key Format</label>
          </div>

          {useCustom ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Custom Key Serial</label>
              <input
                type="text"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value.toUpperCase())}
                placeholder="NSK-ABT-2026-F5G8H"
                className="bg-[#1a1a26] border border-[#252535] text-white text-sm rounded-xl p-2.5 focus:outline-none focus:border-[#d4a843] font-mono uppercase"
              />
            </div>
          ) : (
            <div className="bg-[#1a1a26] border border-[#252535] p-3 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d4a843]/10 flex items-center justify-center text-[#d4a843]">
                <Key size={14} />
              </div>
              <div>
                <p className="text-[10px] text-[#55556a] font-bold uppercase tracking-wider">Autogen Serial Format</p>
                <p className="text-xs text-white font-semibold font-mono mt-0.5">{generatePreview()}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 bg-[#0d0d15] border-t border-[#252535] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#252535] text-[#8888aa] hover:text-white rounded-xl text-xs font-bold hover:bg-[#1a1a26] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-[#d4a843] to-[#f0c060] text-black font-semibold rounded-xl text-xs transition-all hover:scale-[1.02]"
          >
            Generate Key
          </button>
        </div>
      </form>
    </div>
  );
}

// --- RECEIPT-STYLE INVOICE DETAIL MODAL ---
interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onRefund: (id: string) => void;
}

export function InvoiceDetailModal({ isOpen, onClose, invoice, onRefund }: InvoiceDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !invoice) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(invoice.invoice_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const services = (() => {
    try {
      return JSON.parse(invoice.services_json);
    } catch (e) {
      return [];
    }
  })();

  const dateStr = new Date(invoice.created_at).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#12121a] border border-[#252535] rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Receipt Header styling */}
        <div className="p-5 border-b border-[#252535] bg-[#0d0d15] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧾</span>
            <span className="text-sm font-bold text-white tracking-tight font-display">Invoice Detail</span>
          </div>
          <button onClick={onClose} className="text-[#8888aa] hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Thermal Receipt Visual Container */}
          <div className="bg-[#1a1a26]/40 rounded-2xl border border-[#252535] p-5 font-mono text-xs text-white relative">
            
            {/* Top jagged teeth visual overlay */}
            <div className="absolute top-0 inset-x-0 h-1 bg-[linear-gradient(45deg,#252535_25%,transparent_25%,transparent_75%,#252535_75%),linear-gradient(45deg,#252535_25%,transparent_25%,transparent_75%,#252535_75%)] bg-[length:10px_10px] bg-[position:0_0,5px_5px]"></div>

            <div className="text-center mb-5">
              <h4 className="text-[#d4a843] font-bold text-base font-display tracking-wide uppercase">NSK ENTERPRISE</h4>
              <p className="text-[10px] text-[#8888aa] mt-1 uppercase tracking-widest">{invoice.branch_name || 'BRANCH OPERATIONS'}</p>
            </div>

            <div className="flex flex-col gap-1.5 border-b border-[#252535]/80 pb-4 mb-4 text-[#8888aa]">
              <div className="flex justify-between items-center text-white font-semibold">
                <span>INVOICE #:</span>
                <span className="flex items-center gap-1">
                  {invoice.invoice_number}
                  <button onClick={handleCopy} className="text-[#8888aa] hover:text-[#d4a843] cursor-pointer">
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </span>
              </div>
              <div className="flex justify-between">
                <span>DATE/TIME:</span>
                <span className="text-white">{dateStr}</span>
              </div>
              <div className="flex justify-between">
                <span>CUSTOMER:</span>
                <span className="text-white truncate max-w-[150px]">{invoice.customer_name || 'Walk-in Client'}</span>
              </div>
              <div className="flex justify-between">
                <span>STYLST/STAFF:</span>
                <span className="text-white">{invoice.staff_name || 'Staff Stylist'}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="flex flex-col gap-2 border-b border-[#252535]/80 pb-4 mb-4">
              <div className="grid grid-cols-12 font-bold text-[#8888aa] pb-1">
                <span className="col-span-8">SERVICE</span>
                <span className="col-span-2 text-center">QTY</span>
                <span className="col-span-2 text-right">TOTAL</span>
              </div>
              
              {services.map((item: any, idx: number) => (
                <div key={idx} className="grid grid-cols-12 text-[#f0f0f8]">
                  <span className="col-span-8 truncate font-medium">{item.name || 'Salon Treatment'}</span>
                  <span className="col-span-2 text-center">{item.qty || 1}</span>
                  <span className="col-span-2 text-right">{formatPKR(item.price * (item.qty || 1))}</span>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="flex flex-col gap-2 border-b border-[#252535]/80 pb-4 mb-4 font-semibold">
              <div className="flex justify-between text-[#8888aa]">
                <span>SUBTOTAL:</span>
                <span className="text-white">{formatPKR(invoice.subtotal)}</span>
              </div>
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>DISCOUNT:</span>
                  <span>-{formatPKR(invoice.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#8888aa]">
                <span>TAX (5%):</span>
                <span className="text-white">{formatPKR(invoice.tax_amount)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-1 border-t border-dashed border-[#252535]">
                <span>TOTAL AMOUNT:</span>
                <span className="text-[#d4a843]">{formatPKR(invoice.total_amount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#8888aa]">
              <span>PAYMENT METHOD:</span>
              <span className="text-white font-bold uppercase">{invoice.payment_method}</span>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-[#8888aa] mt-2">
              <span>STATUS:</span>
              <span className={`font-extrabold uppercase px-2 py-0.5 rounded-full text-[10px] ${
                invoice.status === 'paid' 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}>{invoice.status}</span>
            </div>
          </div>
        </div>

        {/* Invoice Actions Footer */}
        <div className="p-5 bg-[#0d0d15] border-t border-[#252535] flex items-center justify-between gap-3">
          <div className="text-[10px] text-[#55556a]">NSK Enterprise Systems Ltd.</div>
          
          <div className="flex items-center gap-3">
            {invoice.status === 'paid' && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to issue a full refund for this invoice?')) {
                    onRefund(invoice.id);
                  }
                }}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/15 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Issue Refund
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1a1a26] border border-[#252535] text-white hover:text-[#d4a843] rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CUSTOMER DETAIL DRAWER ---
interface CustomerDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  invoices: Invoice[];
}

export function CustomerDetailDrawer({ isOpen, onClose, customer, invoices }: CustomerDetailDrawerProps) {
  if (!isOpen || !customer) return null;

  const customerInvoices = invoices
    .filter(inv => inv.customer_id === customer.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#0d0d15] border-l border-[#252535] h-full flex flex-col justify-between shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute left-6 top-6 text-[#8888aa] hover:text-white cursor-pointer bg-[#12121a] p-1.5 rounded-lg border border-[#252535]">
          <X size={16} />
        </button>

        <div className="flex-1 overflow-y-auto mt-10">
          <div className="flex flex-col items-center gap-4 text-center pb-6 border-b border-[#252535]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#252535] to-[#1a1a26] border border-[#d4a843]/40 flex items-center justify-center text-[#d4a843] font-bold text-2xl shadow-xl">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">{customer.name}</h3>
              <p className="text-xs text-[#8888aa] mt-1">{customer.phone}</p>
              <p className="text-xs text-[#8888aa] mt-0.5">{customer.email || 'No email provided'}</p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-[#12121a] border border-[#252535] p-4 rounded-2xl">
              <span className="text-[10px] font-semibold text-[#8888aa] uppercase tracking-wider block mb-1">Total Visits</span>
              <span className="text-xl font-bold text-white font-display">{customer.totalVisits || 0}</span>
            </div>
            <div className="bg-[#12121a] border border-[#252535] p-4 rounded-2xl">
              <span className="text-[10px] font-semibold text-[#8888aa] uppercase tracking-wider block mb-1">Total Spent</span>
              <span className="text-xl font-bold text-[#d4a843] font-display">{formatPKR(customer.totalSpend || 0)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#55556a] uppercase tracking-wider block mb-1.5">Profile Notes</span>
              <p className="bg-[#12121a] border border-[#252535] rounded-xl p-3.5 text-xs text-[#8888aa] leading-relaxed">
                {customer.notes || 'No customer preference notes entered.'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#55556a] uppercase tracking-wider block mb-3">Invoice History</span>
              <div className="flex flex-col gap-2.5">
                {customerInvoices.map((inv, idx) => (
                  <div key={`${inv.id}-${idx}`} className="bg-[#12121a] border border-[#252535] p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{inv.invoice_number}</p>
                      <p className="text-[10px] text-[#55556a] mt-1">
                        {new Date(inv.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#d4a843]">{formatPKR(inv.total_amount)}</p>
                      <span className={`text-[9px] font-bold uppercase ${inv.status === 'paid' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
                {customerInvoices.length === 0 && (
                  <p className="text-xs text-[#55556a] italic py-2">No historical invoices found.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#252535] pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#12121a] hover:bg-[#1a1a26] border border-[#252535] text-white font-semibold rounded-xl text-xs transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

// --- BRANCH DETAIL MODAL ---
interface BranchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null;
  staff: Staff[];
  invoices: Invoice[];
  devices: Device[];
}

export function BranchDetailModal({ isOpen, onClose, branch, staff, invoices, devices }: BranchDetailModalProps) {
  if (!isOpen || !branch) return null;

  const branchStaff = staff.filter(s => s.branch_id === branch.id);
  const branchInvoices = invoices.filter(inv => inv.branch_id === branch.id);
  const branchDevices = devices.filter(d => d.branch_id === branch.id);

  const totalSales = branchInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#12121a] border border-[#252535] rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-[#252535] bg-[#0d0d15] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Building className="text-[#d4a843]" size={20} />
            <h3 className="text-base font-bold text-white font-display">{branch.name}</h3>
          </div>
          <button onClick={onClose} className="text-[#8888aa] hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto flex-1">
          {/* Quick Info & Stats column */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#1a1a26] border border-[#252535] p-4 rounded-2xl">
              <span className="text-[10px] text-[#8888aa] uppercase font-bold tracking-wider">Branch Address</span>
              <p className="text-xs text-white leading-relaxed mt-1.5">{branch.address}</p>
              <p className="text-xs text-[#8888aa] font-medium mt-1">Ph: {branch.phone}</p>
            </div>

            <div className="bg-[#1a1a26] border border-[#252535] p-4 rounded-2xl">
              <span className="text-[10px] text-[#8888aa] uppercase font-bold tracking-wider">This Month Sales</span>
              <p className="text-lg font-black text-[#d4a843] font-display mt-1">{formatPKR(totalSales)}</p>
              <p className="text-[10px] text-[#55556a] font-medium mt-0.5">{branchInvoices.length} transactions logged</p>
            </div>

            <div className="bg-[#1a1a26] border border-[#252535] p-4 rounded-2xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8888aa] font-semibold">Active Devices</span>
                <span className="text-white font-bold">{branchDevices.filter(d => d.status === 'active').length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8888aa] font-semibold">Total Staff</span>
                <span className="text-white font-bold">{branchStaff.length}</span>
              </div>
            </div>
          </div>

          {/* Staff list column */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-[#55556a] uppercase tracking-wider block">Assigned Staff ({branchStaff.length})</span>
            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
              {branchStaff.map((member, idx) => (
                <div key={`${member.id}-${idx}`} className="bg-[#0d0d15] border border-[#252535] p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{member.name}</p>
                    <p className="text-[10px] text-[#8888aa] mt-0.5">{member.role}</p>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                    member.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>{member.status}</span>
                </div>
              ))}
              {branchStaff.length === 0 && (
                <p className="text-xs text-[#55556a] italic">No staff assigned yet.</p>
              )}
            </div>
          </div>

          {/* Recent Invoices list column */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-[#55556a] uppercase tracking-wider block">Recent Sales</span>
            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
              {branchInvoices.slice(0, 6).map((inv, idx) => (
                <div key={`${inv.id}-${idx}`} className="bg-[#0d0d15] border border-[#252535] p-2.5 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">{inv.invoice_number}</p>
                    <p className="text-[10px] text-[#55556a] mt-0.5">
                      {new Date(inv.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                  <span className="text-white font-bold">{formatPKR(inv.total_amount)}</span>
                </div>
              ))}
              {branchInvoices.length === 0 && (
                <p className="text-xs text-[#55556a] italic">No sales transactions found.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 bg-[#0d0d15] border-t border-[#252535] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1a1a26] border border-[#252535] text-white hover:text-[#d4a843] rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
}

// --- AUDIT LOG DETAIL MODAL ---
interface AuditLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

export function AuditLogDetailModal({ isOpen, onClose, log }: AuditLogDetailModalProps) {
  if (!isOpen || !log) return null;

  const prettyPrintJSON = (jsonStr: string | null) => {
    if (!jsonStr) return 'N/A';
    try {
      const parsed = JSON.parse(jsonStr);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return jsonStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#12121a] border border-[#252535] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-[#252535] bg-[#0d0d15] flex items-center justify-between shrink-0">
          <h3 className="text-base font-bold text-white font-display">System Audit Log Details</h3>
          <button onClick={onClose} className="text-[#8888aa] hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold bg-[#1a1a26] p-4 rounded-xl border border-[#252535]">
            <div className="flex flex-col gap-1">
              <span className="text-[#8888aa] uppercase text-[9px] tracking-wider">Action Initiated</span>
              <span className="text-white text-sm font-bold">{log.action}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#8888aa] uppercase text-[9px] tracking-wider">Operator IP / Device</span>
              <span className="text-white">{log.ip_address}</span>
              <span className="text-[10px] text-[#55556a] truncate">{log.device_uuid}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#55556a] uppercase tracking-wider">Previous State</label>
              <pre className="bg-[#0c0c14] border border-[#252535] text-[#8888aa] text-[10px] p-3.5 rounded-xl font-mono overflow-auto max-h-[180px]">
                {prettyPrintJSON(log.old_values)}
              </pre>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#55556a] uppercase tracking-wider">Modified State</label>
              <pre className="bg-[#0c0c14] border border-[#252535] text-emerald-400 text-[10px] p-3.5 rounded-xl font-mono overflow-auto max-h-[180px]">
                {prettyPrintJSON(log.new_values)}
              </pre>
            </div>
          </div>
        </div>

        <div className="p-5 bg-[#0d0d15] border-t border-[#252535] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1a1a26] border border-[#252535] text-white hover:text-[#d4a843] rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Dismiss View
          </button>
        </div>
      </div>
    </div>
  );
}
