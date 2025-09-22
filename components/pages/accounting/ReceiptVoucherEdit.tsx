import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../services/localization';
import Button from '../../ui/Button';
import { ReceiptVoucher } from '../../../types';
import { mockReceiptVouchersData, mockCustomersData } from '../../../services/mockData';
import SearchableSelect from '../../ui/SearchableSelect';
import InputField from '../../ui/InputField';

const ReceiptVoucherEdit = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isNew = !id;

    const [voucher, setVoucher] = useState<Partial<ReceiptVoucher> | null>(null);

    const sortedCustomers = useMemo(() => 
        [...mockCustomersData].sort((a, b) => a.name.localeCompare(b.name)),
        []
    );
    
    const customerOptions = useMemo(() => sortedCustomers.map(c => ({ value: c.id.toString(), label: c.name })), [sortedCustomers]);

    useEffect(() => {
        if (isNew) {
            setVoucher({
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                payment_method: 'cash',
                description: '',
            });
        } else {
            const voucherId = parseInt(id);
            const existingVoucher = mockReceiptVouchersData.find(v => v.id === voucherId);
            if (existingVoucher) {
                setVoucher(existingVoucher);
            } else {
                navigate('/accounting/receipt-vouchers');
            }
        }
    }, [id, isNew, navigate]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!voucher) return;
        const { name, value } = e.target;
        setVoucher({ ...voucher, [name]: value });
    };

    const handleSave = () => {
        if (!voucher) return;
        // Add validation logic here
        console.log("Saving voucher:", voucher);
        alert("Voucher saved (check console).");
        navigate('/accounting/receipt-vouchers');
    };

    if (!voucher) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{isNew ? t('new_receipt_voucher') : `${t('edit')} سند القبض #${id}`}</h1>
                 <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSave}>{t('save_changes')}</Button>
                    <Button as={Link} to="/accounting/receipt-vouchers" variant="outline">{t('cancel')}</Button>
                </div>
            </div>

            <div className="bg-[rgb(var(--color-surface))] p-6 rounded-lg shadow-md space-y-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="customer_id" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">{t('customer')}</label>
                        <SearchableSelect
                            options={customerOptions}
                            value={voucher.customer_id?.toString() || ''}
                            onChange={(value) => handleChange({ target: { name: 'customer_id', value } } as ChangeEvent<HTMLSelectElement>)}
                            placeholder={t('select_customer')}
                        />
                    </div>
                    <InputField label={t('date')} name="date" type="date" value={voucher.date} onChange={handleChange} />
                    <InputField label={t('amount')} name="amount" type="number" value={voucher.amount} onChange={handleChange} />
                    <div>
                        <label htmlFor="payment_method" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">{t('payment_method')}</label>
                        <select id="payment_method" name="payment_method" value={voucher.payment_method} onChange={handleChange} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
                            <option value="cash">{t('cash')}</option>
                            <option value="bank_transfer">{t('bank_transfer')}</option>
                            <option value="cheque">{t('cheque')}</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                         <label htmlFor="description" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">{t('description')}</label>
                         <textarea id="description" name="description" value={voucher.description} onChange={handleChange} rows={4} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptVoucherEdit;