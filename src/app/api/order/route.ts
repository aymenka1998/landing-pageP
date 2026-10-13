import { NextResponse } from 'next/server';
import type { OrderData } from '@/config/product';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderData;
    
    const { name, phone, city, qty, notes, product, price, total, date } = body;
    const normalizedPhone = typeof phone === 'string' ? phone.replace(/[\s()-]/g, '') : '';
    const phoneIsValid = /^(?:0[567]\d{8}|\+?213[567]\d{8})$/.test(normalizedPhone);
    const quantity = Number(qty);
    const maxQty = Number((await import('@/config/product.json')).default.maxQty);
    if (typeof name !== 'string' || !name.trim() || !phoneIsValid || !Number.isInteger(quantity) || quantity < 1 || quantity > maxQty) {
      return NextResponse.json({ success: false, message: 'الاسم أو رقم الهاتف أو الكمية غير صالح' }, { status: 400 });
    }

    // Forward to Google Sheets webhook if configured
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK;
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: date || new Date().toLocaleString('ar-DZ'),
            name,
            phone: normalizedPhone,
            city,
            product,
            price,
            qty: quantity,
            total,
            notes: notes || '',
            status: 'جديد'
          })
        });
        if (!response.ok) {
          return NextResponse.json(
            { success: false, message: 'تعذر حفظ الطلب. حاول مرة أخرى أو تواصل عبر واتساب.' },
            { status: 502 }
          );
        }
      } catch (webhookError) {
        console.error('Order webhook request failed.');
        return NextResponse.json(
          { success: false, message: 'تعذر حفظ الطلب. حاول مرة أخرى أو تواصل عبر واتساب.' },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'تم استلام الطلب بنجاح' 
    });

  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في معالجة الطلب' },
      { status: 500 }
    );
  }
}
