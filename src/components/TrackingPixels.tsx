'use client';

import { useEffect } from 'react';
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
  const params: PixelParams = { content_name: product, content_type: 'product' };
  window.fbq?.('track', 'Lead', params);
  window.ttq?.track('Lead', params);
}

export default function TrackingPixels() {
  const config = useProductConfig();
  const metaPixelId = config.tracking?.metaPixelId?.trim() || '';
  const tiktokPixelId = config.tracking?.tiktokPixelId?.trim() || '';

  useEffect(() => {
    if (/^\d{5,30}$/.test(metaPixelId)) initializeMetaPixel(metaPixelId);
    if (/^[A-Za-z0-9_-]{5,64}$/.test(tiktokPixelId)) initializeTikTokPixel(tiktokPixelId);
  }, [metaPixelId, tiktokPixelId]);

  return null;
}
