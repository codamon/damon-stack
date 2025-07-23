import { type Metric } from 'web-vitals';

/**
 * Web Vitals性能指标类型
 */
export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  navigationType?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

/**
 * 发送性能数据到分析服务
 */
export function sendToAnalytics(metric: Metric) {
  // 构建性能指标数据
  const performanceData: PerformanceMetric = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    navigationType: metric.navigationType,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // 发送到 Google Analytics (如果配置了)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      custom_map: {
        metric_id: 'custom_metric_id',
        metric_value: 'custom_metric_value',
        metric_delta: 'custom_metric_delta'
      }
    });
  }

  // 发送到自定义分析端点
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(performanceData),
    }).catch(error => {
      console.warn('Failed to send analytics data:', error);
    });
  }

  // 开发环境下打印到控制台
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', performanceData);
  }
}

/**
 * 获取性能评级的颜色
 */
export function getMetricColor(rating: string): string {
  switch (rating) {
    case 'good':
      return '#0cce6b';
    case 'needs-improvement':
      return '#ffa400';
    case 'poor':
      return '#ff4e42';
    default:
      return '#666';
  }
}

/**
 * 格式化性能指标值
 */
export function formatMetricValue(name: string, value: number): string {
  switch (name) {
    case 'CLS':
      return value.toFixed(3);
    case 'FID':
    case 'FCP':
    case 'LCP':
    case 'TTFB':
      return `${Math.round(value)}ms`;
    case 'INP':
      return `${Math.round(value)}ms`;
    default:
      return Math.round(value).toString();
  }
}

/**
 * 获取性能指标的描述
 */
export function getMetricDescription(name: string): string {
  switch (name) {
    case 'CLS':
      return 'Cumulative Layout Shift - 页面布局稳定性';
    case 'FID':
      return 'First Input Delay - 首次输入延迟';
    case 'FCP':
      return 'First Contentful Paint - 首次内容绘制';
    case 'LCP':
      return 'Largest Contentful Paint - 最大内容绘制';
    case 'TTFB':
      return 'Time to First Byte - 首字节时间';
    case 'INP':
      return 'Interaction to Next Paint - 交互响应时间';
    default:
      return name;
  }
}

/**
 * 页面性能报告
 */
export interface PagePerformanceReport {
  url: string;
  timestamp: number;
  metrics: PerformanceMetric[];
  navigation: PerformanceNavigationTiming | null;
  resources: PerformanceResourceTiming[];
}

/**
 * 收集页面性能报告
 */
export function collectPagePerformance(): PagePerformanceReport {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  return {
    url: window.location.href,
    timestamp: Date.now(),
    metrics: [], // 将由 Web Vitals 填充
    navigation,
    resources: resources.slice(0, 20), // 限制资源数量
  };
}

/**
 * 监控页面加载性能
 */
export function monitorPageLoad() {
  if (typeof window === 'undefined') return;

  // 页面加载完成后收集性能数据
  window.addEventListener('load', () => {
    setTimeout(() => {
      const report = collectPagePerformance();
      
      // 分析加载时间
      if (report.navigation) {
        const loadTime = report.navigation.loadEventEnd - report.navigation.navigationStart;
        const domContentLoaded = report.navigation.domContentLoadedEventEnd - report.navigation.navigationStart;
        
        console.log('Page Performance:', {
          loadTime: `${loadTime}ms`,
          domContentLoaded: `${domContentLoaded}ms`,
          resourceCount: report.resources.length,
        });
      }
    }, 1000);
  });
}

/**
 * 错误监控
 */
export function setupErrorMonitoring() {
  if (typeof window === 'undefined') return;

  // 监控JavaScript错误
  window.addEventListener('error', (event) => {
    const errorData = {
      type: 'javascript-error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    };

    // 发送错误数据
    if (process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      }).catch(() => {
        // 静默处理发送失败
      });
    }
  });

  // 监控Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    const errorData = {
      type: 'promise-rejection',
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    };

    // 发送错误数据
    if (process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      }).catch(() => {
        // 静默处理发送失败
      });
    }
  });
}

/**
 * 用户行为追踪
 */
export function trackUserBehavior() {
  if (typeof window === 'undefined') return;

  // 页面可见性变化
  document.addEventListener('visibilitychange', () => {
    const eventData = {
      type: 'visibility-change',
      visible: !document.hidden,
      url: window.location.href,
      timestamp: Date.now(),
    };

    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }).catch(() => {
        // 静默处理发送失败
      });
    }
  });

  // 页面卸载
  window.addEventListener('beforeunload', () => {
    const sessionData = {
      type: 'session-end',
      url: window.location.href,
      sessionDuration: Date.now() - (window.performance?.timeOrigin || 0),
      timestamp: Date.now(),
    };

    // 使用 sendBeacon 确保数据发送
    if (navigator.sendBeacon && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      navigator.sendBeacon(
        process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
        JSON.stringify(sessionData)
      );
    }
  });
}

/**
 * 初始化性能监控
 */
export function initPerformanceMonitoring() {
  monitorPageLoad();
  setupErrorMonitoring();
  trackUserBehavior();
} 