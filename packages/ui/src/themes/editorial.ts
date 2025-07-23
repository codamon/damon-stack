import { createTheme, rem, MantineThemeOverride, mergeThemeOverrides } from '@mantine/core';
import { baseTheme, brandColors, baseFonts } from './base';

/**
 * 编辑博客主题配置
 * 
 * 设计理念：阅读友好、内容聚焦、优雅简洁
 * 适用场景：博客、新闻、文档、内容展示
 * 
 * 特点：
 * - 优化的阅读体验
 * - 清晰的内容层次
 * - 温和的配色方案
 * - 专注内容本身
 */

// 编辑主题专用色彩
export const editorialColors = {
  // 主色调：温和的灰色系，不干扰阅读
  primary: '#374151',      // gray-700
  primaryLight: '#6b7280', // gray-500
  primaryDark: '#1f2937',  // gray-800
  
  // 辅助色：温暖的琥珀色，突出重要内容
  secondary: '#f59e0b',    // amber-500
  accent: '#10b981',       // emerald-500
  
  // 背景色：柔和护眼
  backgroundPrimary: '#fefefe',    // 略带暖色的白色
  backgroundSecondary: '#fafaf9',  // stone-50
  backgroundTertiary: '#f5f5f4',   // stone-100
  backgroundCode: '#f8fafc',       // slate-50
  
  // 文本色：优化阅读对比度
  textPrimary: '#1c1917',     // stone-900
  textSecondary: '#44403c',   // stone-700
  textMuted: '#78716c',       // stone-500
  textLink: '#2563eb',        // blue-600
  textLinkHover: '#1d4ed8',   // blue-700
  
  // 边框色：轻柔分割
  borderPrimary: '#e7e5e4',   // stone-200
  borderSecondary: '#d6d3d1', // stone-300
  borderAccent: '#fbbf24',    // amber-400
  
  // 特殊色：代码和引用
  codeBackground: '#f1f5f9',  // slate-100
  quoteBorder: '#e5e7eb',     // gray-200
  highlightBackground: '#fef3c7', // amber-100
};

/**
 * 编辑主题配置
 */
