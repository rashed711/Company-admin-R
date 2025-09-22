import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DocumentViewer from '../../shared/DocumentViewer';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { Invoice, CompanyInfo } from '../../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AmiriFont } from '../../../assets/AmiriFont';
import { getInvoiceById } from '../../../services/api';

const InvoiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { config, companyInfo, salesInvoiceTemplate } = useAppSettings();
    const [loading, setLoading] = useState<string | null>(null);
    const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!id) return;
            setLoading('fetch');
            const { data, error } = await getInvoiceById(parseInt(id));
            if (data) {
                setInvoiceData({ ...data, customer_name: data.customer.name, items: data.items || [] });
            } else {
                alert(error?.message);
                navigate('/invoices/sales');
            }
            setLoading(null);
        };
        fetchInvoice();
    }, [id, navigate]);


    const generateInvoicePDF = (invoice: Invoice, outputType: 'save' | 'blob' = 'save'): Blob | void => {
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
        const xPosInv = isRTL ? 20 : 190;
        let startY = 20;

        if (salesInvoiceTemplate.headerImage) {
            try {
                const imgProps = doc.getImageProperties(salesInvoiceTemplate.headerImage);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const imgWidth = pdfWidth - 40;
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                doc.addImage(salesInvoiceTemplate.headerImage, 'PNG', 20, 15, imgWidth, imgHeight);
                startY = 15 + imgHeight + 10;
            } catch (e) {
                console.error("Error adding image to PDF:", e);
            }
        }
        
        if (salesInvoiceTemplate.header) {
          doc.setFontSize(10);
          const headerY = startY > 20 ? startY - 8 : 12;
          doc.text(processText(salesInvoiceTemplate.header), 105, headerY, { align: 'center' });
        }

        const companyHeaderDetails = (isRTL 
          ? [ { key: 'NAME_AR' }, { key: 'ADDRESS_AR' }, { key: 'PHONE', label: 'phone' }, { key: 'EMAIL', label: 'email' }, { key: 'TAX_NUMBER', label: 'tax_number' } ]
          : [ { key: 'NAME' }, { key: 'ADDRESS' }, { key: 'PHONE', label: 'phone' }, { key: 'EMAIL', label: 'email' }, { key: 'TAX_NUMBER', label: 'tax_number' } ])
          .filter(({ key }) => companyInfo[key as keyof CompanyInfo]?.showInHeader && companyInfo[key as keyof CompanyInfo]?.value);

        let currentY = startY;
        companyHeaderDetails.forEach(({ key, label }) => {
            const info = companyInfo[key as keyof CompanyInfo];
            const isName = key === 'NAME' || key === 'NAME_AR';
            const labelText = label ? `${t(label as any)}: ` : '';
            const text = processText(labelText + info.value);
            doc.setFontSize(isName ? 20 : 10);
            doc.text(text, xPos, currentY, { align });
            currentY += isName ? 8 : 6;
        });

        doc.setFontSize(22);
        doc.text(processText(t('invoice')), xPosInv, 20, { align: align === 'right' ? 'left' : 'right'});
        doc.setFontSize(12);
        doc.text(processText(`${t('invoice_no')}: ${invoice.id}`), xPosInv, 35, { align: align === 'right' ? 'left' : 'right'});
        doc.text(processText(`${t('issue_date')}: ${invoice.issue_date}`), xPosInv, 42, { align: align === 'right' ? 'left' : 'right'});
        doc.text(processText(`${t('due_date')}: ${invoice.due_date}`), xPosInv, 49, { align: align === 'right' ? 'left' : 'right'});

        const billToY = currentY + 10;
        doc.text(processText(t('bill_to')), xPos, billToY, { align });
        doc.setFontSize(10);
        doc.text(processText(invoice.customer_name || t('unspecified_customer')), xPos, billToY + 6, { align });

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

        autoTable(doc, { head, body, startY: billToY + 15, theme: 'striped', styles: { font: isRTL ? 'Amiri' : 'helvetica', halign: isRTL ? 'right' : 'left' }, headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' } });

        let finalY = (doc as any).lastAutoTable.finalY || 120;
        finalY += 10;

        const totalX = isRTL ? 190 : 20;
        const totalAlign = isRTL ? 'right' : 'left';
        
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
        finalY += 10;
        
        if (salesInvoiceTemplate.termsAndConditions) {
            doc.setFontSize(9);
            doc.text(processText(t('terms_and_conditions')), totalX, finalY + 5, { align: totalAlign });
            const termsLines = doc.splitTextToSize(processText(salesInvoiceTemplate.termsAndConditions), isRTL ? 100 : 170);
            doc.text(termsLines, totalX, finalY + 11, { align: totalAlign });
        }

        const footerText = salesInvoiceTemplate.footer || t('thank_you_message');
        doc.setFontSize(10);
        doc.text(processText(footerText), 105, 280, { align: 'center' });

        if (outputType === 'blob') {
            return doc.output('blob');
        } else {
            doc.save(`invoice-${invoice.id}.pdf`);
        }
    };

    const handleShare = async () => {
        if (!invoiceData) return;
        setLoading('share');
        const pdfBlob = generateInvoicePDF(invoiceData, 'blob');
        if (!pdfBlob) { setLoading(null); return; }
        const pdfFile = new File([pdfBlob], `invoice-${invoiceData.id}.pdf`, { type: 'application/pdf' });
        
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
            try {
                await navigator.share({
                    files: [pdfFile],
                    title: `${t('invoice_no')} ${invoiceData.id}`,
                    text: `${t('invoice_details')} - ${companyInfo.NAME_AR.value}`,
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
                  <Button as={Link} to={`/invoices/sales/${invoiceData.id}/edit`} variant="outline">{t('edit')}</Button>
                  <Button variant="secondary" onClick={() => generateInvoicePDF(invoiceData)} disabled={!!loading}>{t('download_pdf')}</Button>
                  <Button variant="secondary" onClick={handleShare} disabled={!!loading}>{loading === 'share' ? '...' : t('share')}</Button>
                  <Button variant="secondary" onClick={() => window.print()}>{t('print_document')}</Button>
                </div>
            </div>
            <DocumentViewer 
                document={invoiceData}
                type="invoice"
                companyInfo={companyInfo}
                template={salesInvoiceTemplate}
                config={config}
            />
        </div>
    );
}

export default InvoiceDetail;