// NOTE: In a real production app, use environment variables for sensitive data.
// For example: process.env.REACT_APP_SUPABASE_URL
import { LocaleKey, LocaleConfig, CompanyInfo } from './types';

export const SUPABASE_CONFIG = {
  URL: 'https://glymmefvutzthumkmjaw.supabase.co', // Replace with your Supabase project URL
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdseW1tZWZ2dXR6dGh1bWttamF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0ODI0ODIsImV4cCI6MjA3NDA1ODQ4Mn0.Bekhbp6X2sATXoE-YNxQKS6Bxs6bQpIf_iZD8WPYdOE', // Replace with your Supabase anon key
};

// Renamed to DEFAULT_COMPANY_INFO to act as an initial value.
// The app state will manage the editable company information.
export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  APP_NAME: { value: 'Company', showInHeader: false },
  NAME: { value: 'Company TEC.', showInHeader: true },
  NAME_AR: { value: 'Company For solution', showInHeader: true },
  EMAIL: { value: 'info@Company-app.com', showInHeader: true },
  PHONE: { value: '+966111234567', showInHeader: true },
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