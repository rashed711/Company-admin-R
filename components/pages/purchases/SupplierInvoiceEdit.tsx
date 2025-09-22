import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SupplierInvoice, SupplierInvoiceItem, LocaleKey, Product, Supplier } from '../../../types';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { useTranslation } from '../../../services/localization';
import Button from '../../ui/Button';
import { XIcon } from '../../icons/Icons';
import SearchableSelect from '../../ui/SearchableSelect';
import { LOCALES_CONFIG } from '../../../config';
import InputField from '../../ui/InputField';
import { getSupplierInvoiceById, addSupplierInvoice, updateSupplierInvoice, getProducts, getSuppliers } from '../../../services/api';

const SupplierInvoiceEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { taxRate: globalTaxRate, localeKey: globalLocaleKey } = useAppSettings();
    const isNew = id === 'new' || id === undefined;
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);

    const [invoice, setInvoice] = useState<Partial<SupplierInvoice> | null>(null);
    const [selectedLocaleKey, setSelectedLocaleKey] = useState<LocaleKey>(globalLocaleKey);
    const [products, setProducts] = useState<Product[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const supplierOptions = useMemo(() => suppliers.map(s => ({ value: s.id.toString(), label: s.name })), [suppliers]);
    const productOptions = useMemo(() => products.map(p => ({ value: p.id.toString(), label: p.name })), [products]);

    useEffect(() => {
        const loadInitialData = async () => {
            const [{ data: productsData }, { data: suppliersData }] = await Promise.all([getProducts(), getSuppliers()]);
            if (productsData) setProducts(productsData.sort((a, b) => a.name.localeCompare(b.name)));
            if (suppliersData) setSuppliers(suppliersData.sort((a, b) => a.name.localeCompare(b.name)));

            if (isNew) {
                setInvoice({
                    supplier_id: undefined,
                    issue_date: new Date().toISOString().split('T')[0],
                    due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                    status: 'unpaid',
                    items: [],
                    paid_amount: 0,
                    tax_rate: globalTaxRate,
                    is_taxable: true,
                    discount_amount: 0,
                    discount_type: 'amount',
                    contact_person: '',
                    project_name: '',
                    supplier_invoice_type: '',
                });
                setSelectedLocaleKey(globalLocaleKey);
            } else {
                const invoiceId = parseInt(id || '0');
                const { data, error } = await getSupplierInvoiceById(invoiceId);
                if (data) {
                    setInvoice({ ...data, items: data.items || [] });
                    const matchingLocale = Object.keys(LOCALES_CONFIG).find(key => 
                        LOCALES_CONFIG[key as LocaleKey].taxRate === data.tax_rate
                    ) as LocaleKey | undefined;
                    setSelectedLocaleKey(matchingLocale || globalLocaleKey);
                } else {
                    alert(error?.message);
                    navigate('/invoices/purchases');
                }
            }
            setIsLoading(false);
        };
        loadInitialData();
    }, [id, isNew, globalTaxRate, globalLocaleKey, navigate]);

    const { itemsSubtotal, discountValue, subtotal, taxAmount, total } = useMemo(() => {
        if (!invoice || !invoice.items) return { itemsSubtotal: 0, discountValue: 0, subtotal: 0, taxAmount: 0, total: 0 };
        
        const currentItemsSubtotal = invoice.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);
        const currentDiscountValue = invoice.discount_type === 'percentage' 
            ? currentItemsSubtotal * ((invoice.discount_amount || 0) / 100)
            : (invoice.discount_amount || 0);
        const currentSubtotal = currentItemsSubtotal - currentDiscountValue;
        const currentTaxAmount = invoice.is_taxable ? currentSubtotal * ((invoice.tax_rate || 0) / 100) : 0;
        const currentTotal = currentSubtotal + currentTaxAmount;

        return { itemsSubtotal: currentItemsSubtotal, discountValue: currentDiscountValue, subtotal: currentSubtotal, taxAmount: currentTaxAmount, total: currentTotal };
    }, [invoice]);

    const handleMainDocChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (invoice) {
            let val: string | number | boolean = value;
            if (name === 'supplier_id') val = parseInt(value);
            if (type === 'number') val = parseFloat(value) || 0;
            if (type === 'checkbox') val = (e.target as HTMLInputElement).checked;
            setInvoice({ ...invoice, [name]: val });
        }
    };
    
    const handleLocaleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newLocaleKey = e.target.value as LocaleKey;
        setSelectedLocaleKey(newLocaleKey);
        if (invoice) {
            const newConfig = LOCALES_CONFIG[newLocaleKey];
            setInvoice({ ...invoice, tax_rate: newConfig.taxRate });
        }
    };

    const handleItemChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        if (!invoice || !invoice.items) return;
        const { name, value } = e.target;
        const newItems = [...invoice.items];
        const itemToUpdate = { ...newItems[index] };

        if(['description', 'unit', 'product_name'].includes(name)) {
            (itemToUpdate as any)[name] = value;
        } else if (['quantity', 'price'].includes(name)) {
            (itemToUpdate as any)[name] = parseFloat(value) || 0;
        }
        itemToUpdate.total = itemToUpdate.quantity * itemToUpdate.price;
        newItems[index] = itemToUpdate;
        setInvoice({ ...invoice, items: newItems });
    };

    const handleProductSelect = (index: number, productIdStr: string) => {
        if (!invoice || !invoice.items) return;
        const productId = parseInt(productIdStr);
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const newItems = [...invoice.items];
        const itemToUpdate = { ...newItems[index] };

        itemToUpdate.product_id = product.id;
        itemToUpdate.product_name = product.name;
        itemToUpdate.description = product.description;
        itemToUpdate.unit = product.unit;
        itemToUpdate.price = product.avg_purchase_price;
        itemToUpdate.total = itemToUpdate.quantity * product.avg_purchase_price;
        
        newItems[index] = itemToUpdate;
        setInvoice({ ...invoice, items: newItems });
    };

    const handleAddItem = () => {
        if (!invoice || !invoice.items) return;
        const newItem: SupplierInvoiceItem = {
            id: Date.now(), product_id: 0, product_name: '', description: '', unit: '', quantity: 1, price: 0, total: 0,
        };
        setInvoice({ ...invoice, items: [...invoice.items, newItem] });
    };

    const handleRemoveItem = (index: number) => {
        if (!invoice || !invoice.items) return;
        const newItems = invoice.items.filter((_, i) => i !== index);
        setInvoice({ ...invoice, items: newItems });
    };

    const handleSave = async () => {
        if (!invoice || !invoice.supplier_id) {
            alert("Please select a supplier.");
            return;
        }
        setIsSaving(true);
        const finalInvoice = { ...invoice, subtotal, tax_amount: taxAmount, total };
        
        const { error } = isNew
            ? await addSupplierInvoice(finalInvoice)
            : await updateSupplierInvoice(parseInt(id!), finalInvoice);
        
        setIsSaving(false);
        if (error) {
            alert(error.message);
        } else {
            alert('Supplier invoice saved successfully!');
            navigate('/invoices/purchases');
        }
    };

    if (isLoading || !invoice) {
        return <div className="text-center p-8">Loading...</div>;
    }
    
    const selectedConfig = LOCALES_CONFIG[selectedLocaleKey];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{isNew ? t('new_supplier_invoice') : `${t('edit_supplier_invoice')} #${invoice.id}`}</h1>
                <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSave} disabled={isSaving}>{isSaving ? t('converting') : t('save_changes')}</Button>
                    <Button as={Link} to={isNew ? "/invoices/purchases" : `/invoices/purchases/${id}`} variant="outline">{t('cancel')}</Button>
                </div>
            </div>

            <div className="bg-[rgb(var(--color-surface))] p-6 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="supplier_id" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">{t('supplier')}</label>
                        <SearchableSelect
                            options={supplierOptions}
                            value={invoice.supplier_id?.toString() || ''}
                            onChange={(value) => handleMainDocChange({ target: { name: 'supplier_id', value } } as ChangeEvent<HTMLSelectElement>)}
                            placeholder={t('select_supplier')}
                        />
                    </div>
                    <InputField label={t('contact_person')} name="contact_person" value={invoice.contact_person || ''} onChange={handleMainDocChange} />
                    <InputField label={t('project_name')} name="project_name" value={invoice.project_name || ''} onChange={handleMainDocChange} />
                     <div>
                        <label htmlFor="currency" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">{t('currency')}</label>
                        <select 
                            id="currency" 
                            name="currency" 
                            value={selectedLocaleKey} 
                            onChange={handleLocaleChange}
                            className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                        >
                            {Object.keys(LOCALES_CONFIG).map(key => (
                                <option key={key} value={key}>{t(key as any)}</option>
                            ))}
                        </select>
                    </div>
                    <InputField label={t('invoice_type')} name="supplier_invoice_type" value={invoice.supplier_invoice_type || ''} onChange={handleMainDocChange} />
                    <InputField label={t('issue_date')} name="issue_date" type="date" value={invoice.issue_date} onChange={handleMainDocChange} />
                    <InputField label={t('due_date')} name="due_date" type="date" value={invoice.due_date} onChange={handleMainDocChange} />
                </div>

                <hr className="border-[rgb(var(--color-border))]" />
                
                <div className="space-y-3">
                    <div className="hidden md:grid grid-cols-12 gap-2 font-semibold text-sm text-[rgb(var(--color-text-secondary))] px-2">
                        <div className="col-span-3">{t('product_name')}</div>
                        <div className="col-span-3">{t('description')}</div>
                        <div className="col-span-1">{t('unit')}</div>
                        <div className="col-span-1 text-center">{t('quantity')}</div>
                        <div className="col-span-2 text-end">{t('price')}</div>
                        <div className="col-span-1 text-end">{t('total')}</div>
                        <div className="col-span-1"></div>
                    </div>
                    {invoice.items?.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-12 md:col-span-3">
                                 <SearchableSelect
                                    options={productOptions}
                                    value={item.product_id?.toString() || ''}
                                    onChange={(value) => handleProductSelect(index, value)}
                                    placeholder={t('select_product')}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3"><input type="text" name="description" value={item.description} onChange={e => handleItemChange(index, e)} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5" /></div>
                            <div className="col-span-4 md:col-span-1"><input type="text" name="unit" value={item.unit} onChange={e => handleItemChange(index, e)} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5" /></div>
                            <div className="col-span-4 md:col-span-1"><input type="number" name="quantity" value={item.quantity} onChange={e => handleItemChange(index, e)} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5" /></div>
                            <div className="col-span-4 md:col-span-2"><input type="number" name="price" value={item.price} onChange={e => handleItemChange(index, e)} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 text-end" /></div>
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
                                <InputField label={t('discount')} name="discount_amount" type="number" value={invoice.discount_amount} onChange={handleMainDocChange} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="discount_type" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">{t('discount_type')}</label>
                                <select id="discount_type" name="discount_type" value={invoice.discount_type} onChange={handleMainDocChange} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
                                    <option value="amount">{t('amount_value')}</option>
                                    <option value="percentage">{t('percentage')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                                <input type="checkbox" name="is_taxable" checked={invoice.is_taxable} onChange={handleMainDocChange} className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">{`${t('apply_tax')} (${invoice.tax_rate}%)`}</span>
                            </label>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3">
                        <div className="space-y-2 p-4 bg-[rgb(var(--color-muted))] rounded-lg">
                           <div className="flex justify-between"><span>{t('subtotal_before_discount')}</span><span>{itemsSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            <div className="flex justify-between"><span>{t('discount')}</span><span>-{discountValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            <hr className="border-[rgb(var(--color-border))]" />
                            <div className="flex justify-between font-semibold"><span>{t('subtotal')}</span><span>{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            {invoice.is_taxable && (
                                <div className="flex justify-between"><span>{`${t('tax')} (${invoice.tax_rate}%)`}</span><span>{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            )}
                            <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-[rgb(var(--color-border))]"><span>{t('total')}</span><span>{`${total.toLocaleString(undefined, {minimumFractionDigits: 2})} ${selectedConfig.currencySymbol}`}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierInvoiceEdit;