import { createTheme, rem, MantineThemeOverride, mergeThemeOverrides } from '@mantine/core';
import { baseTheme, brandColors, baseFonts } from './base';

/**
 * 企业官网主题配置
 * 
 * 设计理念：专业、权威、可信
 * 适用场景：企业官网、产品展示、商务合作
 * 
 * 特点：
 * - 深蓝色主色调，传达专业感
 * - 清晰的层次结构
 * - 强调可信度和权威性
 * - 适合B2B商务场景
 */

// 企业主题专用色彩
export const corporateColors = {
  // 主色调：深蓝色系，传达专业和可信
  primary: '#1e40af',      // blue-800
  primaryLight: '#3b82f6', // blue-500  
  primaryDark: '#1e3a8a',  // blue-900
  
  // 辅助色：金色，象征成功和价值
  secondary: '#d97706',    // amber-600
  accent: '#0891b2',       // cyan-600
  
  // 背景色：纯净专业
  backgroundPrimary: '#ffffff',
  backgroundSecondary: '#f8fafc', // slate-50
  backgroundTertiary: '#f1f5f9',  // slate-100
  
  // 文本色：高对比度，确保可读性
  textPrimary: '#0f172a',   // slate-900
  textSecondary: '#475569', // slate-600
  textMuted: '#64748b',     // slate-500
  
  // 边框色：细腻的分割
  borderPrimary: '#e2e8f0', // slate-200
  borderSecondary: '#cbd5e1', // slate-300
};

/**
 * 企业主题配置
 */
