import React, { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { Product } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import Modal from '../../ui/Modal';
import InputField from '../../ui/InputField';
import TextareaField from '../../ui/TextareaField';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../../services/api';

const ProductsList = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);

  // Define options for dropdowns
  const categoryOptions = ['Accessories', 'Air Outlets', 'Cable Tray'];
  const unitOptions = ['No', 'Ton', 'kg', 'MT'];

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await getProducts();
    if (data) {
      setProducts(data);
    } else if (error) {
      console.error("Failed to fetch products:", error);
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const sortedData = useMemo(() => 
    [...products].sort((a, b) => a.name.localeCompare(b.name)), 
    [products]
  );

  const handleAddNew = () => {
    setCurrentProduct({
      name: '', 
      description: '', 
      category: categoryOptions[0], // Set default category
      unit: unitOptions[0], // Set default unit
      price: 0,
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

  const handleSave = async () => {
    if (!currentProduct) return;
    
    const isNew = !currentProduct.id;
    
    if (isNew) {
      const { error } = await addProduct(currentProduct);
      if (error) return alert(error.message);
    } else {
      const { id, created_at, avg_purchase_price, avg_selling_price, ...updateData } = currentProduct;
      const { error } = await updateProduct(id!, updateData);
      if (error) return alert(error.message);
    }
    
    await fetchProducts();
    handleCloseModal();
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        const { error } = await deleteProduct(productId);
        if (error) {
            alert(`Error deleting product: ${error.message}`);
        } else {
            setProducts(products.filter(p => p.id !== productId));
        }
    }
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    { header: t('avg_purchase_price'), accessor: 'avg_purchase_price', render: (val: number) => `${val?.toLocaleString() || 0} ${config.currencySymbol}` },
    { header: t('avg_selling_price'), accessor: 'avg_selling_price', render: (val: number) => `${val?.toLocaleString() || 0} ${config.currencySymbol}` },
  ];
  
   const actions = (row: Product) => (
    <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
      <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>{t('delete')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('products_and_services')}</h1>
        <Button variant="primary" onClick={handleAddNew}>{t('new_product_service')}</Button>
      </div>
      <Table columns={columns} data={sortedData} onRowClick={handleEdit} isLoading={isLoading} actions={actions}/>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentProduct && currentProduct.id ? t('edit_product') : t('new_product')}>
        {currentProduct && (
          <div className="space-y-4">
            <InputField label={t('name')} name="name" value={currentProduct.name} onChange={handleInputChange} />
            <TextareaField label={t('description')} name="description" value={currentProduct.description} onChange={handleInputChange} />
            
            {/* Category Dropdown */}
            <div>
                <label htmlFor="category-select" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">{t('category')}</label>
                <select
                    id="category-select"
                    name="category"
                    value={currentProduct.category}
                    onChange={handleInputChange}
                    className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                >
                    {categoryOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
            </div>

            {/* Unit Dropdown */}
            <div>
                <label htmlFor="unit-select" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">{t('unit')}</label>
                <select
                    id="unit-select"
                    name="unit"
                    value={currentProduct.unit}
                    onChange={handleInputChange}
                    className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                >
                    {unitOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
            </div>
            
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

export default ProductsList;