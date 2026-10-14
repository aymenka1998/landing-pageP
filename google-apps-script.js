// ============================================
// 📊 كود Google Apps Script
// ============================================
// 
// 📋 خطوات الإعداد:
// ──────────────────
// 1. افتح Google Sheets جديد من: https://sheets.new
// 2. أضف هذه العناوين في الصف الأول (A1 إلى J1):
//    التاريخ | الاسم | الهاتف | المدينة | المنتج | السعر | الكمية | الإجمالي | ملاحظات | الحالة
// 3. من القائمة العلوية: Extensions > Apps Script
// 4. احذف الكود الموجود والصق هذا الكود بالكامل
// 5. اضغط على Deploy > New deployment
// 6. اختر Type: Web app
// 7. اضبط Execute as: Me
// 8. اضبط Who has access: Anyone
// 9. اضغط Deploy وأعطِ الصلاحيات المطلوبة
// 10. انسخ الرابط (URL) وضعه في ملف .env.local
//     NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK=الرابط_هنا
//
// ⚠️ ملاحظة: عند أي تعديل، يجب عمل Deploy جديد

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Keep customer-controlled strings from being interpreted as spreadsheet formulas.
    function safeCell(value) {
      var text = String(value || '');
      return /^[=+@\-\t\r]/.test(text) ? "'" + text : text;
    }
    
    sheet.appendRow([
      data.date || new Date().toLocaleString('ar-DZ'),
      safeCell(data.name),
      safeCell(data.phone),
      safeCell(data.city),
      data.product || '',
      data.price || '',
      data.qty || '',
      data.total || '',
      safeCell(data.notes),
      data.status || 'جديد'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', message: 'Webhook is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
