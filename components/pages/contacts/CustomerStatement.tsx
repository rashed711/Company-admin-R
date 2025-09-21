import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { AccountTransaction, Customer } from '../../../types';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AmiriFont } from '../../../assets/AmiriFont';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Mock data
const mockCustomer: Customer = { id: 1, name: 'شركة المشاريع الحديثة', email: 'contact@modern.sa', phone: '011-123-4567', address: 'الرياض', created_at: '' };
const mockTransactions: Omit<AccountTransaction, 'balance'>[] = [
    { id: 'inv-101', date: '2023-10-15', type: 'invoice', description: 'فاتورة رقم #101', debit: 17250, credit: 0 },
    { id: 'rv-1', date: '2023-10-20', type: 'receipt', description: 'سند قبض #1', debit: 0, credit: 10000 },
    { id: 'inv-103', date: '2023-10-25', type: 'invoice', description: 'فاتورة رقم #103', debit: 5000, credit: 0 },
];

const CustomerStatement = () => {
  const { id } = useParams();
  const { config, companyInfo } = useAppSettings();
  const { t } = useTranslation();

  const openingBalance = 0;
  
  const processedTransactions = useMemo(() => {
    // Rewritten with reduce for better compatibility with React StrictMode.
    // This functional approach ensures the calculation is pure and avoids potential side-effects
    // that can cause issues during development builds.
    return mockTransactions.reduce<AccountTransaction[]>((accumulator, currentTransaction) => {
      const previousBalance = accumulator.length > 0 ? accumulator[accumulator.length - 1].balance : openingBalance;
      const newBalance = previousBalance + currentTransaction.debit - currentTransaction.credit;
      
      accumulator.push({
        ...currentTransaction,
        balance: newBalance,
      });

      return accumulator;
    }, []);
  }, []); // Dependencies are empty as mock data and opening balance are constant.

  
  const finalBalance = processedTransactions.length > 0 
    ? processedTransactions[processedTransactions.length - 1].balance 
    : openingBalance;

  const columns: { header: string; accessor: keyof AccountTransaction; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('date'), accessor: 'date' },
    { header: t('description'), accessor: 'description' },
    { header: t('debit'), accessor: 'debit', render: (val: number) => val > 0 ? `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` : '-' },
    { header: t('credit'), accessor: 'credit', render: (val: number) => val > 0 ? `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` : '-' },
    { header: t('balance'), accessor: 'balance', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}` },
  ];
  
  const generatePDF = () => {
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

    // Header
    doc.setFontSize(18);
    doc.text(processText(`${t('account_statement')} - ${isRTL ? companyInfo.NAME_AR.value : companyInfo.NAME.value}`), 105, 20, { align: 'center' });
    
    // Customer Info
    doc.setFontSize(12);
    doc.text(processText(`${t('customer')}: ${mockCustomer.name}`), xPos, 40, { align });
    doc.text(processText(`${t('date')}: ${new Date().toLocaleDateString()}`), xPos, 47, { align });

    // Table
    const head = isRTL 
      ? [[processText(t('balance')), processText(t('credit')), processText(t('debit')), processText(t('description')), processText(t('date'))]]
      : [[t('date'), t('description'), t('debit'), t('credit'), t('balance')]];

    const body = processedTransactions.map(tx => isRTL
      ? [
          `${tx.balance.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`,
          tx.credit > 0 ? `${tx.credit.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`: '-',
          tx.debit > 0 ? `${tx.debit.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`: '-',
          processText(tx.description),
          tx.date
        ]
      : [
          tx.date,
          tx.description,
          tx.debit > 0 ? `${tx.debit.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`: '-',
          tx.credit > 0 ? `${tx.credit.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`: '-',
          `${tx.balance.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`,
        ]
    );

    doc.autoTable({
        head, body, startY: 60, theme: 'striped',
        styles: { font: isRTL ? 'Amiri' : 'helvetica', halign: isRTL ? 'right' : 'left' },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.setFontSize(12);
    doc.text(processText(`${t('total')}: ${finalBalance.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), xPos, finalY + 15, { align });

    doc.save(`statement-${mockCustomer.id}-${new Date().toISOString().split('T')[0]}.pdf`);
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">{t('account_statement')}</h1>
            <p className="text-gray-500">{t('statement_for_customer')}: {mockCustomer.name}</p>
        </div>
        <Button variant="primary" onClick={generatePDF}>{t('download_pdf')}</Button>
      </div>
      <Table columns={columns} data={processedTransactions} />
    </div>
  );
};

export default CustomerStatement;