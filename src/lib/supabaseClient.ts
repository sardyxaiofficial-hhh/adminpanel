import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getLocalDB, saveLocalDB } from './mockData';
import { Branch, Staff, Customer, Service, Appointment, Invoice, Expense, Device, ActivationKey, AuditLog, BRANCHES } from '../types';

// Retrieve keys from env or localStorage override
let supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://uwhvjwfwqqvsuskigonf.supabase.co';
let supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aHZqd2Z3cXF2c3Vza2lnb25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyODYxNzIsImV4cCI6MjA5OTg2MjE3Mn0.1ofq2fKid-yWD-NlBpfDFSP29gRhDEUYC9DYsKI2yjQ';

// If NEXT_PUBLIC_* forms are specified, support them too
if (!supabaseUrl || supabaseUrl === 'https://uwhvjwfwqqvsuskigonf.supabase.co') {
  supabaseUrl = (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL || 'https://uwhvjwfwqqvsuskigonf.supabase.co';
}
if (!supabaseAnonKey || supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aHZqd2Z3cXF2c3Vza2lnb25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyODYxNzIsImV4cCI6MjA5OTg2MjE3Mn0.1ofq2fKid-yWD-NlBpfDFSP29gRhDEUYC9DYsKI2yjQ') {
  supabaseAnonKey = (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aHZqd2Z3cXF2c3Vza2lnb25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyODYxNzIsImV4cCI6MjA5OTg2MjE3Mn0.1ofq2fKid-yWD-NlBpfDFSP29gRhDEUYC9DYsKI2yjQ';
}

// Check localStorage overrides
const localUrl = localStorage.getItem('NSK_SUPABASE_URL');
const localKey = localStorage.getItem('NSK_SUPABASE_ANON_KEY');
if (localUrl && localKey) {
  supabaseUrl = localUrl;
  supabaseAnonKey = localKey;
}

let supabase: SupabaseClient | null = null;
let supabaseConfigured = false;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    supabaseConfigured = true;
    console.log('Supabase client initialized successfully!');
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

export function isSupabaseConfigured(): boolean {
  return supabaseConfigured;
}

export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    key: supabaseAnonKey,
  };
}

export function saveSupabaseConfig(url: string, key: string) {
  if (url && key) {
    localStorage.setItem('NSK_SUPABASE_URL', url);
    localStorage.setItem('NSK_SUPABASE_ANON_KEY', key);
    window.location.reload();
  }
}

export function clearSupabaseConfig() {
  localStorage.removeItem('NSK_SUPABASE_URL');
  localStorage.removeItem('NSK_SUPABASE_ANON_KEY');
  window.location.reload();
}

