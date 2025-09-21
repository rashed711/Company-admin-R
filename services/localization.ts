
import { useAppSettings } from '../contexts/AppSettingsContext';
import { LocaleKey } from '../types';

type TranslationKeys = {
  // Sidebar & Headers
  dashboard: string;
  sales: string;
  quotations: string;
  invoices: string;
  purchases: string;
  purchase_invoices: string;
  contacts: string;
  customers: string;
  suppliers: string;
  settings: string;
  products_and_services: string;
  invoices_menu: string;
  sales_invoices: string;
  app_settings: string;
  username_placeholder: string;
  accounting: string;
  receipt_vouchers: string;
  payment_vouchers: string;
  chart_of_accounts: string;
  journal_entries: string;
  user_management: string;
  role_management: string;
  logout: string;

  // General
  total: string;
  status: string;
  issue_date: string;
  due_date: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  price: string;
  type: string;
  subtotal: string;
  tax: string;
  tax_number: string;
  amount: string;
  payment_method: string;
  role: string;
  permissions: string;
  manager: string;
  module: string;
  category: string;
  unit: string;
  avg_purchase_price: string;
  avg_selling_price: string;
  product_name: string;
  apply_tax: string;
  discount: string;
  discount_type: string;
  percentage: string;
  amount_value: string;
  subtotal_before_discount: string;
  time: string;
  company: string;
  created_by: string;
  linked_document: string;

  // Page specific
  welcome_to_enjaz: string;
  total_sales: string;
  total_purchases: string;
  customer_count: string;
  supplier_count: string;
  sales_and_purchases_overview: string;
  quotation_no: string;
  customer: string;
  expiry_date: string;
  invoice_no: string;
  supplier: string;
  account_statement: string;
  statement_for_customer: string;
  statement_for_supplier: string;
  supplier_statement: string;
  opening_balance: string;
  debit: string;
  credit: string;
  balance: string;
  quotations_count: string;
  sales_invoices_count: string;
  users_count: string;
  account_number: string;
  account_name: string;
  account_type: string;
  entry_no: string;
  users: string;
  roles: string;
  quotation_details: string;
  invoice_details: string;
  purchase_invoice_details: string;
  company_name: string;
  contact_person: string;
  project_name: string;
  quotation_type: string;
  invoice_type: string;
  currency: string;
  currency_egp: string;
  
  // Actions
  new_quotation: string;
  new_invoice: string;
  new_supplier_invoice: string;
  new_customer: string;
  new_supplier: string;
  new_product_service: string;
  new_receipt_voucher: string;
  new_payment_voucher: string;
  new_account: string;
  new_journal_entry: string;
  edit: string;
  view: string;
  record_payment: string;
  convert_to_invoice: string;
  convert_to_invoice_alert: string; // Deprecated, but kept for safety
  conversion_success: string;
  conversion_error: string;
  converting: string;
  download_pdf: string;
  new_user: string;
  edit_user: string;
  edit_permissions: string;
  login: string;
  cancel: string;
  create: string;
  delete: string;
  print: string;
  convert: string;
  view_statement: string;
  back_to_list: string;
  print_document: string;
  share: string;
  add_item: string;
  edit_quotation: string;
  new_product: string;
  edit_product: string;
  edit_invoice: string;
  edit_supplier_invoice: string;

  // Others
  product: string;
  service: string;
  locale: string;
  tax_rate: string;
  save_changes: string;
  'ar-SA': string;
  'ar-EG': string;
  'en-US': string;
  email_address: string;
  password: string;
  select_product: string;
  select_customer: string;
  select_supplier: string;

  // Statuses
  draft: string;
  sent: string;
  accepted: string;
  rejected: string;
  paid: string;
  overdue: string;
  unpaid: string;
  partially_paid: string;
  
  // Payment Methods
  cash: string;
  bank_transfer: string;
  cheque: string;

  // PDF
  bill_to: string;
  quantity: string;
  thank_you_message: string;
  unspecified_customer: string;
  invoice: string;
  quotation: string;
  receipt_voucher: string;
  payment_voucher: string;
  purchase_invoice: string;
  supplier_information: string;

  // Months
  month_jan: string;
  month_feb: string;
  month_mar: string;
  month_apr: string;
  month_may: string;
  month_jun: string;

  // App Settings
  app_name: string;
  company_information: string;
  company_name_ar: string;
  company_name_en: string;
  company_address_ar: string;
  company_address_en: string;
  quotation_template_settings: string;
  sales_invoice_template_settings: string;
  purchase_invoice_template_settings: string;
  header: string;
  footer: string;
  terms_and_conditions: string;
  regional_settings: string;
  header_image: string;
  upload_image: string;
  remove_image: string;
  no_image: string;
  show_in_header: string;

  // Account Types
  asset: string;
  liability: string;
  equity: string;
  revenue: string;
  expense: string;
  
  // Permissions
  permission_group_dashboard: string;
  permission_dashboard_financials_view: string;
  permission_dashboard_users_summary_view: string;
  permission_group_sales: string;
  permission_module_quotations: string;
  permission_module_sales_invoices: string;
  permission_group_purchases: string;
  permission_module_purchase_invoices: string;
  permission_group_contacts: string;
  permission_module_customers: string;
  permission_module_suppliers: string;
  permission_group_accounting: string;
  permission_module_chart_of_accounts: string;
  permission_module_journal_entries: string;
  permission_module_receipt_vouchers: string;
  permission_module_payment_vouchers: string;
  permission_group_settings: string;
  permission_module_products: string;
  permission_module_users: string;
  permission_module_roles: string;
  permission_module_app_settings: string;

  permission_action_view: string;
  permission_action_view_team: string;
  permission_action_view_all: string;
  permission_action_create: string;
  permission_action_edit: string;
  permission_action_edit_team: string;
  permission_action_edit_all: string;
  permission_action_delete: string;
  permission_action_delete_team: string;
  permission_action_delete_all: string;
  permission_action_print: string;
  permission_action_convert: string;
  permission_action_view_statement: string;

  permission_scope: string;
  permission_scope_own: string;
  permission_scope_team: string;
  permission_scope_all: string;
  permission_scope_none: string;
  other_permissions: string;
};

