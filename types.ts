

export type LocaleKey = 'ar-SA' | 'ar-EG' | 'en-US';

export interface LocaleConfig {
  language: 'ar' | 'en';
  dialect: 'sa' | 'eg' | 'us';
  currency: 'SAR' | 'EGP' | 'USD';
  currencySymbol: string;
  taxRate: number;
  dir: 'rtl' | 'ltr';
}

export interface CompanyInfoDetail {
    value: string;
    showInHeader: boolean;
}

// =================== App Settings Specific ===================
export interface CompanyInfo {
  APP_NAME: CompanyInfoDetail;
  NAME: CompanyInfoDetail;
  NAME_AR: CompanyInfoDetail;
  EMAIL: CompanyInfoDetail;
  PHONE: CompanyInfoDetail;
  ADDRESS: CompanyInfoDetail;
  ADDRESS_AR: CompanyInfoDetail;
  TAX_NUMBER: CompanyInfoDetail;
}

export interface DocumentTemplate {
  header: string;
  footer: string;
  termsAndConditions: string;
  headerImage?: string | null;
  showTitleInHeader?: boolean;
}


// =================== RBAC & User Management ===================
// A structured definition of all available permissions in the system.
// This drives the UI in the RolesList component and provides a single source of truth.
const SCOPED_ACTIONS = ['view', 'edit', 'delete'];
const SCOPED_ACTIONS_TEAM_ALL = ['view_team', 'view_all', 'edit_team', 'edit_all', 'delete_team', 'delete_all'];


export const PERMISSION_STRUCTURE = {
  dashboard: {
    id: 'dashboard',
    title: 'permission_group_dashboard',
    permissions: {
      'financials:view': 'permission_dashboard_financials_view',
      'users-summary:view': 'permission_dashboard_users_summary_view',
    }
  },
  sales: {
    id: 'sales',
    title: 'permission_group_sales',
    modules: {
      quotations: {
        title: 'permission_module_quotations',
        actions: ['view', 'view_team', 'view_all', 'create', 'edit', 'edit_team', 'edit_all', 'delete', 'delete_team', 'delete_all', 'print', 'convert']
      },
      invoices: {
        title: 'permission_module_sales_invoices',
        actions: ['view', 'view_team', 'view_all', 'create', 'edit', 'edit_team', 'edit_all', 'delete', 'delete_team', 'delete_all', 'print']
      }
    }
  },
  purchases: {
    id: 'purchases',
    title: 'permission_group_purchases',
    modules: {
      invoices: {
        title: 'permission_module_purchase_invoices',
        actions: ['view', 'view_team', 'view_all', 'create', 'edit', 'edit_team', 'edit_all', 'delete', 'delete_team', 'delete_all']
      }
    }
  },
  contacts: {
    id: 'contacts',
    title: 'permission_group_contacts',
    modules: {
      customers: { title: 'permission_module_customers', actions: ['view', 'view_team', 'view_all', 'create', 'edit', 'edit_team', 'edit_all', 'delete', 'delete_team', 'delete_all', 'view_statement'] },
      suppliers: { title: 'permission_module_suppliers', actions: ['view', 'view_team', 'view_all', 'create', 'edit', 'edit_team', 'edit_all', 'delete', 'delete_team', 'delete_all', 'view_statement'] }
    }
  },
  accounting: {
    id: 'accounting',
    title: 'permission_group_accounting',
    modules: {
      'chart-of-accounts': { title: 'permission_module_chart_of_accounts', actions: ['view', 'create', 'edit', 'delete'] },
      'journal-entries': { title: 'permission_module_journal_entries', actions: ['view', 'create', 'edit', 'delete'] },
      'receipt-vouchers': { title: 'permission_module_receipt_vouchers', actions: ['view', 'create', 'edit', 'delete'] },
      'payment-vouchers': { title: 'permission_module_payment_vouchers', actions: ['view', 'create', 'edit', 'delete'] }
    }
  },
  settings: {
    id: 'settings',
    title: 'permission_group_settings',
    modules: {
      products: { title: 'permission_module_products', actions: ['view', 'create', 'edit', 'delete'] },
      users: { title: 'permission_module_users', actions: ['view', 'create', 'edit', 'delete'] },
      roles: { title: 'permission_module_roles', actions: ['view', 'edit'] },
      app: { title: 'permission_module_app_settings', actions: ['view', 'edit'] }
    }
  }
} as const;


// Utility type to generate all possible permission strings from the structure above
type GeneratePermissions<T> = {
  [G in keyof T]: T[G] extends { id: string; permissions: infer P } 
    ? { [K in keyof P]: `${G & string}:${K & string}` }[keyof P]
    : T[G] extends { id: string; modules: infer M }
      ? { [K in keyof M]: M[K] extends { actions: readonly (infer A)[] } 
          ? `${G & string}:${K & string}:${A & string}`
          : never 
        }[keyof M]
      : never
}[keyof T];