// Generic Client Wrapper to support both Live Supabase and Simulated Offline Mode
export const db = {
  // --- BRANCHES ---
  async getBranches(): Promise<Branch[]> {
    if (supabaseConfigured && supabase) {
      const { data, error } = await supabase.from('branches').select('*').order('name');
      if (!error && data) return data as Branch[];
      console.warn('Supabase getBranches error, falling back to simulator:', error);
    }
    return getLocalDB().branches;
  },

  // --- STAFF ---
  async getStaff(branchId?: string): Promise<Staff[]> {
    if (supabaseConfigured && supabase) {
      let query = supabase.from('staff').select('*').order('name');
      if (branchId && branchId !== 'all') {
        query = query.eq('branch_id', branchId);
      }
      const { data, error } = await query;
      if (!error && data) return data as Staff[];
      console.warn('Supabase getStaff error, falling back to simulator:', error);
    }
    const local = getLocalDB().staff;
    return branchId && branchId !== 'all' ? local.filter(s => s.branch_id === branchId) : local;
  },

  async addStaff(staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<Staff> {
    const now = new Date().toISOString();
    const newStaff: Staff = {
      ...staff,
      id: `st-${Math.random().toString(36).substr(2, 9)}`,
      created_at: now,
      updated_at: now,
    };

    if (supabaseConfigured && supabase) {
      const { data, error } = await supabase.from('staff').insert([staff]).select();
      if (!error && data && data[0]) {
        await this.logAudit(
          newStaff.branch_id,
          'System Admin',
          'Created Staff',
          'staff',
          data[0].id,
          null,
          JSON.stringify(data[0])
        );
        return data[0] as Staff;
      }
      console.warn('Supabase addStaff error, falling back to simulator:', error);
    }

    const local = getLocalDB();
    local.staff.push(newStaff);
    saveLocalDB(local);

    await this.logAudit(
      newStaff.branch_id,
      'System Admin (Simulated)',
      'Created Staff',
      'staff',
      newStaff.id,
      null,
      JSON.stringify(newStaff)
    );

    return newStaff;
  },

  async editStaff(id: string, staff: Partial<Staff>): Promise<Staff> {
    if (supabaseConfigured && supabase) {
      const { data, error } = await supabase.from('staff').update(staff).eq('id', id).select();
      if (!error && data && data[0]) {
        await this.logAudit(
          data[0].branch_id,
          'System Admin',
          'Updated Staff',
          'staff',
          id,
          null,
          JSON.stringify(data[0])
        );
        return data[0] as Staff;
      }
      console.warn('Supabase editStaff error, falling back to simulator:', error);
    }

    const local = getLocalDB();
    const idx = local.staff.findIndex(s => s.id === id);
    if (idx !== -1) {
      const oldVals = { ...local.staff[idx] };
      local.staff[idx] = { ...local.staff[idx], ...staff, updated_at: new Date().toISOString() };
      saveLocalDB(local);

      await this.logAudit(
        local.staff[idx].branch_id,
        'System Admin (Simulated)',
        'Updated Staff',
        'staff',
        id,
        JSON.stringify(oldVals),
        JSON.stringify(local.staff[idx])
      );

      return local.staff[idx];
    }
    throw new Error('Staff not found');
  },

  async deleteStaff(id: string): Promise<boolean> {
    if (supabaseConfigured && supabase) {
      const { error } = await supabase.from('staff').delete().eq('id', id);
      if (!error) {
        return true;
      }
      console.warn('Supabase deleteStaff error, falling back to simulator:', error);
    }

    const local = getLocalDB();
    const staffMember = local.staff.find(s => s.id === id);
    if (staffMember) {
      local.staff = local.staff.filter(s => s.id !== id);
      saveLocalDB(local);

      await this.logAudit(
        staffMember.branch_id,
        'System Admin (Simulated)',
        'Deleted Staff',
        'staff',
        id,
        JSON.stringify(staffMember),
        null
      );
      return true;
    }
    return false;
  },

  // --- CUSTOMERS ---
  async getCustomers(branchId?: string): Promise<Customer[]> {
    if (supabaseConfigured && supabase) {
      let query = supabase.from('customers').select('*');
      if (branchId && branchId !== 'all') {
        query = query.eq('branch_id', branchId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data.map(cust => this.addCustomerStats(cust, getLocalDB().invoices)) as Customer[];
      }
      console.warn('Supabase getCustomers error, falling back to simulator:', error);
    }
    
    const local = getLocalDB();
    const list = branchId && branchId !== 'all' 
      ? local.customers.filter(c => c.branch_id === branchId) 
      : local.customers;

    return list.map(cust => this.addCustomerStats(cust, local.invoices));
  },

  addCustomerStats(customer: Customer, invoices: Invoice[]): Customer {
    const custInvoices = invoices.filter(inv => inv.customer_id === customer.id && inv.status === 'paid');
    const totalVisits = custInvoices.length;
    const totalSpend = custInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const lastVisit = custInvoices.length > 0 
      ? custInvoices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
      : undefined;

    return {
      ...customer,
      totalVisits,
      totalSpend,
      lastVisit
    };
  },

  // --- INVOICES ---
  async getInvoices(branchId?: string): Promise<Invoice[]> {
    if (supabaseConfigured && supabase) {
      let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });
      if (branchId && branchId !== 'all') {
        query = query.eq('branch_id', branchId);
      }
      const { data, error } = await query;
      if (!error && data) return data as Invoice[];
      console.warn('Supabase getInvoices error, falling back to simulator:', error);
    }
    const local = getLocalDB().invoices;
    return branchId && branchId !== 'all' ? local.filter(i => i.branch_id === branchId) : local;
  },

  async refundInvoice(id: string): Promise<Invoice> {
    if (supabaseConfigured && supabase) {
      const { data, error } = await supabase.from('invoices').update({ status: 'refunded', updated_at: new Date().toISOString() }).eq('id', id).select();
      if (!error && data && data[0]) {
        await this.logAudit(
          data[0].branch_id,
          'System Admin',
          'Refunded Invoice',
          'invoices',
          id,
          '{"status": "paid"}',
          '{"status": "refunded"}'
        );
        return data[0] as Invoice;
      }
      console.warn('Supabase refundInvoice error, falling back to simulator:', error);
    }

    const local = getLocalDB();
    const idx = local.invoices.findIndex(inv => inv.id === id);
    if (idx !== -1) {
      const oldVal = { ...local.invoices[idx] };
      local.invoices[idx].status = 'refunded';
      local.invoices[idx].updated_at = new Date().toISOString();
      saveLocalDB(local);

      await this.logAudit(
        local.invoices[idx].branch_id,
        'System Admin (Simulated)',
        'Refunded Invoice',
        'invoices',
        id,
        JSON.stringify(oldVal),
        JSON.stringify(local.invoices[idx])
      );

      return local.invoices[idx];
    }
    throw new Error('Invoice not found');
  },

  // --- APPOINTMENTS ---
  async getAppointments(branchId?: string): Promise<Appointment[]> {
    if (supabaseConfigured && supabase) {
      let query = supabase.from('appointments').select('*').order('start_time', { ascending: false });
      if (branchId && branchId !== 'all') {
        query = query.eq('branch_id', branchId);
      }
      const { data, error } = await query;
      if (!error && data) return data as Appointment[];
      console.warn('Supabase getAppointments error, falling back to simulator:', error);
    }
    const local = getLocalDB().appointments;
    return branchId && branchId !== 'all' ? local.filter(a => a.branch_id === branchId) : local;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    if (supabaseConfigured && supabase) {
      const { data, error } = await supabase.from('appointments').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select();
      if (!error && data && data[0]) {
        await this.logAudit(
          data[0].branch_id,
          'System Admin',
          'Updated Appointment Status',
          'appointments',
          id,
          null,
          JSON.stringify(data[0])
        );
        return data[0] as Appointment;
      }
      console.warn('Supabase updateAppointmentStatus error, falling back to simulator:', error);
    }

    const local = getLocalDB();
    const idx = local.appointments.findIndex(appt => appt.id === id);
    if (idx !== -1) {
      const oldVal = { ...local.appointments[idx] };
      local.appointments[idx].status = status;
      local.appointments[idx].updated_at = new Date().toISOString();
      saveLocalDB(local);

      await this.logAudit(
        local.appointments[idx].branch_id,
        'System Admin (Simulated)',
        'Updated Appointment Status',
        'appointments',
        id,
        JSON.stringify(oldVal),
        JSON.stringify(local.appointments[idx])
      );

      return local.appointments[idx];
    }
    throw new Error('Appointment not found');
  },

  // --- SERVICES ---
  async getServices(): Promise<Service[]> {
    if (supabaseConfigured && supabase) {
      const { data, error } = await supabase.from('services').select('*').order('name');
      if (!error && data) return data as Service[];
      console.warn('Supabase getServices error, falling back to simulator:', error);
    }
    return getLocalDB().services;
  },

  // --- EXPENSES ---
  async getExpenses(branchId?: string): Promise<Expense[]> {
    if (supabaseConfigured && supabase) {
      let query = supabase.from('expenses').select('*').order('date', { ascending: false });
      if (branchId && branchId !== 'all') {
        query = query.eq('branch_id', branchId);
      }
      const { data, error } = await query;
      if (!error && data) return data as Expense[];
      console.warn('Supabase getExpenses error, falling back to simulator:', error);
    }
    const local = getLocalDB().expenses;
    return branchId && branchId !== 'all' ? local.filter(e => e.branch_id === branchId) : local;
  },

  async addExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Math.random().toString(36).substr(2, 9)}`,
      created_at: now,
      updated_at: now,
    };

    if (supabaseConfigured && supabase) {
      const { data, error } = await supabase.from('expenses').insert([expense]).select();
      if (!error && data && data[0]) {
        await this.logAudit(
          newExpense.branch_id,
          'System Admin',
          'Created Expense',
          'expenses',
          data[0].id,
          null,
          JSON.stringify(data[0])
        );
        return data[0] as Expense;
      }
      console.warn('Supabase addExpense error, falling back to simulator:', error);
    }

    const local = getLocalDB();
    local.expenses.push(newExpense);
    saveLocalDB(local);

    await this.logAudit(
      newExpense.branch_id,
      'System Admin (Simulated)',
      'Created Expense',
      'expenses',
      newExpense.id,
      null,
      JSON.stringify(newExpense)
    );

    return newExpense;
  },

  // --- DEVICES ---
  async getDevices(branchId?: string): Promise<Device[]> {
    if (supabaseConfigured && supabase) {
      let query = supabase.from('devices').select('*').order('last_seen', { ascending: false });
      if (branchId && branchId !== 'all') {
        query = query.eq('branch_id', branchId);
      }
      const { data, error } = await query;
      if (!error && data) return data as Device[];
      console.warn('Supabase getDevices error, falling back to simulator:', error);
    }
    const local = getLocalDB().devices;
    return branchId && branchId !== 'all' ? local.filter(d => d.branch_id === branchId) : local;
  },

  async revokeDevice(id: string): Promise<Device> {
    if (supabaseConfigured && supabase) {
      const { data, error } = await supabase.from('devices').update({ status: 'revoked', updated_at: new Date().toISOString() }).eq('id', id).select();
      if (!error && data && data[0]) {
        await this.logAudit(
          data[0].branch_id,
          'System Admin',
          'Revoked Device',
          'devices',
          id,
          '{"status": "active"}',
          '{"status": "revoked"}'
        );
        return data[0] as Device;
      }
      console.warn('Supabase revokeDevice error, falling back to simulator:', error);
    }

    const local = getLocalDB();
    const idx = local.devices.findIndex(d => d.id === id);
    if (idx !== -1) {
      const oldVal = { ...local.devices[idx] };
      local.devices[idx].status = 'revoked';
      local.devices[idx].updated_at = new Date().toISOString();
      saveLocalDB(local);

      await this.logAudit(
        local.devices[idx].branch_id,
        'System Admin (Simulated)',
        'Revoked Device',
        'devices',
        id,
        JSON.stringify(oldVal),
        JSON.stringify(local.devices[idx])
      );

      return local.devices[idx];
    }
    throw new Error('Device not found');
  },

  // --- ACTIVATION KEYS ---
  async getActivationKeys(branchId?: string): Promise<ActivationKey[]> {
    if (supabaseConfigured && supabase) {
      let query = supabase.from('activation_keys').select('*').order('created_at', { ascending: false });
      if (branchId && branchId !== 'all') {
        query = query.eq('branch_id', branchId);
      }
      const { data, error } = await query;
      if (!error && data) return data as ActivationKey[];
      console.warn('Supabase getActivationKeys error, falling back to simulator:', error);
    }
    const local = getLocalDB().activationKeys;
    return branchId && branchId !== 'all' ? local.filter(k => k.branch_id === branchId) : local;
  },

  async generateActivationKey(branchId: string, customKey?: string): Promise<ActivationKey> {
    const branchName = BRANCHES[branchId as keyof typeof BRANCHES] || 'ABT';
    // Get 3 character code
    const shortCode = branchId.split('-')[1]?.toUpperCase() || 'ABT';
    const year = new Date().getFullYear();
    const randomChars = Math.random().toString(36).substr(2, 5).toUpperCase();
    const keyString = customKey || `NSK-${shortCode}-${year}-${randomChars}`;

    const newKey: ActivationKey = {
      key: keyString,
      branch_id: branchId,
      status: 'active',
      device_id: null,
      activated_at: null,
      activated_by: null,
      last_seen: null,
      created_at: new Date().toISOString(),
    };

    if (supabaseConfigured && supabase) {
      const { data, error } = await supabase.from('activation_keys').insert([newKey]).select();
      if (!error && data && data[0]) {
        await this.logAudit(
          branchId,
          'System Admin',
          'Generated Activation Key',
          'activation_keys',
          keyString,
          null,
          JSON.stringify(data[0])
        );
        return data[0] as ActivationKey;
      }
      console.warn('Supabase generateActivationKey error, falling back to simulator:', error);
    }

    const local = getLocalDB();
    local.activationKeys.push(newKey);
    saveLocalDB(local);

    await this.logAudit(
      branchId,
      'System Admin (Simulated)',
      'Generated Activation Key',
      'activation_keys',
      keyString,
      null,
      JSON.stringify(newKey)
    );

    return newKey;
  },

  async deactivateActivationKey(key: string): Promise<ActivationKey> {
    if (supabaseConfigured && supabase) {
      const { data, error } = await supabase.from('activation_keys').update({ status: 'inactive' }).eq('key', key).select();
      if (!error && data && data[0]) {
        await this.logAudit(
          data[0].branch_id,
          'System Admin',
          'Deactivated Key',
          'activation_keys',
          key,
          '{"status": "active"}',
          '{"status": "inactive"}'
        );
        return data[0] as ActivationKey;
      }
      console.warn('Supabase deactivateActivationKey error, falling back to simulator:', error);
    }

    const local = getLocalDB();
    const idx = local.activationKeys.findIndex(k => k.key === key);
    if (idx !== -1) {
      const oldVal = { ...local.activationKeys[idx] };
      local.activationKeys[idx].status = 'inactive';
      saveLocalDB(local);

      await this.logAudit(
        local.activationKeys[idx].branch_id,
        'System Admin (Simulated)',
        'Deactivated Key',
        'activation_keys',
        key,
        JSON.stringify(oldVal),
        JSON.stringify(local.activationKeys[idx])
      );

      return local.activationKeys[idx];
    }
    throw new Error('Key not found');
  },

  // --- AUDIT LOGS ---
  async getAuditLogs(branchId?: string): Promise<AuditLog[]> {
    if (supabaseConfigured && supabase) {
      let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (branchId && branchId !== 'all') {
        query = query.eq('branch_id', branchId);
      }
      const { data, error } = await query;
      if (!error && data) return data as AuditLog[];
      console.warn('Supabase getAuditLogs error, falling back to simulator:', error);
    }
    const local = getLocalDB().auditLogs;
    return branchId && branchId !== 'all' ? local.filter(l => l.branch_id === branchId) : local;
  },

  async logAudit(
    branchId: string,
    operatorName: string,
    action: string,
    entity: string,
    entityId: string,
    oldValues: string | null,
    newValues: string | null,
    deviceUuid: string = '0000-0000-0000-0000'
  ): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: `aud-${Math.random().toString(36).substr(2, 9)}`,
      branch_id: branchId,
      operator_name: operatorName,
      action,
      entity,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
      ip_address: '127.0.0.1',
      device_uuid: deviceUuid,
      created_at: new Date().toISOString(),
    };

    if (supabaseConfigured && supabase) {
      const { data } = await supabase.from('audit_logs').insert([newLog]).select();
      if (data && data[0]) return data[0] as AuditLog;
    }

    const local = getLocalDB();
    local.auditLogs.unshift(newLog);
    // Keep max 200 logs
    if (local.auditLogs.length > 200) {
      local.auditLogs = local.auditLogs.slice(0, 200);
    }
    saveLocalDB(local);

    return newLog;
  },
};
