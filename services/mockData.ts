
import { Quotation, Invoice, SupplierInvoice, Product, Customer, Supplier, User, ReceiptVoucher, PaymentVoucher, JournalEntry, AccountTransaction } from '../types';
import { ROLES } from '../contexts/AuthContext';

export const mockUsersData: User[] = [
  { id: 1, name: 'مدير النظام', email: 'admin@enjaz.app', role: ROLES.admin, manager_id: null },
  { id: 2, name: 'محاسب أول', email: 'accountant@enjaz.app', role: ROLES.accountant, manager_id: 1 },
  { id: 3, name: 'مدير مبيعات', email: 'manager@enjaz.app', role: ROLES.sales_manager, manager_id: 1 },
  { id: 4, name: 'مندوب مبيعات', email: 'sales@enjaz.app', role: ROLES.sales_person, manager_id: 3 },
];

export const mockQuotationsData: Quotation[] = [
  { id: 1, customer_id: 1, customer_name: 'شركة المشاريع الحديثة', issue_date: '2023-10-01', status: 'sent', 
    is_taxable: true, discount_amount: 500, discount_type: 'amount', tax_rate: 15,
    subtotal: 14500, tax_amount: 2175, total: 16675,
    contact_person: 'م. خالد الأحمد', project_name: 'مشروع بناء فيلا بالرياض', quotation_type: 'عرض سعر أولي',
    items: [
      {id: 1, product_id: 1, product_name: 'استشارة هندسية', description: 'جلسة استشارية لمدة ساعة', unit: 'ساعة', quantity: 1, price: 5000, total: 5000},
      {id: 2, product_id: 2, product_name: 'تصميم معماري', description: 'تصميم كامل للمبنى السكني', unit: 'تصميم', quantity: 1, price: 10000, total: 10000},
    ], 
    created_at: '2023-10-01T10:00:00Z',
    created_time: '10:00 ص',
    created_by: 4,
    invoice_id: null,
  },
  { id: 2, customer_id: 2, customer_name: 'مؤسسة البناء الأولى', issue_date: '2023-10-05', status: 'accepted', 
    is_taxable: true, discount_amount: 0, discount_type: 'amount', tax_rate: 15,
    subtotal: 7500, tax_amount: 1125, total: 8625, 
    contact_person: 'أ. سارة عبد الله', project_name: 'توريد مواد لمبنى تجاري', quotation_type: 'عرض سعر نهائي',
    items: [
      {id: 1, product_id: 3, product_name: 'أسمنت مقاوم', description: 'كيس أسمنت 50 كغ', unit: 'كيس', quantity: 50, price: 150, total: 7500},
    ], 
    created_at: '2023-10-05T11:30:00Z',
    created_time: '11:30 ص',
    created_by: 4,
    invoice_id: 102,
  },
  { id: 3, customer_id: 1, customer_name: 'شركة المشاريع الحديثة', issue_date: '2023-10-10', status: 'draft', 
    is_taxable: false, discount_amount: 0, discount_type: 'amount', tax_rate: 15,
    subtotal: 22000, tax_amount: 0, total: 22000,
    contact_person: 'م. خالد الأحمد', project_name: 'أعمال ترميم مكتب', quotation_type: 'عرض سعر مبدئي',
    items: [
      {id: 1, product_id: 4, product_name: 'حديد تسليح', description: 'طن حديد تسليح مقاس 16 مم', unit: 'طن', quantity: 5, price: 3200, total: 16000},
      {id: 2, product_id: 5, product_name: 'مكيف سبليت', description: 'وحدة تكييف سبليت 24000 وحدة', unit: 'وحدة', quantity: 2, price: 3000, total: 6000},
    ], 
    created_at: '2023-10-10T09:30:00Z',
    created_time: '09:30 ص',
    created_by: 3,
    invoice_id: null,
  },
];

