
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { AccountTransaction, Supplier } from '../../../types';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AmiriFont } from '../../../assets/AmiriFont';
import { mockSuppliersData, mockSupplierTransactions } from '../../../services/mockData';

const SupplierStatement = () => {
  const { id } = useParams<{ id: string }>();
  const { config, companyInfo } = useAppSettings();
  const { t } = useTranslation();
  
  const supplierId = parseInt(id || '0');
  const supplier = useMemo(() => mockSuppliersData.find(s => s.id === supplierId), [supplierId]);

  const openingBalance = 0;
  
  const processedTransactions = useMemo(() => {
    return mockSupplierTransactions.reduce<AccountTransaction[]>((accumulator, currentTransaction) => {
      const previousBalance = accumulator.length > 0 ? accumulator[accumulator.length - 1].balance : openingBalance;
      // For suppliers: balance increases with credit (invoices) and decreases with debit (payments)
      const newBalance = previousBalance - currentTransaction.debit + currentTransaction.credit;
      
      accumulator.push({
        ...currentTransaction,
        balance: newBalance,
      });

      return accumulator;
    }, []);
  }, []);

  const finalBalance = processedTransactions.length > 0 
    ? processedTransactions[processedTransactions.length - 1].balance 
    : openingBalance;

  const columns: { header: string; accessor: keyof AccountTransaction; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('date'), accessor: 'date' },
    { header: t('time'), accessor: 'time' },
    { header: t('description'), accessor: 'description' },
    { header: t('debit'), accessor: 'debit', render: (val: number) => val > 0 ? `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` : '-' },
    { header: t('credit'), accessor: 'credit', render: (val: number) => val > 0 ? `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` : '-' },
    { header: t('balance'), accessor: 'balance', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` },
  ];
  
  const generatePDF = () => {
    if (!supplier) return;
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

    doc.setFontSize(18);
    doc.text(processText(`${t('supplier_statement')} - ${isRTL ? companyInfo.NAME_AR.value : companyInfo.NAME.value}`), 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(processText(`${t('supplier')}: ${supplier.name}`), xPos, 40, { align });
    doc.text(processText(`${t('date')}: ${new Date().toLocaleDateString()}`), xPos, 47, { align });

    const head = isRTL 
      ? [[processText(t('balance')), processText(t('credit')), processText(t('debit')), processText(t('description')), processText(t('time')), processText(t('date'))]]
      : [[t('date'), t('time'), t('description'), t('debit'), t('credit'), t('balance')]];

    const body = processedTransactions.map(tx => isRTL
      ? [
          `${tx.balance.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`,
          tx.credit > 0 ? `${tx.credit.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`: '-',
          tx.debit > 0 ? `${tx.debit.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`: '-',
          processText(tx.description),
          tx.time,
          tx.date
        ]
      : [
          tx.date,
          tx.time,
          tx.description,
          tx.debit > 0 ? `${tx.debit.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`: '-',
          tx.credit > 0 ? `${tx.credit.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`: '-',
          `${tx.balance.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`,
        ]
    );

    autoTable(doc, {
        head, body, startY: 60, theme: 'striped',
        styles: { font: isRTL ? 'Amiri' : 'helvetica', halign: isRTL ? 'right' : 'left' },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.setFontSize(12);
    doc.text(processText(`${t('total')}: ${finalBalance.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), xPos, finalY + 15, { align });

    doc.save(`statement-${supplier.id}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (!supplier) {
      return (
          <div className="text-center p-8">
              <h1 className="text-2xl font-bold mb-4">Supplier Not Found</h1>
              <Button as={Link} to="/contacts/suppliers" variant="primary">{t('back_to_list')}</Button>
          </div>
      );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">{t('supplier_statement')}</h1>
            <p className="text-gray-500">{t('statement_for_supplier')}: {supplier.name}</p>
        </div>
        <Button variant="primary" onClick={generatePDF}>{t('download_pdf')}</Button>
      </div>
      <Table columns={columns} data={processedTransactions} />
    </div>
  );
};

export default SupplierStatement;