const arSATranslations: TranslationKeys = {
  dashboard: 'لوحة التحكم', sales: 'المبيعات', quotations: 'عروض الأسعار', invoices: 'الفواتير',
  purchases: 'المشتريات', purchase_invoices: 'فواتير المشتريات', contacts: 'جهات الاتصال',
  customers: 'العملاء', suppliers: 'الموردين', settings: 'الإعدادات', products_and_services: 'المنتجات والخدمات',
  total: 'الإجمالي', status: 'الحالة', issue_date: 'تاريخ الإصدار', due_date: 'تاريخ الاستحقاق', name: 'الاسم',
  email: 'البريد الإلكتروني', phone: 'الهاتف', address: 'العنوان', description: 'الوصف', price: 'سعر البيع',
  type: 'النوع', welcome_to_enjaz: 'مرحباً بك في إنجاز', total_sales: 'إجمالي المبيعات',
  total_purchases: 'إجمالي المشتريات', customer_count: 'عدد العملاء', supplier_count: 'عدد الموردين',
  sales_and_purchases_overview: 'نظرة عامة على المبيعات والمشتريات', quotation_no: 'رقم العرض',
  customer: 'الشركة', expiry_date: 'تاريخ الانتهاء', invoice_no: 'رقم الفاتورة', supplier: 'المورد',
  new_quotation: 'إنشاء عرض سعر جديد', new_invoice: 'إنشاء فاتورة جديدة', new_supplier_invoice: 'إضافة فاتورة جديدة',
  new_customer: 'إضافة شركة جديدة', new_supplier: 'إضافة مورد جديد', new_product_service: 'إضافة منتج/خدمة',
  product: 'منتج', service: 'خدمة', invoices_menu: 'الفواتير', sales_invoices: 'فواتير المبيعات',
  app_settings: 'إعدادات التطبيق', locale: 'اللغة والمنطقة', tax_rate: 'نسبة الضريبة', 'ar-SA': 'العربية - السعودية',
  'ar-EG': 'العربية - مصر', 'en-US': 'الإنجليزية - الولايات المتحدة', save_changes: 'حفظ التغييرات',
  subtotal: 'المجموع الفرعي', tax: 'الضريبة', draft: 'مسودة', sent: 'مرسل', accepted: 'مقبول',
  rejected: 'مرفوض', paid: 'مدفوعة', overdue: 'متأخرة', unpaid: 'غير مدفوعة', partially_paid: 'مدفوعة جزئياً',
  edit: 'تعديل', view: 'عرض', record_payment: 'تسجيل دفعة', convert_to_invoice: 'تحويل لفاتورة',
  convert_to_invoice_alert: 'سيتم تحويل عرض السعر رقم {id} إلى فاتورة.',
  conversion_success: 'تم تحويل عرض السعر {id} إلى فاتورة جديدة برقم {invoiceId} بنجاح!',
  conversion_error: 'فشل تحويل عرض السعر', converting: 'جاري التحويل...',
  download_pdf: 'تحميل PDF', create: 'إنشاء', delete: 'حذف', print: 'طباعة', convert: 'تحويل', view_statement: 'كشف حساب',
  module: 'الوحدة', manager: 'المدير المباشر', share: 'مشاركة',
  add_item: 'إضافة بند', edit_quotation: 'تعديل عرض السعر', new_product: 'منتج جديد', edit_product: 'تعديل المنتج',
  edit_invoice: 'تعديل الفاتورة', edit_supplier_invoice: 'تعديل فاتورة المشتريات',
  bill_to: 'فاتورة إلى:', quantity: 'الكمية', thank_you_message: 'شكراً لتعاملكم معنا!',
  unspecified_customer: 'شركة غير محددة', invoice: 'فاتورة', quotation: 'عرض سعر', tax_number: 'الرقم الضريبي',
  purchase_invoice: 'فاتورة مشتريات', supplier_information: 'بيانات المورد',
  username_placeholder: 'اسم المستخدم', month_jan: 'يناير', month_feb: 'فبراير', month_mar: 'مارس',
  month_apr: 'أبريل', month_may: 'مايو', month_jun: 'يونيو',
  accounting: 'المحاسبة', receipt_vouchers: 'سندات القبض', payment_vouchers: 'سندات الصرف',
  chart_of_accounts: 'دليل الحسابات', journal_entries: 'القيود اليومية',
  amount: 'المبلغ', payment_method: 'طريقة الدفع', cash: 'نقداً', bank_transfer: 'تحويل بنكي', cheque: 'شيك',
  date: 'التاريخ', new_receipt_voucher: 'سند قبض جديد', new_payment_voucher: 'سند صرف جديد',
  new_account: 'إضافة حساب جديد', new_journal_entry: 'إضافة قيد يومية',
  account_statement: 'كشف حساب', statement_for_customer: 'كشف حساب للشركة', statement_for_supplier: 'كشف حساب للمورد',
  supplier_statement: 'كشف حساب مورد', opening_balance: 'رصيد افتتاحي',
  debit: 'مدين', credit: 'دائن', balance: 'الرصيد', receipt_voucher: 'سند قبض', payment_voucher: 'سند صرف',
  quotations_count: 'عروض الأسعار', sales_invoices_count: 'فواتير المبيعات', users_count: 'المستخدمون',
  account_number: 'رقم الحساب', account_name: 'اسم الحساب', account_type: 'نوع الحساب', entry_no: 'رقم القيد',
  app_name: 'اسم التطبيق',
  company_information: 'معلومات الشركة', company_name_ar: 'اسم الشركة (عربي)', company_name_en: 'اسم الشركة (انجليزي)',
  company_address_ar: 'عنوان الشركة (عربي)', company_address_en: 'عنوان الشركة (انجليزي)',
  quotation_template_settings: 'ضبط قالب عرض السعر',
  sales_invoice_template_settings: 'ضبط قالب فاتورة المبيعات',
  purchase_invoice_template_settings: 'ضبط قالب فاتورة المشتريات',
  header: 'الترويسة (Header)',
  footer: 'التذييل (Footer)',
  terms_and_conditions: 'الشروط والأحكام',
  regional_settings: 'الإعدادات الإقليمية',
  header_image: 'صورة الترويسة (كوفر)',
  upload_image: 'رفع صورة',
  remove_image: 'إزالة الصورة',
  no_image: 'لا توجد صورة',
  show_in_header: 'إظهار في الترويسة',
  asset: 'أصل', liability: 'التزام', equity: 'حقوق ملكية', revenue: 'إيراد', expense: 'مصروف',
  user_management: 'إدارة المستخدمين', role_management: 'إدارة الأدوار', logout: 'تسجيل الخروج',
  login: 'تسجيل الدخول', email_address: 'البريد الإلكتروني', password: 'كلمة المرور',
  new_user: 'مستخدم جديد', edit_user: 'تعديل مستخدم', role: 'الدور', permissions: 'الصلاحيات',
  edit_permissions: 'تعديل الصلاحيات', users: 'المستخدمون', roles: 'الأدوار',
  cancel: 'إلغاء',
  quotation_details: 'تفاصيل عرض السعر',
  invoice_details: 'تفاصيل الفاتورة',
  purchase_invoice_details: 'تفاصيل فاتورة المشتريات',
  company_name: 'اسم الشركة',
  contact_person: 'المسئول',
  project_name: 'المشروع',
  quotation_type: 'نوع عرض السعر',
  invoice_type: 'نوع الفاتورة',
  currency: 'العملة',
  currency_egp: 'جنيه مصري',
  back_to_list: 'العودة للقائمة',
  print_document: 'طباعة',
  permission_group_dashboard: 'مجموعة لوحة التحكم',
  permission_dashboard_financials_view: 'عرض الملخصات المالية',
  permission_dashboard_users_summary_view: 'عرض ملخص المستخدمين',
  permission_group_sales: 'مجموعة المبيعات',
  permission_module_quotations: 'عروض الأسعار',
  permission_module_sales_invoices: 'فواتير المبيعات',
  permission_group_purchases: 'مجموعة المشتريات',
  permission_module_purchase_invoices: 'فواتير المشتريات',
  permission_group_contacts: 'مجموعة جهات الاتصال',
  permission_module_customers: 'العملاء',
  permission_module_suppliers: 'الموردون',
  permission_group_accounting: 'مجموعة المحاسبة',
  permission_module_chart_of_accounts: 'دليل الحسابات',
  permission_module_journal_entries: 'القيود اليومية',
  permission_module_receipt_vouchers: 'سندات القبض',
  permission_module_payment_vouchers: 'سندات الصرف',
  permission_group_settings: 'مجموعة الإعدادات',
  permission_module_products: 'المنتجات والخدمات',
  permission_module_users: 'المستخدمون',
  permission_module_roles: 'الأدوار والصلاحيات',
  permission_module_app_settings: 'إعدادات التطبيق',
  permission_action_view: 'عرض',
  permission_action_view_team: 'عرض الفريق',
  permission_action_view_all: 'عرض الكل',
  permission_action_create: 'إنشاء',
  permission_action_edit: 'تعديل',
  permission_action_edit_team: 'تعديل الفريق',
  permission_action_edit_all: 'تعديل الكل',
  permission_action_delete: 'حذف',
  permission_action_delete_team: 'حذف الفريق',
  permission_action_delete_all: 'حذف الكل',
  permission_action_print: 'طباعة',
  permission_action_convert: 'تحويل',
  permission_action_view_statement: 'عرض كشف الحساب',
  permission_scope: 'نطاق',
  permission_scope_own: 'الخاصة فقط',
  permission_scope_team: 'الفريق',
  permission_scope_all: 'الكل',
  permission_scope_none: 'لا يوجد',
  other_permissions: 'صلاحيات أخرى',
  category: 'التصنيف',
  unit: 'الوحدة',
  avg_purchase_price: 'متوسط سعر الشراء',
  avg_selling_price: 'متوسط سعر البيع',
  product_name: 'اسم المنتج',
  select_product: 'اختر منتجاً',
  select_customer: 'اختر شركة',
  select_supplier: 'اختر مورداً',
  apply_tax: 'تطبيق الضريبة',
  discount: 'الخصم',
  discount_type: 'نوع الخصم',
  percentage: 'نسبة',
  amount_value: 'قيمة',
  subtotal_before_discount: 'المجموع قبل الخصم',
  time: 'الوقت',
  company: 'الشركة',
  created_by: 'أنشئ بواسطة',
  linked_document: 'المستند المرتبط',
};

