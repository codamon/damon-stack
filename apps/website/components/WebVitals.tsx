'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';
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
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);

    // 收集INP（Interaction to Next Paint）指标
    onINP(sendToAnalytics);
  }, []);

  // 这个组件不渲染任何UI
  return null;
}

export default WebVitals; 