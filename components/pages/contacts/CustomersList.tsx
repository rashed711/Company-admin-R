
import React from 'react';
import { Customer } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { Link } from 'react-router-dom';

// Mock data
const mockCustomers: Customer[] = [
  { id: 1, name: 'شركة المشاريع الحديثة', email: 'contact@modern.sa', phone: '011-123-4567', address: 'الرياض', created_at: '' },
  { id: 2, name: 'مؤسسة البناء الأولى', email: 'info@binaa.com', phone: '012-765-4321', address: 'جدة', created_at: '' },
  { id: 3, name: 'مجموعة العمار الهندسية', email: 'projects@ammar.group', phone: '013-555-8888', address: 'الدمام', created_at: '' },
];

const CustomersList = () => {
  const { t } = useTranslation();

  const columns: { header: string; accessor: keyof Customer; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('name'), accessor: 'name' },
    { header: t('email'), accessor: 'email' },
    { header: t('phone'), accessor: 'phone' },
    { header: t('address'), accessor: 'address' },
  ];

  const actions = (row: Customer) => (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Button variant="outline" size="sm">{t('edit')}</Button>
      <Link to={`/contacts/customers/${row.id}/statement`}>
        <Button variant="secondary" size="sm">{t('account_statement')}</Button>
      </Link>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('customers')}</h1>
        <Button variant="primary">{t('new_customer')}</Button>
      </div>
      <Table columns={columns} data={mockCustomers} actions={actions} />
    </div>
  );
};

export default CustomersList;
