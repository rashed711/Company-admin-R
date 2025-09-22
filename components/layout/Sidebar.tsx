
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, SalesIcon, InvoiceIcon, ContactsIcon, SettingsIcon, ChevronDownIcon, XIcon, AccountingIcon, UserIcon } from '../icons/Icons';
import { useTranslation } from '../../services/localization';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSettings } from '../../contexts/AppSettingsContext';
import { Permission } from '../../types';

interface SidebarProps {
    isSidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const { companyInfo, config } = useAppSettings();
  const [isAccountingOpen, setAccountingOpen] = useState(false);
  const [isInvoicesOpen, setInvoicesOpen] = useState(true);
  const [isContactsOpen, setContactsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const linkClasses = "flex items-center p-2.5 text-base font-medium text-[rgb(var(--color-text-secondary))] rounded-lg hover:bg-[rgb(var(--color-muted))] group relative";
  const activeLinkClasses = "bg-[rgba(var(--color-primary),0.1)] text-[rgb(var(--color-primary))]";

  // Check if the user has permission to see any of the settings pages
  const canViewSettings = [
    'settings:products:view', 'settings:users:view', 
    'settings:roles:view', 'settings:app:view'
  ].some(p => hasPermission(p as Permission));

  const SidebarContent = () => (
    <div className="h-full px-3 py-4 overflow-y-auto bg-[rgb(var(--color-surface))] shadow-lg lg:shadow-none flex flex-col">
        <div className="flex items-center justify-between mb-6 px-2">
            <h1 className="text-2xl font-bold text-[rgb(var(--color-primary))]">{companyInfo.APP_NAME.value}</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-[rgb(var(--color-muted))]">
                <XIcon />
            </button>
        </div>
      <ul className="space-y-2 flex-grow">
        <li>
          <NavLink to="/dashboard" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
             <span className="absolute inset-y-0 start-0 w-1 bg-[rgb(var(--color-primary))] rounded-e-full scale-y-0 group-[.active]:scale-y-100 transition-transform"></span>
            <DashboardIcon />
            <span className="ms-3">{t('dashboard')}</span>
          </NavLink>
        </li>
        
        {hasPermission('sales:quotations:view') && (
          <li>
            <NavLink to="/quotations" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
               <span className="absolute inset-y-0 start-0 w-1 bg-[rgb(var(--color-primary))] rounded-e-full scale-y-0 group-[.active]:scale-y-100 transition-transform"></span>
              <SalesIcon />
              <span className="ms-3">{t('quotations')}</span>
            </NavLink>
          </li>
        )}

        {hasPermission('sales:invoices:view') || hasPermission('purchases:invoices:view') ? (
            <li>
            <button onClick={() => setInvoicesOpen(!isInvoicesOpen)} className="flex items-center w-full p-2.5 text-base font-medium text-[rgb(var(--color-text-secondary))] rounded-lg hover:bg-[rgb(var(--color-muted))]">
                <InvoiceIcon />
                <span className="flex-1 ms-3 text-start whitespace-nowrap">{t('invoices_menu')}</span>
                <ChevronDownIcon className={`transform transition-transform ${isInvoicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {isInvoicesOpen && (
                <ul className="py-2 space-y-2 ps-6">
                {hasPermission('sales:invoices:view') && <li><NavLink to="/invoices/sales" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('sales_invoices')}</NavLink></li>}
                {hasPermission('purchases:invoices:view') && <li><NavLink to="/invoices/purchases" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('purchase_invoices')}</NavLink></li>}
                </ul>
            )}
            </li>
        ) : null}

        <li>
          <button onClick={() => setAccountingOpen(!isAccountingOpen)} className="flex items-center w-full p-2.5 text-base font-medium text-[rgb(var(--color-text-secondary))] rounded-lg hover:bg-[rgb(var(--color-muted))]">
            <AccountingIcon />
            <span className="flex-1 ms-3 text-start whitespace-nowrap">{t('accounting')}</span>
            <ChevronDownIcon className={`transform transition-transform ${isAccountingOpen ? 'rotate-180' : ''}`} />
          </button>
          {isAccountingOpen && (
            <ul className="py-2 space-y-2 ps-6">
              <li><NavLink to="/accounting/chart-of-accounts" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('chart_of_accounts')}</NavLink></li>
              <li><NavLink to="/accounting/journal-entries" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('journal_entries')}</NavLink></li>
              <li><NavLink to="/accounting/receipt-vouchers" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('receipt_vouchers')}</NavLink></li>
              <li><NavLink to="/accounting/payment-vouchers" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('payment_vouchers')}</NavLink></li>
            </ul>
          )}
        </li>
        
        <li>
          <button onClick={() => setContactsOpen(!isContactsOpen)} className="flex items-center w-full p-2.5 text-base font-medium text-[rgb(var(--color-text-secondary))] rounded-lg hover:bg-[rgb(var(--color-muted))]">
            <ContactsIcon />
            <span className="flex-1 ms-3 text-start whitespace-nowrap">{t('contacts')}</span>
            <ChevronDownIcon className={`transform transition-transform ${isContactsOpen ? 'rotate-180' : ''}`} />
          </button>
          {isContactsOpen && (
            <ul className="py-2 space-y-2 ps-6">
              <li><NavLink to="/contacts/customers" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('customers')}</NavLink></li>
              <li><NavLink to="/contacts/suppliers" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('suppliers')}</NavLink></li>
            </ul>
          )}
        </li>

        {canViewSettings && (
          <li>
            <button onClick={() => setSettingsOpen(!isSettingsOpen)} className="flex items-center w-full p-2.5 text-base font-medium text-[rgb(var(--color-text-secondary))] rounded-lg hover:bg-[rgb(var(--color-muted))]">
              <SettingsIcon />
              <span className="flex-1 ms-3 text-start whitespace-nowrap">{t('settings')}</span>
              <ChevronDownIcon className={`transform transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSettingsOpen && (
              <ul className="py-2 space-y-2 ps-6">
                {hasPermission('settings:products:view') && <li><NavLink to="/settings/products" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('products_and_services')}</NavLink></li>}
                {hasPermission('settings:users:view') && <li><NavLink to="/settings/users" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('user_management')}</NavLink></li>}
                {hasPermission('settings:roles:view') && <li><NavLink to="/settings/roles" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('role_management')}</NavLink></li>}
                {hasPermission('settings:app:view') && <li><NavLink to="/settings/app" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('app_settings')}</NavLink></li>}
              </ul>
            )}
          </li>
        )}
        <li>
            <NavLink to="/profile" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                <UserIcon />
                <span className="ms-3">{t('profile')}</span>
            </NavLink>
        </li>
      </ul>
    </div>
  );
  
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar container */}
      <aside 
        className={`fixed lg:relative inset-y-0 start-0 z-40 w-72 h-full transition-transform transform ${isSidebarOpen ? 'translate-x-0' : (config.dir === 'rtl' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')}`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
