import { createTheme, rem, MantineThemeOverride, mergeThemeOverrides } from '@mantine/core';
import { baseTheme, brandColors, baseFonts } from './base';

/**
 * 电商购物主题配置
 * 
 * 设计理念：转化导向、行动促进、信任建立
 * 适用场景：电商网站、产品展示、购物流程
 * 
 * 特点：
 * - 高转化率的色彩搭配
 * - 清晰的行动指引
 * - 信任感营造
 * - 购物体验优化
 */

// 电商主题专用色彩
export const ecommerceColors = {
  // 主色调：活力橙色，促进行动
  primary: '#ea580c',      // orange-600
  primaryLight: '#fb923c', // orange-400
  primaryDark: '#c2410c',  // orange-700
  
  // 辅助色：成功绿色和警告红色
  secondary: '#16a34a',    // green-600
  accent: '#dc2626',       // red-600
  
  // 购物相关色彩
  success: '#16a34a',      // green-600 - 成功/已添加
  warning: '#d97706',      // amber-600 - 库存警告
  danger: '#dc2626',       // red-600 - 错误/删除
  info: '#2563eb',         // blue-600 - 信息提示
  
  // 背景色：清洁现代
  backgroundPrimary: '#ffffff',
  backgroundSecondary: '#f8fafc', // slate-50
  backgroundTertiary: '#f1f5f9',  // slate-100
  backgroundCart: '#fef3c7',      // amber-100
  
  // 文本色：清晰对比
  textPrimary: '#111827',   // gray-900
  textSecondary: '#374151', // gray-700
  textMuted: '#6b7280',     // gray-500
  textPrice: '#dc2626',     // red-600
  textOriginalPrice: '#9ca3af', // gray-400
  
  // 边框色：明确分割
  borderPrimary: '#e5e7eb',   // gray-200
  borderSecondary: '#d1d5db', // gray-300
  borderSuccess: '#16a34a',   // green-600
  borderWarning: '#d97706',   // amber-600
  
  // 状态色：产品状态
  inStock: '#16a34a',       // green-600
  lowStock: '#d97706',      // amber-600
  outOfStock: '#dc2626',    // red-600
  sale: '#dc2626',          // red-600
  new: '#2563eb',           // blue-600
};

/**
 * 电商主题配置
 */
