// NOTE: In a real production app, use environment variables for sensitive data.
// For example: process.env.REACT_APP_SUPABASE_URL
import { LocaleKey, LocaleConfig, CompanyInfo } from './types';

export const SUPABASE_CONFIG = {
  URL: 'https://placeholder.supabase.co', // Replace with your Supabase project URL
  ANON_KEY: 'ey-placeholder-anon-key', // Replace with your Supabase anon key
};

// Renamed to DEFAULT_COMPANY_INFO to act as an initial value.
// The app state will manage the editable company information.
export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  APP_NAME: { value: 'إنجاز', showInHeader: false },
  NAME: { value: 'Enjaz Contracting Co.', showInHeader: true },
  NAME_AR: { value: 'شركة إنجاز للمقاولات', showInHeader: true },
  EMAIL: { value: 'info@enjaz-app.com', showInHeader: true },
  PHONE: { value: '+966 11 123 4567', showInHeader: true },
  ADDRESS: { value: '1234 King Fahd Rd, Riyadh, Saudi Arabia', showInHeader: true },
  ADDRESS_AR: { value: '1234 شارع الملك فهد، الرياض، المملكة العربية السعودية', showInHeader: true },
  TAX_NUMBER: { value: '300123456700003', showInHeader: true }
};

export const DEFAULT_LOCALE_KEY: LocaleKey = 'ar-EG';

export const LOCALES_CONFIG: Record<LocaleKey, LocaleConfig> = {
  'ar-SA': {
    language: 'ar',
    dialect: 'sa',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    taxRate: 15,
    dir: 'rtl',
  },
  'ar-EG': {
    language: 'ar',
    dialect: 'eg',
    currency: 'EGP',
    currencySymbol: 'ج.م',
    taxRate: 14,
    dir: 'rtl',
  },
  'en-US': {
    language: 'en',
    dialect: 'us',
    currency: 'USD',
    currencySymbol: '$',
    taxRate: 0,
    dir: 'ltr',
  },
};