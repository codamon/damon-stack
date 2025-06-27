import { createTheme, rem, MantineThemeOverride } from '@mantine/core';

/**
 * damon-stack 基础主题配置
 * 
 * 所有应用主题的共同基础，包含：
 * - 品牌一致性元素
 * - 基础设计系统
 * - 通用组件样式
 */

// 品牌色彩系统
export const brandColors = {
  // 主品牌色
  primary: '#6366f1',      // indigo-500
  primaryDark: '#4f46e5',  // indigo-600
  primaryLight: '#818cf8', // indigo-400
  
  // 辅助色
  secondary: '#06b6d4',    // cyan-500
  accent: '#8b5cf6',       // violet-500
  
  // 语义色
  success: '#10b981',      // emerald-500
  warning: '#f59e0b',      // amber-500
  error: '#ef4444',        // red-500
  info: '#3b82f6',         // blue-500
  
  // 中性色
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
};

// 基础字体系统
export const baseFonts = {
  sans: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  serif: '"Source Serif Pro", "Georgia", "Times New Roman", serif',
  mono: '"JetBrains Mono", "SF Mono", "Monaco", "Inconsolata", monospace',
};

// 基础间距系统
export const baseSpacing = {
  xs: rem(4),
  sm: rem(8),
  md: rem(16),
  lg: rem(24),
  xl: rem(32),
  xxl: rem(48),
};

// 基础圆角系统
export const baseRadius = {
  xs: rem(2),
  sm: rem(4),
  md: rem(6),
  lg: rem(8),
  xl: rem(12),
  xxl: rem(16),
};

// 基础阴影系统
export const baseShadows = {
  xs: '0 1px 3px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  xxl: '0 25px 50px rgba(0, 0, 0, 0.25)',
};

// 基础字体大小
export const baseFontSizes = {
  xs: rem(12),
  sm: rem(14),
  md: rem(16),
  lg: rem(18),
  xl: rem(20),
  xxl: rem(24),
};

// 基础行高
export const baseLineHeights = {
  xs: '1.3',
  sm: '1.4',
  md: '1.5',
  lg: '1.6',
  xl: '1.7',
};

/**
 * 基础主题配置
 */
export const baseTheme: MantineThemeOverride = {
  fontFamily: baseFonts.sans,
  fontFamilyMonospace: baseFonts.mono,
  
  fontSizes: baseFontSizes,
  lineHeights: baseLineHeights,
  spacing: baseSpacing,
  radius: baseRadius,
  shadows: baseShadows,
  
  defaultRadius: 'md',
  autoContrast: true,
  luminanceThreshold: 0.3,
  focusRing: 'auto',
  cursorType: 'default',
  
  // 标题系统
  headings: {
    fontFamily: baseFonts.sans,
    fontWeight: '600',
    textWrap: 'wrap',
    sizes: {
      h1: {
        fontSize: rem(32),
        fontWeight: '700',
        lineHeight: '1.2',
      },
      h2: {
        fontSize: rem(26),
        fontWeight: '600',
        lineHeight: '1.25',
      },
      h3: {
        fontSize: rem(22),
        fontWeight: '600',
        lineHeight: '1.3',
      },
      h4: {
        fontSize: rem(18),
        fontWeight: '600',
        lineHeight: '1.35',
      },
      h5: {
        fontSize: rem(16),
        fontWeight: '600',
        lineHeight: '1.4',
      },
      h6: {
        fontSize: rem(14),
        fontWeight: '600',
        lineHeight: '1.45',
      },
    },
  },
  
  // 通用组件配置
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: 500,
          transition: 'all 150ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },

    Input: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        input: {
          transition: 'all 150ms ease',
          '&:focus': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },

    Paper: {
      defaultProps: {
        radius: 'md',
        padding: 'md',
      },
      styles: {
        root: {
          transition: 'all 150ms ease',
        },
      },
    },

    Card: {
      defaultProps: {
        radius: 'md',
        padding: 'lg',
        withBorder: true,
      },
      styles: {
        root: {
          transition: 'all 200ms ease',
          border: `1px solid ${brandColors.gray200}`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: baseShadows.lg,
          },
        },
      },
    },
  },
  
  // 自定义属性
  other: {
    brandColors,
    fonts: baseFonts,
    
    // 布局相关
    layout: {
      maxWidth: '1280px',
      headerHeight: '64px',
      sidebarWidth: '280px',
      footerHeight: '120px',
    },
    
    // 动画时长
    transitions: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    
    // 断点
    breakpoints: {
      xs: '576px',
      sm: '768px',
      md: '992px',
      lg: '1200px',
      xl: '1400px',
    },
  },
};

/**
 * 创建基础主题
 */
export const createBaseTheme = () => createTheme(baseTheme); 