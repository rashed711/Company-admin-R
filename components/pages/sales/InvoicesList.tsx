
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Invoice, CompanyInfo } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AmiriFont } from '../../../assets/AmiriFont';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { mockInvoicesData, mockUsersData } from '../../../services/mockData';

const InvoicesList = () => {
  const { config, companyInfo, salesInvoiceTemplate } = useAppSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userMap = new Map(mockUsersData.map(user => [user.id, user.name]));

  const handleRowClick = (invoice: Invoice) => {
    navigate(`/invoices/sales/${invoice.id}`);
  };

  const generateInvoicePDF = (invoice: Invoice) => {
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
            const imgWidth = pdfWidth - 40; // with margin
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
            doc.addImage(salesInvoiceTemplate.headerImage, 'PNG', 20, 15, imgWidth, imgHeight);
            startY = 15 + imgHeight + 10;
        } catch (e) {
            console.error("Error adding image to PDF:", e);
            startY = 20;
        }
    }

    // Template Header
    if (salesInvoiceTemplate.header) {
      doc.setFontSize(10);
      const headerY = startY > 20 ? startY - 8 : 12; // Place above text if image exists
      doc.text(processText(salesInvoiceTemplate.header), 105, headerY, { align: 'center' });
    }

    // Company Header
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
    startY = currentY;


    doc.setFontSize(22);
    doc.text(processText(t('invoice')), xPosInv, 20, { align: align === 'right' ? 'left' : 'right'});

    // Invoice Info
    doc.setFontSize(12);
    doc.text(processText(`${t('invoice_no')}: ${invoice.id}`), xPosInv, 35, { align: align === 'right' ? 'left' : 'right'});
    doc.text(processText(`${t('issue_date')}: ${invoice.issue_date}`), xPosInv, 42, { align: align === 'right' ? 'left' : 'right'});
    doc.text(processText(`${t('due_date')}: ${invoice.due_date}`), xPosInv, 49, { align: align === 'right' ? 'left' : 'right'});

    const billToY = startY + 10;
    // Bill To
    doc.text(processText(t('bill_to')), xPos, billToY, { align });
    doc.setFontSize(10);
    doc.text(processText(invoice.customer_name || t('unspecified_customer')), xPos, billToY + 6, { align });

    // Table
    const head = isRTL 
      ? [[processText(t('total')), processText(t('price')), processText(t('quantity')), processText(t('description'))]]
      : [[t('description'), t('quantity'), t('price'), t('total')]];

    const body = invoice.items.map(item => isRTL 
      ? [
          `${item.total.toLocaleString()} ${config.currencySymbol}`,
          `${item.price.toLocaleString()} ${config.currencySymbol}`,
          item.quantity,
          processText(config.language === 'ar' && item.product_name === 'Engineering Consultation' ? 'استشارة هندسية' : item.product_name || '...'),
        ]
      : [
          item.product_name || '...',
          item.quantity,
          `${item.price.toLocaleString()} ${config.currencySymbol}`,
          `${item.total.toLocaleString()} ${config.currencySymbol}`,
      ]);

    autoTable(doc, {
        head: head,
        body: body,
        startY: billToY + 15,
        theme: 'striped',
        styles: { font: isRTL ? 'Amiri' : 'helvetica', halign: isRTL ? 'right' : 'left' },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
    });

    // Totals
    let finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.setFontSize(12);
    const totalX = isRTL ? 190 : 20;
    const totalAlign = isRTL ? 'right' : 'left';

    doc.text(processText(`${t('subtotal')}: ${invoice.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), totalX, finalY + 15, { align: totalAlign });
    doc.text(processText(`${t('tax')} (${invoice.tax_rate}%): ${invoice.tax_amount.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), totalX, finalY + 22, { align: totalAlign });
    doc.setFontSize(14);
    doc.text(processText(`${t('total')}: ${invoice.total.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), totalX, finalY + 30, { align: totalAlign });
    finalY += 35;

    // Terms & Conditions
    if (salesInvoiceTemplate.termsAndConditions) {
        doc.setFontSize(9);
        doc.text(processText(t('terms_and_conditions')), totalX, finalY + 10, { align: totalAlign });
        const termsLines = doc.splitTextToSize(processText(salesInvoiceTemplate.termsAndConditions), isRTL ? 100 : 170);
        doc.text(termsLines, totalX, finalY + 16, { align: totalAlign });
    }

    // Footer
    const footerText = salesInvoiceTemplate.footer || t('thank_you_message');
    doc.setFontSize(10);
    doc.text(processText(footerText), 105, 280, { align: 'center' });

    doc.save(`invoice-${invoice.id}.pdf`);
  };
  
  const columns: { header: string; accessor: string; render?: (value: any, row: Invoice) => React.ReactNode; }[] = [
    { header: t('invoice_no'), accessor: 'id' },
    { header: t('time'), accessor: 'created_time' },
    { header: t('date'), accessor: 'issue_date' },
    { header: t('customer'), accessor: 'customer_name' },
    { header: t('contact_person'), accessor: 'contact_person' },
    { header: t('project_name'), accessor: 'project_name' },
    { header: t('created_by'), accessor: 'created_by', render: (_val, row) => row.created_by ? userMap.get(row.created_by) || '-' : '-' },
    { header: t('total'), accessor: 'total', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('linked_document'), accessor: 'quotation_id', render: (_val, row) => row.quotation_id ? <Link to={`/quotations/${row.quotation_id}`} className="text-sky-600 hover:underline" onClick={e => e.stopPropagation()}>{`QUT-${row.quotation_id}`}</Link> : '-' },
  ];

  const actions = (row: Invoice) => (
    <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
      <Button variant="secondary" size="sm" onClick={() => generateInvoicePDF(row)}>{t('download_pdf')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('sales_invoices')}</h1>
        <Button as={Link} to="/invoices/sales/new" variant="primary">{t('new_invoice')}</Button>
      </div>
      <Table columns={columns} data={mockInvoicesData} actions={actions} onRowClick={handleRowClick} />
    </div>
  );
};

export default InvoicesList;