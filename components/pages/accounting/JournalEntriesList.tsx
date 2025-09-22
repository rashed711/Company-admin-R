
import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { JournalEntry } from '../../../types';
import { getJournalEntries } from '../../../services/api';

const JournalEntriesList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      const { data, error } = await getJournalEntries();
      if (data) {
        setEntries(data);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };
    fetchEntries();
  }, []);
  
  const columns: { header: string; accessor: string; render?: (value: any, row: JournalEntry) => React.ReactNode; }[] = [
    { header: t('entry_no'), accessor: 'id' },
    { header: t('time'), accessor: 'created_time' },
    { header: t('date'), accessor: 'date' },
    { header: t('description'), accessor: 'description' },
    { header: t('debit'), accessor: 'total_debit', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('credit'), accessor: 'total_credit', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('journal_entries')}</h1>
        <Button as={Link} to="/accounting/journal-entries/new" variant="primary">{t('new_journal_entry')}</Button>
      </div>
      <Table columns={columns} data={entries} isLoading={isLoading} />
    </div>
  );
};

export default JournalEntriesList;