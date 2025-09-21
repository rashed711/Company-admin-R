import React from 'react';
import { Quotation, Invoice, CompanyInfo, DocumentTemplate, LocaleConfig, SupplierInvoice, InvoiceItem, SupplierInvoiceItem } from '../../types';
import { useTranslation } from '../../services/localization';

type Document = Quotation | Invoice | SupplierInvoice;
type DocumentType = 'quotation' | 'invoice' | 'supplier-invoice';
type TranslationKeys = ReturnType<typeof useTranslation>['t'];

interface DocumentViewerProps {
  document: Document;
  type: DocumentType;
  companyInfo: CompanyInfo;
  template: DocumentTemplate;
  config: LocaleConfig;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, type, companyInfo, template, config }) => {
  const { t } = useTranslation();
  const isRTL = config.dir === 'rtl';

  const isSupplierInvoice = type === 'supplier-invoice';
  
  const docTitle = type === 'quotation' ? t('quotation') : isSupplierInvoice ? t('purchase_invoice') : t('invoice');
  const docNumberLabel = type === 'quotation' ? t('quotation_no') : t('invoice_no');
  
  const currency = type === 'quotation' ? '' : ` ${config.currencySymbol}`;
  
  // Specific to invoice types
  const dueDateLabel = t('due_date');
  const dueDateValue = (document as (Invoice | SupplierInvoice)).due_date;
  
  const entityName = isSupplierInvoice ? (document as SupplierInvoice).supplier_name : (document as Invoice).customer_name;

  const doc = document as any;
  const docTypeLabel = type === 'quotation' ? t('quotation_type') : t('invoice_type');
  const docTypeValue = type === 'quotation' ? doc.quotation_type : (type === 'invoice' ? doc.invoice_type : doc.supplier_invoice_type);

  const companyHeaderDetails: { key: keyof CompanyInfo; label?: Parameters<TranslationKeys>[0] }[] = isRTL
    ? [ { key: 'NAME_AR' }, { key: 'ADDRESS_AR' }, { key: 'PHONE', label: 'phone' }, { key: 'EMAIL', label: 'email' }, { key: 'TAX_NUMBER', label: 'tax_number' } ]
    : [ { key: 'NAME' }, { key: 'ADDRESS' }, { key: 'PHONE', label: 'phone' }, { key: 'EMAIL', label: 'email' }, { key: 'TAX_NUMBER', label: 'tax_number' } ];

  const itemsSubtotal = (document.items as any[]).reduce((sum: number, item) => sum + item.total, 0);
  const discountValue = document.discount_type === 'percentage' 
    ? itemsSubtotal * ((document.discount_amount || 0) / 100)
    : (document.discount_amount || 0);

  return (
    <div className="bg-gray-200 dark:bg-gray-900 p-4 sm:p-8 rounded-lg">
        <div id="print-area" className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 md:p-12 max-w-4xl mx-auto text-gray-900 dark:text-gray-200">
            {/* Header Image */}
            {template.headerImage && (
                <div className="mb-8 text-center">
                    <img src={template.headerImage} alt="Document Header" className="max-w-full h-auto mx-auto" />
                </div>
            )}

            {/* Template Header Text */}
            {template.header && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">{template.header}</p>}

            {/* Main Header */}
            <header className="flex justify-between items-start mb-12">
                <div className={`text-${isRTL ? 'right' : 'left'} space-y-1`}>
                    {companyHeaderDetails.map(({ key, label }) => {
                        const info = companyInfo[key];
                        if (info && info.showInHeader && info.value) {
                            const content = label ? `${t(label)}: ${info.value}` : info.value;
                            const isName = key === 'NAME' || key === 'NAME_AR';
                            return isName 
                                ? <h1 key={key} className="text-3xl font-bold text-sky-600 dark:text-sky-400">{content}</h1>
                                : <p key={key} className="text-sm">{content}</p>;
                        }
                        return null;
                    })}
                </div>
                <div className={`text-${isRTL ? 'left' : 'right'}`}>
                    <h2 className="text-4xl font-bold uppercase">{docTitle}</h2>
                    <p className="mt-2">{`${docNumberLabel}: ${document.id}`}</p>
                    <p>{`${t('issue_date')}: ${document.issue_date}`}</p>
                    {type !== 'quotation' && (
                        <p>{`${dueDateLabel}: ${dueDateValue}`}</p>
                    )}
                </div>
            </header>
            
            {/* Details Section */}
            <section className="mb-12 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 p-4 border rounded-lg dark:border-gray-700">
                    <div><span className="font-semibold">{isSupplierInvoice ? t('supplier') : t('customer')}:</span> {entityName || '-'}</div>
                    <div><span className="font-semibold">{t('contact_person')}:</span> {doc.contact_person || '-'}</div>
                    <div><span className="font-semibold">{t('project_name')}:</span> {doc.project_name || '-'}</div>
                    <div><span className="font-semibold">{docTypeLabel}:</span> {docTypeValue || '-'}</div>
                </div>
            </section>

            {/* Items Table */}
            <section>
                <table className="w-full text-sm text-start">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className={`p-3 font-semibold text-${isRTL ? 'right' : 'left'}`}>{t('product_name')}</th>
                            <th className={`p-3 font-semibold text-${isRTL ? 'right' : 'left'}`}>{t('description')}</th>
                            <th className="p-3 font-semibold text-center">{t('unit')}</th>
                            <th className="p-3 font-semibold text-center">{t('quantity')}</th>
                            <th className={`p-3 font-semibold text-${isRTL ? 'left' : 'right'}`}>{t('price')}</th>
                            <th className={`p-3 font-semibold text-${isRTL ? 'left' : 'right'}`}>{t('total')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(document.items as (InvoiceItem | SupplierInvoiceItem)[]).map((item) => (
                            <tr key={item.id} className="border-b dark:border-gray-700">
                                <td className="p-3">{item.product_name}</td>
                                <td className="p-3">{item.description}</td>
                                <td className="p-3 text-center">{item.unit}</td>
                                <td className="p-3 text-center">{item.quantity}</td>
                                <td className={`p-3 text-${isRTL ? 'left' : 'right'}`}>{`${(item.price as any).toLocaleString(undefined, {minimumFractionDigits: 2})}${currency}`}</td>
                                <td className={`p-3 text-${isRTL ? 'left' : 'right'}`}>{`${(item.total as any).toLocaleString(undefined, {minimumFractionDigits: 2})}${currency}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            
            {/* Totals Section */}
            <section className="flex justify-end mt-8">
                <div className="w-full sm:w-1/2 md:w-1/3">
                    <div className="space-y-2">
                        <div className="flex justify-between"><span>{t('subtotal_before_discount')}</span><span>{`${(itemsSubtotal as any).toLocaleString(undefined, {minimumFractionDigits: 2})}${currency}`}</span></div>
                        {discountValue > 0 && (
                            <div className="flex justify-between"><span>{t('discount')}</span><span>{`-${(discountValue as any).toLocaleString(undefined, {minimumFractionDigits: 2})}${currency}`}</span></div>
                        )}
                        <div className="flex justify-between font-semibold pt-1 border-t dark:border-gray-700"><span>{t('subtotal')}</span><span>{`${(document.subtotal as any).toLocaleString(undefined, {minimumFractionDigits: 2})}${currency}`}</span></div>
                        {document.is_taxable && (
                           <div className="flex justify-between"><span>{`${t('tax')} (${document.tax_rate}%)`}</span><span>{`${(document.tax_amount as any).toLocaleString(undefined, {minimumFractionDigits: 2})}${currency}`}</span></div>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t-2 dark:border-gray-600"><span>{t('total')}</span><span>{`${(document.total as any).toLocaleString(undefined, {minimumFractionDigits: 2})}${currency}`}</span></div>
                    </div>
                </div>
            </section>

            {/* Terms and Footer */}
            <footer className="mt-12 pt-8 border-t dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                {template.termsAndConditions && (
                    <div className="mb-6">
                        <h4 className="font-bold mb-2">{t('terms_and_conditions')}</h4>
                        <p className="whitespace-pre-wrap">{template.termsAndConditions}</p>
                    </div>
                )}
                {template.footer && <p className="text-center">{template.footer}</p>}
            </footer>
        </div>
    </div>
  );
};

export default DocumentViewer;