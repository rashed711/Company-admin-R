import React, { useMemo, useState, useEffect } from 'react';
import { Supplier } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { getSuppliers } from '../../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const SuppliersList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    fetchSuppliers();
  }, []);

  const sortedData = useMemo(() => 
    [...suppliers].sort((a, b) => a.name.localeCompare(b.name)),
    [suppliers]
  );

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
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('suppliers')}</h1>
        <Button variant="primary">{t('new_supplier')}</Button>
      </div>
      <Table columns={columns} data={sortedData} onRowClick={handleRowClick} isLoading={isLoading}/>
    </div>
  );
};

export default SuppliersList;