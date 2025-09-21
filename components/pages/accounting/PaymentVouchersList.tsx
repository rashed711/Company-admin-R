
import React from 'react';
import { PaymentVoucher } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';

// Mock data
const mockData: PaymentVoucher[] = [
  { id: 1, supplier_id: 1, supplier_name: 'مورد مواد البناء', date: '2023-10-25', amount: 20000, payment_method: 'bank_transfer', description: 'دفعة لفاتورة المورد #3', created_at: '' },
  { id: 2, supplier_id: 2, supplier_name: 'شركة الأجهزة الكهربائية', date: '2023-10-28', amount: 5000, payment_method: 'cash', description: 'مصاريف نثرية', created_at: '' },
];

const PaymentVouchersList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();

  const columns: { header: string; accessor: keyof PaymentVoucher; render?: (value: any) => React.ReactNode; }[] = [
    { header: 'ID', accessor: 'id' },
    { header: t('date'), accessor: 'date' },
    { header: t('supplier'), accessor: 'supplier_name' },
    { header: t('amount'), accessor: 'amount', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('payment_method'), accessor: 'payment_method', render: (val: string) => t(val as any) },
    { header: t('description'), accessor: 'description' },
  ];

  const actions = (row: PaymentVoucher) => (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Button variant="outline" size="sm">{t('view')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('payment_vouchers')}</h1>
        <Button variant="primary">{t('new_payment_voucher')}</Button>
      </div>
      <Table columns={columns} data={mockData} actions={actions} />
    </div>
  );
};

export default PaymentVouchersList;
