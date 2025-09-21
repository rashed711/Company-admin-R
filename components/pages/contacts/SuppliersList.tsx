
import React from 'react';
import { Supplier } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { mockSuppliersData } from '../../../services/mockData';
import { Link, useNavigate } from 'react-router-dom';

const SuppliersList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: { header: string; accessor: keyof Supplier; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('name'), accessor: 'name' },
    { header: t('email'), accessor: 'email' },
    { header: t('phone'), accessor: 'phone' },
    { header: t('address'), accessor: 'address' },
  ];

  const handleRowClick = (supplier: Supplier) => {
    navigate(`/contacts/suppliers/${supplier.id}/statement`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('suppliers')}</h1>
        <Button variant="primary">{t('new_supplier')}</Button>
      </div>
      <Table columns={columns} data={mockSuppliersData} onRowClick={handleRowClick} />
    </div>
  );
};

export default SuppliersList;