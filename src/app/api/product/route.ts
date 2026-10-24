import { NextResponse } from 'next/server';
import { getProductConfigResult } from '@/config/getProduct';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await getProductConfigResult();
  return NextResponse.json(
    { ...result.config, _sync: { source: result.source, warning: result.warning ?? null } },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Product-Config-Source': result.source,
        ...(result.warning ? { 'X-Product-Config-Warning': result.warning } : {}),
      },
    },
  );
}
