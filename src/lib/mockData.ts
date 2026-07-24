import { Branch, Staff, Customer, Service, Appointment, Invoice, Expense, Device, ActivationKey, AuditLog } from '../types';

export interface LocalDB {
  branches: Branch[];
  staff: Staff[];
  customers: Customer[];
  services: Service[];
  devices: Device[];
  activationKeys: ActivationKey[];
  auditLogs: AuditLog[];
  expenses: Expense[];
  appointments: Appointment[];
  invoices: Invoice[];
}

export const initialDB: LocalDB = {
  branches: [],
  staff: [],
  customers: [],
  services: [],
  devices: [],
  activationKeys: [],
  auditLogs: [],
  expenses: [],
  appointments: [],
  invoices: [],
};

export function getLocalDB(): LocalDB {
  const data = localStorage.getItem('nsk_admin_data');
  if (data) {
    try {
      const db: LocalDB = JSON.parse(data);
      
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

      db.branches = deduplicate(db.branches || []);
      db.staff = deduplicate(db.staff || []);
      db.customers = deduplicate(db.customers || []);
      db.services = deduplicate(db.services || []);
      db.devices = deduplicate(db.devices || []);
      db.activationKeys = deduplicateKeys(db.activationKeys || []);
      db.auditLogs = deduplicate(db.auditLogs || []);
      db.expenses = deduplicate(db.expenses || []);
      db.appointments = deduplicate(db.appointments || []);
      db.invoices = deduplicate(db.invoices || []);

      return db;
    } catch (e) {
      console.error('Error parsing local storage database, recreating...');
    }
  }
  saveLocalDB(initialDB);
  return initialDB;
}

export function saveLocalDB(db: LocalDB) {
  localStorage.setItem('nsk_admin_data', JSON.stringify(db));
}

export function resetLocalDB() {
  saveLocalDB(initialDB);
  return initialDB;
}
