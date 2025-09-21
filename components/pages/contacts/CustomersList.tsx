
import React from 'react';
import { Customer } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { Link, useNavigate } from 'react-router-dom';
import { mockCustomersData } from '../../../services/mockData';

const CustomersList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: { header: string; accessor: keyof Customer; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('name'), accessor: 'name' },
    { header: t('email'), accessor: 'email' },
    { header: t('phone'), accessor: 'phone' },
    { header: t('address'), accessor: 'address' },
  ];

  const handleRowClick = (customer: Customer) => {
    navigate(`/contacts/customers/${customer.id}/statement`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('customers')}</h1>
        <Button variant="primary">{t('new_customer')}</Button>
      </div>
      <Table columns={columns} data={mockCustomersData} onRowClick={handleRowClick} />
    </div>
  );
};

export default CustomersList;