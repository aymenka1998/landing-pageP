'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import productConfig from './product';

const ProductContext = createContext(productConfig);

export function ProductConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState(productConfig);

  useEffect(() => {
    let stopped = false;
    let loading = false;

    const loadLatestConfig = async () => {
      if (stopped || loading) return;
      loading = true;
      try {
        const response = await fetch('/api/product', { cache: 'no-store' });
        const result = await response.json();
        const warning = result?._sync?.warning || response.headers.get('X-Product-Config-Warning');
        if (!response.ok) throw new Error(warning || `Product configuration request failed (HTTP ${response.status}).`);
        if (warning) console.error(`[product-config] ${warning}`);
        const { _sync: _syncInfo, ...data } = result;
        if (!stopped && data) setConfig((current) => ({ ...current, ...data }));
      } catch (error) {
        console.error('[product-config] Could not load /api/product:', error);
      } finally {
        loading = false;
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void loadLatestConfig();
    };

    void loadLatestConfig();
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      stopped = true;
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

  useEffect(() => {
    const title = [config.name, config.tagline].filter(Boolean).join(' | ');
    if (title) document.title = title;
  }, [config.name, config.tagline]);

  return <ProductContext.Provider value={config}>{children}</ProductContext.Provider>;
}

export const useProductConfig = () => useContext(ProductContext);
