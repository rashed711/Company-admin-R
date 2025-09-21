
import React from 'react';
import { PaymentVoucher } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { mockPaymentVouchersData } from '../../../services/mockData';

const PaymentVouchersList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();

  const columns: { header: string; accessor: keyof PaymentVoucher; render?: (value: any) => React.ReactNode; }[] = [
    { header: 'ID', accessor: 'id' },
    { header: t('date'), accessor: 'date' },
    { header: t('time'), accessor: 'created_time' },
    { header: t('supplier'), accessor: 'supplier_name' },
    { header: t('amount'), accessor: 'amount', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('payment_method'), accessor: 'payment_method', render: (val: string) => t(val as any) },
    { header: t('description'), accessor: 'description' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('payment_vouchers')}</h1>
        <Button variant="primary">{t('new_payment_voucher')}</Button>
      </div>
      <Table columns={columns} data={mockPaymentVouchersData} />
    </div>
  );
};

export default PaymentVouchersList;
