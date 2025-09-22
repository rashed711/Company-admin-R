
import React, { useState } from 'react';
import { User } from '../../../types';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import { useTranslation } from '../../../services/localization';
import { ROLES, useAuth } from '../../../contexts/AuthContext';
import Modal from '../../ui/Modal';
import { mockUsersData } from '../../../services/mockData';
import InputField from '../../ui/InputField';

const UsersList = () => {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsersData);
  
  // State for Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // State for New User Modal
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
      name: '',
      email: '',
      password: '',
      roleId: 'sales_person',
      managerId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEditClick = (user: User) => {
    setSelectedUser(JSON.parse(JSON.stringify(user))); // Deep copy to avoid direct state mutation
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      if (!selectedUser) return;
      const { name, value } = e.target;

      if (name === 'role') {
        const roleId = value as keyof typeof ROLES;
        setSelectedUser({ ...selectedUser, role: ROLES[roleId] });
      } else if (name === 'manager_id') {
        setSelectedUser({ ...selectedUser, manager_id: value || null });
      }
  };

  const handleSaveChanges = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
      handleCloseEditModal();
    }
  };

  const handleAddNewUser = () => {
    setError('');
    setNewUserData({
        name: '', email: '', password: '', roleId: 'sales_person', managerId: '',
    });
    setIsNewUserModalOpen(true);
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveNewUser = async () => {
    setLoading(true);
    setError('');
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const { user: createdUser, error: signUpError } = await signUp(
        newUserData.email,
        newUserData.password,
        newUserData.name,
        newUserData.roleId,
        newUserData.managerId || null
    );
    setLoading(false);

    if (signUpError) {
        if (signUpError.includes('For security purposes')) {
            setError(t('supabase_rate_limit_error'));
        } else {
            setError(signUpError);
        }
    } else if (createdUser) {
        setUsers([...users, createdUser]);
        setIsNewUserModalOpen(false);
    }
  };
  
  const columns: { header: string; accessor: keyof User; render?: (value: any, row: User) => React.ReactNode; }[] = [
    { header: t('name'), accessor: 'name' },
    { header: t('email'), accessor: 'email' },
    { header: t('role'), accessor: 'role', render: (role: User['role']) => role.name },
    { header: t('manager'), accessor: 'manager_id', render: (managerId: string | null) => {
        if (!managerId) return '-';
        return users.find(u => u.id === managerId)?.name || '-';
    }},
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{t('user_management')}</h1>
        <Button variant="primary" onClick={handleAddNewUser}>{t('new_user')}</Button>
      </div>
      <Table columns={columns} data={users} onRowClick={handleEditClick} />

      {/* Edit User Modal */}
      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal} title={t('edit_user')}>
        {selectedUser && (
            <div className="space-y-4">
                <InputField label={t('name')} type="text" value={selectedUser.name} readOnly />
                <InputField label={t('email')} type="email" value={selectedUser.email} readOnly />
                <div>
                  <label htmlFor="role-select" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    {t('role')}
                  </label>
                  <select 
                    id="role-select"
                    name="role" 
                    value={selectedUser.role.id} 
                    onChange={handleFieldChange} 
                    className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                  >
                    {Object.values(ROLES).map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="manager-select" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    {t('manager')}
                  </label>
                  <select 
                    id="manager-select"
                    name="manager_id" 
                    value={selectedUser.manager_id || ''} 
                    onChange={handleFieldChange} 
                    className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                  >
                    <option value="">-</option>
                    {users.filter(u => u.id !== selectedUser.id).map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-6 flex justify-end space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" onClick={handleCloseEditModal}>{t('cancel')}</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>{t('save_changes')}</Button>
                </div>
            </div>
        )}
      </Modal>

      {/* New User Modal */}
      <Modal isOpen={isNewUserModalOpen} onClose={() => setIsNewUserModalOpen(false)} title={t('new_user')}>
        <div className="space-y-4">
            <InputField label={t('name')} name="name" type="text" value={newUserData.name} onChange={handleNewUserChange} required />
            <InputField label={t('email')} name="email" type="email" value={newUserData.email} onChange={handleNewUserChange} required />
            <InputField label={t('password')} name="password" type="password" value={newUserData.password} onChange={handleNewUserChange} required />
            <div>
                <label htmlFor="new-role-select" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">{t('role')}</label>
                <select id="new-role-select" name="roleId" value={newUserData.roleId} onChange={handleNewUserChange} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
                    {Object.values(ROLES).map(role => (<option key={role.id} value={role.id}>{role.name}</option>))}
                </select>
            </div>
            <div>
                <label htmlFor="new-manager-select" className="block mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">{t('manager')}</label>
                <select id="new-manager-select" name="managerId" value={newUserData.managerId} onChange={handleNewUserChange} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
                    <option value="">-</option>
                    {users.map(user => (<option key={user.id} value={user.id}>{user.name}</option>))}
                </select>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="mt-6 flex justify-end space-x-2 rtl:space-x-reverse">
                <Button variant="outline" onClick={() => setIsNewUserModalOpen(false)}>{t('cancel')}</Button>
                <Button variant="primary" onClick={handleSaveNewUser} disabled={loading}>
                    {loading ? '...' : t('create')}
                </Button>
            </div>
        </div>
      </Modal>

    </div>
  );
};

export default UsersList;