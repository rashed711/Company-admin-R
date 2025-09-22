import { supabase } from './supabaseClient';
import { Product, Quotation, Invoice, SupplierInvoice, Customer, Supplier, ReceiptVoucher, PaymentVoucher, InvoiceItem } from '../types';

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

// Suppliers
const getSuppliers = () => fetchData('suppliers');

// --- QUOTATIONS ---
const getQuotations = () => supabase.from('quotations').select('*, customer:customers(name), created_by_user:users(full_name)').order('created_at', { ascending: false });
const getQuotationById = (id: number) => supabase.from('quotations').select('*, items:quotation_items(*), customer:customers(*)').eq('id', id).single();
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
const getInvoices = () => supabase.from('invoices').select('*, customer:customers(name), created_by_user:users(full_name)').order('created_at', { ascending: false });
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
const getSupplierInvoices = () => supabase.from('supplier_invoices').select('*, supplier:suppliers(name), created_by_user:users(full_name)').order('created_at', { ascending: false });
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


// Vouchers
const getReceiptVouchers = () => supabase.from('receipt_vouchers').select('*, customer:customers(name)').order('created_at', { ascending: false });
const deleteReceiptVoucher = (id: number) => supabase.from('receipt_vouchers').delete().eq('id', id);

const getPaymentVouchers = () => supabase.from('payment_vouchers').select('*, supplier:suppliers(name)').order('created_at', { ascending: false });
const deletePaymentVoucher = (id: number) => supabase.from('payment_vouchers').delete().eq('id', id);

// Dashboard counts
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
    getSuppliers,
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
    getDashboardCounts
};
