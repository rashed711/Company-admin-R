
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DocumentViewer from '../../shared/DocumentViewer';
import { mockInvoicesData } from '../../../services/mockData';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { Invoice } from '../../../types';

const calculateTotals = (total: number, taxRate: number) => {
    const subtotal = total / (1 + taxRate / 100);
    const taxAmount = total - subtotal;
    return { subtotal, taxAmount };
}

const InvoiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { config, companyInfo, salesInvoiceTemplate, taxRate } = useAppSettings();

    const invoiceData = mockInvoicesData.find(q => q.id === parseInt(id || '0'));

    if (!invoiceData) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold mb-4">Invoice Not Found</h1>
                <Button as={Link} to="/invoices/sales" variant="primary">{t('back_to_list')}</Button>
            </div>
        );
    }
    
    const { subtotal, taxAmount } = calculateTotals(invoiceData.total, taxRate);
    const processedInvoice: Invoice = {
        ...invoiceData,
        customer_name: config.language === 'ar' ? (invoiceData.id === 101 ? 'شركة المشاريع الحديثة' : 'مؤسسة البناء الأولى') : invoiceData.customer_name,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <h1 className="text-3xl font-bold">{t('invoice_details')}</h1>
                <div className="space-x-2 rtl:space-x-reverse">
                  <Button variant="secondary" onClick={() => window.print()}>{t('print_document')}</Button>
                  <Button as={Link} to="/invoices/sales" variant="outline">{t('back_to_list')}</Button>
                </div>
            </div>
            <DocumentViewer 
                document={processedInvoice}
                type="invoice"
                companyInfo={companyInfo}
                template={salesInvoiceTemplate}
                config={config}
            />
        </div>
    );
}

export default InvoiceDetail;
