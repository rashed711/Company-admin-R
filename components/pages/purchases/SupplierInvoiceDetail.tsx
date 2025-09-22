import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DocumentViewer from '../../shared/DocumentViewer';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { SupplierInvoice, CompanyInfo } from '../../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AmiriFont } from '../../../assets/AmiriFont';
import { getSupplierInvoiceById } from '../../../services/api';

const SupplierInvoiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { config, companyInfo, purchaseInvoiceTemplate } = useAppSettings();
    const [loading, setLoading] = useState<string | null>(null);
    const [invoiceData, setInvoiceData] = useState<SupplierInvoice | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!id) return;
            setLoading('fetch');
            const { data, error } = await getSupplierInvoiceById(parseInt(id));
            if (data) {
                setInvoiceData({ ...data, supplier_name: data.supplier.name, items: data.items || [] });
            } else {
                alert(error?.message);
                navigate('/invoices/purchases');
            }
            setLoading(null);
        };
        fetchInvoice();
    }, [id, navigate]);

    const generateSupplierInvoicePDF = (invoice: SupplierInvoice, outputType: 'save' | 'blob' = 'save'): Blob | void => {
        const doc = new jsPDF();
        const isRTL = config.dir === 'rtl';

        if (isRTL) {
          doc.addFileToVFS('Amiri-Regular.ttf', AmiriFont);
          doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
          doc.setFont('Amiri');
        }

        const processText = (text: string) => isRTL ? text.split('').reverse().join('') : text;
        const align = isRTL ? 'right' : 'left';
        const xPos = isRTL ? 190 : 20;
        let startY = 20;

        if (purchaseInvoiceTemplate.headerImage) {
            try {
                const imgProps = doc.getImageProperties(purchaseInvoiceTemplate.headerImage);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const imgWidth = pdfWidth - 40;
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                doc.addImage(purchaseInvoiceTemplate.headerImage, 'PNG', 20, 15, imgWidth, imgHeight);
                startY = 15 + imgHeight + 10;
            } catch (e) {
                console.error("Error adding image to PDF:", e);
            }
        }
        
        doc.setFontSize(22);
        doc.text(processText(t('purchase_invoice')), 105, startY, { align: 'center'});
        startY += 15;

        doc.setFontSize(12);
        doc.text(processText(`${t('supplier')}: ${invoice.supplier_name || ''}`), xPos, startY, { align });
        doc.text(processText(`${t('invoice_no')}: ${invoice.id}`), isRTL ? 20 : 190, startY, { align: isRTL ? 'left' : 'right' });
        startY += 7;
        doc.text(processText(`${t('issue_date')}: ${invoice.issue_date}`), isRTL ? 20 : 190, startY, { align: isRTL ? 'left' : 'right' });
        startY += 7;
        doc.text(processText(`${t('due_date')}: ${invoice.due_date}`), isRTL ? 20 : 190, startY, { align: isRTL ? 'left' : 'right' });
        
        const head = isRTL 
          ? [[processText(t('total')), processText(t('price')), processText(t('quantity')), processText(t('unit')), processText(t('description')), processText(t('product_name'))]]
          : [[t('product_name'), t('description'), t('unit'), t('quantity'), t('price'), t('total')]];
        const body = invoice.items.map(item => isRTL 
          ? [ 
              `${item.total.toLocaleString()} ${config.currencySymbol}`, 
              `${item.price.toLocaleString()} ${config.currencySymbol}`, 
              item.quantity, 
              processText(item.unit),
              processText(item.description),
              processText(item.product_name || '...'),
            ]
          : [ 
              item.product_name || '...', 
              item.description,
              item.unit,
              item.quantity, 
              `${item.price.toLocaleString()} ${config.currencySymbol}`, 
              `${item.total.toLocaleString()} ${config.currencySymbol}`,
            ]);

        autoTable(doc, { head, body, startY: startY + 10, theme: 'striped', styles: { font: isRTL ? 'Amiri' : 'helvetica', halign: isRTL ? 'right' : 'left' }, headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' } });

        let finalY = (doc as any).lastAutoTable.finalY || 120;
        finalY += 10;
        
        const totalX = isRTL ? 20 : 190;
        const totalAlign = isRTL ? 'left' : 'right';
        
        const itemsSubtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
        const discountValue = invoice.discount_type === 'percentage' 
            ? itemsSubtotal * ((invoice.discount_amount || 0) / 100)
            : (invoice.discount_amount || 0);

        doc.setFontSize(12);
        doc.text(processText(`${t('subtotal_before_discount')}: ${itemsSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), totalX, finalY, { align: totalAlign });
        finalY += 7;

        if (discountValue > 0) {
            doc.text(processText(`${t('discount')}: -${discountValue.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), totalX, finalY, { align: totalAlign });
            finalY += 7;
        }

        doc.text(processText(`${t('subtotal')}: ${invoice.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), totalX, finalY, { align: totalAlign });
        finalY += 7;

        if (invoice.is_taxable) {
            doc.text(processText(`${t('tax')} (${invoice.tax_rate}%): ${invoice.tax_amount.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), totalX, finalY, { align: totalAlign });
            finalY += 7;
        }

        doc.setFontSize(14);
        doc.text(processText(`${t('total')}: ${invoice.total.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), totalX, finalY + 2, { align: totalAlign });


        if (outputType === 'blob') {
            return doc.output('blob');
        } else {
            doc.save(`purchase-invoice-${invoice.id}.pdf`);
        }
    };

    const handleShare = async () => {
        if (!invoiceData) return;
        setLoading('share');
        const pdfBlob = generateSupplierInvoicePDF(invoiceData, 'blob');
        if (!pdfBlob) { setLoading(null); return; }
        const pdfFile = new File([pdfBlob], `purchase-invoice-${invoiceData.id}.pdf`, { type: 'application/pdf' });
        
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
            try {
                await navigator.share({
                    files: [pdfFile],
                    title: `${t('invoice_no')} ${invoiceData.id}`,
                    text: `${t('purchase_invoice_details')} - ${companyInfo.NAME_AR.value}`,
                });
            } catch (error) {
                console.error('Error sharing file:', error);
            }
        } else {
            alert('Web Share API for files is not supported in your browser.');
        }
        setLoading(null);
    };


    if (loading === 'fetch' || !invoiceData) {
         return (
            <div className="flex justify-center items-center p-8">
               <svg className="animate-spin h-8 w-8 text-[rgb(var(--color-primary))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-wrap justify-end items-center mb-6 no-print gap-2">
                <div className="flex flex-wrap gap-2">
                  <Button as={Link} to={`/invoices/purchases/${invoiceData.id}/edit`} variant="outline">{t('edit')}</Button>
                  <Button variant="secondary" onClick={() => generateSupplierInvoicePDF(invoiceData)} disabled={!!loading}>{t('download_pdf')}</Button>
                  <Button variant="secondary" onClick={handleShare} disabled={!!loading}>{loading === 'share' ? '...' : t('share')}</Button>
                  <Button variant="secondary" onClick={() => window.print()}>{t('print_document')}</Button>
                </div>
            </div>
            <DocumentViewer 
                document={invoiceData}
                type="supplier-invoice"
                companyInfo={companyInfo}
                template={purchaseInvoiceTemplate}
                config={config}
            />
        </div>
    );
}

export default SupplierInvoiceDetail;