export const corporateThemeOverride: MantineThemeOverride = {
  primaryColor: 'blue',
  
  // 字体系统：更加正式和专业
  fontFamily: baseFonts.sans,
  headings: {
    fontFamily: baseFonts.sans,
    fontWeight: '700', // 更粗的字重，增强权威感
    textWrap: 'wrap',
    sizes: {
      h1: {
        fontSize: rem(42),
        fontWeight: '800',
        lineHeight: '1.1',
      },
      h2: {
        fontSize: rem(32),
        fontWeight: '700',
        lineHeight: '1.2',
      },
      h3: {
        fontSize: rem(26),
        fontWeight: '600',
        lineHeight: '1.25',
      },
      h4: {
        fontSize: rem(20),
        fontWeight: '600',
        lineHeight: '1.3',
      },
      h5: {
        fontSize: rem(18),
        fontWeight: '600',
        lineHeight: '1.35',
      },
      h6: {
        fontSize: rem(16),
        fontWeight: '600',
        lineHeight: '1.4',
      },
    },
  },
  
  // 圆角：较小的圆角，更加正式
  defaultRadius: 'sm',
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(6),
    lg: rem(8),
    xl: rem(10),
  },
  
  // 阴影：深度感，增强层次
  shadows: {
    xs: '0 1px 3px rgba(15, 23, 42, 0.08)',
    sm: '0 1px 3px rgba(15, 23, 42, 0.12), 0 1px 2px rgba(15, 23, 42, 0.08)',
    md: '0 4px 12px rgba(15, 23, 42, 0.15), 0 2px 4px rgba(15, 23, 42, 0.08)',
    lg: '0 8px 24px rgba(15, 23, 42, 0.15), 0 4px 8px rgba(15, 23, 42, 0.08)',
    xl: '0 16px 40px rgba(15, 23, 42, 0.2), 0 8px 16px rgba(15, 23, 42, 0.1)',
  },
  
  // 组件配置：专业化定制
  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.025em',
          textTransform: 'none',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          
          // 主要按钮样式
          '&[data-variant="filled"]': {
            backgroundColor: corporateColors.primary,
            border: `1px solid ${corporateColors.primary}`,
            '&:hover': {
              backgroundColor: corporateColors.primaryDark,
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 24px rgba(30, 64, 175, 0.25)',
            },
          },
          
          // 次要按钮样式
          '&[data-variant="outline"]': {
            border: `1px solid ${corporateColors.primary}`,
            color: corporateColors.primary,
            '&:hover': {
              backgroundColor: corporateColors.primary,
              transform: 'translateY(-1px)',
            },
          },
        },
      },
    },

    Input: {
      defaultProps: {
        radius: 'sm',
        size: 'md',
      },
      styles: {
        input: {
          border: `1px solid ${corporateColors.borderSecondary}`,
          backgroundColor: corporateColors.backgroundPrimary,
          transition: 'all 200ms ease',
          '&:focus': {
            borderColor: corporateColors.primary,
            boxShadow: `0 0 0 1px ${corporateColors.primary}`,
          },
        },
      },
    },

    Paper: {
      defaultProps: {
        radius: 'sm',
        padding: 'xl',
        withBorder: true,
      },
      styles: {
        root: {
          backgroundColor: corporateColors.backgroundPrimary,
          border: `1px solid ${corporateColors.borderPrimary}`,
          transition: 'all 200ms ease',
        },
      },
    },

    Card: {
      defaultProps: {
        radius: 'sm',
        padding: 'xl',
        withBorder: true,
      },
      styles: {
        root: {
          backgroundColor: corporateColors.backgroundPrimary,
          border: `1px solid ${corporateColors.borderPrimary}`,
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.15)',
            borderColor: corporateColors.primary,
          },
        },
      },
    },

    // 导航组件
    NavLink: {
      defaultProps: {
        variant: 'subtle',
      },
      styles: {
        root: {
          fontWeight: 500,
          borderRadius: rem(4),
          transition: 'all 150ms ease',
          '&:hover': {
            backgroundColor: corporateColors.backgroundSecondary,
          },
        },
      },
    },

    // 标题组件
    Title: {
      styles: {
        root: {
          color: corporateColors.textPrimary,
        },
      },
    },

    // 文本组件
    Text: {
      styles: {
        root: {
          color: corporateColors.textSecondary,
          lineHeight: 1.6,
        },
      },
    },
  },
  
  // 自定义属性
  other: {
    ...baseTheme.other,
    
    // 企业主题专用色彩
    corporateColors,
    
    // 企业主题布局
    layout: {
      maxWidth: '1280px',
      headerHeight: '72px',
      heroHeight: '600px',
      sectionPadding: '120px',
    },
    
    // 企业主题动画
    animations: {
      fadeIn: 'fadeIn 0.6s ease-out',
      slideUp: 'slideUp 0.8s ease-out',
      scaleIn: 'scaleIn 0.4s ease-out',
    },
    
    // 企业主题特定配置
    corporate: {
      logoHeight: '48px',
      navItemSpacing: '32px',
      ctaButtonHeight: '48px',
      testimonialCardRadius: '8px',
      featureIconSize: '48px',
    },
  },
};

/**
 * 创建企业主题
 */
export const corporateTheme = createTheme(
  mergeThemeOverrides(baseTheme, corporateThemeOverride)
);

/**
 * 企业主题工具函数
 */
export const corporateThemeUtils = {
  /**
   * 获取企业主题色彩
   */
  getColor: (colorKey: keyof typeof corporateColors) => corporateColors[colorKey],
  
  /**
   * 获取按钮样式
   */
  getButtonStyle: (variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
    const styles = {
      primary: {
        backgroundColor: corporateColors.primary,
        color: 'white',
        border: `1px solid ${corporateColors.primary}`,
      },
      secondary: {
        backgroundColor: corporateColors.secondary,
        color: 'white',
        border: `1px solid ${corporateColors.secondary}`,
      },
      outline: {
        backgroundColor: 'transparent',
        color: corporateColors.primary,
        border: `1px solid ${corporateColors.primary}`,
      },
    };
    
    return styles[variant];
  },
  
  /**
   * 获取卡片样式
   */
  getCardStyle: (elevated = false) => ({
    backgroundColor: corporateColors.backgroundPrimary,
    border: `1px solid ${corporateColors.borderPrimary}`,
    borderRadius: rem(4),
    boxShadow: elevated ? '0 8px 24px rgba(15, 23, 42, 0.1)' : '0 1px 3px rgba(15, 23, 42, 0.08)',
  }),
};

export default corporateTheme; 