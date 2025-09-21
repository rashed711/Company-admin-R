
import React, { useState } from 'react';
import { Product } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { mockProductsData } from '../../../services/mockData';
import Modal from '../../ui/Modal';


const ProductsList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  
  const [products, setProducts] = useState<Product[]>(mockProductsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);

  const handleAddNew = () => {
    setCurrentProduct({
      id: Date.now(), // Temporary ID
      name: '',
      description: '',
      category: '',
      unit: '',
      price: 0,
      avg_purchase_price: 0,
      avg_selling_price: 0,
      created_at: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleSave = () => {
    if (!currentProduct) return;
    
    // Check if it's a new product by checking if the id exists in the original list
    const isNew = !products.some(p => p.id === currentProduct.id);
    
    if (isNew) {
      setProducts([...products, currentProduct as Product]);
    } else {
      setProducts(products.map(p => p.id === currentProduct.id ? (currentProduct as Product) : p));
    }
    
    handleCloseModal();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!currentProduct) return;
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    });
  };

  const columns: { header: string; accessor: keyof Product; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('name'), accessor: 'name' },
    { header: t('description'), accessor: 'description' },
    { header: t('category'), accessor: 'category' },
    { header: t('unit'), accessor: 'unit' },
    { header: t('price'), accessor: 'price', render: (val: number) => `${val.toLocaleString()} ${config.currencySymbol}` },
    { header: t('avg_purchase_price'), accessor: 'avg_purchase_price', render: (val: number) => `${val.toLocaleString()} ${config.currencySymbol}` },
    { header: t('avg_selling_price'), accessor: 'avg_selling_price', render: (val: number) => `${val.toLocaleString()} ${config.currencySymbol}` },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('products_and_services')}</h1>
        <Button variant="primary" onClick={handleAddNew}>{t('new_product_service')}</Button>
      </div>
      <Table columns={columns} data={products} onRowClick={handleEdit} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentProduct && products.some(p => p.id === currentProduct.id) ? t('edit_product') : t('new_product')}>
        {currentProduct && (
          <div className="space-y-4">
            <InputField label={t('name')} name="name" value={currentProduct.name} onChange={handleInputChange} />
            <TextareaField label={t('description')} name="description" value={currentProduct.description} onChange={handleInputChange} />
            <InputField label={t('category')} name="category" value={currentProduct.category} onChange={handleInputChange} />
            <InputField label={t('unit')} name="unit" value={currentProduct.unit} onChange={handleInputChange} />
            <InputField label={t('price')} name="price" type="number" value={currentProduct.price} onChange={handleInputChange} />
            
            <div className="mt-6 flex justify-end space-x-2 rtl:space-x-reverse">
              <Button variant="outline" onClick={handleCloseModal}>{t('cancel')}</Button>
              <Button variant="primary" onClick={handleSave}>{t('save_changes')}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Reusable input components, can be moved to a separate file if needed
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
        </label>
        <input
            {...props}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
        />
    </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
        </label>
        <textarea
            {...props}
            rows={3}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
        />
    </div>
);


export default ProductsList;
