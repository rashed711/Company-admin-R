
import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { LOCALES_CONFIG, DEFAULT_LOCALE_KEY, DEFAULT_COMPANY_INFO } from '../config';
import { LocaleKey, LocaleConfig, CompanyInfo, DocumentTemplate } from '../types';

interface AppSettingsContextType {
  localeKey: LocaleKey;
  setLocaleKey: (key: LocaleKey) => void;
  config: LocaleConfig;
  taxRate: number;
  setTaxRate: (rate: number) => void;
  companyInfo: CompanyInfo;
  setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
  quotationTemplate: DocumentTemplate;
  setQuotationTemplate: React.Dispatch<React.SetStateAction<DocumentTemplate>>;
  salesInvoiceTemplate: DocumentTemplate;
  setSalesInvoiceTemplate: React.Dispatch<React.SetStateAction<DocumentTemplate>>;
  purchaseInvoiceTemplate: DocumentTemplate;
  setPurchaseInvoiceTemplate: React.Dispatch<React.SetStateAction<DocumentTemplate>>;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const defaultTemplate: DocumentTemplate = {
  header: '',
  footer: 'شكراً لتعاملكم معنا!',
  termsAndConditions: '1. يتم دفع 50% من المبلغ مقدماً.\n2. مدة صلاحية عرض السعر 30 يوماً.',
  headerImage: null,
  showTitleInHeader: true,
};


export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [localeKey, setLocaleKey] = useState<LocaleKey>(DEFAULT_LOCALE_KEY);
  
  const config = useMemo(() => LOCALES_CONFIG[localeKey], [localeKey]);
  
  const [taxRate, setTaxRate] = useState<number>(config.taxRate);

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(DEFAULT_COMPANY_INFO);
  const [quotationTemplate, setQuotationTemplate] = useState<DocumentTemplate>(defaultTemplate);
  const [salesInvoiceTemplate, setSalesInvoiceTemplate] = useState<DocumentTemplate>({
    ...defaultTemplate,
    termsAndConditions: 'يجب سداد المبلغ خلال 30 يوماً من تاريخ الفاتورة.',
  });
  const [purchaseInvoiceTemplate, setPurchaseInvoiceTemplate] = useState<DocumentTemplate>({
    ...defaultTemplate,
    termsAndConditions: 'يجب سداد المبلغ عند الاستلام.',
  });

  // Update taxRate when locale changes
  useEffect(() => {
    setTaxRate(config.taxRate);
  }, [config.taxRate]);
  

  const value = {
    localeKey,
    setLocaleKey,
    config,
    taxRate,
    setTaxRate,
    companyInfo,
    setCompanyInfo,
    quotationTemplate,
    setQuotationTemplate,
    salesInvoiceTemplate,
    setSalesInvoiceTemplate,
    purchaseInvoiceTemplate,
    setPurchaseInvoiceTemplate,
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
