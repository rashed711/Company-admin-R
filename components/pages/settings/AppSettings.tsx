
import React from 'react';
import { useAppSettings } from '../../../contexts/AppSettingsContext';
import { useTranslation } from '../../../services/localization';
import { LocaleKey, DocumentTemplate, CompanyInfo } from '../../../types';
import Button from '../../ui/Button';

type TranslationKeys = ReturnType<typeof useTranslation>['t'];

// A reusable component for a setting section
const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{title}</h2>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

// A reusable input component
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
        </label>
        <input
            {...props}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
        />
    </div>
);

// A reusable textarea component
const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
        </label>
        <textarea
            {...props}
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
        />
    </div>
);

const ImageUploadField: React.FC<{
  label: string;
  imageUrl: string | null | undefined;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
}> = ({ label, imageUrl, onImageUpload, onImageRemove }) => {
  const { t } = useTranslation();
  const inputId = `image-upload-${label.replace(/\s+/g, '-')}`;
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        {imageUrl ? (
          <div className="relative">
            <img src={imageUrl} alt="Header preview" className="h-20 w-auto rounded-lg border dark:border-gray-600" />
            <button
              onClick={onImageRemove}
              className="absolute top-0 end-0 -mt-2 -me-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-sm"
              aria-label={t('remove_image')}
            >
              &times;
            </button>
          </div>
        ) : (
          <div className="h-20 w-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-400">
            {t('no_image')}
          </div>
        )}
        <div>
          <input
            type="file"
            id={inputId}
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && onImageUpload(e.target.files[0])}
          />
          <Button as="label" htmlFor={inputId} variant="outline" size="sm" className="cursor-pointer">
            {t('upload_image')}
          </Button>
        </div>
      </div>
    </div>
  );
};


