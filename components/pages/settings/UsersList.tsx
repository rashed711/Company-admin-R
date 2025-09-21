
import React, { useState } from 'react';
import { User } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { ROLES } from '../../../contexts/AuthContext';
import Modal from '../../ui/Modal';

// Mock data for UsersList, now includes a manager-subordinate relationship
const mockUsers: User[] = [
  { id: 1, name: 'مدير النظام', email: 'admin@enjaz.app', role: ROLES.admin, manager_id: null },
  { id: 2, name: 'محاسب أول', email: 'accountant@enjaz.app', role: ROLES.accountant, manager_id: 1 },
  { id: 3, name: 'مدير مبيعات', email: 'manager@enjaz.app', role: ROLES.sales_manager, manager_id: 1 },
  { id: 4, name: 'مندوب مبيعات', email: 'sales@enjaz.app', role: ROLES.sales_person, manager_id: 3 },
];

const UsersList = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      if (!selectedUser) return;
      const { name, value } = e.target;

      if (name === 'role') {
        const roleId = value as keyof typeof ROLES;
        setSelectedUser({ ...selectedUser, role: ROLES[roleId] });
      } else if (name === 'manager_id') {
        setSelectedUser({ ...selectedUser, manager_id: value ? parseInt(value) : null });
      }
  };

  const handleSaveChanges = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
      handleCloseModal();
    }
  };
  
  const columns: { header: string; accessor: keyof User; render?: (value: any, row: User) => React.ReactNode; }[] = [
    { header: t('name'), accessor: 'name' },
    { header: t('email'), accessor: 'email' },
    { header: t('role'), accessor: 'role', render: (role: User['role']) => role.name },
    { header: t('manager'), accessor: 'manager_id', render: (managerId: number | null) => {
        if (!managerId) return '-';
        return users.find(u => u.id === managerId)?.name || '-';
    }},
  ];

  const actions = (row: User) => (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Button variant="outline" size="sm" onClick={() => handleEditClick(row)}>{t('edit')}</Button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('user_management')}</h1>
        <Button variant="primary">{t('new_user')}</Button>
      </div>
      <Table columns={columns} data={users} actions={actions} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={t('edit_user')}>
        {selectedUser && (
            <div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('name')}</label>
                    <input type="text" value={selectedUser.name} readOnly className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"/>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('email')}</label>
                    <input type="email" value={selectedUser.email} readOnly className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"/>
                </div>
                <div className="mb-4">
                  <label htmlFor="role-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {t('role')}
                  </label>
                  <select 
                    id="role-select"
                    name="role" 
                    value={selectedUser.role.id} 
                    onChange={handleFieldChange} 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {Object.values(ROLES).map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="manager-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {t('manager')}
                  </label>
                  <select 
                    id="manager-select"
                    name="manager_id" 
                    value={selectedUser.manager_id || ''} 
                    onChange={handleFieldChange} 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">-</option>
                    {users.filter(u => u.id !== selectedUser.id).map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-6 flex justify-end space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" onClick={handleCloseModal}>{t('cancel')}</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>{t('save_changes')}</Button>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersList;
