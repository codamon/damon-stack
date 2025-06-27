/**
 * damon-stack 统一主题系统
 * 
 * 为不同应用场景提供专业化主题配置
 * 保持品牌一致性的同时优化用户体验
 */

// 基础主题
export {
  baseTheme,
  createBaseTheme,
  brandColors,
  baseFonts,
  baseSpacing,
  baseRadius,
  baseShadows,
  baseFontSizes,
  baseLineHeights,
} from './base';

// 企业主题
export {
  corporateTheme,
  corporateThemeOverride,
  corporateColors,
  corporateThemeUtils,
} from './corporate';

// 编辑主题
export {
  editorialTheme,
  editorialThemeOverride,
  editorialColors,
  editorialThemeUtils,
} from './editorial';

// 电商主题
export {
  ecommerceTheme,
  ecommerceThemeOverride,
  ecommerceColors,
  ecommerceThemeUtils,
} from './ecommerce';

// 后台主题
export {
  dashboardTheme,
  dashboardThemeOverride,
  dashboardColors,
  dashboardThemeUtils,
} from './dashboard';

// 导入所有主题用于内部使用
import { corporateTheme } from './corporate';
import { editorialTheme } from './editorial';
import { ecommerceTheme } from './ecommerce';
import { dashboardTheme } from './dashboard';

import { corporateColors } from './corporate';
import { editorialColors } from './editorial';
import { ecommerceColors } from './ecommerce';
import { dashboardColors } from './dashboard';

import { corporateThemeUtils } from './corporate';
import { editorialThemeUtils } from './editorial';
import { ecommerceThemeUtils } from './ecommerce';
import { dashboardThemeUtils } from './dashboard';

// 主题类型定义
export type AppTheme = 'corporate' | 'editorial' | 'ecommerce' | 'dashboard';

/**
 * 主题配置映射
 */
export const themes = {
  corporate: corporateTheme,
  editorial: editorialTheme,
  ecommerce: ecommerceTheme,
  dashboard: dashboardTheme,
} as const;

/**
 * 主题颜色映射
 */
export const themeColors = {
  corporate: corporateColors,
  editorial: editorialColors,
  ecommerce: ecommerceColors,
  dashboard: dashboardColors,
} as const;

/**
 * 主题工具函数映射
 */
export const themeUtils = {
  corporate: corporateThemeUtils,
  editorial: editorialThemeUtils,
  ecommerce: ecommerceThemeUtils,
  dashboard: dashboardThemeUtils,
} as const;

/**
 * 应用场景到主题的映射
 */
export const appThemeMap = {
  'website': 'corporate',
  'blog': 'editorial',
  'shop': 'ecommerce',
  'admin-dashboard': 'dashboard',
} as const;

/**
 * 主题选择器工具
 */
export class ThemeSelector {
  /**
   * 根据应用名称获取对应主题
   */
  static getThemeByApp(appName: keyof typeof appThemeMap) {
    const themeName = appThemeMap[appName];
    return themes[themeName];
  }

  /**
   * 根据主题名称获取主题配置
   */
  static getTheme(themeName: AppTheme) {
    return themes[themeName];
  }

  /**
   * 获取主题颜色配置
   */
  static getThemeColors(themeName: AppTheme) {
    return themeColors[themeName];
  }

  /**
   * 获取主题工具函数
   */
  static getThemeUtils(themeName: AppTheme) {
    return themeUtils[themeName];
  }

  /**
   * 获取所有可用主题
   */
  static getAllThemes() {
    return themes;
  }

  /**
   * 检查主题是否存在
   */
  static hasTheme(themeName: string): themeName is AppTheme {
    return themeName in themes;
  }
}

/**
 * 主题适配器 - 为特定组件提供主题样式
 */
export class ThemeAdapter {
  private theme: AppTheme;
  private colors: any;
  private utils: any;

  constructor(theme: AppTheme) {
    this.theme = theme;
    this.colors = themeColors[theme];
    this.utils = themeUtils[theme];
  }

  /**
   * 获取按钮样式
   */
  getButtonStyle(variant: string = 'primary') {
    if (this.utils.getButtonStyle) {
      return this.utils.getButtonStyle(variant);
    }
    return {};
  }

  /**
   * 获取卡片样式
   */
  getCardStyle(variant?: string) {
    if (this.utils.getCardStyle) {
      return this.utils.getCardStyle(variant);
    }
    return {};
  }

  /**
   * 获取颜色值
   */
  getColor(colorKey: string) {
    return this.colors[colorKey] || colorKey;
  }

  /**
   * 切换主题
   */
  switchTheme(newTheme: AppTheme) {
    this.theme = newTheme;
    this.colors = themeColors[newTheme];
    this.utils = themeUtils[newTheme];
  }
}

/**
 * 主题工厂函数
 */
export const createThemeAdapter = (theme: AppTheme) => new ThemeAdapter(theme);

/**
 * 主题验证器
 */
export class ThemeValidator {
  /**
   * 验证主题配置的完整性
   */
  static validateTheme(themeName: AppTheme) {
    const theme = themes[themeName];
    const colors = themeColors[themeName];
    const utils = themeUtils[themeName];

    const errors: string[] = [];

    // 检查主题是否存在
    if (!theme) {
      errors.push(`Theme '${themeName}' does not exist`);
    }

    // 检查颜色配置
    if (!colors) {
      errors.push(`Theme colors for '${themeName}' not found`);
    }

    // 检查工具函数
    if (!utils) {
      errors.push(`Theme utils for '${themeName}' not found`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 验证所有主题
   */
  static validateAllThemes() {
    const results = Object.keys(themes).map(themeName => ({
      theme: themeName,
      ...this.validateTheme(themeName as AppTheme),
    }));

    return {
      allValid: results.every(result => result.isValid),
      results,
    };
  }
}

/**
 * 主题使用统计
 */
export const themeStats = {
  totalThemes: Object.keys(themes).length,
  availableApps: Object.keys(appThemeMap),
  supportedVariants: {
    corporate: ['primary', 'secondary', 'outline'],
    editorial: ['primary', 'secondary'],
    ecommerce: ['primary', 'secondary', 'success'],
    dashboard: ['default', 'primary', 'success', 'warning'],
  },
};

/**
 * 默认导出基础主题（向后兼容）
 */
export { baseTheme as theme, createBaseTheme as createTheme } from './base';

/**
 * 便捷导出
 */
export default {
  themes,
  themeColors,
  themeUtils,
  appThemeMap,
  ThemeSelector,
  ThemeAdapter,
  createThemeAdapter,
  ThemeValidator,
  themeStats,
}; 