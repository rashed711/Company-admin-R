import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SupplierInvoice } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { getSupplierInvoices, deleteSupplierInvoice } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';


const SupplierInvoicesList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchInvoices = async () => {
        setIsLoading(true);
        const { data, error } = await getSupplierInvoices();
        if (data) {
            setInvoices(data);
        } else {
            alert(error?.message);
        }
        setIsLoading(false);
    };
    fetchInvoices();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(t('delete_role_confirm'))) {
        const { error } = await deleteSupplierInvoice(id);
        if (error) {
            alert(error.message);
        } else {
            setInvoices(prev => prev.filter(i => i.id !== id));
        }
    }
  };

  const handleRowClick = (invoice: SupplierInvoice) => {
    navigate(`/invoices/purchases/${invoice.id}`);
  };

  const columns: { header: string; accessor: string; render?: (value: any, row: any) => React.ReactNode; }[] = [
    { header: t('invoice_no'), accessor: 'id' },
    { header: t('time'), accessor: 'created_time' },
    { header: t('date'), accessor: 'issue_date' },
    { header: t('supplier'), accessor: 'supplier', render: (_val, row) => row.supplier?.name || '-' },
    { header: t('contact_person'), accessor: 'contact_person' },
    { header: t('project_name'), accessor: 'project_name' },
    { header: t('created_by'), accessor: 'created_by_user', render: (val) => val?.full_name || '-' },
    { header: t('total'), accessor: 'total', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('linked_document'), accessor: 'linked_doc_ph', render: () => '-' },
  ];

  const actions = (row: SupplierInvoice) => (
    <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
      <Button as={Link} to={`/invoices/purchases/${row.id}/edit`} variant="outline" size="sm">{t('edit')}</Button>
      <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>{t('delete')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('purchase_invoices')}</h1>
        <Button as={Link} to="/invoices/purchases/new" variant="primary">{t('new_supplier_invoice')}</Button>
      </div>
      <Table columns={columns} data={invoices} actions={actions} onRowClick={handleRowClick} isLoading={isLoading} />
    </div>
  );
};

export default SupplierInvoicesList;