export const editorialThemeOverride: MantineThemeOverride = {
  primaryColor: 'gray',
  
  // 字体系统：阅读优化
  fontFamily: baseFonts.serif, // 使用衬线字体提升阅读体验
  fontFamilyMonospace: baseFonts.mono,
  
  // 文本大小：阅读友好
  fontSizes: {
    xs: rem(13),   // 较大的最小字体
    sm: rem(15),   // 舒适的小字体
    md: rem(17),   // 主要阅读字体
    lg: rem(19),   // 大字体
    xl: rem(22),   // 特大字体
  },
  
  // 行高：增强可读性
  lineHeights: {
    xs: '1.5',
    sm: '1.6',
    md: '1.65',
    lg: '1.7',
    xl: '1.75',
  },
  
  headings: {
    fontFamily: baseFonts.sans, // 标题使用无衬线字体
    fontWeight: '600',
    textWrap: 'wrap',
    sizes: {
      h1: {
        fontSize: rem(36),
        fontWeight: '700',
        lineHeight: '1.25',
      },
      h2: {
        fontSize: rem(30),
        fontWeight: '600',
        lineHeight: '1.3',
      },
      h3: {
        fontSize: rem(24),
        fontWeight: '600',
        lineHeight: '1.35',
      },
      h4: {
        fontSize: rem(20),
        fontWeight: '600',
        lineHeight: '1.4',
      },
      h5: {
        fontSize: rem(17),
        fontWeight: '600',
        lineHeight: '1.45',
      },
      h6: {
        fontSize: rem(15),
        fontWeight: '600',
        lineHeight: '1.5',
      },
    },
  },
  
  // 圆角：柔和温暖
  defaultRadius: 'md',
  radius: {
    xs: rem(3),
    sm: rem(6),
    md: rem(8),
    lg: rem(12),
    xl: rem(16),
  },
  
  // 阴影：轻柔自然
  shadows: {
    xs: '0 1px 3px rgba(28, 25, 23, 0.05)',
    sm: '0 1px 3px rgba(28, 25, 23, 0.08), 0 1px 2px rgba(28, 25, 23, 0.05)',
    md: '0 4px 12px rgba(28, 25, 23, 0.1), 0 2px 4px rgba(28, 25, 23, 0.06)',
    lg: '0 8px 24px rgba(28, 25, 23, 0.12), 0 4px 8px rgba(28, 25, 23, 0.06)',
    xl: '0 16px 40px rgba(28, 25, 23, 0.15), 0 8px 16px rgba(28, 25, 23, 0.08)',
  },
  
  // 组件配置：内容优先
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        root: {
          fontFamily: baseFonts.sans,
          fontWeight: 500,
          transition: 'all 200ms ease',
          
          // 主要按钮：突出但不抢夺注意力
          '&[dataVariant="filled"]': {
            backgroundColor: editorialColors.secondary,
            border: `1px solid ${editorialColors.secondary}`,
            '&:hover': {
              backgroundColor: '#d97706', // amber-600
              transform: 'translateY(-1px)',
            },
          },
          
          // 次要按钮：融入文本环境
          '&[dataVariant="outline"]': {
            border: `1px solid ${editorialColors.borderSecondary}`,
            color: editorialColors.textSecondary,
            '&:hover': {
              backgroundColor: editorialColors.backgroundSecondary,
              borderColor: editorialColors.secondary,
            },
          },
          
          // 链接按钮：类似文本链接
          '&[dataVariant="subtle"]': {
            color: editorialColors.textLink,
            '&:hover': {
              backgroundColor: editorialColors.backgroundSecondary,
              color: editorialColors.textLinkHover,
            },
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
          fontFamily: baseFonts.sans,
          border: `1px solid ${editorialColors.borderPrimary}`,
          backgroundColor: editorialColors.backgroundPrimary,
          transition: 'all 200ms ease',
          '&:focus': {
            borderColor: editorialColors.secondary,
            boxShadow: `0 0 0 1px ${editorialColors.secondary}`,
          },
        },
      },
    },

    Paper: {
      defaultProps: {
        radius: 'md',
        padding: 'xl',
        withBorder: false,
      },
      styles: {
        root: {
          backgroundColor: editorialColors.backgroundPrimary,
          boxShadow: '0 1px 3px rgba(28, 25, 23, 0.08)',
          transition: 'all 200ms ease',
        },
      },
    },

    Card: {
      defaultProps: {
        radius: 'md',
        padding: 'xl',
        withBorder: false,
      },
      styles: {
        root: {
          backgroundColor: editorialColors.backgroundPrimary,
          boxShadow: '0 2px 8px rgba(28, 25, 23, 0.08)',
          transition: 'all 250ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(28, 25, 23, 0.12)',
          },
        },
      },
    },

    // 内容相关组件
    Title: {
      styles: {
        root: {
          color: editorialColors.textPrimary,
          fontFamily: baseFonts.sans,
        },
      },
    },

    Text: {
      styles: {
        root: {
          color: editorialColors.textSecondary,
          lineHeight: 1.65,
          fontFamily: baseFonts.serif,
          
          // 链接样式
          'a': {
            color: editorialColors.textLink,
            textDecoration: 'underline',
            textDecorationThickness: '1px',
            textUnderlineOffset: '2px',
            transition: 'color 150ms ease',
            '&:hover': {
              color: editorialColors.textLinkHover,
            },
          },
        },
      },
    },

    // 代码块样式
    Code: {
      styles: {
        root: {
          backgroundColor: editorialColors.codeBackground,
          color: editorialColors.textPrimary,
          fontFamily: baseFonts.mono,
          fontSize: rem(14),
          padding: `${rem(2)} ${rem(6)}`,
          borderRadius: rem(4),
        },
      },
    },

    // 引用块样式
    Blockquote: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          backgroundColor: editorialColors.backgroundSecondary,
          borderLeft: `4px solid ${editorialColors.borderAccent}`,
          fontStyle: 'italic',
          fontSize: rem(16),
          lineHeight: 1.6,
        },
      },
    },

    // 导航链接
    NavLink: {
      styles: {
        root: {
          fontFamily: baseFonts.sans,
          fontWeight: 500,
          borderRadius: rem(6),
          transition: 'all 150ms ease',
          '&:hover': {
            backgroundColor: editorialColors.backgroundSecondary,
          },
        },
      },
    },
  },
  
  // 自定义属性
  other: {
    ...baseTheme.other,
    
    // 编辑主题专用色彩
    editorialColors,
    
    // 编辑主题布局
    layout: {
      maxWidth: '800px',        // 适合阅读的宽度
      contentMaxWidth: '680px',  // 文章内容最大宽度
      headerHeight: '64px',
      sidebarWidth: '280px',
      articleSpacing: '48px',
    },
    
    // 排版配置
    typography: {
      paragraphSpacing: '24px',
      headingSpacing: '32px',
      listSpacing: '16px',
      codeBlockSpacing: '32px',
    },
    
    // 编辑主题动画
    animations: {
      fadeIn: 'fadeIn 0.5s ease-out',
      slideIn: 'slideIn 0.6s ease-out',
      highlight: 'highlight 2s ease-out',
    },
    
    // 文章相关配置
    article: {
      titleSize: rem(36),
      subtitleSize: rem(20),
      metaSize: rem(14),
      leadSize: rem(19),
      bodySize: rem(17),
      captionSize: rem(14),
    },
  },
};

