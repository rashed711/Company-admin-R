import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DocumentViewer from '../../shared/DocumentViewer';
import { mockQuotationsData } from '../../../services/mockData';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { Quotation, CompanyInfo } from '../../../types';
import { supabase } from '../../../services/supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AmiriFont } from '../../../assets/AmiriFont';

const QuotationDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { config, companyInfo, quotationTemplate, taxRate } = useAppSettings();
    const [loading, setLoading] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const quotationData = mockQuotationsData.find(q => q.id === parseInt(id || '0'));

    const handleConvertToInvoice = async (quotationId: number) => {
        setLoading('convert');
        try {
          const { data, error } = await supabase.rpc('convert_quotation_to_invoice', {
            p_quotation_id: quotationId,
          });
    
          if (error) {
            throw error;
          }
          
          alert(t('conversion_success', { id: quotationId, invoiceId: data }));
          // Optional: navigate to the new invoice
          // navigate(`/invoices/sales/${data}`);
        } catch (error: any) {
          alert(`${t('conversion_error')}: ${error.message}`);
        } finally {
          setLoading(null);
        }
    };

    const generateQuotationPDF = (quotation: Quotation, outputType: 'save' | 'blob' = 'save'): Blob | void => {
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

        if (quotationTemplate.headerImage) {
            try {
                const imgProps = doc.getImageProperties(quotationTemplate.headerImage);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const imgWidth = pdfWidth - 40;
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                doc.addImage(quotationTemplate.headerImage, 'PNG', 20, 15, imgWidth, imgHeight);
                startY = 15 + imgHeight + 10;
            } catch (e) {
                console.error("Error adding image to PDF:", e);
            }
        }

        if (quotationTemplate.header) {
          doc.setFontSize(10);
          const headerY = startY > 20 ? startY - 8 : 12;
          doc.text(processText(quotationTemplate.header), 105, headerY, { align: 'center' });
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
        doc.text(processText(t('quotation')), xPosInv, 20, { align: align === 'right' ? 'left' : 'right'});
        
        let infoY = currentY + 15;
        doc.setFontSize(10);
        
        const col1X = isRTL ? 190 : 20;
        const col2X = isRTL ? 125 : 85;
        const col3X = isRTL ? 60 : 150;
        // FIX: The 'Quotation' type does not have a 'company_name' property. Use 'customer_name' instead.
        doc.text(processText(`${t('company_name')}: ${quotation.customer_name || ''}`), col1X, infoY, { align });
        doc.text(processText(`${t('contact_person')}: ${quotation.contact_person || ''}`), col2X, infoY, { align });
        doc.text(processText(`${t('quotation_no')}: ${quotation.id}`), col3X, infoY, { align });
        infoY += 7;
        doc.text(processText(`${t('project_name')}: ${quotation.project_name || ''}`), col1X, infoY, { align });
        doc.text(processText(`${t('quotation_type')}: ${quotation.quotation_type || ''}`), col2X, infoY, { align });
        doc.text(processText(`${t('issue_date')}: ${quotation.issue_date}`), col3X, infoY, { align });

        const head = isRTL 
          ? [[processText(t('total')), processText(t('price')), processText(t('quantity')), processText(t('unit')), processText(t('description')), processText(t('product_name'))]]
          : [[t('product_name'), t('description'), t('unit'), t('quantity'), t('price'), t('total')]];
        const body = quotation.items.map(item => isRTL 
          ? [
              `${item.total.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 
              `${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 
              item.quantity, 
              processText(item.unit || ''),
              processText(item.description || ''),
              processText(item.product_name || '...'),
            ]
          : [
              item.product_name || '...', 
              item.description || '',
              item.unit || '',
              item.quantity, 
              `${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 
              `${item.total.toLocaleString(undefined, {minimumFractionDigits: 2})}`
            ]
        );
        autoTable(doc, { head, body, startY: infoY + 10, theme: 'striped', styles: { font: isRTL ? 'Amiri' : 'helvetica', halign: isRTL ? 'right' : 'left' }, headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }});

        let finalY = (doc as any).lastAutoTable.finalY || 120;
        finalY += 10;
        
        const totalX = isRTL ? 190 : 20;
        const totalAlign = isRTL ? 'right' : 'left';
        doc.setFontSize(12);
        
        const itemsSubtotal = quotation.items.reduce((sum, item) => sum + item.total, 0);
        const discountValue = quotation.discount_type === 'percentage' 
            ? itemsSubtotal * ((quotation.discount_amount || 0) / 100)
            : (quotation.discount_amount || 0);

        doc.text(processText(`${t('subtotal_before_discount')}: ${itemsSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`), totalX, finalY, { align: totalAlign });
        finalY += 7;

        if (discountValue > 0) {
            doc.text(processText(`${t('discount')}: -${discountValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`), totalX, finalY, { align: totalAlign });
            finalY += 7;
        }

        doc.text(processText(`${t('subtotal')}: ${quotation.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`), totalX, finalY, { align: totalAlign });
        finalY += 7;

        if (quotation.is_taxable) {
            doc.text(processText(`${t('tax')} (${quotation.tax_rate}%): ${quotation.tax_amount.toLocaleString(undefined, {minimumFractionDigits: 2})}`), totalX, finalY, { align: totalAlign });
            finalY += 7;
        }
        
        doc.setFontSize(14);
        doc.text(processText(`${t('total')}: ${quotation.total.toLocaleString(undefined, {minimumFractionDigits: 2})}`), totalX, finalY + 2, { align: totalAlign });
        finalY += 10;
        
        if (quotationTemplate.termsAndConditions) {
            doc.setFontSize(9);
            doc.text(processText(t('terms_and_conditions')), totalX, finalY + 5, { align: totalAlign });
            const termsLines = doc.splitTextToSize(processText(quotationTemplate.termsAndConditions), isRTL ? 100 : 170);
            doc.text(termsLines, totalX, finalY + 11, { align: totalAlign });
        }
        const footerText = quotationTemplate.footer || t('thank_you_message');
        doc.setFontSize(10);
        doc.text(processText(footerText), 105, 280, { align: 'center' });

        if (outputType === 'blob') {
            return doc.output('blob');
        } else {
            doc.save(`quotation-${quotation.id}.pdf`);
        }
    };

    const handleShare = async () => {
        if (!quotationData) return;
        setLoading('share');
        const pdfBlob = generateQuotationPDF(quotationData, 'blob');
        if (!pdfBlob) { setLoading(null); return; }

        const pdfFile = new File([pdfBlob], `quotation-${quotationData.id}.pdf`, { type: 'application/pdf' });
        
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
            try {
                await navigator.share({
                    files: [pdfFile],
                    title: `${t('quotation_no')} ${quotationData.id}`,
                    text: `${t('quotation_details')} - ${companyInfo.NAME_AR.value}`,
                });
            } catch (error) {
                console.error('Error sharing file:', error);
            }
        } else {
            alert('Web Share API for files is not supported in your browser.');
        }
        setLoading(null);
    };


    if (!quotationData) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold mb-4">Quotation Not Found</h1>
                <Button as={Link} to="/quotations" variant="primary">{t('back_to_list')}</Button>
            </div>
        );
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <h1 className="text-3xl font-bold">{t('quotation_details')}</h1>
                <div className="flex flex-wrap gap-2">
                  <Button as={Link} to={`/quotations/${quotationData.id}/edit`} variant="outline">{t('edit')}</Button>
                  <Button 
                    variant="primary" 
                    onClick={() => handleConvertToInvoice(quotationData.id)}
                    disabled={loading === 'convert' || (quotationData.status !== 'accepted' && quotationData.status !== 'sent')}
                  >
                    {loading === 'convert' ? t('converting') : t('convert_to_invoice')}
                  </Button>
                  <Button variant="secondary" onClick={() => generateQuotationPDF(quotationData)} disabled={!!loading}>
                      {t('download_pdf')}
                  </Button>
                  <Button variant="secondary" onClick={handleShare} disabled={!!loading}>
                      {loading === 'share' ? '...' : t('share')}
                  </Button>
                  <Button as={Link} to="/quotations" variant="outline">{t('back_to_list')}</Button>
                </div>
            </div>
            <DocumentViewer 
                document={quotationData}
                type="quotation"
                companyInfo={companyInfo}
                template={quotationTemplate}
                config={config}
            />
        </div>
    );
}

export default QuotationDetail;