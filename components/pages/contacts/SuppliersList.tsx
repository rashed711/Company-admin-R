
import React from 'react';
import { Supplier } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';

// Mock data
const mockSuppliers: Supplier[] = [
  { id: 1, name: 'مورد مواد البناء', email: 'sales@bm-supplier.com', phone: '011-987-6543', address: 'الرياض', created_at: '' },
  { id: 2, name: 'شركة الأجهزة الكهربائية', email: 'info@electric.co', phone: '012-111-2222', address: 'جدة', created_at: '' },
];

const SuppliersList = () => {
  const { t } = useTranslation();
  const columns: { header: string; accessor: keyof Supplier; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('name'), accessor: 'name' },
    { header: t('email'), accessor: 'email' },
    { header: t('phone'), accessor: 'phone' },
    { header: t('address'), accessor: 'address' },
  ];

  const actions = (row: Supplier) => (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Button variant="outline" size="sm">{t('edit')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('suppliers')}</h1>
        <Button variant="primary">{t('new_supplier')}</Button>
      </div>
      <Table columns={columns} data={mockSuppliers} actions={actions} />
    </div>
  );
};

export default SuppliersList;