export const mockInvoicesData: Invoice[] = [
  { id: 101, customer_id: 1, customer_name: 'Modern Projects Co.', issue_date: '2023-10-15', due_date: '2023-11-15', status: 'sent', paid_amount: 0, 
    is_taxable: true, discount_amount: 10, discount_type: 'percentage', tax_rate: 15,
    subtotal: 13500, tax_amount: 2025, total: 15525, 
    contact_person: 'Eng. Khalid Al-Ahmad', project_name: 'Riyadh Villa Construction', invoice_type: 'فاتورة أعمال',
    items: [
      {id: 1, product_id: 1, product_name: 'Engineering Consultation', description: 'One hour advisory session', unit: 'Hour', quantity: 1, price: 5000, total: 5000},
      {id: 2, product_id: 2, product_name: 'Architectural Design', description: 'Full design for residential building', unit: 'Design', quantity: 1, price: 10000, total: 10000},
    ], 
    created_at: '2023-10-15T14:00:00Z',
    created_time: '02:00 م',
    created_by: 3,
    quotation_id: null,
  },
  { id: 102, customer_id: 2, customer_name: 'First Construction Est.', issue_date: '2023-10-20', due_date: '2023-11-20', status: 'paid', paid_amount: 8625, 
    is_taxable: true, discount_amount: 0, discount_type: 'amount', tax_rate: 15,
    subtotal: 7500, tax_amount: 1125, total: 8625,
    contact_person: 'Ms. Sara Abdullah', project_name: 'Commercial Building Supply', invoice_type: 'فاتورة مواد',
    items: [
      {id: 1, product_id: 3, product_name: 'Resistant Cement', description: '50kg cement bag', unit: 'Bag', quantity: 50, price: 150, total: 7500},
    ], 
    created_at: '2023-10-20T16:45:00Z',
    created_time: '04:45 م',
    created_by: 4,
    quotation_id: 2,
  },
];

export const mockSupplierInvoicesData: SupplierInvoice[] = [
  { id: 1, supplier_id: 1, supplier_name: 'مورد مواد البناء', issue_date: '2023-09-25', due_date: '2023-10-25', status: 'paid', paid_amount: 33000, 
    is_taxable: false, discount_amount: 0, discount_type: 'amount', tax_rate: 15,
    subtotal: 33000, tax_amount: 0, total: 33000,
    contact_person: 'أ. محمد علي', project_name: 'تأثيث مكتب المدير العام', supplier_invoice_type: 'فاتورة مواد بناء',
    items: [
    {id: 1, product_id: 3, product_name: 'أسمنت مقاوم', description: 'أسمنت بورتلاندي عالي المقاومة', unit: 'كيس', quantity: 500, price: 60, total: 30000},
    {id: 2, product_id: 4, product_name: 'حديد تسليح', description: 'حديد مقاس 16 مم', unit: 'طن', quantity: 1, price: 3000, total: 3000},
  ], 
    created_at: '2023-09-25T09:15:00Z',
    created_time: '09:15 ص',
    created_by: 2,
  },
  { id: 2, supplier_id: 2, supplier_name: 'شركة الأجهزة الكهربائية', issue_date: '2023-10-02', due_date: '2023-11-02', status: 'unpaid', paid_amount: 0, 
    is_taxable: true, discount_amount: 0, discount_type: 'amount', tax_rate: 15,
    subtotal: 12500, tax_amount: 1875, total: 14375,
    contact_person: 'م. فاطمة حسن', project_name: 'تكييف مبنى المكاتب', supplier_invoice_type: 'فاتورة أجهزة',
    items: [
    {id: 1, product_id: 5, product_name: 'مكيفات سبليت', description: 'وحدة تكييف سبليت 24000 وحدة', unit: 'وحدة', quantity: 5, price: 2500, total: 12500},
  ], 
    created_at: '2023-10-02T13:00:00Z',
    created_time: '01:00 م',
    created_by: 2,
  },
  { id: 3, supplier_id: 1, supplier_name: 'مورد مواد البناء', issue_date: '2023-10-11', due_date: '2023-11-11', status: 'partially_paid', paid_amount: 20000,
    is_taxable: true, discount_amount: 5, discount_type: 'percentage', tax_rate: 15,
    subtotal: 42750, tax_amount: 6412.5, total: 49162.5,
    contact_person: 'أ. محمد علي', project_name: 'مشروع بناء سور خارجي', supplier_invoice_type: 'فاتورة حديد',
    items: [
    {id: 1, product_id: 4, product_name: 'حديد تسليح', description: 'حديد مقاس 16 مم', unit: 'طن', quantity: 15, price: 3000, total: 45000},
  ], 
    created_at: '2023-10-11T11:00:00Z',
    created_time: '11:00 ص',
    created_by: 1,
  },
];

export const mockProductsData: Product[] = [
    { id: 1, name: 'استشارة هندسية', description: 'جلسة استشارية لمدة ساعة', category: 'خدمة', unit: 'ساعة', price: 500, avg_purchase_price: 0, avg_selling_price: 500, created_at: '2023-01-01' },
    { id: 2, name: 'تصميم معماري', description: 'تصميم كامل للمبنى السكني', category: 'خدمة', unit: 'تصميم', price: 10000, avg_purchase_price: 0, avg_selling_price: 10000, created_at: '2023-01-02' },
    { id: 3, name: 'أسمنت مقاوم', description: 'كيس أسمنت 50 كغ', category: 'منتج', unit: 'كيس', price: 25, avg_purchase_price: 20, avg_selling_price: 24.5, created_at: '2023-01-03' },
    { id: 4, name: 'حديد تسليح', description: 'طن حديد تسليح مقاس 16 مم', category: 'منتج', unit: 'طن', price: 3200, avg_purchase_price: 3000, avg_selling_price: 3150, created_at: '2023-01-04' },
    { id: 5, name: 'مكيف سبليت', description: 'وحدة تكييف سبليت 24000 وحدة', category: 'منتج', unit: 'وحدة', price: 2800, avg_purchase_price: 2500, avg_selling_price: 2750, created_at: '2023-01-05' },
];

