import { Branch, Staff, Customer, Service, Appointment, Invoice, Expense, Device, ActivationKey, AuditLog } from '../types';

const BRANCH_LIST: Branch[] = [
  { id: 'nsk-abt-gents-0001', name: 'NSK ABBOTTABAD GENTS', address: 'Main Jinnah Road, Abbottabad', phone: '0992-111222', created_at: '2025-01-10T10:00:00Z' },
  { id: 'nsk-abt-ladies-0002', name: 'NSK ABBOTTABAD LADIES', address: 'Kunj Road near Girls College, Abbottabad', phone: '0992-333444', created_at: '2025-01-15T11:30:00Z' },
  { id: 'nsk-msr-gents-0003', name: 'NSK MANSEHRA GENTS', address: 'Kashmir Road, Mansehra', phone: '0997-555666', created_at: '2025-02-01T09:00:00Z' },
  { id: 'nsk-btg-gents-0004', name: 'NSK BATTAGRAM GENTS', address: 'Main Bazar near DHQ Hospital, Battagram', phone: '0996-777888', created_at: '2025-03-05T12:00:00Z' },
];

const STAFF_LIST: Staff[] = [
  { id: 'st-001', branch_id: 'nsk-abt-gents-0001', name: 'Asif Khan', phone: '0300-1234567', email: 'asif@nsk.com', role: 'Stylist', status: 'active', created_at: '2025-01-12T00:00:00Z', updated_at: '2025-01-12T00:00:00Z' },
  { id: 'st-002', branch_id: 'nsk-abt-gents-0001', name: 'Sajid Ali', phone: '0312-9876543', email: 'sajid@nsk.com', role: 'Stylist', status: 'active', created_at: '2025-01-12T00:00:00Z', updated_at: '2025-01-12T00:00:00Z' },
  { id: 'st-003', branch_id: 'nsk-abt-gents-0001', name: 'Bilal Ahmed', phone: '0333-5551122', email: 'bilal@nsk.com', role: 'Manager', status: 'active', created_at: '2025-01-11T00:00:00Z', updated_at: '2025-01-11T00:00:00Z' },
  
  { id: 'st-004', branch_id: 'nsk-abt-ladies-0002', name: 'Sadia Bibi', phone: '0345-4443322', email: 'sadia@nsk.com', role: 'Stylist', status: 'active', created_at: '2025-01-16T00:00:00Z', updated_at: '2025-01-16T00:00:00Z' },
  { id: 'st-005', branch_id: 'nsk-abt-ladies-0002', name: 'Kiran Shah', phone: '0321-1110099', email: 'kiran@nsk.com', role: 'Stylist', status: 'active', created_at: '2025-01-16T00:00:00Z', updated_at: '2025-01-16T00:00:00Z' },
  { id: 'st-006', branch_id: 'nsk-abt-ladies-0002', name: 'Ayesha Omer', phone: '0301-8887766', email: 'ayesha@nsk.com', role: 'Manager', status: 'active', created_at: '2025-01-15T00:00:00Z', updated_at: '2025-01-15T00:00:00Z' },

  { id: 'st-007', branch_id: 'nsk-msr-gents-0003', name: 'Zubair Shah', phone: '0315-7776655', email: 'zubair@nsk.com', role: 'Stylist', status: 'active', created_at: '2025-02-02T00:00:00Z', updated_at: '2025-02-02T00:00:00Z' },
  { id: 'st-008', branch_id: 'nsk-msr-gents-0003', name: 'Yasir Khan', phone: '0300-6663344', email: 'yasir@nsk.com', role: 'Stylist', status: 'active', created_at: '2025-02-02T00:00:00Z', updated_at: '2025-02-02T00:00:00Z' },
  { id: 'st-009', branch_id: 'nsk-msr-gents-0003', name: 'Umar Abbasi', phone: '0334-9998877', email: 'umar@nsk.com', role: 'Manager', status: 'active', created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },

  { id: 'st-010', branch_id: 'nsk-btg-gents-0004', name: 'Haris Qureshi', phone: '0346-2228811', email: 'haris@nsk.com', role: 'Stylist', status: 'active', created_at: '2025-03-06T00:00:00Z', updated_at: '2025-03-06T00:00:00Z' },
  { id: 'st-011', branch_id: 'nsk-btg-gents-0004', name: 'Faisal Jamil', phone: '0313-5554433', email: 'faisal@nsk.com', role: 'Stylist', status: 'inactive', created_at: '2025-03-06T00:00:00Z', updated_at: '2025-03-06T00:00:00Z' },
  { id: 'st-012', branch_id: 'nsk-btg-gents-0004', name: 'Noman Yousaf', phone: '0302-3332211', email: 'noman@nsk.com', role: 'Manager', status: 'active', created_at: '2025-03-05T00:00:00Z', updated_at: '2025-03-05T00:00:00Z' },
];

