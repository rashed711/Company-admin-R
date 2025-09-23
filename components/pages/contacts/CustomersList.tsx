
import React, { useMemo, useState, useEffect, ChangeEvent } from 'react';
import { Customer } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { Link, useNavigate } from 'react-router-dom';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../../services/api';
import Modal from '../../ui/Modal';
import InputField from '../../ui/InputField';

const CustomersList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer> | null>(null);

  const fetchCustomers = async () => {
      setIsLoading(true);
      const { data, error } = await getCustomers();
      if (data) {
          setCustomers(data);
      } else {
          alert(error?.message);
      }
      setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const sortedData = useMemo(() => 
    [...customers].sort((a, b) => a.name.localeCompare(b.name)),
    [customers]
  );

  const handleAddNew = () => {
    setCurrentCustomer({ name: '', email: '', phone: '', address: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleSave = async () => {
    if (!currentCustomer) return;
    
    const isNew = !currentCustomer.id;
    
    if (isNew) {
      const { error } = await addCustomer(currentCustomer);
      if (error) return alert(error.message);
    } else {
      const { id, created_at, created_by, ...updateData } = currentCustomer;
      const { error } = await updateCustomer(id!, updateData);
      if (error) return alert(error.message);
    }
    
    await fetchCustomers();
    handleCloseModal();
  };

  const handleDelete = async (customerId: number) => {
    if (window.confirm(t('delete_role_confirm'))) {
        const { error } = await deleteCustomer(customerId);
        if (error) {
            alert(`Error deleting customer: ${error.message}`);
        } else {
            setCustomers(customers.filter(c => c.id !== customerId));
        }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!currentCustomer) return;
    const { name, value } = e.target;
    setCurrentCustomer({ ...currentCustomer, [name]: value });
  };
  
  const columns: { header: string; accessor: keyof Customer; render?: (value: any) => React.ReactNode; }[] = [
    { header: t('name'), accessor: 'name' },
    { header: t('email'), accessor: 'email' },
    { header: t('phone'), accessor: 'phone' },
    { header: t('address'), accessor: 'address' },
  ];
  
  const actions = (row: Customer) => (
    <div className="flex space-x-2 rtl:space-x-reverse" onClick={(e) => e.stopPropagation()}>
      <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>{t('delete')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('customers')}</h1>
        <Button variant="primary" onClick={handleAddNew}>{t('new_customer')}</Button>
      </div>
      <Table columns={columns} data={sortedData} onRowClick={handleEdit} isLoading={isLoading} actions={actions} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentCustomer?.id ? t('edit_customer') : t('new_customer')}>
        {currentCustomer && (
          <div className="space-y-4">
            <InputField label={t('name')} name="name" value={currentCustomer.name} onChange={handleInputChange} required />
            <InputField label={t('email')} name="email" type="email" value={currentCustomer.email} onChange={handleInputChange} />
            <InputField label={t('phone')} name="phone" type="tel" value={currentCustomer.phone} onChange={handleInputChange} />
            <InputField label={t('address')} name="address" value={currentCustomer.address} onChange={handleInputChange} />
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

export default CustomersList;