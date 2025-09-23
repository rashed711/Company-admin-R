
import React, { useMemo, useState, useEffect, ChangeEvent } from 'react';
import { Supplier } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import Modal from '../../ui/Modal';
import InputField from '../../ui/InputField';

const SuppliersList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Partial<Supplier> | null>(null);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    const { data, error } = await getSuppliers();
    if (data) {
      setSuppliers(data);
    } else {
      alert(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const sortedData = useMemo(() => 
    [...suppliers].sort((a, b) => a.name.localeCompare(b.name)),
    [suppliers]
  );

  const handleAddNew = () => {
    setCurrentSupplier({ name: '', email: '', phone: '', address: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSupplier(null);
  };
  
  const handleSave = async () => {
    if (!currentSupplier) return;
    
    const isNew = !currentSupplier.id;
    
    if (isNew) {
      const { error } = await addSupplier(currentSupplier);
      if (error) return alert(error.message);
    } else {
      const { id, created_at, created_by, ...updateData } = currentSupplier;
      const { error } = await updateSupplier(id!, updateData);
      if (error) return alert(error.message);
    }
    
    await fetchSuppliers();
    handleCloseModal();
  };

  const handleDelete = async (supplierId: number) => {
    if (window.confirm(t('delete_role_confirm'))) {
        const { error } = await deleteSupplier(supplierId);
        if (error) {
            alert(`Error deleting supplier: ${error.message}`);
        } else {
            setSuppliers(suppliers.filter(s => s.id !== supplierId));
        }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!currentSupplier) return;
    const { name, value } = e.target;
    setCurrentSupplier({ ...currentSupplier, [name]: value });
  };


  const columns: { header: string; accessor: keyof Supplier; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('name'), accessor: 'name' },
    { header: t('email'), accessor: 'email' },
    { header: t('phone'), accessor: 'phone' },
    { header: t('address'), accessor: 'address' },
  ];
  
  const actions = (row: Supplier) => (
    <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
      <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>{t('delete')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('suppliers')}</h1>
        <Button variant="primary" onClick={handleAddNew}>{t('new_supplier')}</Button>
      </div>
      <Table columns={columns} data={sortedData} onRowClick={handleEdit} isLoading={isLoading} actions={actions} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentSupplier?.id ? t('edit_supplier') : t('new_supplier')}>
        {currentSupplier && (
          <div className="space-y-4">
            <InputField label={t('name')} name="name" value={currentSupplier.name} onChange={handleInputChange} required />
            <InputField label={t('email')} name="email" type="email" value={currentSupplier.email} onChange={handleInputChange} />
            <InputField label={t('phone')} name="phone" type="tel" value={currentSupplier.phone} onChange={handleInputChange} />
            <InputField label={t('address')} name="address" value={currentSupplier.address} onChange={handleInputChange} />
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

export default SuppliersList;