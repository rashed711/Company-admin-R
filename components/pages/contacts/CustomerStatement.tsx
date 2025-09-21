
import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { AccountTransaction, Customer } from '../../../types';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import { mockCustomersData, mockCustomerTransactions } from '../../../services/mockData';

const CustomerStatement = () => {
  const { id } = useParams<{ id: string }>();
  const { config } = useAppSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const customerId = parseInt(id || '0');
  const customer = useMemo(() => mockCustomersData.find(c => c.id === customerId), [customerId]);

  const openingBalance = 0;
  
  const processedTransactions = useMemo(() => {
    // Sort chronologically first to calculate balance correctly
    const sortedChronologically = [...mockCustomerTransactions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    const transactionsWithBalance = sortedChronologically.reduce<AccountTransaction[]>((accumulator, currentTransaction) => {
      const previousBalance = accumulator.length > 0 ? accumulator[accumulator.length - 1].balance : openingBalance;
      const newBalance = previousBalance + currentTransaction.debit - currentTransaction.credit;
      
      accumulator.push({
        ...currentTransaction,
        balance: newBalance,
      });

      return accumulator;
    }, []);

    // Reverse for display (most recent first)
    return transactionsWithBalance.reverse();
  }, []);
  
  const columns: { header: string; accessor: keyof AccountTransaction; render?: (value: any, row: AccountTransaction) => React.ReactNode; }[] = [
    { header: t('time'), accessor: 'time' },
    { header: t('date'), accessor: 'date' },
    { header: t('description'), accessor: 'description' },
    { header: t('debit'), accessor: 'debit', render: (val: number) => val > 0 ? `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` : '-' },
    { header: t('credit'), accessor: 'credit', render: (val: number) => val > 0 ? `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` : '-' },
    { header: t('balance'), accessor: 'balance', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` },
  ];
  
  const getEditPath = (tx: AccountTransaction) => {
    switch (tx.source_type) {
        case 'invoice': return `/invoices/sales/${tx.source_id}/edit`;
        case 'receipt': return `/accounting/receipt-vouchers/${tx.source_id}/edit`;
        default: return '#';
    }
  };

  const actions = (row: AccountTransaction) => (
    <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
      <Button as={Link} to={getEditPath(row)} variant="outline" size="sm">{t('edit')}</Button>
    </div>
  );

  if (!customer) {
    return (
        <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Customer Not Found</h1>
            <Button as={Link} to="/contacts/customers" variant="primary">{t('back_to_list')}</Button>
        </div>
    );
  }


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">{t('account_statement')}</h1>
            <p className="text-gray-500">{t('statement_for_customer')}: {customer.name}</p>
        </div>
        <Button as={Link} to={`/contacts/customers/${customerId}/statement/view`} variant="primary">{t('view')}</Button>
      </div>
      <Table columns={columns} data={processedTransactions} onRowClick={(row) => navigate(getEditPath(row))} actions={actions} />
    </div>
  );
};

export default CustomerStatement;
