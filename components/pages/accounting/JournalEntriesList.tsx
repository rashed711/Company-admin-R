
import React from 'react';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';

interface JournalEntry {
    id: number;
    date: string;
    description: string;
    debit: number;
    credit: number;
}

const mockEntries: JournalEntry[] = [
    { id: 1, date: '2023-10-01', description: 'شراء مواد بناء', debit: 5000, credit: 5000 },
    { id: 2, date: '2023-10-05', description: 'دفع رواتب الموظفين', debit: 25000, credit: 25000 },
    { id: 3, date: '2023-10-15', description: 'تحصيل دفعة من العميل', debit: 10000, credit: 10000 },
];

const JournalEntriesList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();

  const columns: { header: string; accessor: keyof JournalEntry; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('entry_no'), accessor: 'id' },
    { header: t('date'), accessor: 'date' },
    { header: t('description'), accessor: 'description' },
    { header: t('debit'), accessor: 'debit', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('credit'), accessor: 'credit', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` },
  ];

  const actions = (row: JournalEntry) => (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Button variant="outline" size="sm">{t('view')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('journal_entries')}</h1>
        <Button variant="primary">{t('new_journal_entry')}</Button>
      </div>
      <Table columns={columns} data={mockEntries} actions={actions} />
    </div>
  );
};

export default JournalEntriesList;