const CUSTOMER_LIST: Customer[] = [
  { id: 'cust-001', branch_id: 'nsk-abt-gents-0001', name: 'Zeeshan Jadoon', phone: '0333-5112233', email: 'zeeshan@gmail.com', notes: 'Prefers scissors cut only, no clippers. Uses tea tree shampoo.', created_at: '2025-01-20T10:00:00Z', updated_at: '2025-01-20T10:00:00Z' },
  { id: 'cust-002', branch_id: 'nsk-abt-gents-0001', name: 'Kamran Mughal', phone: '0312-5223344', email: 'kamran@yahoo.com', notes: 'Regular shaving customer. Needs sensitive skin shaving cream.', created_at: '2025-01-22T14:30:00Z', updated_at: '2025-01-22T14:30:00Z' },
  { id: 'cust-003', branch_id: 'nsk-abt-gents-0001', name: 'Hamza Tanoli', phone: '0300-5334455', email: 'hamza@gmail.com', notes: 'Prefers gold facial treatment. Visits monthly.', created_at: '2025-01-25T11:00:00Z', updated_at: '2025-01-25T11:00:00Z' },
  
  { id: 'cust-004', branch_id: 'nsk-abt-ladies-0002', name: 'Mariam Bibi', phone: '0345-5445566', email: 'mariam@outlook.com', notes: 'Requires premium hair spa. Frequent hair color visits.', created_at: '2025-01-18T10:00:00Z', updated_at: '2025-01-18T10:00:00Z' },
  { id: 'cust-005', branch_id: 'nsk-abt-ladies-0002', name: 'Saba Gul', phone: '0321-5556677', email: 'saba.gul@gmail.com', notes: 'Bridal service package booked in past. Prefers senior stylist Kiran.', created_at: '2025-01-20T16:00:00Z', updated_at: '2025-01-20T16:00:00Z' },
  { id: 'cust-006', branch_id: 'nsk-abt-ladies-0002', name: 'Farah Abbasi', phone: '0301-5667788', email: 'farah@gmail.com', notes: 'Prefers herbal facials. Extremely sensitive skin.', created_at: '2025-01-29T12:00:00Z', updated_at: '2025-01-29T12:00:00Z' },

  { id: 'cust-007', branch_id: 'nsk-msr-gents-0003', name: 'Waqas Jahangiri', phone: '0315-5778899', email: 'waqas@gmail.com', notes: 'Beard grooming specialist interest. Recommends friends often.', created_at: '2025-02-05T15:00:00Z', updated_at: '2025-02-05T15:00:00Z' },
  { id: 'cust-008', branch_id: 'nsk-msr-gents-0003', name: 'Danish Khan', phone: '0334-5889900', email: 'danish@gmail.com', notes: 'Prefers charcoal face peel. Regular weekend visits.', created_at: '2025-02-10T11:30:00Z', updated_at: '2025-02-10T11:30:00Z' },

  { id: 'cust-009', branch_id: 'nsk-btg-gents-0004', name: 'Sajid Swati', phone: '0346-5990011', email: 'sajid.swati@gmail.com', notes: 'Hair trim and beard oil application.', created_at: '2025-03-10T14:00:00Z', updated_at: '2025-03-10T14:00:00Z' },
  { id: 'cust-010', branch_id: 'nsk-btg-gents-0004', name: 'Atif Yousafzai', phone: '0313-6001122', email: 'atif@gmail.com', notes: 'Prefers head massage with herbal oils.', created_at: '2025-03-12T16:45:00Z', updated_at: '2025-03-12T16:45:00Z' },
];

