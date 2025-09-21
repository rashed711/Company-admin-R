
import React from 'react';
import { SupplierInvoice } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';

const calculateTotals = (total: number, taxRate: number) => {
    const subtotal = total / (1 + taxRate / 100);
    const taxAmount = total - subtotal;
    return { subtotal, taxAmount };
}

// Mock data
const mockInvoices: Omit<SupplierInvoice, 'subtotal' | 'tax_rate' | 'tax_amount'>[] = [
  { id: 1, supplier_id: 1, supplier_name: 'مورد مواد البناء', issue_date: '2023-09-25', due_date: '2023-10-25', status: 'paid', total: 34500, paid_amount: 34500, items: [], created_at: '' },
  { id: 2, supplier_id: 2, supplier_name: 'شركة الأجهزة الكهربائية', issue_date: '2023-10-02', due_date: '2023-11-02', status: 'unpaid', total: 14375, paid_amount: 0, items: [], created_at: '' },
  { id: 3, supplier_id: 1, supplier_name: 'مورد مواد البناء', issue_date: '2023-10-11', due_date: '2023-11-11', status: 'partially_paid', total: 51750, paid_amount: 20000, items: [], created_at: '' },
];

const SupplierInvoicesList = () => {
  const { config, taxRate } = useAppSettings();
  const { t } = useTranslation();

  const processedInvoices: SupplierInvoice[] = mockInvoices.map(inv => {
    const { subtotal, taxAmount } = calculateTotals(inv.total, taxRate);
    return { ...inv, subtotal, tax_rate: taxRate, tax_amount: taxAmount };
  });

  const columns: { header: string; accessor: keyof SupplierInvoice; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('invoice_no'), accessor: 'id' },
    { header: t('supplier'), accessor: 'supplier_name' },
    { header: t('issue_date'), accessor: 'issue_date' },
    { header: t('subtotal'), accessor: 'subtotal', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('tax'), accessor: 'tax_amount', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('total'), accessor: 'total', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('status'), accessor: 'status', render: (val: string) => {
        const statusMap: {[key: string]: string} = {
            unpaid: 'bg-red-200 text-red-800',
            paid: 'bg-green-200 text-green-800',
            partially_paid: 'bg-yellow-200 text-yellow-800',
        };
        return <span className={`px-2 py-1 rounded-full text-sm ${statusMap[val]}`}>{t(val as any)}</span>;
    }},
  ];

  const actions = (row: SupplierInvoice) => (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Button variant="outline" size="sm">{t('view')}</Button>
      <Button variant="primary" size="sm">{t('record_payment')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('purchase_invoices')}</h1>
        <Button variant="primary">{t('new_supplier_invoice')}</Button>
      </div>
      <Table columns={columns} data={processedInvoices} actions={actions} />
    </div>
  );
};

export default SupplierInvoicesList;
