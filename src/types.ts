export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  created_at: string;
}

export interface ActivationKey {
  key: string;
  branch_id: string;
  status: 'active' | 'used' | 'inactive';
  device_id: string | null;
  activated_at: string | null;
  activated_by: string | null;
  last_seen: string | null;
  created_at: string;
}

export interface Device {
  id: string;
  branch_id: string;
  device_uuid: string;
  computer_name: string;
  windows_username: string;
  operating_system: string;
  application_version: string;
  activation_key: string;
  first_activation: string;
  last_seen: string;
  status: 'active' | 'revoked';
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string;
  phone: string;
  email: string;
  address: string;
  receipt_footer: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  tax_rate: number;
  business_hours_open: string;
  business_hours_close: string;
  application_version: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  branch_id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  totalVisits?: number;
  totalSpend?: number;
  lastVisit?: string;
}

export interface Service {
  id: string;
  branch_id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  branch_id: string;
  operator_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'in-service' | 'completed' | 'cancelled' | 'no-show';
  price: number;
  notes: string;
  created_at: string;
  updated_at: string;
  // Expanded fields
  customer_name?: string;
  service_name?: string;
  operator_name?: string;
  branch_name?: string;
}

export interface Staff {
  id: string;
  branch_id: string;
  name: string;
  phone: string;
  email: string;
  role: 'Stylist' | 'Manager' | 'Receptionist' | 'Other';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  appointment_id: string | null;
  customer_id: string;
  branch_id: string;
  staff_id: string;
  services_json: string; // JSON array of items
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_method: 'cash' | 'card';
  status: 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  // Expanded fields
  customer_name?: string;
  staff_name?: string;
  branch_name?: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  service_id: string;
  service_name: string;
  price: number;
  duration: number;
  quantity: number;
  line_total: number;
  created_at: string;
}

export interface Expense {
  id: string;
  branch_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface DailyClosing {
  id: string;
  branch_id: string;
  date: string;
  total_sales: number;
  total_expenses: number;
  cash_expected: number;
  cash_counted: number;
  discrepancy: number;
  notes: string;
  closed_by: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  branch_id: string;
  operator_name: string;
  action: string;
  entity: string;
  entity_id: string;
  old_values: string | null;
  new_values: string | null;
  ip_address: string;
  device_uuid: string;
  created_at: string;
}

export type ViewType = 
  | 'dashboard'
  | 'branches'
  | 'analytics'
  | 'staff'
  | 'customers'
  | 'invoices'
  | 'appointments'
  | 'expenses'
  | 'devices'
  | 'activation-keys'
  | 'audit-logs';

export const BRANCHES = {
  'nsk-abt-gents-0001': 'NSK ABBOTTABAD GENTS',
  'nsk-abt-ladies-0002': 'NSK ABBOTTABAD LADIES',
  'nsk-msr-gents-0003': 'NSK MANSEHRA GENTS',
  'nsk-btg-gents-0004': 'NSK BATTAGRAM GENTS',
} as const;
