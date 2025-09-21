import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../services/localization';
import Button from '../ui/Button';
import { UserIcon } from '../icons/Icons';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    // This should ideally not happen if the component is rendered within an authenticated route
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-8">{t('profile')}</h1>
      
      <div className="max-w-lg mx-auto bg-[rgb(var(--color-surface))] p-8 rounded-xl shadow-sm">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-[rgb(var(--color-muted))] rounded-full flex items-center justify-center mb-2">
            <UserIcon className="w-12 h-12 text-[rgb(var(--color-text-secondary))]" />
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-[rgb(var(--color-text-secondary))]">{user.email}</p>
          <span className="bg-[rgba(var(--color-primary),0.1)] text-[rgb(var(--color-primary))] text-sm font-medium me-2 px-3 py-1 rounded-full">
            {user.role.name}
          </span>
          
          <div className="pt-6 w-full max-w-xs">
            <Button variant="danger" onClick={logout} className="w-full">
              {t('logout')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
