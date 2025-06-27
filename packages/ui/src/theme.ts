import { createTheme, rem } from '@mantine/core';

/**
 * damon-stack 项目的中心化主题配置
 * 
 * 此主题文件定义了整个应用的设计系统，包括：
 * - 颜色系统（主色调、语义颜色）
 * - 字体系统
 * - 组件默认样式
 * - 间距和圆角
 * - 阴影系统
 */

export const theme = createTheme({
  /** 
   * 主色调 - 使用深蓝色作为主要品牌色
   * Mantine 提供的颜色：blue, red, green, yellow, orange, purple, violet, teal, cyan, pink, grape, indigo, lime
   */
  primaryColor: 'violet',

  /** 
   * 默认圆角 - 所有组件的默认圆角大小
   * 选项：xs, sm, md, lg, xl 或具体数值
   */
  defaultRadius: 'md',

  /** 
   * 字体系统
   */
  fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: '"JetBrains Mono", "Fira Code", "Monaco", "Menlo", monospace',

  /** 
   * 字号系统 - 自定义字体大小
   */
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },

  /** 
   * 行高系统
   */
  lineHeights: {
    xs: '1.4',
    sm: '1.45',
    md: '1.55',
    lg: '1.6',
    xl: '1.65',
  },

  /** 
   * 标题样式配置
   */
  headings: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontWeight: '600',
    textWrap: 'wrap',
    sizes: {
      h1: {
        fontSize: rem(36),
        fontWeight: '700',
        lineHeight: '1.2',
      },
      h2: {
        fontSize: rem(30),
        fontWeight: '600',
        lineHeight: '1.25',
      },
      h3: {
        fontSize: rem(24),
        fontWeight: '600',
        lineHeight: '1.3',
      },
      h4: {
        fontSize: rem(20),
        fontWeight: '600',
        lineHeight: '1.35',
      },
      h5: {
        fontSize: rem(18),
        fontWeight: '600',
        lineHeight: '1.4',
      },
      h6: {
        fontSize: rem(16),
        fontWeight: '600',
        lineHeight: '1.45',
      },
    },
  },

  /** 
   * 间距系统
   */
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },

  /** 
   * 阴影系统
   */
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.05), 0 20px 25px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.05), 0 25px 50px rgba(0, 0, 0, 0.25)',
  },

  /** 
   * 圆角系统
   */
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(8),
    lg: rem(12),
    xl: rem(16),
  },

  /** 
   * 全局组件默认属性配置
   * 这里为核心组件设置默认样式，确保整个应用的一致性
   */
  components: {
    /** Button 组件默认配置 */
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: 500,
          transition: 'all 200ms ease',
        },
      },
    },

    /** Input 组件默认配置 */
    Input: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        input: {
          transition: 'border-color 200ms ease, box-shadow 200ms ease',
        },
      },
    },

    /** TextInput 组件默认配置 */
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },

    /** PasswordInput 组件默认配置 */
    PasswordInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },

    /** Paper 组件默认配置 */
    Paper: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
        padding: 'md',
      },
      styles: {
        root: {
          transition: 'box-shadow 200ms ease',
        },
      },
    },

    /** Card 组件默认配置 */
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
        padding: 'lg',
        withBorder: false,
      },
      styles: {
        root: {
          transition: 'box-shadow 200ms ease, transform 200ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'var(--mantine-shadow-md)',
          },
        },
      },
    },

    /** Modal 组件默认配置 */
    Modal: {
      defaultProps: {
        radius: 'md',
        centered: true,
        shadow: 'xl',
      },
    },

    /** Notification 组件默认配置 */
    Notification: {
      defaultProps: {
        radius: 'md',
      },
    },

    /** Tabs 组件默认配置 */
    Tabs: {
      defaultProps: {
        radius: 'md',
      },
    },
  },

  /** 
   * 自动对比度 - 自动调整文本颜色以确保可读性
   */
  autoContrast: true,
  luminanceThreshold: 0.3,

  /** 
   * 聚焦样式配置
   */
  focusRing: 'auto',

  /** 
   * 光标类型配置
   */
  cursorType: 'default',

  /** 
   * 自定义主题属性
   * 在 theme.other 中存储项目特定的设计令牌
   */
  other: {
    // 品牌色彩
    brandColors: {
      primary: '#7c3aed', // violet-600
      secondary: '#06b6d4', // cyan-500
      success: '#10b981', // emerald-500
      warning: '#f59e0b', // amber-500
      error: '#ef4444', // red-500
      info: '#3b82f6', // blue-500
    },
    
    // 特殊间距
    containerMaxWidth: '1200px',
    headerHeight: '64px',
    sidebarWidth: '280px',
    
    // 认证相关颜色
    authColors: {
      formBackground: 'rgba(255, 255, 255, 0.95)',
      formBackgroundDark: 'rgba(31, 41, 55, 0.95)',
      cardShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      cardShadowDark: '0 10px 25px rgba(0, 0, 0, 0.3)',
    },
    
    // 动画时长
    transitions: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
  },
});

/** 
 * 主题类型定义，用于 TypeScript 类型检查
 */
export type AppTheme = typeof theme;

/** 
 * 获取主题中的自定义属性的辅助函数
 */
export const getThemeColor = (theme: AppTheme, colorKey: keyof NonNullable<typeof theme.other>['brandColors']) => {
  return theme.other?.brandColors[colorKey];
};

/** 
 * 默认导出主题对象
 */
export default theme; 