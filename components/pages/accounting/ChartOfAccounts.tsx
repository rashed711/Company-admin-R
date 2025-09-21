
import React from 'react';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';

interface Account {
    id: number;
    number: string;
    name: string;
    type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
    balance: number;
}

const mockAccounts: Account[] = [
    { id: 1, number: '1010', name: 'الصندوق', type: 'asset', balance: 50000 },
    { id: 2, number: '1020', name: 'البنك', type: 'asset', balance: 250000 },
    { id: 3, number: '1110', name: 'العملاء', type: 'asset', balance: 75000 },
    { id: 4, number: '2010', name: 'الموردون', type: 'liability', balance: 45000 },
    { id: 5, number: '3010', name: 'رأس المال', type: 'equity', balance: 300000 },
    { id: 6, number: '4010', name: 'إيرادات المشاريع', type: 'revenue', balance: 120000 },
    { id: 7, number: '5010', name: 'مصاريف عمومية', type: 'expense', balance: 35000 },
];

const ChartOfAccounts = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();

  const columns: { header: string; accessor: keyof Account; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('account_number'), accessor: 'number' },
    { header: t('account_name'), accessor: 'name' },
    { header: t('account_type'), accessor: 'type', render: (val: string) => t(val as any) },
    { header: t('balance'), accessor: 'balance', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` },
  ];

  const actions = (row: Account) => (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Button variant="outline" size="sm">{t('edit')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('chart_of_accounts')}</h1>
        <Button variant="primary">{t('new_account')}</Button>
      </div>
      <Table columns={columns} data={mockAccounts} actions={actions} />
    </div>
  );
};

export default ChartOfAccounts;