const arEGTranslations: TranslationKeys = {
  ...arSATranslations,
  phone: 'التليفون',
  welcome_to_enjaz: 'أهلاً بك في إنجاز',
};

const enUSTranslations: TranslationKeys = {
  dashboard: 'Dashboard', sales: 'Sales', quotations: 'Quotations', invoices: 'Invoices',
  purchases: 'Purchases', purchase_invoices: 'Purchase Invoices', contacts: 'Contacts',
  customers: 'Customers', suppliers: 'Suppliers', settings: 'Settings', products_and_services: 'Products & Services',
  total: 'Total', status: 'Status', issue_date: 'Issue Date', due_date: 'Due Date', name: 'Name',
  email: 'Email', phone: 'Phone', address: 'Address', description: 'Description', price: 'Selling Price',
  type: 'Type', welcome_to_enjaz: 'Welcome to Enjaz', total_sales: 'Total Sales',
  total_purchases: 'Total Purchases', customer_count: 'Customer Count', supplier_count: 'Supplier Count',
  sales_and_purchases_overview: 'Sales & Purchases Overview', quotation_no: 'Quotation #',
  customer: 'Customer', expiry_date: 'Expiry Date', invoice_no: 'Invoice #', supplier: 'Supplier',
  new_quotation: 'New Quotation', new_invoice: 'New Invoice', new_supplier_invoice: 'New Supplier Invoice',
  new_customer: 'New Customer', new_supplier: 'New Supplier', new_product_service: 'New Product/Service',
  product: 'Product', service: 'Service', invoices_menu: 'Invoices', sales_invoices: 'Sales Invoices',
  app_settings: 'App Settings', locale: 'Language & Region', tax_rate: 'Tax Rate', 'ar-SA': 'Arabic - Saudi Arabia',
  'ar-EG': 'Arabic - Egypt', 'en-US': 'English - United States', save_changes: 'Save Changes',
  subtotal: 'Subtotal', tax: 'Tax', draft: 'Draft', sent: 'Sent', accepted: 'Accepted',
  rejected: 'Rejected', paid: 'Paid', overdue: 'Overdue', unpaid: 'Unpaid', partially_paid: 'Partially Paid',
  edit: 'Edit', view: 'View', record_payment: 'Record Payment', convert_to_invoice: 'Convert to Invoice',
  convert_to_invoice_alert: 'Quotation #{id} will be converted to an invoice.',
  conversion_success: 'Quotation #{id} has been successfully converted to a new invoice #{invoiceId}!',
  conversion_error: 'Failed to convert quotation', converting: 'Converting...',
  download_pdf: 'Download PDF', create: 'Create', delete: 'Delete', print: 'Print', convert: 'Convert', view_statement: 'Statement',
  module: 'Module', manager: 'Manager', share: 'Share',
  add_item: 'Add Item', edit_quotation: 'Edit Quotation', new_product: 'New Product', edit_product: 'Edit Product',
  edit_invoice: 'Edit Invoice', edit_supplier_invoice: 'Edit Purchase Invoice',
  bill_to: 'Bill To:', quantity: 'Qty', thank_you_message: 'Thank you for your business!',
  unspecified_customer: 'Unspecified Customer', invoice: 'Invoice', quotation: 'Quotation', tax_number: 'Tax Number',
  purchase_invoice: 'Purchase Invoice', supplier_information: 'Supplier Information',
  username_placeholder: 'Username', month_jan: 'Jan', month_feb: 'Feb', month_mar: 'Mar',
  month_apr: 'Apr', month_may: 'May', month_jun: 'Jun',
  accounting: 'Accounting', receipt_vouchers: 'Receipt Vouchers', payment_vouchers: 'Payment Vouchers',
  chart_of_accounts: 'Chart of Accounts', journal_entries: 'Journal Entries',
  amount: 'Amount', payment_method: 'Payment Method', cash: 'Cash', bank_transfer: 'Bank Transfer', cheque: 'Cheque',
  date: 'Date', new_receipt_voucher: 'New Receipt Voucher', new_payment_voucher: 'New Payment Voucher',
  new_account: 'New Account', new_journal_entry: 'New Journal Entry',
  account_statement: 'Statement', statement_for_customer: 'Statement of Account for', statement_for_supplier: 'Statement of Account for Supplier',
  supplier_statement: 'Supplier Statement', opening_balance: 'Opening Balance',
  debit: 'Debit', credit: 'Credit', balance: 'Balance', receipt_voucher: 'Receipt Voucher', payment_voucher: 'Payment Voucher',
  quotations_count: 'Quotations', sales_invoices_count: 'Sales Invoices', users_count: 'Users',
  account_number: 'Account #', account_name: 'Account Name', account_type: 'Account Type', entry_no: 'Entry #',
  app_name: 'App Name',
  company_information: 'Company Information', company_name_ar: 'Company Name (Arabic)', company_name_en: 'Company Name (English)',
  company_address_ar: 'Company Address (Arabic)', company_address_en: 'Company Address (English)',
  quotation_template_settings: 'Quotation Template Settings',
  sales_invoice_template_settings: 'Sales Invoice Template Settings',
  purchase_invoice_template_settings: 'Purchase Invoice Template Settings',
  header: 'Header',
  footer: 'Footer',
  terms_and_conditions: 'Terms & Conditions',
  regional_settings: 'Regional Settings',
  header_image: 'Header Image (Cover)',
  upload_image: 'Upload Image',
  remove_image: 'Remove Image',
  no_image: 'No Image',
  show_in_header: 'Show in Header',
  asset: 'Asset', liability: 'Liability', equity: 'Equity', revenue: 'Revenue', expense: 'Expense',
  user_management: 'User Management', role_management: 'Role Management', logout: 'Logout',
  login: 'Login', email_address: 'Email Address', password: 'Password',
  new_user: 'New User', edit_user: 'Edit User', role: 'Role', permissions: 'Permissions',
  edit_permissions: 'Edit Permissions', users: 'Users', roles: 'Roles',
  cancel: 'Cancel',
  quotation_details: 'Quotation Details',
  invoice_details: 'Invoice Details',
  purchase_invoice_details: 'Purchase Invoice Details',
  company_name: 'Company Name',
  contact_person: 'Contact Person',
  project_name: 'Project',
  quotation_type: 'Quotation Type',
  invoice_type: 'Invoice Type',
  currency: 'Currency',
  currency_egp: 'Egyptian Pound',
  back_to_list: 'Back to List',
  print_document: 'Print',
  permission_group_dashboard: 'Dashboard Module',
  permission_dashboard_financials_view: 'View Financials Summary',
  permission_dashboard_users_summary_view: 'View Users Summary',
  permission_group_sales: 'Sales Module',
  permission_module_quotations: 'Quotations',
  permission_module_sales_invoices: 'Sales Invoices',
  permission_group_purchases: 'Purchases Module',
  permission_module_purchase_invoices: 'Purchase Invoices',
  permission_group_contacts: 'Contacts Module',
  permission_module_customers: 'Customers',
  permission_module_suppliers: 'Suppliers',
  permission_group_accounting: 'Accounting Module',
  permission_module_chart_of_accounts: 'Chart of Accounts',
  permission_module_journal_entries: 'Journal Entries',
  permission_module_receipt_vouchers: 'Receipt Vouchers',
  permission_module_payment_vouchers: 'Payment Vouchers',
  permission_group_settings: 'Settings Module',
  permission_module_products: 'Products & Services',
  permission_module_users: 'Users',
  permission_module_roles: 'Roles & Permissions',
  permission_module_app_settings: 'Application Settings',
  permission_action_view: 'View',
  permission_action_view_team: 'View Team',
  permission_action_view_all: 'View All',
  permission_action_create: 'Create',
  permission_action_edit: 'Edit',
  permission_action_edit_team: 'Edit Team',
  permission_action_edit_all: 'Edit All',
  permission_action_delete: 'Delete',
  permission_action_delete_team: 'Delete Team',
  permission_action_delete_all: 'Delete All',
  permission_action_print: 'Print',
  permission_action_convert: 'Convert',
  permission_action_view_statement: 'View Statement',
  permission_scope: 'Scope',
  permission_scope_own: 'Own',
  permission_scope_team: 'Team',
  permission_scope_all: 'All',
  permission_scope_none: 'None',
  other_permissions: 'Other Permissions',
  category: 'Category',
  unit: 'Unit',
  avg_purchase_price: 'Avg. Purchase Price',
  avg_selling_price: 'Avg. Selling Price',
  product_name: 'Product Name',
  select_product: 'Select a product',
  select_customer: 'Select a customer',
  select_supplier: 'Select a supplier',
  apply_tax: 'Apply Tax',
  discount: 'Discount',
  discount_type: 'Discount Type',
  percentage: 'Percentage',
  amount_value: 'Amount',
  subtotal_before_discount: 'Subtotal Before Discount',
  time: 'Time',
  company: 'Company',
  created_by: 'Created By',
  linked_document: 'Linked Document',
};

const allTranslations: Record<LocaleKey, TranslationKeys> = {
  'ar-SA': arSATranslations,
  'ar-EG': arEGTranslations,
  'en-US': enUSTranslations,
};

export function useTranslation() {
  const { localeKey } = useAppSettings();
  
  const t = (key: keyof TranslationKeys, options?: { [key: string]: string | number }): string => {
    let translation = allTranslations[localeKey][key] || key;
    if (options) {
      Object.keys(options).forEach(k => {
        translation = translation.replace(`{${k}}`, String(options[k]));
      });
    }
    return translation;
  };

  return { t };
}
