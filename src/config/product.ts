// ============================================
// ⚙️ إعدادات المنتج - يقرأ من product.json
// ============================================
// هذا الملف يقرأ البيانات من product.json ويضيف الدوال التي لا يدعمها JSON

import productData from './product.json';

export type OrderData = {
  name: string;
  phone: string;
  city: string;
  qty: number;
  notes: string;
  product: string;
  price: number;
  total: number;
  date: string;
};

const productConfig = {
  ...productData,

  // قالب رسالة الواتساب - يُرسل تلقائياً عند الطلب
  whatsappMessage: (order: OrderData) =>
    `🛒 *طلب جديد*\n` +
    `━━━━━━━━━━━━\n` +
    `📦 المنتج: ${order.product}\n` +
    `💰 السعر: ${order.price} ${productData.currency}\n` +
    `🔢 الكمية: ${order.qty}\n` +
    `💵 الإجمالي: ${order.total} ${productData.currency}\n` +
    `━━━━━━━━━━━━\n` +
    `👤 الاسم: ${order.name}\n` +
    `📱 الجوال: ${order.phone}\n` +
    `🏙️ المدينة: ${order.city}\n` +
    (order.notes ? `📝 ملاحظات: ${order.notes}\n` : ''),

};

export default productConfig;
