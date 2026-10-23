import { NextResponse } from 'next/server';
import { getProductConfig } from '@/config/getProduct';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getProductConfig(), { headers: { 'Cache-Control': 'no-store' } });
}
