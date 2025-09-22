
import React from 'react';
import { Customer, Supplier, AccountTransaction, CompanyInfo, LocaleConfig } from '../../types';
import { useTranslation } from '../../services/localization';

type Entity = Customer | Supplier;

interface StatementViewerProps {
  entity: Entity;
  transactions: AccountTransaction[];
  openingBalance: number;
  finalBalance: number;
  type: 'customer' | 'supplier';
  companyInfo: CompanyInfo;
  config: LocaleConfig;
}

const StatementViewer: React.FC<StatementViewerProps> = ({ entity, transactions, openingBalance, finalBalance, type, companyInfo, config }) => {
  const { t } = useTranslation();
  const isRTL = config.dir === 'rtl';

  const entityTypeLabel = type === 'customer' ? t('customer') : t('supplier');
  const statementTitle = type === 'customer' ? t('statement_for_customer') : t('statement_for_supplier');

  const companyHeaderDetails: { key: keyof CompanyInfo; label?: any }[] = isRTL
    ? [ { key: 'NAME_AR' }, { key: 'ADDRESS_AR' }, { key: 'PHONE', label: 'phone' }, { key: 'EMAIL', label: 'email' }, { key: 'TAX_NUMBER', label: 'tax_number' } ]
    : [ { key: 'NAME' }, { key: 'ADDRESS' }, { key: 'PHONE', label: 'phone' }, { key: 'EMAIL', label: 'email' }, { key: 'TAX_NUMBER', label: 'tax_number' } ];


  return (
    <div className="bg-[rgb(var(--color-muted))] p-4 sm:p-8 rounded-lg">
        <div id="print-area" className="bg-[rgb(var(--color-surface))] shadow-lg rounded-lg p-8 md:p-12 max-w-4xl mx-auto text-[rgb(var(--color-text-primary))]">
            <header className="flex justify-between items-start mb-12 border-b border-[rgb(var(--color-border))] pb-6">
                <div className={`text-${isRTL ? 'right' : 'left'} space-y-1`}>
                    {companyHeaderDetails.map(({ key, label }) => {
                        const info = companyInfo[key];
                        if (info && info.showInHeader && info.value) {
                            const content = label ? `${t(label)}: ${info.value}` : info.value;
                            const isName = key === 'NAME' || key === 'NAME_AR';
                            return isName 
                                ? <h1 key={key} className="text-2xl font-bold text-sky-600 dark:text-sky-400">{content}</h1>
                                : <p key={key} className="text-sm">{content}</p>;
                        }
                        return null;
                    })}
                </div>
                <div className={`text-${isRTL ? 'left' : 'right'}`}>
                    <h2 className="text-3xl font-bold uppercase">{t('account_statement')}</h2>
                    <p className="mt-2">{`${t('date')}: ${new Date().toLocaleDateString()}`}</p>
                </div>
            </header>

            <section className="mb-8 p-4 border rounded-lg border-[rgb(var(--color-border))]">
                 <h3 className="text-lg font-semibold">{statementTitle}</h3>
                 <p>{`${entityTypeLabel}: ${entity.name}`}</p>
                 <p>{`${t('email')}: ${entity.email}`}</p>
                 <p>{`${t('phone')}: ${entity.phone}`}</p>
            </section>
            
            <section>
                <table className="w-full text-sm text-start">
                    <thead className="bg-[rgb(var(--color-muted))]">
                        <tr>
                            <th className={`p-3 font-semibold text-${isRTL ? 'right' : 'left'}`}>{t('date')}</th>
                            <th className={`p-3 font-semibold text-${isRTL ? 'right' : 'left'}`}>{t('time')}</th>
                            <th className={`p-3 font-semibold text-${isRTL ? 'right' : 'left'}`}>{t('description')}</th>
                            <th className={`p-3 font-semibold text-${isRTL ? 'left' : 'right'}`}>{t('debit')}</th>
                            <th className={`p-3 font-semibold text-${isRTL ? 'left' : 'right'}`}>{t('credit')}</th>
                            <th className={`p-3 font-semibold text-${isRTL ? 'left' : 'right'}`}>{t('balance')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...transactions].reverse().map((tx) => (
                             <tr key={tx.id} className="border-b border-[rgb(var(--color-border))]">
                                <td className="p-3">{tx.date}</td>
                                <td className="p-3">{tx.time}</td>
                                <td className="p-3">{tx.description}</td>
                                <td className={`p-3 text-${isRTL ? 'left' : 'right'}`}>{tx.debit > 0 ? tx.debit.toLocaleString(undefined, {minimumFractionDigits: 2}) : '-'}</td>
                                <td className={`p-3 text-${isRTL ? 'left' : 'right'}`}>{tx.credit > 0 ? tx.credit.toLocaleString(undefined, {minimumFractionDigits: 2}) : '-'}</td>
                                <td className={`p-3 text-${isRTL ? 'left' : 'right'}`}>{tx.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                             </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold bg-[rgb(var(--color-muted))]">
                            <td colSpan={5} className={`p-3 text-${isRTL ? 'right' : 'left'}`}>{t('total')}</td>
                            <td className={`p-3 text-${isRTL ? 'left' : 'right'}`}>{`${finalBalance.toLocaleString(undefined, {minimumFractionDigits: 2})} ${config.currencySymbol}`}</td>
                        </tr>
                    </tfoot>
                </table>
            </section>
        </div>
    </div>
  );
};

export default StatementViewer;
