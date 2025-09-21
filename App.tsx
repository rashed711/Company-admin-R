
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/pages/Dashboard';
import QuotationsList from './components/pages/sales/QuotationsList';
import InvoicesList from './components/pages/sales/InvoicesList';
import SupplierInvoicesList from './components/pages/purchases/SupplierInvoicesList';
import ProductsList from './components/pages/settings/ProductsList';
import CustomersList from './components/pages/contacts/CustomersList';
import SuppliersList from './components/pages/contacts/SuppliersList';
import AppSettings from './components/pages/settings/AppSettings';
import ReceiptVouchersList from './components/pages/accounting/ReceiptVouchersList';
import PaymentVouchersList from './components/pages/accounting/PaymentVouchersList';
import CustomerStatement from './components/pages/contacts/CustomerStatement';
import { AppSettingsProvider, useAppSettings } from './contexts/AppSettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ChartOfAccounts from './components/pages/accounting/ChartOfAccounts';
import JournalEntriesList from './components/pages/accounting/JournalEntriesList';
import LoginPage from './components/pages/auth/LoginPage';
import UsersList from './components/pages/settings/UsersList';
import RolesList from './components/pages/settings/RolesList';
import QuotationDetail from './components/pages/sales/QuotationDetail';
import InvoiceDetail from './components/pages/sales/InvoiceDetail';
import QuotationEdit from './components/pages/sales/QuotationEdit';

// This component handles app-wide settings like language direction and contains the main routing logic.
const AppRouter = () => {
  const { config } = useAppSettings();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.documentElement.lang = config.language;
    document.documentElement.dir = config.dir;
  }, [config]);

  return (
    <HashRouter>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
        {isAuthenticated ? (
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quotations" element={<QuotationsList />} />
              <Route path="/quotations/:id" element={<QuotationDetail />} />
              <Route path="/quotations/:id/edit" element={<QuotationEdit />} />
              <Route path="/invoices/sales" element={<InvoicesList />} />
              <Route path="/invoices/sales/:id" element={<InvoiceDetail />} />
              <Route path="/invoices/purchases" element={<SupplierInvoicesList />} />
              <Route path="/contacts/customers" element={<CustomersList />} />
              <Route path="/contacts/customers/:id/statement" element={<CustomerStatement />} />
              <Route path="/contacts/suppliers" element={<SuppliersList />} />
              <Route path="/accounting/chart-of-accounts" element={<ChartOfAccounts />} />
              <Route path="/accounting/journal-entries" element={<JournalEntriesList />} />
              <Route path="/accounting/receipt-vouchers" element={<ReceiptVouchersList />} />
              <Route path="/accounting/payment-vouchers" element={<PaymentVouchersList />} />
              <Route path="/settings/products" element={<ProductsList />} />
              <Route path="/settings/app" element={<AppSettings />} />
              <Route path="/settings/users" element={<UsersList />} />
              <Route path="/settings/roles" element={<RolesList />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </MainLayout>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </HashRouter>
  );
};

// The main App component wraps the application with context providers.
function App() {
  return (
    <AuthProvider>
      <AppSettingsProvider>
        <AppRouter />
      </AppSettingsProvider>
    </AuthProvider>
  );
}

export default App;