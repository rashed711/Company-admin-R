import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { mockPaymentVouchersData, mockSuppliersData } from '../../../services/mockData';
import Button from '../../ui/Button';
import { PaymentVoucher } from '../../../types';
import jsPDF from 'jspdf';
import { AmiriFont } from '../../../assets/AmiriFont';

const PaymentVoucherDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { config, companyInfo } = useAppSettings();
    const isRTL = config.dir === 'rtl';

    const voucher = mockPaymentVouchersData.find(v => v.id === parseInt(id || '0'));
    const supplier = mockSuppliersData.find(s => s.id === voucher?.supplier_id);

    const generatePDF = (voucherData: PaymentVoucher) => {
        const doc = new jsPDF();

        if (isRTL) {
          doc.addFileToVFS('Amiri-Regular.ttf', AmiriFont);
          doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
          doc.setFont('Amiri');
        }

        const processText = (text: string) => isRTL ? text.split('').reverse().join('') : text;
        const align = isRTL ? 'right' : 'left';
        const xPos = isRTL ? 190 : 20;

        // Header
        doc.setFontSize(22);
        doc.text(processText(t('payment_voucher')), 105, 20, { align: 'center' });
        doc.setFontSize(10);
        const companyName = isRTL ? companyInfo.NAME_AR.value : companyInfo.NAME.value;
        doc.text(processText(companyName), 105, 28, { align: 'center' });

        // Details
        let startY = 45;
        doc.setFontSize(12);
        doc.text(processText(`${t('payment_voucher')} #: ${voucherData.id}`), xPos, startY, { align });
        doc.text(processText(`${t('date')}: ${voucherData.date}`), isRTL ? 20 : 190, startY, { align: isRTL ? 'left' : 'right' });
        startY += 10;
        
        doc.line(20, startY, 190, startY);
        startY += 10;

        doc.text(processText(`${t('supplier')}: ${voucherData.supplier_name}`), xPos, startY, { align });
        startY += 7;
        if(supplier?.phone) doc.text(processText(`${t('phone')}: ${supplier.phone}`), xPos, startY, { align });
        startY += 10;

        doc.text(processText(`${t('amount')}: ${voucherData.amount.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`), xPos, startY, { align });
        startY += 7;
        doc.text(processText(`${t('payment_method')}: ${t(voucherData.payment_method)}`), xPos, startY, { align });
        startY += 7;
        doc.text(processText(`${t('description')}: ${voucherData.description}`), xPos, startY, { align });
        
        // Footer
        let finalY = 250;
        doc.line(20, finalY, 190, finalY);
        finalY += 10;
        doc.text(processText('المستلم'), xPos, finalY, { align });
        doc.text(processText('المحاسب'), 105, finalY, { align: 'center' });
        doc.text(processText('المدير المالي'), isRTL ? 20 : 190, finalY, { align: isRTL ? 'left' : 'right' });

        doc.save(`payment-voucher-${voucherData.id}.pdf`);
    };

    if (!voucher) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold mb-4">Payment Voucher Not Found</h1>
                <Button as={Link} to="/accounting/payment-vouchers" variant="primary">{t('back_to_list')}</Button>
            </div>
        );
    }
    
    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 no-print gap-2">
                <h1 className="text-3xl font-bold">تفاصيل سند الصرف</h1>
                <div className="flex flex-wrap gap-2">
                    <Button as={Link} to={`/accounting/payment-vouchers/${voucher.id}/edit`} variant="outline">{t('edit')}</Button>
                    <Button variant="secondary" onClick={() => generatePDF(voucher)}>{t('download_pdf')}</Button>
                    <Button variant="secondary" onClick={() => window.print()}>{t('print_document')}</Button>
                    <Button as={Link} to="/accounting/payment-vouchers" variant="outline">{t('back_to_list')}</Button>
                </div>
            </div>
            
             <div className="bg-gray-200 dark:bg-gray-900 p-4 sm:p-8 rounded-lg">
                <div id="print-area" className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 md:p-12 max-w-4xl mx-auto text-gray-900 dark:text-gray-200">
                     <header className="flex justify-between items-start mb-8 border-b dark:border-gray-700 pb-4">
                        <div className={`text-${isRTL ? 'right' : 'left'} space-y-1`}>
                            <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400">{isRTL ? companyInfo.NAME_AR.value : companyInfo.NAME.value}</h1>
                            <p className="text-sm">{isRTL ? companyInfo.ADDRESS_AR.value : companyInfo.ADDRESS.value}</p>
                            <p className="text-sm">{companyInfo.PHONE.value}</p>
                        </div>
                        <div className={`text-${isRTL ? 'left' : 'right'}`}>
                            <h2 className="text-3xl font-bold uppercase">{t('payment_voucher')}</h2>
                        </div>
                    </header>

                    <section className="flex justify-between items-center mb-8 text-sm">
                        <div>
                            <span className="font-semibold">{t('supplier')}: </span>
                            {voucher.supplier_name}
                        </div>
                        <div>
                            <p><span className="font-semibold">{t('payment_voucher')} #:</span> {voucher.id}</p>
                            <p><span className="font-semibold">{t('date')}:</span> {voucher.date}</p>
                        </div>
                    </section>
                    
                    <section className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 my-8 space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="font-semibold">{t('amount')}:</div>
                            <div>{voucher.amount.toLocaleString(undefined, {minimumFractionDigits: 2})} {config.currencySymbol}</div>
                            
                            <div className="font-semibold">{t('payment_method')}:</div>
                            <div>{t(voucher.payment_method)}</div>
                            
                            <div className="font-semibold">{t('description')}:</div>
                            <div>{voucher.description}</div>
                         </div>
                    </section>

                    <footer className="mt-20 pt-8 text-sm text-center text-gray-600 dark:text-gray-400">
                         <div className="flex justify-around">
                            <div>
                                <p className="mb-8">____________________</p>
                                <p>المستلم</p>
                            </div>
                            <div>
                                <p className="mb-8">____________________</p>
                                <p>المحاسب</p>
                            </div>
                            <div>
                                <p className="mb-8">____________________</p>
                                <p>المدير المالي</p>
                            </div>
                         </div>
                    </footer>

                </div>
            </div>

        </div>
    );
};

export default PaymentVoucherDetail;
