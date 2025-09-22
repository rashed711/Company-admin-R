
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { AccountTransaction, Supplier } from '../../../types';
import Button from '../../ui/Button';
import { mockSuppliersData, mockSupplierTransactions } from '../../../services/mockData';
import StatementViewer from '../../shared/StatementViewer';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AmiriFont } from '../../../assets/AmiriFont';

const SupplierStatementDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { config, companyInfo } = useAppSettings();
    const { t } = useTranslation();
    
    const supplierId = parseInt(id || '0');
    const supplier = useMemo(() => mockSuppliersData.find(s => s.id === supplierId), [supplierId]);

    const openingBalance = 0;
  
    const { processedTransactions, finalBalance } = useMemo(() => {
        const sortedChronologically = [...mockSupplierTransactions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
        const transactionsWithBalance = sortedChronologically.reduce<AccountTransaction[]>((accumulator, currentTransaction) => {
            const previousBalance = accumulator.length > 0 ? accumulator[accumulator.length - 1].balance : openingBalance;
            const newBalance = previousBalance - currentTransaction.debit + currentTransaction.credit;
            accumulator.push({ ...currentTransaction, balance: newBalance });
            return accumulator;
        }, []);
      
        const finalBal = transactionsWithBalance.length > 0 ? transactionsWithBalance[transactionsWithBalance.length - 1].balance : openingBalance;
        return { processedTransactions: transactionsWithBalance, finalBalance: finalBal };
    }, []);

    const generatePDF = (outputType: 'save' | 'blob' = 'save'): Blob | void => {
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
            ? [`${tx.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}`, tx.credit > 0 ? `${tx.credit.toLocaleString(undefined, {minimumFractionDigits: 2})}`: '-', tx.debit > 0 ? `${tx.debit.toLocaleString(undefined, {minimumFractionDigits: 2})}`: '-', processText(tx.description), tx.time, tx.date]
            : [tx.date, tx.time, tx.description, tx.debit > 0 ? `${tx.debit.toLocaleString(undefined, {minimumFractionDigits: 2})}`: '-', tx.credit > 0 ? `${tx.credit.toLocaleString(undefined, {minimumFractionDigits: 2})}`: '-', `${tx.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}`]
        );

        autoTable(doc, {
            head, body, startY: 60, theme: 'striped',
            styles: { font: isRTL ? 'Amiri' : 'helvetica', halign: isRTL ? 'right' : 'left', fontStyle: 'normal' },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
        });

        const finalY = (doc as any).lastAutoTable.finalY || 120;
        doc.setFontSize(12);
        doc.text(processText(`${t('total')}: ${finalBalance.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), xPos, finalY + 15, { align });

        if (outputType === 'blob') {
            return doc.output('blob');
        }
        doc.save(`supplier-statement-${supplier.id}-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const handleShare = async () => {
        if (!supplier) return;
        const pdfBlob = generatePDF('blob');
        if (!pdfBlob) return;
        const pdfFile = new File([pdfBlob], `supplier-statement-${supplier.id}.pdf`, { type: 'application/pdf' });
        
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
            await navigator.share({ files: [pdfFile], title: t('supplier_statement') });
        } else {
            alert('Web Share API not supported.');
        }
    };


    if (!supplier) {
        return (
            <div className="text-center p-8"><h1 className="text-2xl font-bold mb-4">Supplier Not Found</h1><Button as={Link} to="/contacts/suppliers" variant="primary">{t('back_to_list')}</Button></div>
        );
    }
    
    return (
        <div>
            <div className="flex flex-wrap justify-end items-center mb-6 no-print gap-2">
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => generatePDF('save')}>{t('download_pdf')}</Button>
                  <Button variant="secondary" onClick={handleShare}>{t('share')}</Button>
                  <Button variant="secondary" onClick={() => window.print()}>{t('print_document')}</Button>
                </div>
            </div>
            <StatementViewer 
                entity={supplier}
                transactions={processedTransactions}
                openingBalance={openingBalance}
                finalBalance={finalBalance}
                type="supplier"
                companyInfo={companyInfo}
                config={config}
            />
        </div>
    );
};

export default SupplierStatementDetail;
