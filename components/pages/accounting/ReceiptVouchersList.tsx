import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReceiptVoucher } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { mockReceiptVouchersData } from '../../../services/mockData';

const ReceiptVouchersList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<ReceiptVoucher[]>(mockReceiptVouchersData);

  const sortedData = useMemo(() =>
    [...vouchers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [vouchers]
  );

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السند؟')) {
      setVouchers(prevVouchers => prevVouchers.filter(v => v.id !== id));
      // In a real app, you would also make an API call to delete the voucher from the database.
    }
  };

  const handleRowClick = (voucher: ReceiptVoucher) => {
    navigate(`/accounting/receipt-vouchers/${voucher.id}`);
  };

  const actions = (row: ReceiptVoucher) => (
    <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
      <Button as={Link} to={`/accounting/receipt-vouchers/${row.id}/edit`} variant="outline" size="sm">{t('edit')}</Button>
      <Button onClick={() => handleDelete(row.id)} variant="danger" size="sm">{t('delete')}</Button>
    </div>
  );

  const columns: { header: string; accessor: keyof ReceiptVoucher; render?: (value: any) => React.ReactNode; }[] = [
    { header: 'ID', accessor: 'id' },
    { header: t('time'), accessor: 'created_time' },
    { header: t('date'), accessor: 'date' },
    { header: t('customer'), accessor: 'customer_name' },
    { header: t('amount'), accessor: 'amount', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('payment_method'), accessor: 'payment_method', render: (val: string) => t(val as any) },
    { header: t('description'), accessor: 'description' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('receipt_vouchers')}</h1>
        <Button variant="primary">{t('new_receipt_voucher')}</Button>
      </div>
      <Table columns={columns} data={sortedData} actions={actions} onRowClick={handleRowClick} />
    </div>
  );
};

export default ReceiptVouchersList;