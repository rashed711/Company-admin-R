

import { supabase } from './supabaseClient';
import { Product, Quotation, Invoice, SupplierInvoice, Customer, Supplier, ReceiptVoucher, PaymentVoucher, InvoiceItem, JournalEntry, JournalEntryItem } from '../types';

// Generic fetch function
const fetchData = async (table: string) => {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    return { data, error };
};

// Products
const getProducts = () => fetchData('products');
const addProduct = (product: Partial<Product>) => supabase.from('products').insert([product]).select();
const updateProduct = (id: number, updates: Partial<Product>) => supabase.from('products').update(updates).eq('id', id).select();
const deleteProduct = (id: number) => supabase.from('products').delete().eq('id', id);

// Customers
const getCustomers = () => fetchData('customers');
const addCustomer = (customer: Partial<Customer>) => supabase.from('customers').insert([customer]).select();
const updateCustomer = (id: number, updates: Partial<Customer>) => supabase.from('customers').update(updates).eq('id', id).select();
const deleteCustomer = (id: number) => supabase.from('customers').delete().eq('id', id);


// Suppliers
const getSuppliers = () => fetchData('suppliers');
const addSupplier = (supplier: Partial<Supplier>) => supabase.from('suppliers').insert([supplier]).select();
const updateSupplier = (id: number, updates: Partial<Supplier>) => supabase.from('suppliers').update(updates).eq('id', id).select();
const deleteSupplier = (id: number) => supabase.from('suppliers').delete().eq('id', id);


// --- QUOTATIONS ---
const getQuotations = () => supabase.from('quotations').select('*, customer:customers(name), created_by_user:created_by(full_name), customer_name_temp').order('created_at', { ascending: false });
const getQuotationById = (id: number) => supabase.from('quotations').select('*, items:quotation_items(*), customer:customers(*), customer_name_temp').eq('id', id).single();
const addQuotation = (quotation: Partial<Quotation>) => {
    const { items, ...quotationData } = quotation;
    const itemsData = items?.map(({ id, product_name, ...rest }) => rest);
    return supabase.rpc('create_quotation_with_items', { quotation_data: quotationData, items_data: itemsData });
};
const updateQuotation = (id: number, quotation: Partial<Quotation>) => {
    const { items, ...quotationData } = quotation;
    const itemsData = items?.map(({ id, product_name, ...rest }) => rest);
    return supabase.rpc('update_quotation_with_items', { p_quotation_id: id, quotation_data: quotationData, items_data: itemsData });
};
const deleteQuotation = (id: number) => supabase.from('quotations').delete().eq('id', id);

// --- INVOICES ---
const getInvoices = () => supabase.from('invoices').select('*, customer:customers(name), created_by_user:created_by(full_name)').order('created_at', { ascending: false });
const getInvoiceById = (id: number) => supabase.from('invoices').select('*, items:invoice_items(*), customer:customers(*)').eq('id', id).single();
const addInvoice = (invoice: Partial<Invoice>) => {
    const { items, ...invoiceData } = invoice;
    const itemsData = items?.map(({ id, product_name, ...rest }) => rest);
    return supabase.rpc('create_invoice_with_items', { invoice_data: invoiceData, items_data: itemsData });
};
const updateInvoice = (id: number, invoice: Partial<Invoice>) => {
    const { items, ...invoiceData } = invoice;
    const itemsData = items?.map(({ id, product_name, ...rest }) => rest);
    return supabase.rpc('update_invoice_with_items', { p_invoice_id: id, invoice_data: invoiceData, items_data: itemsData });
};
const deleteInvoice = (id: number) => supabase.from('invoices').delete().eq('id', id);


// --- SUPPLIER INVOICES ---
const getSupplierInvoices = () => supabase.from('supplier_invoices').select('*, supplier:suppliers(name), created_by_user:created_by(full_name)').order('created_at', { ascending: false });
const getSupplierInvoiceById = (id: number) => supabase.from('supplier_invoices').select('*, items:supplier_invoice_items(*), supplier:suppliers(*)').eq('id', id).single();
const addSupplierInvoice = (invoice: Partial<SupplierInvoice>) => {
    const { items, ...invoiceData } = invoice;
    const itemsData = items?.map(({ id, ...rest }) => rest);
    return supabase.rpc('create_supplier_invoice_with_items', { invoice_data: invoiceData, items_data: itemsData });
};
const updateSupplierInvoice = (id: number, invoice: Partial<SupplierInvoice>) => {
    const { items, ...invoiceData } = invoice;
    const itemsData = items?.map(({ id, ...rest }) => rest);
    return supabase.rpc('update_supplier_invoice_with_items', { p_invoice_id: id, invoice_data: invoiceData, items_data: itemsData });
};
const deleteSupplierInvoice = (id: number) => supabase.from('supplier_invoices').delete().eq('id', id);


// --- VOUCHERS ---
const getReceiptVouchers = () => supabase.from('receipt_vouchers').select('*, customer:customers(name)').order('created_at', { ascending: false });
const deleteReceiptVoucher = (id: number) => supabase.from('receipt_vouchers').delete().eq('id', id);

const getPaymentVouchers = () => supabase.from('payment_vouchers').select('*, supplier:suppliers(name)').order('created_at', { ascending: false });
const deletePaymentVoucher = (id: number) => supabase.from('payment_vouchers').delete().eq('id', id);

// --- ACCOUNTING ---
const getChartOfAccounts = () => supabase.from('chart_of_accounts').select('*').order('name');
const getJournalEntries = () => supabase.from('journal_entries_view').select('*');
const addJournalEntry = (entry: Partial<JournalEntry>) => {
    const { items, ...entryData } = entry;
    const itemsData = items?.map(({ id, account_name, ...rest }) => rest); // Remove UI-only fields
    return supabase.rpc('create_journal_entry_with_items', { entry_data: entryData, items_data: itemsData });
};

// --- USERS ---
const getUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('id, name:full_name, role, manager_id');
    return { data, error };
};

const updateUser = (id: string, updates: { role: string; manager_id: string | null }) => {
    return supabase.from('users').update(updates).eq('id', id);
};


// --- DASHBOARD ---
const getDashboardCounts = async () => {
    const [
        { count: quotations_count },
        { count: invoices_count },
        { count: customers_count },
        { count: suppliers_count },
        { count: users_count }
    ] = await Promise.all([
        supabase.from('quotations').select('*', { count: 'exact', head: true }),
        supabase.from('invoices').select('*', { count: 'exact', head: true }),
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('suppliers').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true })
    ]);
    return { quotations_count, invoices_count, customers_count, suppliers_count, users_count };
}

export {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getQuotations,
    getQuotationById,
    addQuotation,
    updateQuotation,
    deleteQuotation,
    getInvoices,
    getInvoiceById,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getSupplierInvoices,
    getSupplierInvoiceById,
    addSupplierInvoice,
    updateSupplierInvoice,
    deleteSupplierInvoice,
    getReceiptVouchers,
    deleteReceiptVoucher,
    getPaymentVouchers,
    deletePaymentVoucher,
    getDashboardCounts,
    getChartOfAccounts,
    getJournalEntries,
    addJournalEntry,
    getUsers,
    updateUser,
};