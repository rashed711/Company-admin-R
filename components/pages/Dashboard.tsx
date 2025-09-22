import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { SalesIcon, InvoiceIcon, CustomersIcon, SuppliersIcon, UserIcon } from '../icons/Icons';
import { useTranslation } from '../../services/localization';
import { useAppSettings } from '../../contexts/AppSettingsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getDashboardCounts } from '../../services/api';

const Dashboard = () => {
  const { config, companyInfo } = useAppSettings();
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const colors = useThemeColors();
  const [counts, setCounts] = useState({
    quotations_count: 0,
    invoices_count: 0,
    customers_count: 0,
    suppliers_count: 0,
    users_count: 0,
  });

  useEffect(() => {
      const fetchCounts = async () => {
          const data = await getDashboardCounts();
          setCounts({
              quotations_count: data.quotations_count || 0,
              invoices_count: data.invoices_count || 0,
              customers_count: data.customers_count || 0,
              suppliers_count: data.suppliers_count || 0,
              users_count: data.users_count || 0,
          });
      };
      fetchCounts();
  }, []);

  // Mock data for the chart
  const salesData = [
    { name: t('month_jan'), [t('sales')]: 4000, [t('purchases')]: 2400 },
    { name: t('month_feb'), [t('sales')]: 3000, [t('purchases')]: 1398 },
    { name: t('month_mar'), [t('sales')]: 2000, [t('purchases')]: 9800 },
    { name: t('month_apr'), [t('sales')]: 2780, [t('purchases')]: 3908 },
    { name: t('month_may'), [t('sales')]: 1890, [t('purchases')]: 4800 },
    { name: t('month_jun'), [t('sales')]: 2390, [t('purchases')]: 3800 },
  ];
  
  const showFinancials = hasPermission('dashboard:financials:view');
  const showUserStats = hasPermission('dashboard:users-summary:view');

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-[rgb(var(--color-text-primary))] mb-8">{t('welcome_message', { appName: companyInfo.APP_NAME.value })}</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {showFinancials && <Card title={t('quotations_count')} value={String(counts.quotations_count)} icon={<SalesIcon />} />}
        {showFinancials && <Card title={t('sales_invoices_count')} value={String(counts.invoices_count)} icon={<InvoiceIcon />} />}
        <Card title={t('customer_count')} value={String(counts.customers_count)} icon={<CustomersIcon />} />
        <Card title={t('supplier_count')} value={String(counts.suppliers_count)} icon={<SuppliersIcon />} />
        {showUserStats && <Card title={t('users_count')} value={String(counts.users_count)} icon={<UserIcon />} />}
      </div>

      {/* Sales Chart */}
      {showFinancials && (
        <div className="bg-[rgb(var(--color-surface))] p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-[rgb(var(--color-text-primary))]">{t('sales_and_purchases_overview')}</h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart
                data={salesData}
                margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
                layout="horizontal"
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis dataKey="name" tick={{ fill: colors.textSecondary }} />
                <YAxis reversed={config.dir === 'rtl'} orientation={config.dir === 'rtl' ? 'right' : 'left'} tick={{ fill: colors.textSecondary }}/>
                <Tooltip
                  contentStyle={{ 
                      backgroundColor: colors.surface, 
                      borderColor: colors.border,
                      borderRadius: '0.75rem',
                      color: colors.textPrimary,
                  }}
                  cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}
                />
                <Legend wrapperStyle={{ color: colors.textSecondary }} />
                <Bar dataKey={t('sales')} fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey={t('purchases')} fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;