export type Permission = GeneratePermissions<typeof PERMISSION_STRUCTURE>;

// Flatten the structure to get an array of all permission strings, used for granting all permissions to admin.
function flattenPermissions(structure: typeof PERMISSION_STRUCTURE): Permission[] {
    const permissions: Permission[] = [];
    for (const groupKey in structure) {
        const group = structure[groupKey as keyof typeof structure];
        if ('permissions' in group) {
            for (const permKey in group.permissions) {
                permissions.push(`${group.id}:${permKey}` as Permission);
            }
        }
        if ('modules' in group) {
            for (const modKey in group.modules) {
                const module = (group.modules as any)[modKey];
                for (const action of module.actions) {
                    permissions.push(`${group.id}:${modKey}:${action}` as Permission);
                }
            }
        }
    }
    return permissions;
}

export const ALL_PERMISSIONS: Permission[] = flattenPermissions(PERMISSION_STRUCTURE);


export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

export interface User {
    id: string; // Changed to string for Supabase UUID
    name: string;
    email?: string;
    role: Role;
    manager_id?: string | null; // Changed to string for Supabase UUID
}

// =================== Core Business Models ===================
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  created_by?: string; // Changed to string for Supabase UUID
}

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  created_by?: string; // Changed to string for Supabase UUID
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  unit: string;
  price: number; // Selling Price
  avg_purchase_price: number;
  avg_selling_price: number;
  created_at: string;
}

export interface InvoiceItem {
  id: number;
  product_id: number;
  product_name?: string;
  description: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

export interface SupplierInvoiceItem {
  id: number;
  product_id: number;
  product_name: string;
  description: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}


interface DocumentShared {
  id: number;
  issue_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  created_at: string;
  created_time: string;
  created_by?: string; // Changed to string for Supabase UUID
  is_taxable: boolean;
  discount_amount: number;
  discount_type: 'percentage' | 'amount';
}

export interface Invoice extends DocumentShared {
  customer_id: number;
  customer_name?: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paid_amount: number;
  items: InvoiceItem[];
  quotation_id?: number | null;
  invoice_type?: string;
  contact_person?: string;
  project_name?: string;
}

export interface Quotation extends DocumentShared {
    customer_id?: number;
    customer_name?: string;
    customer_name_temp?: string;
    status: 'draft' | 'sent' | 'accepted' | 'rejected';
    contact_person?: string;
    project_name?: string;
    quotation_type?: string;
    items: InvoiceItem[];
    invoice_id?: number | null;
}

export interface SupplierInvoice extends DocumentShared {
    supplier_id: number;
    supplier_name?: string;
    due_date: string;
    status: 'unpaid' | 'paid' | 'partially_paid';
    paid_amount: number;
    items: SupplierInvoiceItem[];
    contact_person?: string;
    project_name?: string;
    supplier_invoice_type?: string;
}

// =================== Accounting Module ===================
export interface ChartOfAccount {
    id: number;
    name: string;
    type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
    created_at: string;
}

export interface JournalEntryItem {
    id?: number; // Optional for new items
    journal_entry_id?: number;
    account_id: number;
    account_name?: string; // for UI display
    debit: number;
    credit: number;
}

export interface JournalEntry {
    id: number;
    date: string;
    description: string;
    created_at: string;
    created_time: string;
    created_by?: string; // UUID
    items?: JournalEntryItem[];
    // For list view from the database view
    created_by_name?: string;
    total_debit?: number;
    total_credit?: number;
}

export interface ReceiptVoucher {
    id: number;
    customer_id: number;
    customer_name: string;
    date: string;
    amount: number;
    payment_method: 'cash' | 'bank_transfer' | 'cheque';
    description: string;
    created_at: string;
    created_time: string;
    created_by?: string; // Changed to string for Supabase UUID
}

export interface PaymentVoucher {
    id: number;
    supplier_id: number;
    supplier_name: string;
    date: string;
    amount: number;
    payment_method: 'cash' | 'bank_transfer' | 'cheque';
    description: string;
    created_at: string;
    created_time: string;
    created_by?: string; // Changed to string for Supabase UUID
}

export interface AccountTransaction {
    id: string; // e.g., 'inv-101' or 'rv-1'
    date: string;
    time: string;
    source_type: 'invoice' | 'receipt' | 'payment' | 'supplier-invoice';
    source_id: number;
    description: string;
    debit: number;
    credit: number;
    balance: number;
    created_at: string;
}