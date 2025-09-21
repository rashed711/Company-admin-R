import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Quotation, InvoiceItem, LocaleKey } from '../../../types';
import { mockQuotationsData, mockProductsData, mockCustomersData } from '../../../services/mockData';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { useTranslation } from '../../../services/localization';
import Button from '../../ui/Button';
import { XIcon } from '../../icons/Icons';
import SearchableSelect from '../../ui/SearchableSelect';
import { LOCALES_CONFIG } from '../../../config';

const QuotationEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { taxRate: globalTaxRate, localeKey: globalLocaleKey } = useAppSettings();
    const isNew = id === 'new' || id === undefined;

    const [quotation, setQuotation] = useState<Quotation | null>(null);
    const [selectedLocaleKey, setSelectedLocaleKey] = useState<LocaleKey>(globalLocaleKey);

    const sortedCustomers = useMemo(() => 
        [...mockCustomersData].sort((a, b) => a.name.localeCompare(b.name)), 
        []
    );

    const sortedProducts = useMemo(() =>
        [...mockProductsData].sort((a, b) => a.name.localeCompare(b.name)),
        []
    );
    
    const customerOptions = useMemo(() => sortedCustomers.map(c => ({ value: c.id.toString(), label: c.name })), [sortedCustomers]);
    const productOptions = useMemo(() => sortedProducts.map(p => ({ value: p.id.toString(), label: p.name })), [sortedProducts]);

    useEffect(() => {
        if (isNew) {
            setQuotation({
                id: Date.now(),
                customer_id: 0,
                issue_date: new Date().toISOString().split('T')[0],
                status: 'draft',
                items: [],
                subtotal: 0,
                tax_rate: globalTaxRate,
                tax_amount: 0,
                total: 0,
                created_at: new Date().toISOString(),
                created_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                contact_person: '',
                project_name: '',
                quotation_type: '',
                is_taxable: true,
                discount_amount: 0,
                discount_type: 'amount',
            });
            setSelectedLocaleKey(globalLocaleKey);
        } else {
            const quotationId = parseInt(id || '0');
            const originalQuotationData = mockQuotationsData.find(q => q.id === quotationId);
            
            if (originalQuotationData) {
                setQuotation(originalQuotationData);
                const matchingLocale = Object.keys(LOCALES_CONFIG).find(key => 
                    LOCALES_CONFIG[key as LocaleKey].taxRate === originalQuotationData.tax_rate
                ) as LocaleKey | undefined;
                setSelectedLocaleKey(matchingLocale || globalLocaleKey);
            } else {
                navigate('/quotations');
            }
        }
    }, [id, isNew, globalTaxRate, globalLocaleKey, navigate]);

    const { itemsSubtotal, discountValue, subtotal, taxAmount, total } = useMemo(() => {
        if (!quotation) return { itemsSubtotal: 0, discountValue: 0, subtotal: 0, taxAmount: 0, total: 0 };
        
        const currentItemsSubtotal = quotation.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);
        
        const currentDiscountValue = quotation.discount_type === 'percentage' 
            ? currentItemsSubtotal * ((quotation.discount_amount || 0) / 100)
            : (quotation.discount_amount || 0);

        const currentSubtotal = currentItemsSubtotal - currentDiscountValue;

        const currentTaxAmount = quotation.is_taxable 
            ? currentSubtotal * (quotation.tax_rate / 100) 
            : 0;

        const currentTotal = currentSubtotal + currentTaxAmount;

        return { 
            itemsSubtotal: currentItemsSubtotal,
            discountValue: currentDiscountValue,
            subtotal: currentSubtotal, 
            taxAmount: currentTaxAmount, 
            total: currentTotal 
        };
    }, [quotation]);

    const handleMainDocChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (quotation) {
            let val: string | number | boolean = value;
            if (type === 'number') {
                val = parseFloat(value) || 0;
            }
             if (type === 'checkbox') {
                val = (e.target as HTMLInputElement).checked;
            }
            setQuotation({ ...quotation, [name]: val });
        }
    };

    const handleLocaleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newLocaleKey = e.target.value as LocaleKey;
        setSelectedLocaleKey(newLocaleKey);
        if (quotation) {
            const newConfig = LOCALES_CONFIG[newLocaleKey];
            setQuotation({ 
                ...quotation, 
                tax_rate: newConfig.taxRate 
            });
        }
    };
    
    const handleItemChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        if (!quotation) return;
        const { name, value } = e.target;
        const newItems = [...quotation.items];
        const itemToUpdate = { ...newItems[index] };

        if(name === 'description' || name === 'unit') {
            itemToUpdate[name] = value;
        } else if (name === 'quantity' || name === 'price') {
            itemToUpdate[name] = parseFloat(value) || 0;
        }
        itemToUpdate.total = itemToUpdate.quantity * itemToUpdate.price;
        newItems[index] = itemToUpdate;
        setQuotation({ ...quotation, items: newItems });
    };

    const handleProductSelect = (index: number, productIdStr: string) => {
        if (!quotation) return;
        const productId = parseInt(productIdStr);
        const product = mockProductsData.find(p => p.id === productId);
        if (!product) return;

        const newItems = [...quotation.items];
        const itemToUpdate = { ...newItems[index] };

        itemToUpdate.product_id = product.id;
        itemToUpdate.product_name = product.name;
        itemToUpdate.description = product.description;
        itemToUpdate.unit = product.unit;
        itemToUpdate.price = product.price;
        itemToUpdate.total = itemToUpdate.quantity * product.price;
        
        newItems[index] = itemToUpdate;
        setQuotation({ ...quotation, items: newItems });
    };

    const handleAddItem = () => {
        if (!quotation) return;
        const newItem: InvoiceItem = {
            id: Date.now(),
            product_id: 0,
            product_name: '',
            description: '',
            unit: '',
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
            const finalQuotation = { ...quotation, subtotal, tax_amount: taxAmount, total };
            console.log("Saving quotation:", finalQuotation);
            // Here you would typically replace the mock data or send it to an API
            alert('Changes saved (check console log).');
            const targetId = isNew ? quotation.id : id;
            navigate(`/quotations/${targetId}`);
        }
    };

    if (!quotation) {
        return <div className="text-center p-8">Loading...</div>;
    }

    const selectedConfig = LOCALES_CONFIG[selectedLocaleKey];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{isNew ? t('new_quotation') : `${t('edit_quotation')} #${quotation.id}`}</h1>
                <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSave}>{t('save_changes')}</Button>
                    <Button as={Link} to={isNew ? "/quotations" : `/quotations/${id}`} variant="outline">{t('cancel')}</Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="customer_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('customer')}</label>
                        <SearchableSelect
                            options={customerOptions}
                            value={quotation.customer_id.toString()}
                            onChange={(value) => handleMainDocChange({ target: { name: 'customer_id', value } } as ChangeEvent<HTMLSelectElement>)}
                            placeholder={t('select_customer')}
                        />
                    </div>
                    <InputField label={t('contact_person')} name="contact_person" value={quotation.contact_person} onChange={handleMainDocChange} />
                    <InputField label={t('project_name')} name="project_name" value={quotation.project_name} onChange={handleMainDocChange} />
                    <div>
                        <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('currency')}</label>
                        <select 
                            id="currency" 
                            name="currency" 
                            value={selectedLocaleKey} 
                            onChange={handleLocaleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                        >
                            {Object.keys(LOCALES_CONFIG).map(key => (
                                <option key={key} value={key}>{t(key as any)}</option>
                            ))}
                        </select>
                    </div>
                    <InputField label={t('quotation_type')} name="quotation_type" value={quotation.quotation_type} onChange={handleMainDocChange} />
                    <InputField label={t('issue_date')} name="issue_date" type="date" value={quotation.issue_date} onChange={handleMainDocChange} />
                </div>

                <hr className="dark:border-gray-600" />
                
                <div className="space-y-3">
                    <div className="hidden md:grid grid-cols-12 gap-2 font-semibold text-sm text-gray-600 dark:text-gray-300 px-2">
                        <div className="col-span-3">{t('product_name')}</div>
                        <div className="col-span-3">{t('description')}</div>
                        <div className="col-span-1">{t('unit')}</div>
                        <div className="col-span-1 text-center">{t('quantity')}</div>
                        <div className="col-span-2 text-end">{t('price')}</div>
                        <div className="col-span-1 text-end">{t('total')}</div>
                        <div className="col-span-1"></div>
                    </div>
                    {quotation.items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-12 md:col-span-3">
                                <SearchableSelect
                                    options={productOptions}
                                    value={item.product_id?.toString() || ''}
                                    onChange={(value) => handleProductSelect(index, value)}
                                    placeholder={t('select_product')}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3"><input type="text" name="description" value={item.description} onChange={e => handleItemChange(index, e)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                            <div className="col-span-4 md:col-span-1"><input type="text" name="unit" value={item.unit} onChange={e => handleItemChange(index, e)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                            <div className="col-span-4 md:col-span-1"><input type="number" name="quantity" value={item.quantity} onChange={e => handleItemChange(index, e)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                            <div className="col-span-4 md:col-span-2"><input type="number" name="price" value={item.price} onChange={e => handleItemChange(index, e)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-end" /></div>
                            <div className="col-span-8 md:col-span-1"><p className="p-2.5 text-sm text-end">{(item.quantity * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                            <div className="col-span-4 md:col-span-1 text-center"><Button variant="danger" size="sm" onClick={() => handleRemoveItem(index)} className="!p-1.5"><XIcon /></Button></div>
                        </div>
                    ))}
                </div>
                <Button variant="secondary" onClick={handleAddItem}>{t('add_item')}</Button>
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="w-full md:w-1/3">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1">
                                <InputField label={t('discount')} name="discount_amount" type="number" value={quotation.discount_amount} onChange={handleMainDocChange} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="discount_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('discount_type')}</label>
                                <select id="discount_type" name="discount_type" value={quotation.discount_type} onChange={handleMainDocChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                                    <option value="amount">{t('amount_value')}</option>
                                    <option value="percentage">{t('percentage')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                                <input type="checkbox" name="is_taxable" checked={quotation.is_taxable} onChange={handleMainDocChange} className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">{`${t('apply_tax')} (${quotation.tax_rate}%)`}</span>
                            </label>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3">
                        <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex justify-between"><span>{t('subtotal_before_discount')}</span><span>{itemsSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            <div className="flex justify-between"><span>{t('discount')}</span><span>-{discountValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            <hr className="dark:border-gray-600"/>
                            <div className="flex justify-between font-semibold"><span>{t('subtotal')}</span><span>{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            {quotation.is_taxable && (
                                <div className="flex justify-between"><span>{`${t('tax')} (${quotation.tax_rate}%)`}</span><span>{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            )}
                            <div className="flex justify-between font-bold text-lg pt-2 border-t-2 dark:border-gray-600"><span>{t('total')}</span><span>{`${total.toLocaleString(undefined, {minimumFractionDigits: 2})} ${selectedConfig.currencySymbol}`}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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

export default QuotationEdit;