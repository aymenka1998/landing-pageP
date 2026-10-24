import productConfig from './product';

export type ProductConfigResult = {
  config: typeof productConfig;
  source: 'supabase' | 'static';
  warning?: string;
};

export async function getProductConfigResult(): Promise<ProductConfigResult> {
  if (process.env.PRODUCT_CONFIG_SOURCE !== 'supabase') {
    return { config: productConfig, source: 'static' };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return {
      config: productConfig,
      source: 'static',
      warning: 'Supabase product source is enabled, but its URL or publishable key is missing.',
    };
  }

  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/product_settings?id=eq.1&select=data`, {
      headers: { apikey: key },
      cache: 'no-store',
    });
    if (!response.ok) {
      return { config: productConfig, source: 'static', warning: `Supabase returned HTTP ${response.status}.` };
    }
    const rows = await response.json();
    if (rows?.[0]?.data && typeof rows[0].data === 'object') {
      return { config: { ...productConfig, ...rows[0].data }, source: 'supabase' };
    }
    return { config: productConfig, source: 'static', warning: 'No product_settings row with id=1 was found in Supabase.' };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown connection error';
    console.error('[product-config] Supabase read failed:', detail);
    return { config: productConfig, source: 'static', warning: `Could not read product settings from Supabase: ${detail}` };
  }
}

export async function getProductConfig() {
  return (await getProductConfigResult()).config;
}
