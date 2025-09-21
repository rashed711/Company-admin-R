
import React from 'react';
import { useTranslation } from '../../services/localization';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const getPageTitle = (pathname: string): string => {
    // This is a simple mapping. A more robust solution might use a dedicated mapping object.
    const pathSegments = pathname.split('/').filter(p => p);
    const mainPath = pathSegments[0];
    const subPath = pathSegments[1];

    if (mainPath === 'settings') {
        if (subPath === 'users') return t('user_management');
        if (subPath === 'roles') return t('role_management');
        return t('settings');
    }

    switch (mainPath) {
        case 'dashboard': return t('dashboard');
        case 'quotations': return t('quotations');
        case 'invoices': return t('invoices_menu');
        case 'contacts': return t('contacts');
        default: return t('dashboard');
    }
  }

  return (
    <header className="flex items-center justify-between p-4 bg-[rgb(var(--color-surface))] shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">{getPageTitle(location.pathname)}</h2>
      </div>
    </header>
  );
};

export default Header;