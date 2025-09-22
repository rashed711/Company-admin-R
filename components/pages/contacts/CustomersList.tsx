import React, { useMemo, useState, useEffect } from 'react';
import { Customer } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { Link, useNavigate } from 'react-router-dom';
import { getCustomers } from '../../../services/api';

const CustomersList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    fetchCustomers();
  }, []);

  const sortedData = useMemo(() => 
    [...customers].sort((a, b) => a.name.localeCompare(b.name)),
    [customers]
  );

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
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('customers')}</h1>
        <Button variant="primary">{t('new_customer')}</Button>
      </div>
      <Table columns={columns} data={sortedData} onRowClick={handleRowClick} isLoading={isLoading}/>
    </div>
  );
};

export default CustomersList;