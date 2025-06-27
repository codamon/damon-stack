'use client';

import { useMemo } from 'react';
import { api } from '../api/client';
import type { DashboardStats, ChartData } from '../api/types';

/**
 * 获取Dashboard统计数据
 */
export function useDashboardStats() {
  return (api as any).dashboard.stats.useQuery(undefined, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5分钟
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 每5分钟自动刷新
  });
}

/**
 * 获取用户增长数据
 */
export function useUserGrowthData(period: '7d' | '30d' | '90d' = '30d') {
  return (api as any).dashboard.userGrowth.useQuery({ period }, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 10, // 10分钟
    refetchOnWindowFocus: false,
  });
}

/**
 * 获取文章统计数据
 */
export function usePostStats(period: '7d' | '30d' | '90d' = '30d') {
  return (api as any).dashboard.postStats.useQuery({ period }, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 10, // 10分钟
    refetchOnWindowFocus: false,
  });
}

/**
 * 获取最近活动数据
 */
export function useRecentActivity(limit = 10) {
  return (api as any).dashboard.recentActivity.useQuery({ limit }, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2, // 2分钟
    refetchOnWindowFocus: false,
  });
}

/**
 * 统计数据工具函数
 */
export function useStatsUtils() {
  return useMemo(() => ({
    /**
     * 格式化统计数字
     */
    formatNumber: (num: number): string => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    },

    /**
     * 格式化百分比变化
     */
    formatPercentage: (percentage: number): { text: string; color: string; icon: string } => {
      const absPercentage = Math.abs(percentage);
      const formattedPercentage = absPercentage.toFixed(1) + '%';
      
      if (percentage > 0) {
        return {
          text: `+${formattedPercentage}`,
          color: 'green',
          icon: '↗'
        };
      } else if (percentage < 0) {
        return {
          text: `-${formattedPercentage}`,
          color: 'red',
          icon: '↘'
        };
      } else {
        return {
          text: '0%',
          color: 'gray',
          icon: '→'
        };
      }
    },

    /**
     * 格式化增长数据
     */
    formatGrowth: (current: number, previous: number) => {
      const change = current - previous;
      const percentage = previous > 0 ? ((change / previous) * 100) : 0;
      
      return {
        current,
        previous,
        change,
        percentage,
        formatted: {
          current: (current >= 1000) ? (current / 1000).toFixed(1) + 'K' : current.toString(),
          change: change > 0 ? `+${change}` : change.toString(),
          percentage: percentage.toFixed(1) + '%'
        }
      };
    },

    /**
     * 生成图表颜色方案
     */
    getChartColors: () => ({
      primary: '#339af0',
      secondary: '#51cf66',
      warning: '#ffd43b',
      danger: '#ff6b6b',
      info: '#74c0fc',
      success: '#69db7c',
      gradients: {
        blue: ['#339af0', '#1c7ed6'],
        green: ['#51cf66', '#37b24d'],
        yellow: ['#ffd43b', '#fab005'],
        red: ['#ff6b6b', '#e03131'],
      }
    }),

    /**
     * 转换数据为图表格式
     */
    toChartData: (data: any[], labelKey: string, valueKey: string, label: string): ChartData => {
      return {
        labels: data.map(item => item[labelKey]),
        datasets: [{
          label,
          data: data.map(item => item[valueKey]),
          borderColor: '#339af0',
          backgroundColor: 'rgba(51, 154, 240, 0.1)',
          fill: true,
        }]
      };
    },

    /**
     * 生成时间周期选项
     */
    getPeriodOptions: () => [
      { value: '7d', label: '最近7天' },
      { value: '30d', label: '最近30天' },
      { value: '90d', label: '最近90天' },
    ],

    /**
     * 计算统计卡片数据
     */
    generateStatCards: (stats: DashboardStats) => [
      {
        title: '总用户数',
        value: stats.totalUsers,
        change: stats.userGrowth.percentage,
        icon: 'users',
        color: 'blue'
      },
      {
        title: '总文章数',
        value: stats.totalPosts,
        change: stats.postGrowth.percentage,
        icon: 'article',
        color: 'green'
      },
      {
        title: '已发布文章',
        value: stats.publishedPosts,
        change: 0, // 可以添加已发布文章的增长数据
        icon: 'published',
        color: 'cyan'
      },
      {
        title: '总浏览量',
        value: stats.totalViews,
        change: stats.viewGrowth.percentage,
        icon: 'eye',
        color: 'yellow'
      },
      {
        title: '总点赞数',
        value: stats.totalLikes,
        change: 0, // 可以添加点赞数的增长数据
        icon: 'heart',
        color: 'red'
      },
      {
        title: '分类数量',
        value: stats.totalCategories,
        change: 0, // 可以添加分类数量的增长数据
        icon: 'category',
        color: 'purple'
      }
    ],

    /**
     * 获取性能指标
     */
    getPerformanceMetrics: (stats: DashboardStats) => ({
      contentHealth: {
        publishedRatio: stats.totalPosts > 0 ? (stats.publishedPosts / stats.totalPosts * 100) : 0,
        draftCount: stats.draftPosts,
        averageViewsPerPost: stats.totalPosts > 0 ? (stats.totalViews / stats.totalPosts) : 0,
      },
      engagement: {
        likesPerPost: stats.totalPosts > 0 ? (stats.totalLikes / stats.totalPosts) : 0,
        viewsPerUser: stats.totalUsers > 0 ? (stats.totalViews / stats.totalUsers) : 0,
      },
      growth: {
        userGrowthRate: stats.userGrowth.percentage,
        contentGrowthRate: stats.postGrowth.percentage,
        engagementGrowthRate: stats.viewGrowth.percentage,
      }
    }),
  }), []);
}

/**
 * 实时数据更新Hook
 */
export function useRealTimeStats(enabled = false) {
  return useDashboardStats();
  // 如果需要WebSocket实时更新，可以在这里添加WebSocket逻辑
}

/**
 * 导出数据Hook
 */
export function useExportStats() {
  const utils = (api as any).useUtils();
  
  return useMemo(() => ({
    /**
     * 导出CSV格式统计数据
     */
    exportToCSV: (stats: DashboardStats, filename = 'dashboard-stats.csv') => {
      const csvData = [
        ['指标', '数值', '变化百分比'],
        ['总用户数', stats.totalUsers.toString(), stats.userGrowth.percentage.toString()],
        ['总文章数', stats.totalPosts.toString(), stats.postGrowth.percentage.toString()],
        ['已发布文章', stats.publishedPosts.toString(), '0'],
        ['草稿文章', stats.draftPosts.toString(), '0'],
        ['总浏览量', stats.totalViews.toString(), stats.viewGrowth.percentage.toString()],
        ['总点赞数', stats.totalLikes.toString(), '0'],
        ['分类数量', stats.totalCategories.toString(), '0'],
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    /**
     * 导出JSON格式统计数据
     */
    exportToJSON: (stats: DashboardStats, filename = 'dashboard-stats.json') => {
      const dataStr = JSON.stringify(stats, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  }), []);
} 