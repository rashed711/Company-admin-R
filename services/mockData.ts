import {
    Customer,
    Supplier,
    Product,
    Quotation,
    Invoice,
    SupplierInvoice,
    User,
    AccountTransaction,
    JournalEntry,
    ReceiptVoucher,
    PaymentVoucher
} from '../types';
import { ROLES } from '../contexts/AuthContext';

// Mock Users
export const mockUsersData: User[] = [
  { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', name: 'Admin User', email: 'admin@example.com', role: ROLES.admin },
  { id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', name: 'Sales Manager Sam', email: 'manager@example.com', role: ROLES.sales_manager, manager_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' },
  { id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12', name: 'Sales Person Pete', email: 'sales@example.com', role: ROLES.sales_person, manager_id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1' },
  { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef123', name: 'Accountant Annie', email: 'accountant@example.com', role: ROLES.accountant, manager_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' }
];

// Mock Customers
export const mockCustomersData: Customer[] = [
  { id: 1, name: 'Innovate Corp', email: 'contact@innovate.com', phone: '555-0101', address: '123 Innovation Dr, Tech City', created_at: '2023-10-01T10:00:00Z' },
  { id: 2, name: 'Synergy Solutions', email: 'hello@synergy.com', phone: '555-0102', address: '456 Synergy Ave, Business Bay', created_at: '2023-10-05T11:30:00Z' },
  { id: 3, name: 'Quantum Industries', email: 'info@quantum.com', phone: '555-0103', address: '789 Quantum Blvd, Science Park', created_at: '2023-10-10T14:00:00Z' }
];

// Mock Suppliers
export const mockSuppliersData: Supplier[] = [
  { id: 1, name: 'Global Components', email: 'sales@globalcomp.com', phone: '555-0201', address: '1 Component Rd, Industrial Zone', created_at: '2023-09-15T09:00:00Z' },
  { id: 2, name: 'Office Supreme', email: 'orders@officesupreme.com', phone: '555-0202', address: '22 Office Park, Commerce City', created_at: '2023-09-20T16:00:00Z' }
];

// Mock Products
export const mockProductsData: Product[] = [
  { id: 1, name: 'Engineering Consultation', description: '1 hour of senior engineering consultation.', category: 'Services', unit: 'Hour', price: 150.00, avg_purchase_price: 0, avg_selling_price: 150.00, created_at: '2023-01-01T00:00:00Z' },
  { id: 2, name: 'Custom Software Module', description: 'A custom-built software module for an existing system.', category: 'Software', unit: 'Module', price: 2500.00, avg_purchase_price: 1000, avg_selling_price: 2500, created_at: '2023-01-02T00:00:00Z' },
  { id: 3, name: 'Cloud Server Hosting (Advanced)', description: '1 month of advanced cloud server hosting.', category: 'Hosting', unit: 'Month', price: 99.99, avg_purchase_price: 40, avg_selling_price: 99.99, created_at: '2023-01-03T00:00:00Z' },
  { id: 4, name: 'On-site Support', description: '1 day of on-site technical support.', category: 'Services', unit: 'Day', price: 800.00, avg_purchase_price: 300, avg_selling_price: 800, created_at: '2023-01-04T00:00:00Z' }
];

// Mock Quotations
export const mockQuotationsData: Quotation[] = [
  {
    id: 101, customer_id: 1, customer_name: 'Innovate Corp', issue_date: '2023-11-01', status: 'sent',
    items: [
      { id: 1, product_id: 1, description: 'Project planning session', unit: 'Hour', quantity: 5, price: 150, total: 750, product_name: 'Engineering Consultation' },
      { id: 2, product_id: 2, description: 'Authentication module', unit: 'Module', quantity: 1, price: 2500, total: 2500, product_name: 'Custom Software Module' }
    ],
    subtotal: 3250, tax_rate: 15, tax_amount: 487.5, total: 3737.5,
    created_at: '2023-11-01T09:15:00Z', created_time: '09:15', is_taxable: true, discount_amount: 0, discount_type: 'amount',
    contact_person: 'John Doe', project_name: 'Project Alpha', quotation_type: 'Standard'
  },
  {
    id: 102, customer_id: 2, customer_name: 'Synergy Solutions', issue_date: '2023-11-05', status: 'accepted',
    items: [
      { id: 3, product_id: 3, description: 'Yearly hosting plan', unit: 'Month', quantity: 12, price: 90, total: 1080, product_name: 'Cloud Server Hosting (Advanced)' }
    ],
    subtotal: 1080, tax_rate: 15, tax_amount: 162, total: 1242,
    created_at: '2023-11-05T14:20:00Z', created_time: '14:20', is_taxable: true, discount_amount: 0, discount_type: 'amount', invoice_id: 201,
    contact_person: 'Jane Smith', project_name: 'Website Revamp', quotation_type: 'Annual'
  }
];

// Mock Invoices
export const mockInvoicesData: Invoice[] = [
  {
    id: 201, customer_id: 2, customer_name: 'Synergy Solutions', issue_date: '2023-11-10', due_date: '2023-12-10', status: 'paid', paid_amount: 1242,
    items: [
      { id: 1, product_id: 3, description: 'Yearly hosting plan', unit: 'Month', quantity: 12, price: 90, total: 1080, product_name: 'Cloud Server Hosting (Advanced)' }
    ],
    subtotal: 1080, tax_rate: 15, tax_amount: 162, total: 1242,
    created_at: '2023-11-10T10:00:00Z', created_time: '10:00', quotation_id: 102, is_taxable: true, discount_amount: 0, discount_type: 'amount',
    contact_person: 'Jane Smith', project_name: 'Website Revamp', invoice_type: 'Annual'
  },
  {
    id: 202, customer_id: 1, customer_name: 'Innovate Corp', issue_date: '2023-11-12', due_date: '2023-12-12', status: 'sent', paid_amount: 0,
    items: [
        { id: 2, product_id: 4, description: 'Emergency server maintenance', unit: 'Day', quantity: 2, price: 800, total: 1600, product_name: 'On-site Support' }
    ],
    subtotal: 1600, tax_rate: 15, tax_amount: 240, total: 1840,
    created_at: '2023-11-12T11:45:00Z', created_time: '11:45', is_taxable: true, discount_amount: 0, discount_type: 'amount',
    contact_person: 'John Doe', project_name: 'Server Migration', invoice_type: 'Service'
  }
];

// Mock Supplier Invoices
export const mockSupplierInvoicesData: SupplierInvoice[] = [
    {
        id: 301, supplier_id: 1, supplier_name: 'Global Components', issue_date: '2023-10-20', due_date: '2023-11-20', status: 'paid', paid_amount: 575,
        items: [
            { id: 1, product_id: 101, product_name: 'Microcontroller Unit', description: 'Model XYZ-123', unit: 'pcs', quantity: 50, price: 10, total: 500 }
        ],
        subtotal: 500, tax_rate: 15, tax_amount: 75, total: 575,
        created_at: '2023-10-20T18:00:00Z', created_time: '18:00', is_taxable: true, discount_amount: 0, discount_type: 'amount'
    },
    {
        id: 302, supplier_id: 2, supplier_name: 'Office Supreme', issue_date: '2023-11-01', due_date: '2023-12-01', status: 'unpaid', paid_amount: 0,
        items: [
            { id: 2, product_id: 102, product_name: 'Ergonomic Office Chair', description: 'Black, leather', unit: 'pcs', quantity: 5, price: 200, total: 1000 }
        ],
        subtotal: 1000, tax_rate: 0, tax_amount: 0, total: 1000,
        created_at: '2023-11-01T13:00:00Z', created_time: '13:00', is_taxable: false, discount_amount: 0, discount_type: 'amount'
    }
];

// Mock Transactions
export const mockCustomerTransactions: AccountTransaction[] = [
  { id: 'inv-201', date: '2023-11-10', time: '10:00', source_type: 'invoice', source_id: 201, description: 'Invoice #201 - Website Revamp', debit: 1242, credit: 0, balance: 0, created_at: '2023-11-10T10:00:00Z' },
  { id: 'inv-202', date: '2023-11-12', time: '11:45', source_type: 'invoice', source_id: 202, description: 'Invoice #202 - Server Migration', debit: 1840, credit: 0, balance: 0, created_at: '2023-11-12T11:45:00Z' },
  { id: 'rv-1', date: '2023-11-15', time: '15:00', source_type: 'receipt', source_id: 1, description: 'Payment for INV-201', debit: 0, credit: 1242, balance: 0, created_at: '2023-11-15T15:00:00Z' }
];

export const mockSupplierTransactions: AccountTransaction[] = [
  { id: 'sinv-301', date: '2023-10-20', time: '18:00', source_type: 'supplier-invoice', source_id: 301, description: 'Supplier Invoice #301 - Microcontrollers', debit: 0, credit: 575, balance: 0, created_at: '2023-10-20T18:00:00Z' },
  { id: 'sinv-302', date: '2023-11-01', time: '13:00', source_type: 'supplier-invoice', source_id: 302, description: 'Supplier Invoice #302 - Office Chairs', debit: 0, credit: 1000, balance: 0, created_at: '2023-11-01T13:00:00Z' },
  { id: 'pv-1', date: '2023-10-25', time: '10:30', source_type: 'payment', source_id: 1, description: 'Payment for SINV-301', debit: 575, credit: 0, balance: 0, created_at: '2023-10-25T10:30:00Z' }
];

// Mock Journal Entries
export const mockJournalEntriesData: JournalEntry[] = [
    { id: 1, date: '2023-11-20', time: '12:00', description: 'Record monthly salaries', debit: 15000, credit: 15000, created_at: '2023-11-20T12:00:00Z' },
    { id: 2, date: '2023-11-18', time: '09:30', description: 'Purchase office supplies', debit: 500, credit: 500, created_at: '2023-11-18T09:30:00Z' }
];

// Mock Vouchers
export const mockReceiptVouchersData: ReceiptVoucher[] = [
    { id: 1, customer_id: 2, customer_name: 'Synergy Solutions', date: '2023-11-15', amount: 1242, payment_method: 'bank_transfer', description: 'Payment for INV-201', created_at: '2023-11-15T15:00:00Z', created_time: '15:00' }
];

export const mockPaymentVouchersData: PaymentVoucher[] = [
    { id: 1, supplier_id: 1, supplier_name: 'Global Components', date: '2023-10-25', amount: 575, payment_method: 'cash', description: 'Payment for SINV-301', created_at: '2023-10-25T10:30:00Z', created_time: '10:30' }
];
