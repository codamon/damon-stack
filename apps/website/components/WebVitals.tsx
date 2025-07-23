'use client';

import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';
import { sendToAnalytics, initPerformanceMonitoring } from '../utils/analytics';

/**
 * Web Vitals 监控组件
 * 收集并发送核心Web性能指标
 */
export function WebVitals() {
  useEffect(() => {
    // 初始化性能监控
    initPerformanceMonitoring();

    // 收集Core Web Vitals指标
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);

    // 如果支持INP（Interaction to Next Paint），也收集
    if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes.includes('event')) {
      import('web-vitals').then(({ onINP }) => {
        onINP(sendToAnalytics);
      });
    }
  }, []);

  // 这个组件不渲染任何UI
  return null;
}

export default WebVitals; 