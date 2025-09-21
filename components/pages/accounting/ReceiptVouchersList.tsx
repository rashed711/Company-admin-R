
import React from 'react';
import { ReceiptVoucher } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';

// Mock data
const mockData: ReceiptVoucher[] = [
  { id: 1, customer_id: 1, customer_name: 'شركة المشاريع الحديثة', date: '2023-10-20', amount: 10000, payment_method: 'bank_transfer', description: 'دفعة من حساب فاتورة #101', created_at: '' },
  { id: 2, customer_id: 2, customer_name: 'مؤسسة البناء الأولى', date: '2023-10-22', amount: 8625, payment_method: 'cheque', description: 'سداد كامل فاتورة #102', created_at: '' },
];

const ReceiptVouchersList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();

  const columns: { header: string; accessor: keyof ReceiptVoucher; render?: (value: any) => React.ReactNode; }[] = [
    { header: 'ID', accessor: 'id' },
    { header: t('date'), accessor: 'date' },
    { header: t('customer'), accessor: 'customer_name' },
    { header: t('amount'), accessor: 'amount', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('payment_method'), accessor: 'payment_method', render: (val: string) => t(val as any) },
    { header: t('description'), accessor: 'description' },
  ];

  const actions = (row: ReceiptVoucher) => (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Button variant="outline" size="sm">{t('view')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('receipt_vouchers')}</h1>
        <Button variant="primary">{t('new_receipt_voucher')}</Button>
      </div>
      <Table columns={columns} data={mockData} actions={actions} />
    </div>
  );
};

export default ReceiptVouchersList;