export const ecommerceThemeOverride: MantineThemeOverride = {
  primaryColor: 'orange',
  
  // 字体系统：清晰易读
  fontFamily: baseFonts.sans,
  headings: {
    fontFamily: baseFonts.sans,
    fontWeight: '700',
    textWrap: 'wrap',
    sizes: {
      h1: {
        fontSize: rem(38),
        fontWeight: '800',
        lineHeight: '1.2',
      },
      h2: {
        fontSize: rem(30),
        fontWeight: '700',
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
  
  // 圆角：现代友好
  defaultRadius: 'md',
  radius: {
    xs: rem(4),
    sm: rem(6),
    md: rem(8),
    lg: rem(12),
    xl: rem(16),
  },
  
  // 阴影：层次清晰
  shadows: {
    xs: '0 1px 3px rgba(17, 24, 39, 0.08)',
    sm: '0 1px 3px rgba(17, 24, 39, 0.1), 0 1px 2px rgba(17, 24, 39, 0.06)',
    md: '0 4px 12px rgba(17, 24, 39, 0.15), 0 2px 4px rgba(17, 24, 39, 0.08)',
    lg: '0 8px 24px rgba(17, 24, 39, 0.15), 0 4px 8px rgba(17, 24, 39, 0.08)',
    xl: '0 16px 40px rgba(17, 24, 39, 0.2), 0 8px 16px rgba(17, 24, 39, 0.1)',
  },
  
  // 组件配置：转化优化
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          
          // 主要CTA按钮
          '&[data-variant="filled"]': {
            backgroundColor: ecommerceColors.primary,
            border: `1px solid ${ecommerceColors.primary}`,
            fontSize: rem(16),
            fontWeight: 700,
            '&:hover': {
              backgroundColor: ecommerceColors.primaryDark,
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(234, 88, 12, 0.3)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          
          // 次要按钮
          '&[data-variant="outline"]': {
            border: `2px solid ${ecommerceColors.primary}`,
            color: ecommerceColors.primary,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: ecommerceColors.primary,
              transform: 'translateY(-1px)',
            },
          },
          
          // 成功按钮（已添加到购物车等）
          '&[data-variant="success"]': {
            backgroundColor: ecommerceColors.success,
            color: 'white',
            '&:hover': {
              backgroundColor: '#15803d', // green-700
            },
          },
          
          // 危险按钮（删除等）
          '&[data-variant="danger"]': {
            backgroundColor: ecommerceColors.danger,
            color: 'white',
            '&:hover': {
              backgroundColor: '#b91c1c', // red-700
            },
          },
        },
      },
    },

    Input: {
      defaultProps: {
        radius: 'md',
        size: 'lg', // 更大的输入框，便于移动端使用
      },
      styles: {
        input: {
          border: `2px solid ${ecommerceColors.borderPrimary}`,
          backgroundColor: ecommerceColors.backgroundPrimary,
          transition: 'all 200ms ease',
          '&:focus': {
            borderColor: ecommerceColors.primary,
            boxShadow: `0 0 0 2px rgba(234, 88, 12, 0.1)`,
          },
        },
      },
    },

    Paper: {
      defaultProps: {
        radius: 'md',
        padding: 'lg',
        withBorder: true,
      },
      styles: {
        root: {
          backgroundColor: ecommerceColors.backgroundPrimary,
          border: `1px solid ${ecommerceColors.borderPrimary}`,
          transition: 'all 200ms ease',
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
          backgroundColor: ecommerceColors.backgroundPrimary,
          border: `1px solid ${ecommerceColors.borderPrimary}`,
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(17, 24, 39, 0.15)',
            borderColor: ecommerceColors.primary,
          },
        },
      },
    },

    // 徽章样式（销售标签等）
    Badge: {
      defaultProps: {
        radius: 'sm',
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          
          // 销售徽章
          '&[data-variant="sale"]': {
            backgroundColor: ecommerceColors.sale,
            color: 'white',
          },
          
          // 新品徽章
          '&[data-variant="new"]': {
            backgroundColor: ecommerceColors.new,
            color: 'white',
          },
          
          // 库存状态
          '&[data-variant="in-stock"]': {
            backgroundColor: ecommerceColors.inStock,
            color: 'white',
          },
          
          '&[data-variant="low-stock"]': {
            backgroundColor: ecommerceColors.lowStock,
            color: 'white',
          },
          
          '&[data-variant="out-of-stock"]': {
            backgroundColor: ecommerceColors.outOfStock,
            color: 'white',
          },
        },
      },
    },

    // 价格显示
    Text: {
      styles: {
        root: {
          '&[data-variant="price"]': {
            color: ecommerceColors.textPrice,
            fontWeight: 700,
            fontSize: rem(18),
          },
          
          '&[data-variant="original-price"]': {
            color: ecommerceColors.textOriginalPrice,
            textDecoration: 'line-through',
            fontSize: rem(14),
          },
          
          '&[data-variant="discount"]': {
            color: ecommerceColors.sale,
            fontWeight: 600,
            fontSize: rem(14),
          },
        },
      },
    },

    // 导航组件
    NavLink: {
      styles: {
        root: {
          fontWeight: 500,
          borderRadius: rem(6),
          transition: 'all 150ms ease',
          '&:hover': {
            backgroundColor: ecommerceColors.backgroundSecondary,
            color: ecommerceColors.primary,
          },
        },
      },
    },

    // 通知组件
    Notification: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          '&[data-variant="success"]': {
            backgroundColor: '#dcfce7', // green-100
            borderColor: ecommerceColors.success,
          },
          
          '&[data-variant="error"]': {
            backgroundColor: '#fee2e2', // red-100
            borderColor: ecommerceColors.danger,
          },
        },
      },
    },
  },
  
  // 自定义属性
  other: {
    ...baseTheme.other,
    
    // 电商主题专用色彩
    ecommerceColors,
    
    // 电商主题布局
    layout: {
      maxWidth: '1400px',
      headerHeight: '80px',
      productGridGap: '24px',
      cartSidebarWidth: '400px',
      checkoutMaxWidth: '600px',
    },
    
    // 产品相关配置
    product: {
      imageAspectRatio: '1:1',
      thumbnailSize: '80px',
      cardMinHeight: '320px',
      priceSize: rem(20),
      titleSize: rem(16),
    },
    
    // 购物车配置
    cart: {
      itemHeight: '120px',
      quantityInputWidth: '80px',
      totalFontSize: rem(24),
      subtotalFontSize: rem(18),
    },
    
    // 电商主题动画
    animations: {
      addToCart: 'bounce 0.6s ease-out',
      priceChange: 'pulse 0.4s ease-out',
      stockAlert: 'shake 0.5s ease-out',
      checkout: 'slideInRight 0.3s ease-out',
    },
    
    // 响应式断点
    responsive: {
      productGridCols: {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
      },
    },
  },
};

/**
 * 创建电商主题
 */
export const ecommerceTheme = createTheme(
  mergeThemeOverrides(baseTheme, ecommerceThemeOverride)
);

/**
 * 电商主题工具函数
 */
export const ecommerceThemeUtils = {
  /**
   * 获取电商主题色彩
   */
  getColor: (colorKey: keyof typeof ecommerceColors) => ecommerceColors[colorKey],
  
  /**
   * 获取产品卡片样式
   */
  getProductCardStyle: (variant: 'default' | 'featured' = 'default') => {
    const baseStyle = {
      backgroundColor: ecommerceColors.backgroundPrimary,
      border: `1px solid ${ecommerceColors.borderPrimary}`,
      borderRadius: rem(8),
      padding: rem(16),
      transition: 'all 300ms ease',
    };
    
    if (variant === 'featured') {
      return {
        ...baseStyle,
        border: `2px solid ${ecommerceColors.primary}`,
        boxShadow: '0 8px 24px rgba(234, 88, 12, 0.15)',
      };
    }
    
    return baseStyle;
  },
  
  /**
   * 获取价格显示样式
   */
  getPriceStyle: (type: 'current' | 'original' | 'discount' = 'current') => {
    const styles = {
      current: {
        color: ecommerceColors.textPrice,
        fontSize: rem(20),
        fontWeight: 700,
      },
      original: {
        color: ecommerceColors.textOriginalPrice,
        fontSize: rem(16),
        fontWeight: 500,
        textDecoration: 'line-through',
      },
      discount: {
        color: ecommerceColors.sale,
        fontSize: rem(14),
        fontWeight: 600,
        backgroundColor: '#fee2e2', // red-100
        padding: `${rem(2)} ${rem(6)}`,
        borderRadius: rem(4),
      },
    };
    
    return styles[type];
  },
  
  /**
   * 获取库存状态样式
   */
  getStockStyle: (status: 'in-stock' | 'low-stock' | 'out-of-stock') => {
    const styles = {
      'in-stock': {
        color: ecommerceColors.inStock,
        backgroundColor: '#dcfce7', // green-100
      },
      'low-stock': {
        color: ecommerceColors.lowStock,
        backgroundColor: '#fef3c7', // amber-100
      },
      'out-of-stock': {
        color: ecommerceColors.outOfStock,
        backgroundColor: '#fee2e2', // red-100
      },
    };
    
    return {
      ...styles[status],
      padding: `${rem(4)} ${rem(8)}`,
      borderRadius: rem(4),
      fontSize: rem(12),
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    };
  },
  
  /**
   * 获取CTA按钮样式
   */
  getCTAButtonStyle: (variant: 'primary' | 'secondary' | 'success' = 'primary') => {
    const styles = {
      primary: {
        backgroundColor: ecommerceColors.primary,
        color: 'white',
        fontSize: rem(16),
        fontWeight: 700,
        padding: `${rem(12)} ${rem(24)}`,
      },
      secondary: {
        backgroundColor: 'transparent',
        color: ecommerceColors.primary,
        border: `2px solid ${ecommerceColors.primary}`,
        fontSize: rem(16),
        fontWeight: 600,
        padding: `${rem(10)} ${rem(24)}`,
      },
      success: {
        backgroundColor: ecommerceColors.success,
        color: 'white',
        fontSize: rem(16),
        fontWeight: 700,
        padding: `${rem(12)} ${rem(24)}`,
      },
    };
    
    return {
      ...styles[variant],
      borderRadius: rem(8),
      transition: 'all 200ms ease',
      textTransform: 'none',
    };
  },
};

export default ecommerceTheme; 