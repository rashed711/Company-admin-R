import React from 'react';
import { useTranslation } from '../../services/localization';
import { useLocation, Link } from 'react-router-dom';
import { useAppSettings } from '../../contexts/AppSettingsContext';
import Button from '../ui/Button';
import { ArrowLeftIcon, ArrowRightIcon, MenuIcon, MoonIcon, SunIcon } from '../icons/Icons';

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { config, theme, toggleTheme } = useAppSettings();

  const { title, backLink } = React.useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    let title = t('dashboard');
    let backLink: string | undefined = undefined;

    if (segments.length === 0) {
      return { title, backLink };
    }

    const [page, id, action, subAction, finalAction] = segments;

    // Default list pages
    const listTitles: { [key: string]: any } = {
      dashboard: 'dashboard', profile: 'profile',
      quotations: 'quotations',
      customers: 'customers', suppliers: 'suppliers',
      'chart-of-accounts': 'chart_of_accounts', 'journal-entries': 'journal_entries',
      'receipt-vouchers': 'receipt_vouchers', 'payment-vouchers': 'payment_vouchers',
      products: 'products_and_services', users: 'user_management', roles: 'role_management', app: 'app_settings'
    };

    if (segments.length === 1 && listTitles[page]) {
      return { title: t(listTitles[page]) };
    }

    // Nested pages
    if (page === 'quotations') {
      if (!id) title = t('quotations');
      else if (id === 'new') { title = t('new_quotation'); backLink = '/quotations'; }
      else if (action === 'edit') { title = t('edit_quotation'); backLink = `/quotations/${id}`; }
      else { title = t('quotation_details'); backLink = '/quotations'; }
    } else if (page === 'invoices') {
      if (!id) title = t('invoices_menu');
      else if (id === 'sales') {
        if (!action) title = t('sales_invoices');
        else if (action === 'new') { title = t('new_invoice'); backLink = '/invoices/sales'; }
        else if (subAction === 'edit') { title = t('edit_invoice'); backLink = `/invoices/sales/${action}`; }
        else { title = t('invoice_details'); backLink = '/invoices/sales'; }
      } else if (id === 'purchases') {
        if (!action) title = t('purchase_invoices');
        else if (action === 'new') { title = t('new_supplier_invoice'); backLink = '/invoices/purchases'; }
        else if (subAction === 'edit') { title = t('edit_supplier_invoice'); backLink = `/invoices/purchases/${action}`; }
        else { title = t('purchase_invoice_details'); backLink = '/invoices/purchases'; }
      }
    } else if (page === 'contacts') {
      if (!id) title = t('contacts');
      else if (id === 'customers') {
        if (!action) title = t('customers');
        else if (subAction === 'statement') {
          if (finalAction === 'view') { title = t('account_statement'); backLink = `/contacts/customers/${action}/statement`; }
          else { title = t('account_statement'); backLink = '/contacts/customers'; }
        }
      } else if (id === 'suppliers') {
        if (!action) title = t('suppliers');
        else if (subAction === 'statement') {
          if (finalAction === 'view') { title = t('supplier_statement'); backLink = `/contacts/suppliers/${action}/statement`; }
          else { title = t('supplier_statement'); backLink = '/contacts/suppliers'; }
        }
      }
    } else if (page === 'accounting') {
      if (!id) title = t('accounting');
      else if (id === 'receipt-vouchers') {
        if (!action) title = t('receipt_vouchers');
        else if (subAction === 'edit') { title = t('edit'); backLink = `/accounting/receipt-vouchers/${action}`; }
        else { title = t('receipt_voucher'); backLink = '/accounting/receipt-vouchers'; }
      } else if (id === 'payment-vouchers') {
        if (!action) title = t('payment_vouchers');
        else if (subAction === 'edit') { title = t('edit'); backLink = `/accounting/payment-vouchers/${action}`; }
        else { title = t('payment_voucher'); backLink = '/accounting/payment-vouchers'; }
      } else if (listTitles[id]) {
        title = t(listTitles[id]);
      }
    } else if (page === 'settings') {
      if (!id) title = t('settings');
      else if (listTitles[id]) title = t(listTitles[id]);
    }

    return { title, backLink };
  }, [location.pathname, t]);

  const TitleComponent = <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">{title}</h2>;
  
  const MenuButton = (
    <button className="lg:hidden p-2 -ms-2" onClick={() => setSidebarOpen(true)}>
      <MenuIcon />
    </button>
  );
  
  const BackButton = (
    <Button as={Link} to={backLink!} variant="outline" size="sm" className="!p-2 rounded-full aspect-square" aria-label={t('back_to_list')}>
      {config.dir === 'rtl' ? <ArrowRightIcon className="w-5 h-5" /> : <ArrowLeftIcon className="w-5 h-5" />}
    </Button>
  );
  
  const ThemeToggleButton = (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text-primary))]"
      aria-label={theme === 'light' ? t('toggle_theme_to_dark') : t('toggle_theme_to_light')}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );

  let content;
  if (backLink) {
    // Per user request, back button is always visually to the left of the title.
    // This is the default behavior for flex items in both LTR and RTL.
    content = <>{BackButton} {TitleComponent}</>;
  } else {
    // Menu button follows standard RTL/LTR conventions (start of the line).
    // In RTL, the menu button should be on the right, which is the start. 
    // Flexbox with `dir="rtl"` reverses the visual order, so we swap them in the DOM for RTL.
    if (config.dir === 'rtl') {
        content = <>{TitleComponent} {MenuButton}</>;
    } else {
        content = <>{MenuButton} {TitleComponent}</>;
    }
  }

  return (
    <header className="flex items-center justify-between p-4 bg-[rgb(var(--color-surface))] shadow-sm">
      <div className="flex items-center gap-3">
        {content}
      </div>
      <div className="flex items-center gap-2">
        {ThemeToggleButton}
      </div>
    </header>
  );
};

export default Header;
