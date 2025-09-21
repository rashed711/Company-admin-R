
import React from 'react';
import { Product } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';

// Mock data
const mockProducts: Product[] = [
  { id: 1, name: 'استشارة هندسية', description: 'جلسة استشارية لمدة ساعة', price: 500, type: 'service', created_at: '' },
  { id: 2, name: 'تصميم معماري', description: 'تصميم كامل للمبنى السكني', price: 10000, type: 'service', created_at: '' },
  { id: 3, name: 'أسمنت مقاوم', description: 'كيس أسمنت 50 كغ', price: 25, type: 'product', created_at: '' },
  { id: 4, name: 'حديد تسليح', description: 'طن حديد تسليح مقاس 16 مم', price: 3200, type: 'product', created_at: '' },
];

const ProductsList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  
  const columns: { header: string; accessor: keyof Product; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('name'), accessor: 'name' },
    { header: t('description'), accessor: 'description' },
    { header: t('price'), accessor: 'price', render: (val: number) => `${val.toLocaleString()} ${config.currencySymbol}` },
    { header: t('type'), accessor: 'type', render: (val: 'product' | 'service') => t(val) },
  ];

  const actions = (row: Product) => (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Button variant="outline" size="sm">{t('edit')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('products_and_services')}</h1>
        <Button variant="primary">{t('new_product_service')}</Button>
      </div>
      <Table columns={columns} data={mockProducts} actions={actions} />
    </div>
  );
};

export default ProductsList;
