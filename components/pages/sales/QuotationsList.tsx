
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Quotation } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { mockQuotationsData } from '../../../services/mockData';


const calculateTotals = (total: number, taxRate: number) => {
    const subtotal = total / (1 + taxRate / 100);
    const taxAmount = total - subtotal;
    return { subtotal, taxAmount };
}

const QuotationsList = () => {
  const { config, taxRate } = useAppSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const processedQuotations: Quotation[] = mockQuotationsData.map(q => {
      const { subtotal, taxAmount } = calculateTotals(q.total, taxRate);
      return {
          ...q,
          subtotal: subtotal,
          tax_rate: taxRate,
          tax_amount: taxAmount
      }
  });
  
  const handleRowClick = (quotation: Quotation) => {
    navigate(`/quotations/${quotation.id}`);
  };
  
  const columns: { header: string; accessor: keyof Quotation; render?: (value: any) => React.ReactNode }[] = [
    { header: t('quotation_no'), accessor: 'id' },
    { header: t('customer'), accessor: 'customer_name' },
    { header: t('issue_date'), accessor: 'issue_date' },
    { header: t('total'), accessor: 'total', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('status'), accessor: 'status', render: (val: string) => {
        const statusMap: {[key: string]: string} = {
            draft: 'bg-gray-200 text-gray-800', sent: 'bg-blue-200 text-blue-800',
            accepted: 'bg-green-200 text-green-800', rejected: 'bg-red-200 text-red-800',
        };
        return <span className={`px-2 py-1 rounded-full text-sm ${statusMap[val]}`}>{t(val as any)}</span>;
    }},
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('quotations')}</h1>
        <Button variant="primary">{t('new_quotation')}</Button>
      </div>
      <Table columns={columns} data={processedQuotations} onRowClick={handleRowClick} />
    </div>
  );
};

export default QuotationsList;