
import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Quotation, InvoiceItem } from '../../../types';
import { mockQuotationsData } from '../../../services/mockData';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { useTranslation } from '../../../services/localization';
import Button from '../../ui/Button';
import { XIcon } from '../../icons/Icons';

// A reusable input component for this page
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
        </label>
        <input
            {...props}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
        />
    </div>
);


const QuotationEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { config, taxRate } = useAppSettings();

    const [quotation, setQuotation] = useState<Quotation | null>(null);

    useEffect(() => {
        const quotationId = parseInt(id || '0');
        const originalQuotationData = mockQuotationsData.find(q => q.id === quotationId);
        
        if (originalQuotationData) {
            // This is a simplified calculation for display.
            // In a real app, you might re-calculate from items if `total` is not the source of truth.
            const subtotal = originalQuotationData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const taxAmount = subtotal * (taxRate / 100);
            
            setQuotation({
                ...originalQuotationData,
                subtotal: subtotal,
                tax_rate: taxRate,
                tax_amount: taxAmount,
                total: subtotal + taxAmount,
            });
        } else {
            navigate('/quotations');
        }
    }, [id, taxRate, navigate]);

    const { subtotal, taxAmount, total } = useMemo(() => {
        if (!quotation) return { subtotal: 0, taxAmount: 0, total: 0 };
        const currentSubtotal = quotation.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);
        const currentTaxAmount = currentSubtotal * (taxRate / 100);
        const currentTotal = currentSubtotal + currentTaxAmount;
        return { subtotal: currentSubtotal, taxAmount: currentTaxAmount, total: currentTotal };
    }, [quotation, taxRate]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (quotation) {
            setQuotation({ ...quotation, [name]: value });
        }
    };
    
    const handleItemChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        if (!quotation) return;
        const { name, value } = e.target;
        const newItems = [...quotation.items];
        const itemToUpdate = { ...newItems[index] };

        if(name === 'product_name') {
            itemToUpdate.product_name = value;
        } else if (name === 'quantity' || name === 'price') {
            itemToUpdate[name] = parseFloat(value) || 0;
        }
        itemToUpdate.total = itemToUpdate.quantity * itemToUpdate.price;
        newItems[index] = itemToUpdate;
        setQuotation({ ...quotation, items: newItems });
    };

    const handleAddItem = () => {
        if (!quotation) return;
        const newItem: InvoiceItem = {
            id: Date.now(), // temporary unique id
            product_id: 0,
            product_name: '',
            quantity: 1,
            price: 0,
            total: 0,
        };
        setQuotation({ ...quotation, items: [...quotation.items, newItem] });
    };

    const handleRemoveItem = (index: number) => {
        if (!quotation) return;
        const newItems = quotation.items.filter((_, i) => i !== index);
        setQuotation({ ...quotation, items: newItems });
    };

    const handleSave = () => {
        if (quotation) {
            // In a real app, you would send this to your backend/API
            console.log("Saving quotation:", { ...quotation, subtotal, taxAmount, total });
            alert('Changes saved (check console log).');
            // Here you might update your global state or mock data source
            navigate(`/quotations/${id}`);
        }
    };

    if (!quotation) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('edit_quotation')} #{quotation.id}</h1>
                <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSave}>{t('save_changes')}</Button>
                    <Button as={Link} to={`/quotations/${id}`} variant="outline">{t('cancel')}</Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
                {/* Quotation Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label={t('company_name')} name="company_name" value={quotation.company_name} onChange={handleInputChange} />
                    <InputField label={t('contact_person')} name="contact_person" value={quotation.contact_person} onChange={handleInputChange} />
                    <InputField label={t('issue_date')} name="issue_date" type="date" value={quotation.issue_date} onChange={handleInputChange} />
                    <InputField label={t('project_name')} name="project_name" value={quotation.project_name} onChange={handleInputChange} />
                    <InputField label={t('quotation_type')} name="quotation_type" value={quotation.quotation_type} onChange={handleInputChange} />
                </div>

                <hr className="dark:border-gray-600" />
                
                {/* Items */}
                <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-gray-600 dark:text-gray-300 px-2">
                        <div className="col-span-5">{t('description')}</div>
                        <div className="col-span-2">{t('quantity')}</div>
                        <div className="col-span-2">{t('price')}</div>
                        <div className="col-span-2">{t('total')}</div>
                        <div className="col-span-1"></div>
                    </div>
                    {quotation.items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5">
                                <input type="text" name="product_name" value={item.product_name} onChange={e => handleItemChange(index, e)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div className="col-span-2">
                                <input type="number" name="quantity" value={item.quantity} onChange={e => handleItemChange(index, e)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                             <div className="col-span-2">
                                <input type="number" name="price" value={item.price} onChange={e => handleItemChange(index, e)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                             <div className="col-span-2">
                                <p className="p-2.5 text-sm">{(item.quantity * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="col-span-1 text-center">
                                <Button variant="danger" size="sm" onClick={() => handleRemoveItem(index)} className="!p-1.5">
                                    <XIcon />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <Button variant="secondary" onClick={handleAddItem}>{t('add_item')}</Button>

                {/* Totals */}
                <div className="flex justify-end mt-4">
                    <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
                        <div className="flex justify-between"><span>{t('subtotal')}</span><span>{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                        <div className="flex justify-between"><span>{`${t('tax')} (${taxRate}%)`}</span><span>{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t-2 dark:border-gray-600"><span>{t('total')}</span><span>{`${total.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationEdit;