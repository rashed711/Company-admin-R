import { Quotation, Invoice } from '../types';

// Raw data before processing totals
export const mockQuotationsData: Omit<Quotation, 'subtotal' | 'tax_rate' | 'tax_amount'>[] = [
  { id: 1, customer_id: 1, customer_name: 'شركة المشاريع الحديثة', issue_date: '2023-10-01', status: 'sent', total: 17250, 
    company_name: 'شركة المشاريع الحديثة', contact_person: 'م. خالد الأحمد', project_name: 'مشروع بناء فيلا بالرياض', quotation_type: 'عرض سعر أولي',
    items: [
      {id: 1, product_id: 1, product_name: 'استشارة هندسية', quantity: 1, price: 5000, total: 5000},
      {id: 2, product_id: 2, product_name: 'تصميم معماري', quantity: 1, price: 10000, total: 10000},
  ], created_at: '2023-10-01T10:00:00Z' },
  { id: 2, customer_id: 2, customer_name: 'مؤسسة البناء الأولى', issue_date: '2023-10-05', status: 'accepted', total: 8625, 
    company_name: 'مؤسسة البناء الأولى', contact_person: 'أ. سارة عبد الله', project_name: 'توريد مواد لمبنى تجاري', quotation_type: 'عرض سعر نهائي',
    items: [
      {id: 1, product_id: 3, product_name: 'أسمنت مقاوم', quantity: 50, price: 150, total: 7500},
  ], created_at: '2023-10-05T11:00:00Z' },
  { id: 3, customer_id: 1, customer_name: 'شركة المشاريع الحديثة', issue_date: '2023-10-10', status: 'draft', total: 25300, 
    company_name: 'شركة المشاريع الحديثة', contact_person: 'م. خالد الأحمد', project_name: 'أعمال ترميم مكتب', quotation_type: 'عرض سعر مبدئي',
    items: [], created_at: '2023-10-10T09:30:00Z' },
];

export const mockInvoicesData: Omit<Invoice, 'subtotal' | 'tax_rate' | 'tax_amount'>[] = [
  { id: 101, customer_id: 1, customer_name: 'Modern Projects Co.', issue_date: '2023-10-15', due_date: '2023-11-15', status: 'sent', total: 17250, paid_amount: 0, items: [
      {id: 1, product_id: 1, product_name: 'Engineering Consultation', quantity: 1, price: 5000, total: 5000},
      {id: 2, product_id: 2, product_name: 'Architectural Design', quantity: 1, price: 10000, total: 10000},
  ], created_at: '2023-10-15T14:00:00Z' },
  { id: 102, customer_id: 2, customer_name: 'First Construction Est.', issue_date: '2023-10-20', due_date: '2023-11-20', status: 'paid', total: 8625, paid_amount: 8625, items: [
      {id: 1, product_id: 3, product_name: 'Building Materials - Batch 1', quantity: 50, price: 150, total: 7500},
  ], created_at: '2023-10-20T16:00:00Z' },
];