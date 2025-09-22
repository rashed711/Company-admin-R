
import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { JournalEntry, JournalEntryItem, ChartOfAccount } from '../../../types';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { useTranslation } from '../../../services/localization';
import Button from '../../ui/Button';
import { XIcon } from '../../icons/Icons';
import SearchableSelect from '../../ui/SearchableSelect';
import InputField from '../../ui/InputField';
import { getChartOfAccounts, addJournalEntry } from '../../../services/api';
import TextareaField from '../../ui/TextareaField';

const JournalEntryEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { config } = useAppSettings();
    const isNew = !id;
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [entry, setEntry] = useState<Partial<JournalEntry>>({
        date: new Date().toISOString().split('T')[0],
        description: '',
        items: [
            { account_id: 0, debit: 0, credit: 0 },
            { account_id: 0, debit: 0, credit: 0 },
        ],
    });
    const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);

    const accountOptions = useMemo(() => accounts.map(a => ({ value: a.id.toString(), label: a.name })), [accounts]);

    useEffect(() => {
        const loadInitialData = async () => {
            const { data: accountsData, error } = await getChartOfAccounts();
            if (accountsData) {
                setAccounts(accountsData);
            } else {
                alert(error?.message);
            }
            // Logic for editing an existing entry can be added here
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    const { totalDebit, totalCredit, difference } = useMemo(() => {
        if (!entry.items) return { totalDebit: 0, totalCredit: 0, difference: 0 };
        const debit = entry.items.reduce((sum, item) => sum + Number(item.debit), 0);
        const credit = entry.items.reduce((sum, item) => sum + Number(item.credit), 0);
        return { totalDebit: debit, totalCredit: credit, difference: debit - credit };
    }, [entry.items]);

    const handleMainChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEntry(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: 'account_id' | 'debit' | 'credit', value: string) => {
        if (!entry.items) return;
        const newItems = [...entry.items];
        const item = { ...newItems[index] };
        
        if (field === 'account_id') {
            item.account_id = parseInt(value) || 0;
        } else {
            const numValue = parseFloat(value) || 0;
            item[field] = numValue;
            // Ensure only one of debit/credit has a value
            if (field === 'debit' && numValue > 0) item.credit = 0;
            if (field === 'credit' && numValue > 0) item.debit = 0;
        }

        newItems[index] = item;
        setEntry(prev => ({ ...prev, items: newItems }));
    };

    const handleAddItem = () => {
        if (!entry.items) return;
        setEntry(prev => ({ ...prev, items: [...(prev.items || []), { account_id: 0, debit: 0, credit: 0 }] }));
    };

    const handleRemoveItem = (index: number) => {
        if (!entry.items) return;
        const newItems = entry.items.filter((_, i) => i !== index);
        setEntry(prev => ({ ...prev, items: newItems }));
    };

    const handleSave = async () => {
        if (difference !== 0) {
            alert('Total debit must equal total credit.');
            return;
        }
        if (!entry.items || entry.items.length < 2) {
            alert('A journal entry must have at least two lines.');
            return;
        }
        
        setIsSaving(true);
        const { error } = await addJournalEntry(entry);
        setIsSaving(false);
        
        if (error) {
            alert(error.message);
        } else {
            alert('Journal entry saved successfully!');
            navigate('/accounting/journal-entries');
        }
    };
    
    if (isLoading) return <div className="text-center p-8">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{isNew ? t('new_journal_entry') : t('edit')}</h1>
                <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSave} disabled={isSaving || difference !== 0}>
                        {isSaving ? '...' : t('save_changes')}
                    </Button>
                    <Button as={Link} to="/accounting/journal-entries" variant="outline">{t('cancel')}</Button>
                </div>
            </div>

            <div className="bg-[rgb(var(--color-surface))] p-6 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <InputField label={t('date')} name="date" type="date" value={entry.date} onChange={handleMainChange} />
                    <div className="md:col-span-3">
                        <TextareaField label={t('description')} name="description" value={entry.description} onChange={handleMainChange} rows={1} />
                    </div>
                </div>

                <hr className="border-[rgb(var(--color-border))]" />

                <div className="space-y-3">
                    <div className="hidden md:grid grid-cols-12 gap-3 font-semibold text-sm text-[rgb(var(--color-text-secondary))] px-2">
                        <div className="col-span-5">{t('account_name')}</div>
                        <div className="col-span-3 text-end">{t('debit')}</div>
                        <div className="col-span-3 text-end">{t('credit')}</div>
                        <div className="col-span-1"></div>
                    </div>
                    {entry.items?.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-12 md:col-span-5">
                                <SearchableSelect
                                    options={accountOptions}
                                    value={item.account_id?.toString() || ''}
                                    onChange={(value) => handleItemChange(index, 'account_id', value)}
                                    placeholder={t('select_product')}
                                />
                            </div>
                            <div className="col-span-6 md:col-span-3">
                                <input type="number" value={item.debit} onChange={e => handleItemChange(index, 'debit', e.target.value)} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 text-end" />
                            </div>
                            <div className="col-span-6 md:col-span-3">
                                <input type="number" value={item.credit} onChange={e => handleItemChange(index, 'credit', e.target.value)} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 text-end" />
                            </div>
                            <div className="col-span-12 md:col-span-1 text-center">
                                <Button variant="danger" size="sm" onClick={() => handleRemoveItem(index)} className="!p-1.5" disabled={(entry.items?.length ?? 0) <= 2}>
                                    <XIcon />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <Button variant="secondary" onClick={handleAddItem}>{t('add_item')}</Button>

                <div className="flex justify-end mt-4">
                    <div className="w-full md:w-1/3">
                        <div className="space-y-2 p-4 bg-[rgb(var(--color-muted))] rounded-lg">
                            <div className="flex justify-between font-semibold"><span>{t('debit')}</span><span>{totalDebit.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            <div className="flex justify-between font-semibold"><span>{t('credit')}</span><span>{totalCredit.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                             <hr className="border-[rgb(var(--color-border))]" />
                             <div className={`flex justify-between font-bold text-lg ${difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{t('balance')}</span>
                                <span>{difference.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalEntryEdit;