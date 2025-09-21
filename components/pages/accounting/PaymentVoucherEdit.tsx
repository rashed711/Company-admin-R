import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../services/localization';
import Button from '../../ui/Button';
import { PaymentVoucher } from '../../../types';
import { mockPaymentVouchersData, mockSuppliersData } from '../../../services/mockData';
import SearchableSelect from '../../ui/SearchableSelect';

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
        </label>
        <input
            {...props}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
    </div>
);

const PaymentVoucherEdit = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isNew = !id;

    const [voucher, setVoucher] = useState<Partial<PaymentVoucher> | null>(null);

    const sortedSuppliers = useMemo(() => 
        [...mockSuppliersData].sort((a, b) => a.name.localeCompare(b.name)),
        []
    );

    const supplierOptions = useMemo(() => sortedSuppliers.map(s => ({ value: s.id.toString(), label: s.name })), [sortedSuppliers]);

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
            const existingVoucher = mockPaymentVouchersData.find(v => v.id === voucherId);
            if (existingVoucher) {
                setVoucher(existingVoucher);
            } else {
                navigate('/accounting/payment-vouchers');
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
        navigate('/accounting/payment-vouchers');
    };

    if (!voucher) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{isNew ? t('new_payment_voucher') : `${t('edit')} سند الصرف #${id}`}</h1>
                 <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSave}>{t('save_changes')}</Button>
                    <Button as={Link} to="/accounting/payment-vouchers" variant="outline">{t('cancel')}</Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="supplier_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('supplier')}</label>
                        <SearchableSelect
                            options={supplierOptions}
                            value={voucher.supplier_id?.toString() || ''}
                            onChange={(value) => handleChange({ target: { name: 'supplier_id', value } } as ChangeEvent<HTMLSelectElement>)}
                            placeholder={t('select_supplier')}
                        />
                    </div>
                    <InputField label={t('date')} name="date" type="date" value={voucher.date} onChange={handleChange} />
                    <InputField label={t('amount')} name="amount" type="number" value={voucher.amount} onChange={handleChange} />
                    <div>
                        <label htmlFor="payment_method" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('payment_method')}</label>
                        <select id="payment_method" name="payment_method" value={voucher.payment_method} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                            <option value="cash">{t('cash')}</option>
                            <option value="bank_transfer">{t('bank_transfer')}</option>
                            <option value="cheque">{t('cheque')}</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                         <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('description')}</label>
                         <textarea id="description" name="description" value={voucher.description} onChange={handleChange} rows={4} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentVoucherEdit;