import { createTheme, rem, MantineThemeOverride, mergeThemeOverrides } from '@mantine/core';
import { baseTheme, brandColors, baseFonts } from './base';

/**
 * 后台管理主题配置
 * 
 * 设计理念：功能导向、效率优先、信息密度适中
 * 适用场景：管理后台、数据面板、系统配置
 * 
 * 特点：
 * - 高信息密度布局
 * - 清晰的功能分区
 * - 专业化色彩搭配
 * - 快速操作优化
 */

// 后台主题专用色彩
export const dashboardColors = {
  // 主色调：紫色系，现代专业
  primary: '#7c3aed',      // violet-600
  primaryLight: '#8b5cf6', // violet-500
  primaryDark: '#6d28d9',  // violet-700
  
  // 辅助色：蓝色和青色
  secondary: '#0ea5e9',    // sky-500
  accent: '#06b6d4',       // cyan-500
  
  // 状态色：管理场景优化
  success: '#10b981',      // emerald-500
  warning: '#f59e0b',      // amber-500
  danger: '#ef4444',       // red-500
  info: '#3b82f6',         // blue-500
  
  // 背景色：层次化
  backgroundPrimary: '#ffffff',
  backgroundSecondary: '#f8fafc', // slate-50
  backgroundTertiary: '#f1f5f9',  // slate-100
  backgroundSidebar: '#f8fafc',   // slate-50
  backgroundCard: '#ffffff',
  
  // 文本色：高对比度
  textPrimary: '#0f172a',   // slate-900
  textSecondary: '#475569', // slate-600
  textMuted: '#64748b',     // slate-500
  textInverse: '#ffffff',
  
  // 边框色：细腻分层
  borderPrimary: '#e2e8f0',   // slate-200
  borderSecondary: '#cbd5e1', // slate-300
  borderAccent: '#7c3aed',    // violet-600
  
  // 功能色：操作状态
  active: '#7c3aed',        // violet-600
  hover: '#f1f5f9',         // slate-100
  selected: '#ede9fe',      // violet-100
  disabled: '#94a3b8',      // slate-400
};

/**
 * 后台主题配置
 */
export const dashboardThemeOverride: MantineThemeOverride = {
  primaryColor: 'violet',
  
  // 字体系统：信息密度优化
  fontFamily: baseFonts.sans,
  fontSizes: {
    xs: rem(11),   // 表格数据、标签
    sm: rem(13),   // 次要信息
    md: rem(14),   // 主要内容
    lg: rem(16),   // 标题
    xl: rem(18),   // 页面标题
  },
  
  // 行高：紧凑布局
  lineHeights: {
    xs: '1.3',
    sm: '1.4',
    md: '1.45',
    lg: '1.5',
    xl: '1.55',
  },
  
  headings: {
    fontFamily: baseFonts.sans,
    fontWeight: '600',
    textWrap: 'wrap',
    sizes: {
      h1: {
        fontSize: rem(28),
        fontWeight: '700',
        lineHeight: '1.2',
      },
      h2: {
        fontSize: rem(22),
        fontWeight: '600',
        lineHeight: '1.25',
      },
      h3: {
        fontSize: rem(18),
        fontWeight: '600',
        lineHeight: '1.3',
      },
      h4: {
        fontSize: rem(16),
        fontWeight: '600',
        lineHeight: '1.35',
      },
      h5: {
        fontSize: rem(14),
        fontWeight: '600',
        lineHeight: '1.4',
      },
      h6: {
        fontSize: rem(12),
        fontWeight: '600',
        lineHeight: '1.45',
      },
    },
  },
  
  // 间距：紧凑高效
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24),
  },
  
  // 圆角：轻量现代
  defaultRadius: 'sm',
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(6),
    lg: rem(8),
    xl: rem(10),
  },
  
  // 阴影：层次清晰但不突兀
  shadows: {
    xs: '0 1px 3px rgba(15, 23, 42, 0.06)',
    sm: '0 1px 3px rgba(15, 23, 42, 0.1), 0 1px 2px rgba(15, 23, 42, 0.06)',
    md: '0 4px 12px rgba(15, 23, 42, 0.1), 0 2px 4px rgba(15, 23, 42, 0.06)',
    lg: '0 8px 24px rgba(15, 23, 42, 0.12), 0 4px 8px rgba(15, 23, 42, 0.06)',
    xl: '0 16px 40px rgba(15, 23, 42, 0.15), 0 8px 16px rgba(15, 23, 42, 0.08)',
  },
  
  // 组件配置：功能优先
  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
      styles: {
        root: {
          fontWeight: 500,
          fontSize: rem(13),
          transition: 'all 150ms ease',
          
          // 主要按钮
          '&[data-variant="filled"]': {
            backgroundColor: dashboardColors.primary,
            border: `1px solid ${dashboardColors.primary}`,
            '&:hover': {
              backgroundColor: dashboardColors.primaryDark,
              transform: 'translateY(-1px)',
            },
          },
          
          // 次要按钮
          '&[data-variant="outline"]': {
            border: `1px solid ${dashboardColors.borderSecondary}`,
            color: dashboardColors.textSecondary,
            '&:hover': {
              backgroundColor: dashboardColors.hover,
              borderColor: dashboardColors.primary,
            },
          },
          
          // 轻量按钮
          '&[data-variant="light"]': {
            backgroundColor: dashboardColors.backgroundTertiary,
            color: dashboardColors.textPrimary,
            '&:hover': {
              backgroundColor: dashboardColors.selected,
            },
          },
          
          // 危险按钮
          '&[data-variant="danger"]': {
            backgroundColor: dashboardColors.danger,
            color: 'white',
            '&:hover': {
              backgroundColor: '#dc2626', // red-600
            },
          },
        },
      },
    },

    Input: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
      styles: {
        input: {
          border: `1px solid ${dashboardColors.borderPrimary}`,
          backgroundColor: dashboardColors.backgroundPrimary,
          fontSize: rem(13),
          transition: 'all 150ms ease',
          '&:focus': {
            borderColor: dashboardColors.primary,
            boxShadow: `0 0 0 1px ${dashboardColors.primary}`,
          },
        },
      },
    },

    Paper: {
      defaultProps: {
        radius: 'sm',
        padding: 'md',
        withBorder: true,
      },
      styles: {
        root: {
          backgroundColor: dashboardColors.backgroundCard,
          border: `1px solid ${dashboardColors.borderPrimary}`,
          transition: 'all 150ms ease',
        },
      },
    },

    Card: {
      defaultProps: {
        radius: 'sm',
        padding: 'md',
        withBorder: true,
      },
      styles: {
        root: {
          backgroundColor: dashboardColors.backgroundCard,
          border: `1px solid ${dashboardColors.borderPrimary}`,
          transition: 'all 200ms ease',
          '&:hover': {
            borderColor: dashboardColors.borderAccent,
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)',
          },
        },
      },
    },

    // 表格样式：信息密度优化
    Table: {
      defaultProps: {
        withTableBorder: true,
        withColumnBorders: true,
        striped: true,
      },
      styles: {
        table: {
          fontSize: rem(13),
          '& th': {
            backgroundColor: dashboardColors.backgroundSecondary,
            color: dashboardColors.textSecondary,
            fontWeight: 600,
            fontSize: rem(12),
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: `${rem(8)} ${rem(12)}`,
          },
          '& td': {
            padding: `${rem(6)} ${rem(12)}`,
            borderBottom: `1px solid ${dashboardColors.borderPrimary}`,
          },
          '& tr:hover': {
            backgroundColor: dashboardColors.hover,
          },
        },
      },
    },

    // 导航菜单
    NavLink: {
      defaultProps: {
        variant: 'subtle',
      },
      styles: {
        root: {
          fontWeight: 500,
          fontSize: rem(13),
          borderRadius: rem(4),
          padding: `${rem(8)} ${rem(12)}`,
          margin: `${rem(1)} 0`,
          transition: 'all 150ms ease',
          
          '&:hover': {
            backgroundColor: dashboardColors.hover,
          },
          
          '&[data-active="true"]': {
            backgroundColor: dashboardColors.selected,
            color: dashboardColors.primary,
            fontWeight: 600,
          },
        },
      },
    },

    // 标签页
    Tabs: {
      defaultProps: {
        radius: 'sm',
        variant: 'outline',
      },
      styles: {
        tab: {
          fontSize: rem(13),
          fontWeight: 500,
          padding: `${rem(6)} ${rem(12)}`,
          '&[data-active="true"]': {
            borderColor: dashboardColors.primary,
            color: dashboardColors.primary,
          },
        },
      },
    },

    // 徽章
    Badge: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
      styles: {
        root: {
          fontSize: rem(11),
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          
          '&[data-variant="light"]': {
            '&[data-color="green"]': {
              backgroundColor: '#dcfce7', // green-100
              color: '#166534', // green-800
            },
            '&[data-color="yellow"]': {
              backgroundColor: '#fef3c7', // amber-100
              color: '#92400e', // amber-800
            },
            '&[data-color="red"]': {
              backgroundColor: '#fee2e2', // red-100
              color: '#991b1b', // red-800
            },
          },
        },
      },
    },

    // 统计卡片
    Title: {
      styles: {
        root: {
          color: dashboardColors.textPrimary,
          
          '&[data-order="1"]': {
            fontSize: rem(20),
            fontWeight: 700,
          },
        },
      },
    },

    Text: {
      styles: {
        root: {
          color: dashboardColors.textSecondary,
          fontSize: rem(13),
          
          '&[data-variant="dimmed"]': {
            color: dashboardColors.textMuted,
            fontSize: rem(12),
          },
        },
      },
    },

    // 通知组件
    Notification: {
      defaultProps: {
        radius: 'sm',
      },
      styles: {
        root: {
          fontSize: rem(13),
          
          '&[data-variant="success"]': {
            backgroundColor: '#dcfce7', // green-100
            borderColor: dashboardColors.success,
          },
          
          '&[data-variant="error"]': {
            backgroundColor: '#fee2e2', // red-100
            borderColor: dashboardColors.danger,
          },
          
          '&[data-variant="warning"]': {
            backgroundColor: '#fef3c7', // amber-100
            borderColor: dashboardColors.warning,
          },
        },
      },
    },
  },
  
  // 自定义属性
  other: {
    ...baseTheme.other,
    
    // 后台主题专用色彩
    dashboardColors,
    
    // 后台布局配置
    layout: {
      maxWidth: '100%',
      headerHeight: '60px',
      sidebarWidth: '260px',
      sidebarCollapsedWidth: '60px',
      contentPadding: '16px',
      cardSpacing: '16px',
    },
    
    // 表格配置
    table: {
      rowHeight: '40px',
      headerHeight: '36px',
      actionColumnWidth: '120px',
      statusColumnWidth: '100px',
    },
    
    // 表单配置
    form: {
      labelWidth: '120px',
      inputSpacing: '12px',
      sectionSpacing: '24px',
      submitButtonHeight: '36px',
    },
    
    // 仪表板配置
    dashboard: {
      statCardHeight: '100px',
      chartCardMinHeight: '300px',
      widgetSpacing: '16px',
      gridGap: '16px',
    },
    
    // 后台主题动画
    animations: {
      slideIn: 'slideIn 0.2s ease-out',
      fadeIn: 'fadeIn 0.15s ease-out',
      scaleIn: 'scaleIn 0.1s ease-out',
      collapse: 'collapse 0.2s ease-out',
    },
    
    // 响应式设置
    responsive: {
      sidebarBreakpoint: '768px',
      tableScrollBreakpoint: '640px',
      cardStackBreakpoint: '480px',
    },
  },
};