const AppSettings = () => {
  const { 
    localeKey, setLocaleKey, 
    taxRate, setTaxRate,
    companyInfo, setCompanyInfo,
    quotationTemplate, setQuotationTemplate,
    salesInvoiceTemplate, setSalesInvoiceTemplate,
    purchaseInvoiceTemplate, setPurchaseInvoiceTemplate,
  } = useAppSettings();
  const { t } = useTranslation();

  const handleCompanyInfoChange = (key: keyof CompanyInfo, field: 'value' | 'showInHeader', fieldValue: string | boolean) => {
    setCompanyInfo(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: fieldValue,
      },
    }));
  };

  const handleTemplateChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<DocumentTemplate>>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setter(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleImageUpload = (
    file: File | null,
    setter: React.Dispatch<React.SetStateAction<DocumentTemplate>>
  ) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(prev => ({ ...prev, headerImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (setter: React.Dispatch<React.SetStateAction<DocumentTemplate>>) => {
    setter(prev => ({ ...prev, headerImage: null }));
  };
  
  const handleSave = () => {
    // In a real app, you would persist these settings, e.g., to localStorage or a user profile in the database.
    alert('Settings saved!');
  };
  
  const companyInfoLabels: Record<keyof CompanyInfo, Parameters<TranslationKeys>[0]> = {
      APP_NAME: 'app_name',
      NAME: 'company_name_en',
      NAME_AR: 'company_name_ar',
      EMAIL: 'email',
      PHONE: 'phone',
      ADDRESS: 'company_address_en',
      ADDRESS_AR: 'company_address_ar',
      TAX_NUMBER: 'tax_number'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('app_settings')}</h1>
        <Button onClick={handleSave}>{t('save_changes')}</Button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <SettingsSection title={t('company_information')}>
            {Object.entries(companyInfo).map(([key, detail]) => {
                const typedKey = key as keyof CompanyInfo;
                return (
                    <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end border-b dark:border-gray-700 pb-4 last:border-b-0">
                        <InputField 
                          label={t(companyInfoLabels[typedKey])}
                          name={key}
                          value={detail.value}
                          onChange={(e) => handleCompanyInfoChange(typedKey, 'value', e.target.value)}
                        />
                        <div className="flex items-center pb-2.5">
                          <input
                            type="checkbox"
                            id={`show-${key}`}
                            checked={detail.showInHeader}
                            onChange={(e) => handleCompanyInfoChange(typedKey, 'showInHeader', e.target.checked)}
                            className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor={`show-${key}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {t('show_in_header')}
                          </label>
                        </div>
                    </div>
                );
            })}
        </SettingsSection>

        <SettingsSection title={t('quotation_template_settings')}>
          <ImageUploadField
            label={t('header_image')}
            imageUrl={quotationTemplate.headerImage}
            onImageUpload={(file) => handleImageUpload(file, setQuotationTemplate)}
            onImageRemove={() => handleImageRemove(setQuotationTemplate)}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showTitleQuotation"
              name="showTitleInHeader"
              checked={quotationTemplate.showTitleInHeader}
              onChange={(e) => handleTemplateChange(e, setQuotationTemplate)}
              className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="showTitleQuotation" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              {t('show_document_title')}
            </label>
          </div>
          <TextareaField label={t('header')} name="header" value={quotationTemplate.header} onChange={(e) => handleTemplateChange(e, setQuotationTemplate)} />
          <TextareaField label={t('footer')} name="footer" value={quotationTemplate.footer} onChange={(e) => handleTemplateChange(e, setQuotationTemplate)} />
          <TextareaField label={t('terms_and_conditions')} name="termsAndConditions" value={quotationTemplate.termsAndConditions} onChange={(e) => handleTemplateChange(e, setQuotationTemplate)} />
        </SettingsSection>

        <SettingsSection title={t('sales_invoice_template_settings')}>
          <ImageUploadField
            label={t('header_image')}
            imageUrl={salesInvoiceTemplate.headerImage}
            onImageUpload={(file) => handleImageUpload(file, setSalesInvoiceTemplate)}
            onImageRemove={() => handleImageRemove(setSalesInvoiceTemplate)}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showTitleSalesInvoice"
              name="showTitleInHeader"
              checked={salesInvoiceTemplate.showTitleInHeader}
              onChange={(e) => handleTemplateChange(e, setSalesInvoiceTemplate)}
              className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="showTitleSalesInvoice" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              {t('show_document_title')}
            </label>
          </div>
          <TextareaField label={t('header')} name="header" value={salesInvoiceTemplate.header} onChange={(e) => handleTemplateChange(e, setSalesInvoiceTemplate)} />
          <TextareaField label={t('footer')} name="footer" value={salesInvoiceTemplate.footer} onChange={(e) => handleTemplateChange(e, setSalesInvoiceTemplate)} />
          <TextareaField label={t('terms_and_conditions')} name="termsAndConditions" value={salesInvoiceTemplate.termsAndConditions} onChange={(e) => handleTemplateChange(e, setSalesInvoiceTemplate)} />
        </SettingsSection>

        <SettingsSection title={t('purchase_invoice_template_settings')}>
          <ImageUploadField
            label={t('header_image')}
            imageUrl={purchaseInvoiceTemplate.headerImage}
            onImageUpload={(file) => handleImageUpload(file, setPurchaseInvoiceTemplate)}
            onImageRemove={() => handleImageRemove(setPurchaseInvoiceTemplate)}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showTitlePurchaseInvoice"
              name="showTitleInHeader"
              checked={purchaseInvoiceTemplate.showTitleInHeader}
              onChange={(e) => handleTemplateChange(e, setPurchaseInvoiceTemplate)}
              className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="showTitlePurchaseInvoice" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              {t('show_document_title')}
            </label>
          </div>
          <TextareaField label={t('header')} name="header" value={purchaseInvoiceTemplate.header} onChange={(e) => handleTemplateChange(e, setPurchaseInvoiceTemplate)} />
          <TextareaField label={t('footer')} name="footer" value={purchaseInvoiceTemplate.footer} onChange={(e) => handleTemplateChange(e, setPurchaseInvoiceTemplate)} />
          <TextareaField label={t('terms_and_conditions')} name="termsAndConditions" value={purchaseInvoiceTemplate.termsAndConditions} onChange={(e) => handleTemplateChange(e, setPurchaseInvoiceTemplate)} />
        </SettingsSection>
        
        <SettingsSection title={t('regional_settings')}>
            <div>
              <label htmlFor="locale-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {t('locale')}
              </label>
              <select id="locale-select" value={localeKey} onChange={(e) => setLocaleKey(e.target.value as LocaleKey)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500">
                <option value="ar-SA">{t('ar-SA')}</option>
                <option value="ar-EG">{t('ar-EG')}</option>
                <option value="en-US">{t('en-US')}</option>
              </select>
            </div>
            <InputField label={`${t('tax_rate')} (%)`} type="number" step="0.01" min="0" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
        </SettingsSection>
      </div>
    </div>
  );
};

export default AppSettings;