/**
 * 创建编辑主题
 */
export const editorialTheme = createTheme(
  mergeThemeOverrides(baseTheme, editorialThemeOverride)
);

/**
 * 编辑主题工具函数
 */
export const editorialThemeUtils = {
  /**
   * 获取编辑主题色彩
   */
  getColor: (colorKey: keyof typeof editorialColors) => editorialColors[colorKey],
  
  /**
   * 获取文章排版样式
   */
  getArticleStyle: () => ({
    fontFamily: baseFonts.serif,
    fontSize: rem(17),
    lineHeight: 1.65,
    color: editorialColors.textSecondary,
    maxWidth: '680px',
    margin: '0 auto',
  }),
  
  /**
   * 获取代码块样式
   */
  getCodeBlockStyle: () => ({
    backgroundColor: editorialColors.codeBackground,
    border: `1px solid ${editorialColors.borderPrimary}`,
    borderRadius: rem(8),
    padding: rem(16),
    fontFamily: baseFonts.mono,
    fontSize: rem(14),
    lineHeight: 1.5,
    overflow: 'auto',
  }),
  
  /**
   * 获取引用样式
   */
  getQuoteStyle: () => ({
    backgroundColor: editorialColors.backgroundSecondary,
    borderLeft: `4px solid ${editorialColors.borderAccent}`,
    padding: `${rem(16)} ${rem(20)}`,
    margin: `${rem(24)} 0`,
    fontStyle: 'italic',
    fontSize: rem(16),
    lineHeight: 1.6,
    borderRadius: `0 ${rem(6)} ${rem(6)} 0`,
  }),
  
  /**
   * 获取标签样式
   */
  getTagStyle: (variant: 'primary' | 'secondary' = 'primary') => {
    const styles = {
      primary: {
        backgroundColor: editorialColors.secondary,
        color: 'white',
      },
      secondary: {
        backgroundColor: editorialColors.backgroundTertiary,
        color: editorialColors.textSecondary,
      },
    };
    
    return {
      ...styles[variant],
      padding: `${rem(4)} ${rem(8)}`,
      borderRadius: rem(4),
      fontSize: rem(12),
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    };
  },
};

export default editorialTheme; 