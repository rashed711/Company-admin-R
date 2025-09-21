
import React from 'react';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { JournalEntry } from '../../../types';
import { mockJournalEntriesData } from '../../../services/mockData';

const JournalEntriesList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();

  const columns: { header: string; accessor: keyof JournalEntry; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('entry_no'), accessor: 'id' },
    { header: t('date'), accessor: 'date' },
    { header: t('time'), accessor: 'time' },
    { header: t('description'), accessor: 'description' },
    { header: t('debit'), accessor: 'debit', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('credit'), accessor: 'credit', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('journal_entries')}</h1>
        <Button variant="primary">{t('new_journal_entry')}</Button>
      </div>
      <Table columns={columns} data={mockJournalEntriesData} />
    </div>
  );
};

export default JournalEntriesList;