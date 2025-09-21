
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { SalesIcon, InvoiceIcon, CustomersIcon, SuppliersIcon, UserIcon } from '../icons/Icons';
import { useTranslation } from '../../services/localization';
import { useAppSettings } from '../../contexts/AppSettingsContext';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { config } = useAppSettings();
  const { t } = useTranslation();
  const { hasPermission } = useAuth();

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
      <h1 className="text-3xl font-bold mb-6">{t('welcome_to_enjaz')}</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {showFinancials && <Card title={t('quotations_count')} value="3" icon={<SalesIcon />} />}
        {showFinancials && <Card title={t('sales_invoices_count')} value="2" icon={<InvoiceIcon />} />}
        <Card title={t('customer_count')} value="128" icon={<CustomersIcon />} />
        <Card title={t('supplier_count')} value="42" icon={<SuppliersIcon />} />
        {showUserStats && <Card title={t('users_count')} value="5" icon={<UserIcon />} />}
      </div>

      {/* Sales Chart */}
      {showFinancials && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('sales_and_purchases_overview')}</h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart
                data={salesData}
                margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
                layout="horizontal"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis reversed={config.dir === 'rtl'} orientation={config.dir === 'rtl' ? 'right' : 'left'}/>
                <Tooltip
                  contentStyle={{ 
                      backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                      borderColor: '#4B5563',
                      borderRadius: '0.5rem'
                  }}
                  cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}
                />
                <Legend />
                <Bar dataKey={t('sales')} fill="#38bdf8" />
                <Bar dataKey={t('purchases')} fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
