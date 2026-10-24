'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import productConfig from './product';

const ProductContext = createContext(productConfig);

export function ProductConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState(productConfig);
  useEffect(() => {
    fetch('/api/product', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        const source = result?._sync?.source || response.headers.get('X-Product-Config-Source');
        const warning = result?._sync?.warning || response.headers.get('X-Product-Config-Warning');
        if (!response.ok) throw new Error(warning || `Product configuration request failed (HTTP ${response.status}).`);
        if (warning) console.error(`[product-config] ${warning}`);
        else if (source !== 'supabase') {
          console.warn('[product-config] Landing page is using bundled static data. Set PRODUCT_CONFIG_SOURCE=supabase and the Supabase URL/publishable key in this Vercel project to receive dashboard changes.');
        }
        const { _sync: _syncInfo, ...data } = result;
        return data;
      })
      .then((data) => { if (data) setConfig((current) => ({ ...current, ...data })); })
      .catch((error) => console.error('[product-config] Could not load /api/product:', error));
  }, []);
  return <ProductContext.Provider value={config}>{children}</ProductContext.Provider>;
}

export const useProductConfig = () => useContext(ProductContext);
