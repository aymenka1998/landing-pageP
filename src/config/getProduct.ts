import productConfig from './product';

export async function getProductConfig() {
  if (process.env.PRODUCT_CONFIG_SOURCE !== 'supabase') return productConfig;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return productConfig;

  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/product_settings?id=eq.1&select=data`, {
      headers: { apikey: key },
      cache: 'no-store',
    });
    const rows = await response.json();
    if (response.ok && rows?.[0]?.data) return { ...productConfig, ...rows[0].data };
  } catch {}
  return productConfig;
}


