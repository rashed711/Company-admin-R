import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PaymentVoucher } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { getPaymentVouchers, deletePaymentVoucher } from '../../../services/api';

const PaymentVouchersList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVouchers = async () => {
    setIsLoading(true);
    const { data, error } = await getPaymentVouchers();
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
      const { error } = await deletePaymentVoucher(id);
      if (error) {
        alert(error.message);
      } else {
        setVouchers(prevVouchers => prevVouchers.filter(v => v.id !== id));
      }
    }
  };

  const handleRowClick = (voucher: PaymentVoucher) => {
    navigate(`/accounting/payment-vouchers/${voucher.id}`);
  };

  const actions = (row: PaymentVoucher) => (
    <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
      <Button as={Link} to={`/accounting/payment-vouchers/${row.id}/edit`} variant="outline" size="sm">{t('edit')}</Button>
      <Button onClick={() => handleDelete(row.id)} variant="danger" size="sm">{t('delete')}</Button>
    </div>
  );

  const columns: { header: string; accessor: string; render?: (value: any, row: any) => React.ReactNode; }[] = [
    { header: 'ID', accessor: 'id' },
    { header: t('time'), accessor: 'created_time' },
    { header: t('date'), accessor: 'date' },
    { header: t('supplier'), accessor: 'supplier', render: (val, row) => row.supplier?.name || '-' },
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
      <Table columns={columns} data={vouchers} actions={actions} onRowClick={handleRowClick} isLoading={isLoading} />
    </div>
  );
};

export default PaymentVouchersList;