const SERVICE_LIST: Service[] = [
  // Gents services
  { id: 'ser-001', branch_id: 'nsk-abt-gents-0001', name: 'Royal Hair Cut', price: 1200, duration: 30, category: 'Hair', description: 'Premium cut with wash and massage', created_at: '2025-01-10T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },
  { id: 'ser-002', branch_id: 'nsk-abt-gents-0001', name: 'Classic Beard Shave / Trim', price: 600, duration: 20, category: 'Beard', description: 'Hot towel shave or beard designer styling', created_at: '2025-01-10T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },
  { id: 'ser-003', branch_id: 'nsk-abt-gents-0001', name: 'Gold Facial Treatment', price: 3500, duration: 60, category: 'Facial', description: 'Multi-stage skin brightening facial', created_at: '2025-01-10T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },
  { id: 'ser-004', branch_id: 'nsk-abt-gents-0001', name: 'Herbal Head Massage', price: 800, duration: 25, category: 'Therapy', description: 'Nourishing oil massage for stress relief', created_at: '2025-01-10T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },

  // Ladies services
  { id: 'ser-005', branch_id: 'nsk-abt-ladies-0002', name: 'Layer Hair Cut & Style', price: 2500, duration: 45, category: 'Hair', description: 'Professional women haircut and blowdry styling', created_at: '2025-01-15T00:00:00Z', updated_at: '2025-01-15T00:00:00Z' },
  { id: 'ser-006', branch_id: 'nsk-abt-ladies-0002', name: 'Loreal Hair Color Splash', price: 8500, duration: 120, category: 'Color', description: 'Full dye root touchup or global color matching', created_at: '2025-01-15T00:00:00Z', updated_at: '2025-01-15T00:00:00Z' },
  { id: 'ser-007', branch_id: 'nsk-abt-ladies-0002', name: 'Hydrafacial Pro', price: 6500, duration: 75, category: 'Facial', description: 'Advanced hydra hydration skin facial', created_at: '2025-01-15T00:00:00Z', updated_at: '2025-01-15T00:00:00Z' },
  { id: 'ser-008', branch_id: 'nsk-abt-ladies-0002', name: 'Premium Bridal Makeup', price: 25000, duration: 180, category: 'Makeup', description: 'Complete wedding day makeover with hair-do', created_at: '2025-01-15T00:00:00Z', updated_at: '2025-01-15T00:00:00Z' },

  // Gents Mansehra
  { id: 'ser-009', branch_id: 'nsk-msr-gents-0003', name: 'Royal Hair Cut', price: 1000, duration: 35, category: 'Hair', description: 'Haircut and conditioning wash', created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },
  { id: 'ser-010', branch_id: 'nsk-msr-gents-0003', name: 'Classic Beard Shave / Trim', price: 500, duration: 20, category: 'Beard', description: 'Clean trim and hot towel wash', created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },
  { id: 'ser-011', branch_id: 'nsk-msr-gents-0003', name: 'Organic Facial', price: 2500, duration: 50, category: 'Facial', description: 'All-natural fruit facial', created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },

  // Gents Battagram
  { id: 'ser-012', branch_id: 'nsk-btg-gents-0004', name: 'Standard Hair Cut', price: 800, duration: 30, category: 'Hair', description: 'Local haircut style', created_at: '2025-03-05T00:00:00Z', updated_at: '2025-03-05T00:00:00Z' },
  { id: 'ser-013', branch_id: 'nsk-btg-gents-0004', name: 'Beard Trim', price: 400, duration: 15, category: 'Beard', description: 'Quick clipper beard trim', created_at: '2025-03-05T00:00:00Z', updated_at: '2025-03-05T00:00:00Z' },
];

const DEVICE_LIST: Device[] = [
  { id: 'dev-1', branch_id: 'nsk-abt-gents-0001', device_uuid: 'E9F1-A42D-998C-1234', computer_name: 'NSK-ABT-GENTS-POS', windows_username: 'Administrator', operating_system: 'Windows 11 Enterprise LTSC', application_version: 'v2.4.1', activation_key: 'NSK-ABT-2026-F5G8H', first_activation: '2026-01-15T12:04:10Z', last_seen: '2026-07-17T09:48:15Z', status: 'active', created_at: '2026-01-15T12:04:10Z', updated_at: '2026-07-17T09:48:15Z' },
  { id: 'dev-2', branch_id: 'nsk-abt-ladies-0002', device_uuid: 'D8A2-B54E-773B-5678', computer_name: 'NSK-ABT-LADIES-POS', windows_username: 'NSKUser', operating_system: 'Windows 11 Pro', application_version: 'v2.4.1', activation_key: 'NSK-ABT-2026-X9Y2Z', first_activation: '2026-01-18T10:15:33Z', last_seen: '2026-07-17T09:50:22Z', status: 'active', created_at: '2026-01-18T10:15:33Z', updated_at: '2026-07-17T09:50:22Z' },
  { id: 'dev-3', branch_id: 'nsk-msr-gents-0003', device_uuid: 'A1B2-C3D4-E5F6-7890', computer_name: 'NSK-MSR-GENTS-POS', windows_username: 'Owner', operating_system: 'Windows 10 Pro', application_version: 'v2.3.9', activation_key: 'NSK-MSR-2026-P8Q9R', first_activation: '2026-02-05T14:40:00Z', last_seen: '2026-07-17T09:42:00Z', status: 'active', created_at: '2026-02-05T14:40:00Z', updated_at: '2026-07-17T09:42:00Z' },
  { id: 'dev-4', branch_id: 'nsk-btg-gents-0004', device_uuid: 'F0E1-D2C3-B4A5-0123', computer_name: 'NSK-BTG-GENTS-POS', windows_username: 'Cashier-01', operating_system: 'Windows 11 Home', application_version: 'v2.4.0', activation_key: 'NSK-BTG-2026-L5K8J', first_activation: '2026-03-08T09:30:15Z', last_seen: '2026-07-16T18:25:00Z', status: 'active', created_at: '2026-03-08T09:30:15Z', updated_at: '2026-07-16T18:25:00Z' },
];

const ACTIVATION_KEYS_LIST: ActivationKey[] = [
  { key: 'NSK-ABT-2026-F5G8H', branch_id: 'nsk-abt-gents-0001', status: 'used', device_id: 'dev-1', activated_at: '2026-01-15T12:04:10Z', activated_by: 'Admin', last_seen: '2026-07-17T09:48:15Z', created_at: '2026-01-01T08:00:00Z' },
  { key: 'NSK-ABT-2026-X9Y2Z', branch_id: 'nsk-abt-ladies-0002', status: 'used', device_id: 'dev-2', activated_at: '2026-01-18T10:15:33Z', activated_by: 'Admin', last_seen: '2026-07-17T09:50:22Z', created_at: '2026-01-01T08:00:00Z' },
  { key: 'NSK-MSR-2026-P8Q9R', branch_id: 'nsk-msr-gents-0003', status: 'used', device_id: 'dev-3', activated_at: '2026-02-05T14:40:00Z', activated_by: 'Admin', last_seen: '2026-07-17T09:42:00Z', created_at: '2026-01-15T09:30:00Z' },
  { key: 'NSK-BTG-2026-L5K8J', branch_id: 'nsk-btg-gents-0004', status: 'used', device_id: 'dev-4', activated_at: '2026-03-08T09:30:15Z', activated_by: 'Admin', last_seen: '2026-07-16T18:25:00Z', created_at: '2026-02-28T10:15:00Z' },
  
  { key: 'NSK-ABT-2026-A1B2C', branch_id: 'nsk-abt-gents-0001', status: 'active', device_id: null, activated_at: null, activated_by: null, last_seen: null, created_at: '2026-07-10T12:00:00Z' },
  { key: 'NSK-ABT-2026-M4K5L', branch_id: 'nsk-abt-ladies-0002', status: 'active', device_id: null, activated_at: null, activated_by: null, last_seen: null, created_at: '2026-07-12T14:10:00Z' },
  { key: 'NSK-MSR-2026-Z7X8Y', branch_id: 'nsk-msr-gents-0003', status: 'inactive', device_id: null, activated_at: null, activated_by: null, last_seen: null, created_at: '2026-07-14T11:00:00Z' },
];

const AUDIT_LOGS_LIST: AuditLog[] = [
  { id: 'aud-001', branch_id: 'nsk-abt-gents-0001', operator_name: 'Admin User', action: 'Activated Key', entity: 'activation_keys', entity_id: 'NSK-ABT-2026-F5G8H', old_values: '{"status": "active"}', new_values: '{"status": "used", "device_id": "dev-1"}', ip_address: '182.176.88.192', device_uuid: 'E9F1-A42D-998C-1234', created_at: '2026-01-15T12:04:10Z' },
  { id: 'aud-002', branch_id: 'nsk-abt-ladies-0002', operator_name: 'Admin User', action: 'Created Staff', entity: 'staff', entity_id: 'st-004', old_values: null, new_values: '{"name": "Sadia Bibi", "role": "Stylist", "status": "active"}', ip_address: '182.176.88.192', device_uuid: 'D8A2-B54E-773B-5678', created_at: '2026-01-16T09:12:33Z' },
  { id: 'aud-003', branch_id: 'nsk-msr-gents-0003', operator_name: 'Umar Abbasi', action: 'Created Appointment', entity: 'appointments', entity_id: 'ap-001', old_values: null, new_values: '{"customer_id": "cust-007", "price": 1000, "status": "completed"}', ip_address: '110.39.44.15', device_uuid: 'A1B2-C3D4-E5F6-7890', created_at: '2026-07-15T10:15:00Z' },
  { id: 'aud-004', branch_id: 'nsk-btg-gents-0004', operator_name: 'Admin User', action: 'Revoked Device', entity: 'devices', entity_id: 'dev-4', old_values: '{"status": "active"}', new_values: '{"status": "revoked"}', ip_address: '182.176.88.200', device_uuid: 'F0E1-D2C3-B4A5-0123', created_at: '2026-07-16T18:45:00Z' },
];

const EXPENSES_LIST: Expense[] = [
  { id: 'exp-001', branch_id: 'nsk-abt-gents-0001', amount: 45000, category: 'Rent', description: 'Monthly salon premises rent for Abbottabad Gents branch', date: '2026-07-01', created_at: '2026-07-01T09:00:00Z', updated_at: '2026-07-01T09:00:00Z' },
  { id: 'exp-002', branch_id: 'nsk-abt-gents-0001', amount: 15200, category: 'Utilities', description: 'Pesco Electricity Bill for June 2026', date: '2026-07-05', created_at: '2026-07-05T10:15:00Z', updated_at: '2026-07-05T10:15:00Z' },
  { id: 'exp-003', branch_id: 'nsk-abt-gents-0001', amount: 3500, category: 'Supplies', description: 'Bought professional hair gel and shaving creams', date: '2026-07-12', created_at: '2026-07-12T14:30:00Z', updated_at: '2026-07-12T14:30:00Z' },
  { id: 'exp-004', branch_id: 'nsk-abt-gents-0001', amount: 4800, category: 'Staff Tea/Meals', description: 'Weekly staff tea and lunch expense', date: '2026-07-14', created_at: '2026-07-14T18:00:00Z', updated_at: '2026-07-14T18:00:00Z' },

  { id: 'exp-005', branch_id: 'nsk-abt-ladies-0002', amount: 65000, category: 'Rent', description: 'Rent for Ladies branch salon', date: '2026-07-01', created_at: '2026-07-01T09:00:00Z', updated_at: '2026-07-01T09:00:00Z' },
  { id: 'exp-006', branch_id: 'nsk-abt-ladies-0002', amount: 28400, category: 'Utilities', description: 'Sui Gas and Electric Bill for June 2026', date: '2026-07-05', created_at: '2026-07-05T11:00:00Z', updated_at: '2026-07-05T11:00:00Z' },
  { id: 'exp-007', branch_id: 'nsk-abt-ladies-0002', amount: 18500, category: 'Supplies', description: 'Bought Loreal hair dyes, face creams, facial products', date: '2026-07-10', created_at: '2026-07-10T12:00:00Z', updated_at: '2026-07-10T12:00:00Z' },

  { id: 'exp-008', branch_id: 'nsk-msr-gents-0003', amount: 35000, category: 'Rent', description: 'Salon premises rent Mansehra branch', date: '2026-07-01', created_at: '2026-07-01T09:00:00Z', updated_at: '2026-07-01T09:00:00Z' },
  { id: 'exp-009', branch_id: 'nsk-msr-gents-0003', amount: 11400, category: 'Utilities', description: 'Pesco Electric Bill June 2026', date: '2026-07-06', created_at: '2026-07-06T10:00:00Z', updated_at: '2026-07-06T10:00:00Z' },

  { id: 'exp-010', branch_id: 'nsk-btg-gents-0004', amount: 22000, category: 'Rent', description: 'Salon premises rent Battagram branch', date: '2026-07-01', created_at: '2026-07-01T09:00:00Z', updated_at: '2026-07-01T09:00:00Z' },
  { id: 'exp-011', branch_id: 'nsk-btg-gents-0004', amount: 6200, category: 'Utilities', description: 'Electric Bill June 2026', date: '2026-07-07', created_at: '2026-07-07T10:00:00Z', updated_at: '2026-07-07T10:00:00Z' },
];

// Seed dynamic appointments and invoices for past 30 days and today.
// This is to generate an amazing chart and dashboard statistics perfectly on current date 2026-07-17.
const APPOINTMENT_LIST: Appointment[] = [];
const INVOICE_LIST: Invoice[] = [];

function seedHistoricalData() {
  APPOINTMENT_LIST.length = 0;
  INVOICE_LIST.length = 0;
  const categories = ['Hair', 'Beard', 'Facial', 'Makeup'];
  const today = new Date('2026-07-17T09:53:05-07:00');
  
  // Create 50 realistic historical entries for the past 30 days
  let apptIdCounter = 1;
  let invIdCounter = 1001;

  for (let d = 30; d >= 0; d--) {
    const currentDate = new Date(today.getTime());
    currentDate.setDate(today.getDate() - d);
    
    // Set fixed counts per day to make charts beautiful and deterministic
    // Ladies branch has higher average price, Gents branch has higher frequency
    const dayOfWeek = currentDate.getDay();
    const apptsCount = dayOfWeek === 0 || dayOfWeek === 6 ? 4 : 2; // more on weekends

    for (let i = 0; i < apptsCount; i++) {
      const isToday = d === 0;
      const hours = 9 + (i * 2.5); // spread out appointments
      currentDate.setHours(hours, 0, 0, 0);

      const branchIndex = (d + i) % 4;
      const branch = BRANCH_LIST[branchIndex];
      
      // Get branch staff
      const branchStaff = STAFF_LIST.filter(s => s.branch_id === branch.id);
      const staff = branchStaff[i % branchStaff.length] || STAFF_LIST[0];

      // Get branch services
      const branchServices = SERVICE_LIST.filter(s => s.branch_id === branch.id);
      const service = branchServices[i % branchServices.length] || SERVICE_LIST[0];

      // Get customer
      const branchCustomers = CUSTOMER_LIST.filter(c => c.branch_id === branch.id);
      const customer = branchCustomers[i % branchCustomers.length] || CUSTOMER_LIST[0];

      const statusVal = isToday && i >= 1 ? 'pending' : ((d + i) % 8 === 0 ? 'cancelled' : ((d + i) % 15 === 0 ? 'no-show' : 'completed'));
      
      const apptId = `ap-${String(apptIdCounter).padStart(4, '0')}`;
      apptIdCounter++;

      const duration = service.duration;
      const start = currentDate.toISOString();
      const end = new Date(currentDate.getTime() + duration * 60 * 1000).toISOString();

      APPOINTMENT_LIST.push({
        id: apptId,
        customer_id: customer.id,
        service_id: service.id,
        branch_id: branch.id,
        operator_id: staff.id,
        start_time: start,
        end_time: end,
        status: statusVal as any,
        price: service.price,
        notes: isToday ? 'Walk-in booking' : 'Standard appointment',
        created_at: start,
        updated_at: start,
        customer_name: customer.name,
        service_name: service.name,
        operator_name: staff.name,
        branch_name: branch.name,
      });

      // If completed or pending, create an invoice
      if (statusVal === 'completed' || isToday) {
        const discount = d % 5 === 0 ? 200 : 0;
        const tax = Math.round((service.price - discount) * 0.05);
        const total = service.price - discount + tax;
        const invoiceNum = `NSK-INV-${String(invIdCounter)}`;
        invIdCounter++;

        INVOICE_LIST.push({
          id: `inv-${String(invIdCounter)}`,
          invoice_number: invoiceNum,
          appointment_id: apptId,
          customer_id: customer.id,
          branch_id: branch.id,
          staff_id: staff.id,
          services_json: JSON.stringify([{ service_id: service.id, name: service.name, price: service.price, qty: 1 }]),
          subtotal: service.price,
          discount_amount: discount,
          tax_amount: tax,
          total_amount: total,
          payment_method: (d + i) % 3 === 0 ? 'card' : 'cash',
          status: (d === 1 && i === 0) ? 'refunded' : 'paid', // Seed 1 refunded invoice
          created_at: start,
          updated_at: start,
          customer_name: customer.name,
          staff_name: staff.name,
          branch_name: branch.name,
        });
      }
    }
  }
}

seedHistoricalData();

// Combine everything into a local database representation
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
  branches: BRANCH_LIST,
  staff: STAFF_LIST,
  customers: CUSTOMER_LIST,
  services: SERVICE_LIST,
  devices: DEVICE_LIST,
  activationKeys: ACTIVATION_KEYS_LIST,
  auditLogs: AUDIT_LOGS_LIST,
  expenses: EXPENSES_LIST,
  appointments: APPOINTMENT_LIST,
  invoices: INVOICE_LIST,
};

// Local storage management helpers
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
