import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Quotation } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { getQuotations, deleteQuotation } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const QuotationsList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuotations = async () => {
    setIsLoading(true);
    const { data, error } = await getQuotations();
    if (data) {
      setQuotations(data);
    } else {
      console.error(error);
      alert(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(t('delete_role_confirm'))) {
        const { error } = await deleteQuotation(id);
        if (error) {
            alert(error.message);
        } else {
            setQuotations(prev => prev.filter(q => q.id !== id));
        }
    }
  };

  const handleRowClick = (quotation: Quotation) => {
    navigate(`/quotations/${quotation.id}`);
  };
  
  const columns: { header: string; accessor: string; render?: (value: any, row: any) => React.ReactNode }[] = [
    { header: t('quotation_no'), accessor: 'id' },
    { header: t('time'), accessor: 'created_time' },
    { header: t('date'), accessor: 'issue_date' },
    { header: t('customer'), accessor: 'customer', render: (_val, row) => row.customer?.name || row.customer_name_temp || '-' },
    { header: t('contact_person'), accessor: 'contact_person' },
    { header: t('project_name'), accessor: 'project_name' },
    { header: t('created_by'), accessor: 'created_by_user', render: (val) => val?.full_name || '-' },
    { header: t('total'), accessor: 'total', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('linked_document'), accessor: 'invoice_id', render: (_val, row) => row.invoice_id ? <Link to={`/invoices/sales/${row.invoice_id}`} className="text-sky-600 hover:underline" onClick={e => e.stopPropagation()}>{`INV-${row.invoice_id}`}</Link> : '-' },
  ];

  const actions = (row: Quotation) => (
    <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
      <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>{t('delete')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('quotations')}</h1>
        <Button as={Link} to="/quotations/new" variant="primary">{t('new_quotation')}</Button>
      </div>
      <Table columns={columns} data={quotations} onRowClick={handleRowClick} isLoading={isLoading} actions={actions}/>
    </div>
  );
};

export default QuotationsList;