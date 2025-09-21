
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Quotation } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { mockQuotationsData, mockUsersData } from '../../../services/mockData';


const QuotationsList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userMap = new Map(mockUsersData.map(user => [user.id, user.name]));
  
  const handleRowClick = (quotation: Quotation) => {
    navigate(`/quotations/${quotation.id}`);
  };
  
  const columns: { header: string; accessor: string; render?: (value: any, row: Quotation) => React.ReactNode }[] = [
    { header: t('quotation_no'), accessor: 'id' },
    { header: t('time'), accessor: 'created_time' },
    { header: t('date'), accessor: 'issue_date' },
    { header: t('customer'), accessor: 'customer_name' },
    { header: t('contact_person'), accessor: 'contact_person' },
    { header: t('project_name'), accessor: 'project_name' },
    { header: t('created_by'), accessor: 'created_by', render: (_val, row) => row.created_by ? userMap.get(row.created_by) || '-' : '-' },
    { header: t('total'), accessor: 'total', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('linked_document'), accessor: 'invoice_id', render: (_val, row) => row.invoice_id ? <Link to={`/invoices/sales/${row.invoice_id}`} className="text-sky-600 hover:underline" onClick={e => e.stopPropagation()}>{`INV-${row.invoice_id}`}</Link> : '-' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('quotations')}</h1>
        <Button as={Link} to="/quotations/new" variant="primary">{t('new_quotation')}</Button>
      </div>
      <Table columns={columns} data={mockQuotationsData} onRowClick={handleRowClick} />
    </div>
  );
};

export default QuotationsList;
