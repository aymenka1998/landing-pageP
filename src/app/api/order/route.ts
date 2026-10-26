import { NextResponse } from 'next/server';
import { getProductConfig } from '@/config/getProduct';

const PHONE_PATTERN = /^(?:0[567]\d{8}|\+?213[567]\d{8})$/;
const MAX_BODY_BYTES = 16 * 1024;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: Request) {
  const productConfig = await getProductConfig();
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse('حجم بيانات الطلب أكبر من المسموح.', 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('بيانات الطلب غير صالحة.', 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return errorResponse('بيانات الطلب غير صالحة.', 400);
  }

  const input = body as Record<string, unknown>;

  // Quietly discard bot submissions caught by the form honeypot.
  if (typeof input.website === "string" && input.website.trim()) {
    return NextResponse.json({ success: true, persisted: false });
  }
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const phone = typeof input.phone === 'string' ? input.phone.replace(/[\s()-]/g, '') : '';
  const city = typeof input.city === 'string' ? input.city.trim() : '';
  const notes = typeof input.notes === 'string' ? input.notes.trim() : '';
  const quantity = Number(input.qty);

  if (!name || name.length > 120 || !PHONE_PATTERN.test(phone) ||
      !productConfig.cities.includes(city) || !Number.isInteger(quantity) ||
      quantity < 1 || quantity > productConfig.maxQty || notes.length > 1000) {
    return errorResponse('تحقق من الاسم ورقم الهاتف والمدينة والكمية والملاحظات.', 400);
  }

  // Never trust product, price, total, date, or status sent by the browser.
  const order = {
    date: new Date().toLocaleString('ar-DZ'),
    name,
    phone,
    city,
    product: productConfig.name,
    price: productConfig.price,
    qty: quantity,
    total: productConfig.price * quantity,
    notes,
    status: 'جديد',
  };

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK;
  if (!webhookUrl) {
    // WhatsApp remains available, but be explicit that nothing was persisted.
    return NextResponse.json({ success: true, persisted: false });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });

    if (!response.ok) {
      return errorResponse('تعذر حفظ الطلب. أعد المحاولة أو أكمل الطلب عبر واتساب.', 502);
    }

    // Apps Script can return HTTP 200 when its own handler failed.
    const result: unknown = await response.json().catch(() => null);
    if (!result || typeof result !== 'object' || (result as { success?: unknown }).success !== true) {
      return errorResponse('لم يؤكد جدول الطلبات حفظ الطلب. أعد المحاولة أو أكمل عبر واتساب.', 502);
    }

    return NextResponse.json({ success: true, persisted: true });
  } catch {
    return errorResponse('تعذر الاتصال بخدمة حفظ الطلبات. أعد المحاولة أو أكمل عبر واتساب.', 502);
  }
}
