
import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Invoice, InvoiceItem } from '../../../types';
import { mockInvoicesData, mockProductsData, mockCustomersData } from '../../../services/mockData';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { useTranslation } from '../../../services/localization';
import Button from '../../ui/Button';
import { XIcon } from '../../icons/Icons';

const InvoiceEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { config, taxRate } = useAppSettings();
    const isNew = id === 'new' || id === undefined;

    const [invoice, setInvoice] = useState<Invoice | null>(null);

    useEffect(() => {
        if (isNew) {
            setInvoice({
                id: Date.now(),
                customer_id: 0,
                issue_date: new Date().toISOString().split('T')[0],
                due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                status: 'draft',
                items: [],
                paid_amount: 0,
                subtotal: 0,
                tax_rate: taxRate,
                tax_amount: 0,
                total: 0,
                created_at: new Date().toISOString(),
                created_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                is_taxable: true,
                discount_amount: 0,
                discount_type: 'amount',
                contact_person: '',
                project_name: '',
                invoice_type: '',
            });
        } else {
            const invoiceId = parseInt(id || '0');
            const originalData = mockInvoicesData.find(q => q.id === invoiceId);
            
            if (originalData) {
                setInvoice(originalData);
            } else {
                navigate('/invoices/sales');
            }
        }
    }, [id, isNew, taxRate, navigate]);

    const { itemsSubtotal, discountValue, subtotal, taxAmount, total } = useMemo(() => {
        if (!invoice) return { itemsSubtotal: 0, discountValue: 0, subtotal: 0, taxAmount: 0, total: 0 };
        
        const currentItemsSubtotal = invoice.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);
        
        const currentDiscountValue = invoice.discount_type === 'percentage' 
            ? currentItemsSubtotal * ((invoice.discount_amount || 0) / 100)
            : (invoice.discount_amount || 0);

        const currentSubtotal = currentItemsSubtotal - currentDiscountValue;

        const currentTaxAmount = invoice.is_taxable
            ? currentSubtotal * (taxRate / 100) 
            : 0;

        const currentTotal = currentSubtotal + currentTaxAmount;

        return { 
            itemsSubtotal: currentItemsSubtotal,
            discountValue: currentDiscountValue,
            subtotal: currentSubtotal, 
            taxAmount: currentTaxAmount, 
            total: currentTotal 
        };
    }, [invoice, taxRate]);

    const handleMainDocChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (invoice) {
            let val: string | number = value;
            if (type === 'number') {
                val = parseFloat(value) || 0;
            }
            setInvoice({ ...invoice, [name]: val });
        }
    };
    
    const handleItemChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        if (!invoice) return;
        const { name, value } = e.target;
        const newItems = [...invoice.items];
        const itemToUpdate = { ...newItems[index] };

        if(name === 'description' || name === 'unit') {
            itemToUpdate[name] = value;
        } else if (name === 'quantity' || name === 'price') {
            itemToUpdate[name] = parseFloat(value) || 0;
        }
        itemToUpdate.total = itemToUpdate.quantity * itemToUpdate.price;
        newItems[index] = itemToUpdate;
        setInvoice({ ...invoice, items: newItems });
    };

    const handleProductSelect = (index: number, productId: number) => {
        if (!invoice) return;
        const product = mockProductsData.find(p => p.id === productId);
        if (!product) return;

        const newItems = [...invoice.items];
        const itemToUpdate = { ...newItems[index] };

        itemToUpdate.product_id = product.id;
        itemToUpdate.product_name = product.name;
        itemToUpdate.description = product.description;
        itemToUpdate.unit = product.unit;
        itemToUpdate.price = product.price;
        itemToUpdate.total = itemToUpdate.quantity * product.price;
        
        newItems[index] = itemToUpdate;
        setInvoice({ ...invoice, items: newItems });
    };

    const handleAddItem = () => {
        if (!invoice) return;
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
        setInvoice({ ...invoice, items: [...invoice.items, newItem] });
    };

    const handleRemoveItem = (index: number) => {
        if (!invoice) return;
        const newItems = invoice.items.filter((_, i) => i !== index);
        setInvoice({ ...invoice, items: newItems });
    };

    const handleSave = () => {
        if (invoice) {
            const finalInvoice = { ...invoice, subtotal, tax_amount: taxAmount, total };
            console.log("Saving invoice:", finalInvoice);
            alert('Changes saved (check console log).');
            const targetId = isNew ? invoice.id : id;
            navigate(`/invoices/sales/${targetId}`);
        }
    };

    if (!invoice) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{isNew ? t('new_invoice') : `${t('edit_invoice')} #${invoice.id}`}</h1>
                <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSave}>{t('save_changes')}</Button>
                    <Button as={Link} to={isNew ? "/invoices/sales" : `/invoices/sales/${id}`} variant="outline">{t('cancel')}</Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="customer_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('customer')}</label>
                        <select id="customer_id" name="customer_id" value={invoice.customer_id} onChange={handleMainDocChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                            <option value="">{t('select_customer')}</option>
                            {mockCustomersData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <InputField label={t('contact_person')} name="contact_person" value={invoice.contact_person || ''} onChange={handleMainDocChange} />
                    <InputField label={t('project_name')} name="project_name" value={invoice.project_name || ''} onChange={handleMainDocChange} />
                    <InputField label={t('invoice_type')} name="invoice_type" value={invoice.invoice_type || ''} onChange={handleMainDocChange} />
                    <InputField label={t('issue_date')} name="issue_date" type="date" value={invoice.issue_date} onChange={handleMainDocChange} />
                    <InputField label={t('due_date')} name="due_date" type="date" value={invoice.due_date} onChange={handleMainDocChange} />
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
                    {invoice.items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-12 md:col-span-3"><select name="product_id" value={item.product_id || ''} onChange={e => handleProductSelect(index, parseInt(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option value="" disabled>{t('select_product')}</option>{mockProductsData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
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
                                <InputField label={t('discount')} name="discount_amount" type="number" value={invoice.discount_amount} onChange={handleMainDocChange} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="discount_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('discount_type')}</label>
                                <select id="discount_type" name="discount_type" value={invoice.discount_type} onChange={handleMainDocChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                                    <option value="amount">{t('amount_value')}</option>
                                    <option value="percentage">{t('percentage')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                                <input type="checkbox" name="is_taxable" checked={invoice.is_taxable} onChange={e => setInvoice({ ...invoice, is_taxable: e.target.checked })} className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">{t('apply_tax')}</span>
                            </label>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3">
                        <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex justify-between"><span>{t('subtotal_before_discount')}</span><span>{itemsSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            <div className="flex justify-between"><span>{t('discount')}</span><span>-{discountValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            <hr className="dark:border-gray-600"/>
                            <div className="flex justify-between font-semibold"><span>{t('subtotal')}</span><span>{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            {invoice.is_taxable && (
                                <div className="flex justify-between"><span>{`${t('tax')} (${taxRate}%)`}</span><span>{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            )}
                            <div className="flex justify-between font-bold text-lg pt-2 border-t-2 dark:border-gray-600"><span>{t('total')}</span><span>{`${total.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`}</span></div>
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


export default InvoiceEdit;
