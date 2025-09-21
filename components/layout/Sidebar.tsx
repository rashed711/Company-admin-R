
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, SalesIcon, InvoiceIcon, ContactsIcon, SettingsIcon, ChevronDownIcon, MenuIcon, XIcon, AccountingIcon } from '../icons/Icons';
import { useTranslation } from '../../services/localization';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSettings } from '../../contexts/AppSettingsContext';
import { Permission } from '../../types';

const Sidebar = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const { companyInfo } = useAppSettings();
  const [isAccountingOpen, setAccountingOpen] = useState(false);
  const [isInvoicesOpen, setInvoicesOpen] = useState(true);
  const [isContactsOpen, setContactsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const linkClasses = "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700";
  const activeLinkClasses = "bg-sky-100 dark:bg-sky-900";

  // Check if the user has permission to see any of the settings pages
  const canViewSettings = [
    'settings:products:view', 'settings:users:view', 
    'settings:roles:view', 'settings:app:view'
  ].some(p => hasPermission(p as Permission));

  const SidebarContent = () => (
    <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400">{companyInfo.APP_NAME.value}</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <XIcon />
            </button>
        </div>
      <ul className="space-y-2">
        <li>
          <NavLink to="/dashboard" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
            <DashboardIcon />
            <span className="ms-3">{t('dashboard')}</span>
          </NavLink>
        </li>
        
        {hasPermission('sales:quotations:view') && (
          <li>
            <NavLink to="/quotations" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
              <SalesIcon />
              <span className="ms-3">{t('quotations')}</span>
            </NavLink>
          </li>
        )}

        {hasPermission('sales:invoices:view') || hasPermission('purchases:invoices:view') ? (
            <li>
            <button onClick={() => setInvoicesOpen(!isInvoicesOpen)} className="flex items-center w-full p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                <InvoiceIcon />
                <span className="flex-1 ms-3 text-start whitespace-nowrap">{t('invoices_menu')}</span>
                <ChevronDownIcon className={`transform transition-transform ${isInvoicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {isInvoicesOpen && (
                <ul className="py-2 space-y-2 ms-4">
                {hasPermission('sales:invoices:view') && <li><NavLink to="/invoices/sales" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('sales_invoices')}</NavLink></li>}
                {hasPermission('purchases:invoices:view') && <li><NavLink to="/invoices/purchases" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('purchase_invoices')}</NavLink></li>}
                </ul>
            )}
            </li>
        ) : null}

        <li>
          <button onClick={() => setAccountingOpen(!isAccountingOpen)} className="flex items-center w-full p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
            <AccountingIcon />
            <span className="flex-1 ms-3 text-start whitespace-nowrap">{t('accounting')}</span>
            <ChevronDownIcon className={`transform transition-transform ${isAccountingOpen ? 'rotate-180' : ''}`} />
          </button>
          {isAccountingOpen && (
            <ul className="py-2 space-y-2 ms-4">
              <li><NavLink to="/accounting/chart-of-accounts" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('chart_of_accounts')}</NavLink></li>
              <li><NavLink to="/accounting/journal-entries" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('journal_entries')}</NavLink></li>
              <li><NavLink to="/accounting/receipt-vouchers" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('receipt_vouchers')}</NavLink></li>
              <li><NavLink to="/accounting/payment-vouchers" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('payment_vouchers')}</NavLink></li>
            </ul>
          )}
        </li>
        
        <li>
          <button onClick={() => setContactsOpen(!isContactsOpen)} className="flex items-center w-full p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
            <ContactsIcon />
            <span className="flex-1 ms-3 text-start whitespace-nowrap">{t('contacts')}</span>
            <ChevronDownIcon className={`transform transition-transform ${isContactsOpen ? 'rotate-180' : ''}`} />
          </button>
          {isContactsOpen && (
            <ul className="py-2 space-y-2 ms-4">
              <li><NavLink to="/contacts/customers" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('customers')}</NavLink></li>
              <li><NavLink to="/contacts/suppliers" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('suppliers')}</NavLink></li>
            </ul>
          )}
        </li>

        {canViewSettings && (
          <li>
            <button onClick={() => setSettingsOpen(!isSettingsOpen)} className="flex items-center w-full p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
              <SettingsIcon />
              <span className="flex-1 ms-3 text-start whitespace-nowrap">{t('settings')}</span>
              <ChevronDownIcon className={`transform transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSettingsOpen && (
              <ul className="py-2 space-y-2 ms-4">
                {hasPermission('settings:products:view') && <li><NavLink to="/settings/products" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('products_and_services')}</NavLink></li>}
                {hasPermission('settings:users:view') && <li><NavLink to="/settings/users" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('user_management')}</NavLink></li>}
                {hasPermission('settings:roles:view') && <li><NavLink to="/settings/roles" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('role_management')}</NavLink></li>}
                {hasPermission('settings:app:view') && <li><NavLink to="/settings/app" onClick={() => setSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>{t('app_settings')}</NavLink></li>}
              </ul>
            )}
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <>
      <button onClick={() => setSidebarOpen(true)} className="lg:hidden fixed top-4 end-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-md">
        <MenuIcon />
      </button>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed top-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden w-64 ${isSidebarOpen ? 'start-0' : '-start-full'}`}>
          <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0" aria-label="Sidebar">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;