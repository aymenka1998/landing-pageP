'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import productConfig from './product';

const ProductContext = createContext(productConfig);

export function ProductConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState(productConfig);
  useEffect(() => {
    fetch('/api/product', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data) setConfig((current) => ({ ...current, ...data })); })
      .catch(() => {});
  }, []);
  return <ProductContext.Provider value={config}>{children}</ProductContext.Provider>;
}

export const useProductConfig = () => useContext(ProductContext);