/**
 * 创建后台主题
 */
export const dashboardTheme = createTheme(
  mergeThemeOverrides(baseTheme, dashboardThemeOverride)
);

/**
 * 后台主题工具函数
 */
export const dashboardThemeUtils = {
  /**
   * 获取后台主题色彩
   */
  getColor: (colorKey: keyof typeof dashboardColors) => dashboardColors[colorKey],
  
  /**
   * 获取状态徽章样式
   */
  getStatusBadgeStyle: (status: 'active' | 'inactive' | 'pending' | 'error') => {
    const styles = {
      active: {
        backgroundColor: '#dcfce7', // green-100
        color: '#166534', // green-800
      },
      inactive: {
        backgroundColor: '#f3f4f6', // gray-100
        color: '#374151', // gray-700
      },
      pending: {
        backgroundColor: '#fef3c7', // amber-100
        color: '#92400e', // amber-800
      },
      error: {
        backgroundColor: '#fee2e2', // red-100
        color: '#991b1b', // red-800
      },
    };
    
    return {
      ...styles[status],
      padding: `${rem(2)} ${rem(6)}`,
      borderRadius: rem(4),
      fontSize: rem(11),
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    };
  },
  
  /**
   * 获取统计卡片样式
   */
  getStatCardStyle: (variant: 'default' | 'primary' | 'success' | 'warning' = 'default') => {
    const variants = {
      default: {
        backgroundColor: dashboardColors.backgroundCard,
        borderColor: dashboardColors.borderPrimary,
      },
      primary: {
        backgroundColor: '#ede9fe', // violet-100
        borderColor: dashboardColors.primary,
      },
      success: {
        backgroundColor: '#dcfce7', // green-100
        borderColor: dashboardColors.success,
      },
      warning: {
        backgroundColor: '#fef3c7', // amber-100
        borderColor: dashboardColors.warning,
      },
    };
    
    return {
      ...variants[variant],
      border: `1px solid`,
      borderRadius: rem(4),
      padding: rem(16),
      minHeight: '100px',
      transition: 'all 150ms ease',
    };
  },
  
  /**
   * 获取表格行样式
   */
  getTableRowStyle: (state: 'default' | 'hover' | 'selected' = 'default') => {
    const styles = {
      default: {},
      hover: {
        backgroundColor: dashboardColors.hover,
      },
      selected: {
        backgroundColor: dashboardColors.selected,
        borderColor: dashboardColors.primary,
      },
    };
    
    return {
      ...styles[state],
      transition: 'all 150ms ease',
      cursor: 'pointer',
    };
  },
  
  /**
   * 获取侧边栏样式
   */
  getSidebarStyle: (collapsed = false) => ({
    width: collapsed ? '60px' : '260px',
    backgroundColor: dashboardColors.backgroundSidebar,
    borderRight: `1px solid ${dashboardColors.borderPrimary}`,
    transition: 'width 200ms ease',
    overflow: 'hidden',
  }),
  
  /**
   * 获取操作按钮样式
   */
  getActionButtonStyle: (variant: 'edit' | 'delete' | 'view' = 'edit') => {
    const styles = {
      edit: {
        color: dashboardColors.primary,
        backgroundColor: 'transparent',
      },
      delete: {
        color: dashboardColors.danger,
        backgroundColor: 'transparent',
      },
      view: {
        color: dashboardColors.info,
        backgroundColor: 'transparent',
      },
    };
    
    return {
      ...styles[variant],
      border: 'none',
      padding: `${rem(4)} ${rem(8)}`,
      borderRadius: rem(4),
      fontSize: rem(12),
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 150ms ease',
      '&:hover': {
        backgroundColor: `${styles[variant].color}10`, // 10% opacity
      },
    };
  },
};

export default dashboardTheme; 