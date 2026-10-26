import { NextResponse } from 'next/server';

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const body = payload as { email?: unknown; consent?: unknown };
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_PATTERN.test(email) || email.length > 254 || body.consent !== true) {
    return NextResponse.json({ error: 'A valid email and consent are required.' }, { status: 400 });
  }

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';
  if (!supabaseUrl || !supabaseKey) {
    console.error('[newsletter] Missing Supabase URL or publishable key.');
    return NextResponse.json({ error: 'Newsletter storage is not configured.' }, { status: 503 });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ email, consent: true }),
      cache: 'no-store',
    });

    if (response.ok) return NextResponse.json({ success: true });

    const detail = await response.text();
    let errorCode = '';
    try {
      const databaseError = JSON.parse(detail);
      errorCode = databaseError?.code || '';
    } catch {
      // Keep the raw database response in server logs only.
    }

    if (errorCode === '23505') return NextResponse.json({ success: true });

    console.error('[newsletter] Supabase insert failed:', response.status, errorCode);
    return NextResponse.json({ error: 'Could not save the newsletter subscription.' }, { status: 502 });
  } catch (error) {
    console.error('[newsletter] Supabase request failed:', error);
    return NextResponse.json({ error: 'Newsletter storage is temporarily unavailable.' }, { status: 502 });
  }
}
