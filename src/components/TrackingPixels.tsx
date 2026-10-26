'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useProductConfig } from '@/config/ProductConfigProvider';

type PixelParams = {
  content_name: string;
  content_type: 'product';
};

type MetaPixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: MetaPixel;
};

type TikTokPixel = unknown[] & {
  [key: string]: unknown;
  methods: string[];
  setAndDefer: (target: TikTokPixel, method: string) => void;
  load: (id: string) => void;
  page: () => void;
  track: (event: string, params?: PixelParams) => void;
  instance: (id: string) => TikTokPixel;
  _i: Record<string, TikTokPixel>;
  _t: Record<string, number>;
  _o: Record<string, unknown>;
};

declare global {
  interface Window {
    fbq?: MetaPixel;
    _fbq?: MetaPixel;
    ttq?: TikTokPixel;
    TiktokAnalyticsObject?: string;
  }
}

const initializedMetaIds = new Set<string>();
const initializedTikTokIds = new Set<string>();
const subscribeToConsent = (callback: () => void) => {
  window.addEventListener('marketing-consent-change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('marketing-consent-change', callback);
    window.removeEventListener('storage', callback);
  };
};
const getConsent = () => window.localStorage.getItem('marketing-consent');
const getServerConsent = () => null;

function initializeMetaPixel(id: string) {
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as MetaPixel;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.push = fbq;
    window.fbq = window._fbq = fbq;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    script.dataset.metaPixel = 'true';
    document.head.appendChild(script);
  }

  if (!initializedMetaIds.has(id)) {
    window.fbq!('init', id);
    window.fbq!('track', 'PageView');
    initializedMetaIds.add(id);
  }
}

function initializeTikTokPixel(id: string) {
  if (!window.ttq) {
    window.TiktokAnalyticsObject = 'ttq';
    const ttq = [] as unknown as TikTokPixel;
    ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
    ttq.setAndDefer = (target, method) => {
      target[method] = (...args: unknown[]) => target.push([method, ...args]);
    };
    ttq._i = {};
    ttq._t = {};
    ttq._o = {};
    ttq.instance = (pixelId) => {
      if (!ttq._i[pixelId]) {
        const instance = [] as unknown as TikTokPixel;
        for (const method of ttq.methods) ttq.setAndDefer(instance, method);
        ttq._i[pixelId] = instance;
      }
      return ttq._i[pixelId];
    };
    for (const method of ttq.methods) ttq.setAndDefer(ttq, method);
    ttq.load = (pixelId) => {
      ttq._i[pixelId] = [] as unknown as TikTokPixel;
      ttq._t[pixelId] = Date.now();
      ttq._o[pixelId] = {};
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(pixelId)}&lib=ttq`;
      script.dataset.tiktokPixel = pixelId;
      document.head.appendChild(script);
    };
    window.ttq = ttq;
  }

  if (!initializedTikTokIds.has(id)) {
    window.ttq!.load(id);
    window.ttq!.page();
    initializedTikTokIds.add(id);
  }
}

export function trackLead({ product }: { product: string }) {
  if (window.localStorage.getItem('marketing-consent') !== 'accepted') return;
  const params: PixelParams = { content_name: product, content_type: 'product' };
  window.fbq?.('track', 'Lead', params);
  window.ttq?.track('Lead', params);
}

export default function TrackingPixels() {
  const config = useProductConfig();
  const metaPixelId = config.tracking?.metaPixelId?.trim() || '';
  const tiktokPixelId = config.tracking?.tiktokPixelId?.trim() || '';
  const consent = useSyncExternalStore(subscribeToConsent, getConsent, getServerConsent);

  useEffect(() => {
    if (consent !== 'accepted') return;
    if (/^\d{5,30}$/.test(metaPixelId)) initializeMetaPixel(metaPixelId);
    if (/^[A-Za-z0-9_-]{5,64}$/.test(tiktokPixelId)) initializeTikTokPixel(tiktokPixelId);
  }, [consent, metaPixelId, tiktokPixelId]);

  if (consent !== null) return <button type="button" onClick={() => saveMarketingConsent('')} aria-label="تغيير تفضيلات التتبع" style={{ position: 'fixed', zIndex: 999, bottom: 12, left: 12, borderRadius: 999, padding: '8px 12px', border: '1px solid #ffffff44', background: '#17131f', color: '#fff' }}>تفضيلات الخصوصية</button>;
  return <aside dir="rtl" style={{ position: 'fixed', zIndex: 1000, bottom: 16, right: 16, left: 16, maxWidth: 620, margin: 'auto', padding: 18, borderRadius: 14, background: '#17131f', color: '#fff', boxShadow: '0 8px 32px #0008', border: '1px solid #ffffff26' }}>
    <p style={{ margin: '0 0 12px', lineHeight: 1.7 }}>نستخدم ملفات تعريف الارتباط التسويقية من Meta وTikTok عند تفعيلها لقياس الزيارات والطلبات. يمكنك القبول أو الرفض. <a href="/privacy" style={{ color: '#c9a4ff' }}>سياسة الخصوصية</a></p>
    <div style={{ display: 'flex', gap: 10 }}>
      <button type="button" onClick={() => saveMarketingConsent('accepted')}>أوافق على التتبع التسويقي</button>
      <button type="button" onClick={() => saveMarketingConsent('rejected')}>أرفض</button>
    </div>
  </aside>;
}

function saveMarketingConsent(value: 'accepted' | 'rejected' | '') {
  if (value) window.localStorage.setItem('marketing-consent', value);
  else window.localStorage.removeItem('marketing-consent');
  window.dispatchEvent(new Event('marketing-consent-change'));
}
