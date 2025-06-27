// @damon-stack/ui 共享 UI 组件库入口文件

// 重新导出 Mantine 核心组件，方便统一引用
export * from '@mantine/core';
export * from '@mantine/hooks';

// 导出中心化主题配置（向后兼容）
export { theme, getThemeColor, type AppTheme } from './theme';
export { default as defaultTheme } from './theme';

// 导出新的统一主题系统
export {
  // 所有主题
  themes,
  corporateTheme,
  editorialTheme,
  ecommerceTheme,
  dashboardTheme,
  
  // 主题颜色
  themeColors,
  corporateColors,
  editorialColors,
  ecommerceColors,
  dashboardColors,
  
  // 主题工具
  themeUtils,
  corporateThemeUtils,
  editorialThemeUtils,
  ecommerceThemeUtils,
  dashboardThemeUtils,
  
  // 工具类
  ThemeSelector,
  ThemeAdapter,
  createThemeAdapter,
  ThemeValidator,
  themeStats,
  appThemeMap,
  
  // 基础元素
  baseTheme,
  brandColors,
  baseFonts,
} from './themes';

// 导出自定义组件
export { default as Card } from './Card';  // 使用 Mantine Paper 的完整实现
export { default as ExampleButton } from './components/ExampleButton';

// 导出认证相关的 UI 组件
export { Button, type ButtonProps } from './components/Button';
export { TextInput, type TextInputProps } from './components/TextInput';
export { PasswordInput, type PasswordInputProps } from './components/PasswordInput';

// 导出数据展示组件
export { 
  StatCard, 
  default as StatCardDefault, 
  type StatCardProps, 
  type TrendData, 
  type TrendType 
} from './components/StatCard';

// 导出富文本编辑器组件
export { 
  RichTextEditor, 
  default as RichTextEditorDefault, 
  type RichTextEditorProps 
} from './components/RichTextEditor';

// 导出页面头部组件
export { 
  PageHeader, 
  default as PageHeaderDefault, 
  type PageHeaderProps,
  type BreadcrumbItem 
} from './components/PageHeader';

// 导出分类树表格组件
export { 
  CategoryTreeTable 
} from './components/CategoryTreeTable';

// ===== 前端网站专用组件 =====

// 网站布局组件
export { 
  WebsiteHeader,
  default as WebsiteHeaderDefault,
  type WebsiteHeaderProps,
  type NavigationItem,
  type UserInfo
} from './components/WebsiteHeader';

export { 
  WebsiteFooter,
  default as WebsiteFooterDefault,
  type WebsiteFooterProps,
  type FooterLink,
  type FooterSection,
  type SocialLink,
  type ContactInfo as FooterContactInfo
} from './components/WebsiteFooter';

// 内容展示组件
export { 
  HeroSection,
  HeroSectionCentered,
  HeroSectionSplit,
  HeroSectionStacked,
  default as HeroSectionDefault,
  type HeroSectionProps,
  type HeroAction,
  type HeroFeature,
  type HeroStats
} from './components/HeroSection';

export { 
  FeatureCard,
  FeatureCardVertical,
  FeatureCardHorizontal,
  FeatureCardOverlay,
  FeatureGrid,
  default as FeatureCardDefault,
  type FeatureCardProps,
  type FeatureGridProps
} from './components/FeatureCard';

export { 
  TestimonialCard,
  TestimonialCardStandard,
  TestimonialCardMinimal,
  TestimonialCardFeatured,
  TestimonialGrid,
  TestimonialStats,
  default as TestimonialCardDefault,
  type TestimonialCardProps,
  type TestimonialAuthor,
  type TestimonialGridProps,
  type TestimonialStatsProps
} from './components/TestimonialCard';

export { 
  BlogCard,
  BlogCardStandard,
  BlogCardHorizontal,
  BlogCardMinimal,
  BlogCardFeatured,
  BlogGrid,
  BlogSidebar,
  default as BlogCardDefault,
  type BlogCardProps,
  type BlogAuthor,
  type BlogStats,
  type BlogGridProps,
  type BlogSidebarProps
} from './components/BlogCard';

// 交互组件
export { 
  ContactForm,
  ContactFormSimple,
  ContactFormSidebar,
  default as ContactFormDefault,
  type ContactFormProps,
  type ContactInfo,
  type ContactFormData
} from './components/ContactForm';

export { 
  NewsletterSignup,
  NewsletterSignupCard,
  NewsletterSignupInline,
  NewsletterSignupBanner,
  NewsletterSignupMinimal,
  NewsletterSignupFeatured,
  default as NewsletterSignupDefault,
  type NewsletterSignupProps,
  type NewsletterSignupData,
  type NewsletterBenefit
} from './components/NewsletterSignup'; 