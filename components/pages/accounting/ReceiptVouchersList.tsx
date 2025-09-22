import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReceiptVoucher } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { getReceiptVouchers, deleteReceiptVoucher } from '../../../services/api';

const ReceiptVouchersList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVouchers = async () => {
    setIsLoading(true);
    const { data, error } = await getReceiptVouchers();
    if (data) {
      setVouchers(data);
    } else {
      alert(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السند؟')) {
      const { error } = await deleteReceiptVoucher(id);
      if (error) {
        alert(error.message);
      } else {
        setVouchers(prevVouchers => prevVouchers.filter(v => v.id !== id));
      }
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

  const columns: { header: string; accessor: string; render?: (value: any, row: any) => React.ReactNode; }[] = [
    { header: 'ID', accessor: 'id' },
    { header: t('time'), accessor: 'created_time' },
    { header: t('date'), accessor: 'date' },
    { header: t('customer'), accessor: 'customer', render: (val, row) => row.customer?.name || '-' },
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
      <Table columns={columns} data={vouchers} actions={actions} onRowClick={handleRowClick} isLoading={isLoading}/>
    </div>
  );
};

export default ReceiptVouchersList;