
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SupplierInvoice } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { mockSupplierInvoicesData, mockUsersData } from '../../../services/mockData';

const SupplierInvoicesList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userMap = new Map(mockUsersData.map(user => [user.id, user.name]));

  const handleRowClick = (invoice: SupplierInvoice) => {
    navigate(`/invoices/purchases/${invoice.id}`);
  };

  const columns: { header: string; accessor: string; render?: (value: any, row: SupplierInvoice) => React.ReactNode; }[] = [
    { header: t('invoice_no'), accessor: 'id' },
    { header: t('time'), accessor: 'created_time' },
    { header: t('date'), accessor: 'issue_date' },
    { header: t('supplier'), accessor: 'supplier_name' },
    { header: t('contact_person'), accessor: 'contact_person' },
    { header: t('project_name'), accessor: 'project_name' },
    { header: t('created_by'), accessor: 'created_by', render: (_val, row) => row.created_by ? userMap.get(row.created_by) || '-' : '-' },
    { header: t('total'), accessor: 'total', render: (val: number) => `${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${config.currencySymbol}` },
    { header: t('linked_document'), accessor: 'linked_doc_ph', render: () => '-' },
  ];

  const actions = (row: SupplierInvoice) => (
    <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
      <Button variant="primary" size="sm">{t('record_payment')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('purchase_invoices')}</h1>
        <Button as={Link} to="/invoices/purchases/new" variant="primary">{t('new_supplier_invoice')}</Button>
      </div>
      <Table columns={columns} data={mockSupplierInvoicesData} actions={actions} onRowClick={handleRowClick} />
    </div>
  );
};

export default SupplierInvoicesList;