export const mockCustomersData: Customer[] = [
  { id: 1, name: 'شركة المشاريع الحديثة', email: 'contact@modern.sa', phone: '011-123-4567', address: 'الرياض', created_at: '' },
  { id: 2, name: 'مؤسسة البناء الأولى', email: 'info@binaa.com', phone: '012-765-4321', address: 'جدة', created_at: '' },
  { id: 3, name: 'مجموعة العمار الهندسية', email: 'projects@ammar.group', phone: '013-555-8888', address: 'الدمام', created_at: '' },
];

export const mockSuppliersData: Supplier[] = [
  { id: 1, name: 'مورد مواد البناء', email: 'sales@bm-supplier.com', phone: '011-987-6543', address: 'الرياض', created_at: '' },
  { id: 2, name: 'شركة الأجهزة الكهربائية', email: 'info@electric.co', phone: '012-111-2222', address: 'جدة', created_at: '' },
];

export const mockReceiptVouchersData: ReceiptVoucher[] = [
  { id: 1, customer_id: 1, customer_name: 'شركة المشاريع الحديثة', date: '2023-10-20', amount: 10000, payment_method: 'bank_transfer', description: 'دفعة من حساب فاتورة #101', created_at: '2023-10-20T14:30:00Z', created_time: '02:30 م' },
  { id: 2, customer_id: 2, customer_name: 'مؤسسة البناء الأولى', date: '2023-10-22', amount: 8625, payment_method: 'cheque', description: 'سداد كامل فاتورة #102', created_at: '2023-10-22T11:00:00Z', created_time: '11:00 ص' },
];

export const mockPaymentVouchersData: PaymentVoucher[] = [
  { id: 1, supplier_id: 1, supplier_name: 'مورد مواد البناء', date: '2023-10-25', amount: 20000, payment_method: 'bank_transfer', description: 'دفعة لفاتورة المورد #3', created_at: '2023-10-25T15:00:00Z', created_time: '03:00 م' },
  { id: 2, supplier_id: 2, supplier_name: 'شركة الأجهزة الكهربائية', date: '2023-10-28', amount: 5000, payment_method: 'cash', description: 'مصاريف نثرية', created_at: '2023-10-28T10:15:00Z', created_time: '10:15 ص' },
];

export const mockJournalEntriesData: JournalEntry[] = [
    { id: 1, date: '2023-10-01', time: '09:00 ص', description: 'شراء مواد بناء', debit: 5000, credit: 5000 },
    { id: 2, date: '2023-10-05', time: '04:30 م', description: 'دفع رواتب الموظفين', debit: 25000, credit: 25000 },
    { id: 3, date: '2023-10-15', time: '12:00 م', description: 'تحصيل دفعة من العميل', debit: 10000, credit: 10000 },
];

export const mockCustomerTransactions: Omit<AccountTransaction, 'balance'>[] = [
    { id: 'inv-101', date: '2023-10-15', time: '02:00 م', type: 'invoice', description: 'فاتورة رقم #101', debit: 17250, credit: 0 },
    { id: 'rv-1', date: '2023-10-20', time: '02:30 م', type: 'receipt', description: 'سند قبض #1', debit: 0, credit: 10000 },
    { id: 'inv-103', date: '2023-10-25', time: '10:00 ص', type: 'invoice', description: 'فاتورة رقم #103', debit: 5000, credit: 0 },
];

export const mockSupplierTransactions: Omit<AccountTransaction, 'balance'>[] = [
    { id: 'sinv-1', date: '2023-09-25', time: '09:15 ص', type: 'invoice', description: 'فاتورة مشتريات #1', debit: 0, credit: 33000 },
    { id: 'pv-1', date: '2023-10-25', time: '03:00 م', type: 'payment', description: 'سند صرف #1', debit: 20000, credit: 0 },
    { id: 'sinv-3', date: '2023-10-11', time: '11:00 ص', type: 'invoice', description: 'فاتورة مشتريات #3', debit: 0, credit: 49162.5 },
];
