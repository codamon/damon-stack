'use client';

import type { SEOData, Post, Category } from '../api/types';
// 独立的Metadata类型定义，不依赖Next.js
export interface MetadataBase {
  title?: string;
  description?: string;
  keywords?: string;
  authors?: Array<{ name: string }>;
  openGraph?: {
    type?: 'website' | 'article';
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
    locale?: string;
  };
  twitter?: {
    card?: 'summary_large_image' | 'summary';
    title?: string;
    description?: string;
    images?: string[];
    creator?: string;
  };
  alternates?: {
    canonical?: string;
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
    };
  };
}

/**
 * SEO工具函数集合
 */
export const seoUtils = {
  /**
   * 生成文章的SEO数据
   */
  generatePostSEO: (post: Post, baseUrl: string): SEOData => {
    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt || generateExcerpt(post.content);
    const url = `${baseUrl}/posts/${post.slug}`;
    
    return {
      title: title.length > 60 ? title.substring(0, 57) + '...' : title,
      description: description.length > 160 ? description.substring(0, 157) + '...' : description,
      keywords: post.tags,
      image: extractFirstImage(post.content),
      url,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      author: post.author?.name,
      section: post.category?.name,
      tags: post.tags,
    };
  },

  /**
   * 生成分类页面的SEO数据
   */
  generateCategorySEO: (category: Category, baseUrl: string): SEOData => {
    const title = `${category.name} - 文章分类`;
    const description = category.description || `浏览${category.name}分类下的所有文章`;
    const url = `${baseUrl}/category/${category.slug}`;
    
    return {
      title,
      description,
      url,
      type: 'website',
      keywords: [category.name],
    };
  },

  /**
   * 生成首页SEO数据
   */
  generateHomeSEO: (baseUrl: string): SEOData => {
    return {
      title: 'Damon Stack - 现代化全栈开发解决方案',
      description: '基于Next.js、tRPC、Prisma和Mantine构建的现代化全栈开发平台，提供完整的CMS、用户管理和数据分析功能。',
      keywords: ['全栈开发', 'Next.js', 'tRPC', 'Prisma', 'Mantine', 'TypeScript', 'React'],
      url: baseUrl,
      type: 'website',
    };
  },

  /**
   * 生成博客首页SEO数据
   */
  generateBlogSEO: (baseUrl: string): SEOData => {
    return {
      title: '技术博客 - Damon Stack',
      description: '分享最新的前端技术、全栈开发经验和技术思考，涵盖React、Next.js、TypeScript等现代Web开发技术。',
      keywords: ['技术博客', '前端开发', '全栈开发', 'React', 'Next.js', 'TypeScript'],
      url: `${baseUrl}/blog`,
      type: 'blog',
    };
  },

  /**
   * 生成结构化数据 (JSON-LD)
   */
  generateStructuredData: {
    /**
     * 文章结构化数据
     */
    article: (post: Post, baseUrl: string) => ({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt || generateExcerpt(post.content),
      image: extractFirstImage(post.content),
      author: {
        '@type': 'Person',
        name: post.author?.name || 'Anonymous',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Damon Stack',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
      },
      datePublished: post.publishedAt?.toISOString(),
      dateModified: post.updatedAt.toISOString(),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/posts/${post.slug}`,
      },
      articleSection: post.category?.name,
      keywords: post.tags,
      wordCount: estimateWordCount(post.content),
      timeRequired: `PT${post.readingTime || 5}M`,
    }),

    /**
     * 博客结构化数据
     */
    blog: (baseUrl: string) => ({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Damon Stack 技术博客',
      description: '分享前端和全栈开发技术经验',
      url: `${baseUrl}/blog`,
      author: {
        '@type': 'Organization',
        name: 'Damon Stack Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Damon Stack',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
      },
    }),

    /**
     * 面包屑导航结构化数据
     */
    breadcrumb: (items: Array<{ name: string; url: string }>) => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }),

    /**
     * 网站搜索框结构化数据
     */
    searchBox: (baseUrl: string) => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Damon Stack',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  },

  /**
   * 生成Open Graph标签
   */
  generateOpenGraph: (seoData: SEOData) => {
    const tags: Record<string, string> = {
      'og:title': seoData.title,
      'og:description': seoData.description,
      'og:type': seoData.type || 'website',
      'og:url': seoData.url || '',
    };

    if (seoData.image) {
      tags['og:image'] = seoData.image;
      tags['og:image:alt'] = seoData.title;
    }

    if (seoData.publishedTime) {
      tags['article:published_time'] = seoData.publishedTime;
    }

    if (seoData.modifiedTime) {
      tags['article:modified_time'] = seoData.modifiedTime;
    }

    if (seoData.author) {
      tags['article:author'] = seoData.author;
    }

    if (seoData.section) {
      tags['article:section'] = seoData.section;
    }

    if (seoData.tags?.length) {
      seoData.tags.forEach(tag => {
        tags[`article:tag_${tag}`] = tag;
      });
    }

    return tags;
  },

  /**
   * 生成Twitter卡片标签
   */
  generateTwitterCard: (seoData: SEOData) => {
    const tags: Record<string, string> = {
      'twitter:card': seoData.image ? 'summary_large_image' : 'summary',
      'twitter:title': seoData.title,
      'twitter:description': seoData.description,
    };

    if (seoData.image) {
      tags['twitter:image'] = seoData.image;
      tags['twitter:image:alt'] = seoData.title;
    }

    return tags;
  },

  /**
   * 生成sitemap条目
   */
  generateSitemapEntry: (url: string, lastmod?: string, changefreq?: string, priority?: number) => ({
    url,
    lastmod: lastmod || new Date().toISOString(),
    changefreq: changefreq || 'weekly',
    priority: priority || 0.5,
  }),

  /**
   * 生成文章页面的完整metadata
   */
  generatePostMetadata: (post: PostSEOData): MetadataBase => {
    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt || 
      seoUtils.extractExcerpt(post.content);
    const image = post.ogImage || post.featuredImage || SEO_DEFAULTS.defaultImage;
    const url = `${SEO_DEFAULTS.siteUrl}/posts/${post.slug}`;

    return {
      title: `${title} | ${SEO_DEFAULTS.siteName}`,
      description,
      keywords: post.tags?.map(tag => tag.name).join(', '),
      authors: post.author ? [{ name: post.author.name }] : undefined,
      openGraph: {
        type: 'article',
        title,
        description,
        url,
        siteName: SEO_DEFAULTS.siteName,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        publishedTime: post.publishedAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: post.author ? [post.author.name] : undefined,
        section: post.category?.name,
        tags: post.tags?.map(tag => tag.name),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
        creator: SEO_DEFAULTS.twitterHandle,
      },
      alternates: {
        canonical: url,
      },
    };
  },

  /**
   * 生成普通页面的metadata
   */
  generatePageMetadata: (page: PageSEOData): MetadataBase => {
    const title = `${page.title} | ${SEO_DEFAULTS.siteName}`;
    const image = page.ogImage || SEO_DEFAULTS.defaultImage;
    const url = page.canonical || SEO_DEFAULTS.siteUrl;

    return {
      title,
      description: page.description,
      keywords: page.keywords?.join(', '),
      robots: {
        index: !page.noindex,
        follow: !page.nofollow,
        googleBot: {
          index: !page.noindex,
          follow: !page.nofollow,
        },
      },
      openGraph: {
        type: 'website',
        title: page.title,
        description: page.description,
        url,
        siteName: SEO_DEFAULTS.siteName,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: page.title,
          },
        ],
        locale: SEO_DEFAULTS.locale,
      },
      twitter: {
        card: 'summary_large_image',
        title: page.title,
        description: page.description,
        images: [image],
        creator: SEO_DEFAULTS.twitterHandle,
      },
      alternates: {
        canonical: url,
      },
    };
  },

  /**
   * 生成商品页面的metadata
   */
  generateProductMetadata: (product: ProductSEOData): MetadataBase => {
    const title = `${product.name} | ${SEO_DEFAULTS.siteName}`;
    const description = product.description;
    const image = product.images[0] || SEO_DEFAULTS.defaultImage;

    return {
      title,
      description,
      openGraph: {
        type: 'website',
        title: product.name,
        description,
        siteName: SEO_DEFAULTS.siteName,
        images: product.images.map((img, index) => ({
          url: img,
          width: 800,
          height: 600,
          alt: `${product.name} - 图片 ${index + 1}`,
        })),
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description,
        images: [image],
      },
    };
  },

  /**
   * 生成JSON-LD结构化数据
   */
  generateJsonLd: {
    /**
     * 网站结构化数据
     */
    website: () => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SEO_DEFAULTS.siteName,
      url: SEO_DEFAULTS.siteUrl,
      description: SEO_DEFAULTS.defaultDescription,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SEO_DEFAULTS.siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),

    /**
     * 文章结构化数据
     */
    article: (post: PostSEOData) => ({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.featuredImage || post.ogImage,
      datePublished: post.publishedAt.toISOString(),
      dateModified: post.updatedAt.toISOString(),
      author: post.author ? {
        '@type': 'Person',
        name: post.author.name,
        image: post.author.image,
      } : undefined,
      publisher: {
        '@type': 'Organization',
        name: SEO_DEFAULTS.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${SEO_DEFAULTS.siteUrl}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SEO_DEFAULTS.siteUrl}/posts/${post.slug}`,
      },
      articleSection: post.category?.name,
      keywords: post.tags?.map(tag => tag.name).join(', '),
    }),

    /**
     * 商品结构化数据
     */
    product: (product: ProductSEOData) => ({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      brand: product.brand ? {
        '@type': 'Brand',
        name: product.brand,
      } : undefined,
      category: product.category,
      sku: product.sku,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: `https://schema.org/${product.availability}`,
      },
      aggregateRating: product.reviews ? {
        '@type': 'AggregateRating',
        ratingValue: product.reviews.average,
        reviewCount: product.reviews.count,
      } : undefined,
    }),

    /**
     * 面包屑导航
     */
    breadcrumb: (items: Array<{ name: string; url: string }>) => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }),

    /**
     * 组织信息
     */
    organization: () => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SEO_DEFAULTS.siteName,
      url: SEO_DEFAULTS.siteUrl,
      logo: `${SEO_DEFAULTS.siteUrl}/logo.png`,
      description: SEO_DEFAULTS.defaultDescription,
      sameAs: [
        // 添加社交媒体链接
      ],
    }),
  },

  /**
   * 从内容中提取摘要
   */
  extractExcerpt: (content?: string, maxLength: number = 160): string => {
    if (!content) return '';
    
    // 移除HTML标签
    const textContent = content.replace(/<[^>]*>/g, '');
    
    // 截取指定长度
    if (textContent.length <= maxLength) {
      return textContent;
    }
    
    // 在单词边界截取
    const truncated = textContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  },

  /**
   * 生成sitemap数据
   */
  generateSitemapUrls: (pages: Array<{
    url: string;
    lastModified: Date;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>) => {
    return pages.map(page => ({
      url: `${SEO_DEFAULTS.siteUrl}${page.url}`,
      lastModified: page.lastModified.toISOString(),
      changeFrequency: page.changeFrequency || 'weekly',
      priority: page.priority || 0.5,
    }));
  },

  /**
   * 验证SEO数据
   */
  validateSEO: (data: {
    title?: string;
    description?: string;
    keywords?: string[];
  }) => {
    const issues: string[] = [];
    
    if (!data.title) {
      issues.push('缺少标题');
    } else if (data.title.length > 60) {
      issues.push('标题过长（建议60字符以内）');
    } else if (data.title.length < 10) {
      issues.push('标题过短（建议10字符以上）');
    }
    
    if (!data.description) {
      issues.push('缺少描述');
    } else if (data.description.length > 160) {
      issues.push('描述过长（建议160字符以内）');
    } else if (data.description.length < 50) {
      issues.push('描述过短（建议50字符以上）');
    }
    
    if (!data.keywords || data.keywords.length === 0) {
      issues.push('建议添加关键词');
    } else if (data.keywords.length > 10) {
      issues.push('关键词过多（建议10个以内）');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      score: Math.max(0, 100 - issues.length * 20),
    };
  },

  /**
   * 生成robots.txt内容
   */
  generateRobotsTxt: (options: {
    allowAll?: boolean;
    disallowPaths?: string[];
    sitemapUrl?: string;
  } = {}) => {
    const { allowAll = true, disallowPaths = [], sitemapUrl } = options;
    
    let content = 'User-agent: *\n';
    
    if (allowAll) {
      content += 'Allow: /\n';
    }
    
    disallowPaths.forEach(path => {
      content += `Disallow: ${path}\n`;
    });
    
    if (sitemapUrl) {
      content += `\nSitemap: ${sitemapUrl}\n`;
    }
    
    return content;
  },
};

/**
 * 从HTML内容中提取第一张图片
 */
function extractFirstImage(content: string): string | undefined {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = content.match(imgRegex);
  return match ? match[1] : undefined;
}

/**
 * 生成文章摘要
 */
function generateExcerpt(content: string, maxLength = 160): string {
  // 移除HTML标签
  const plainText = content.replace(/<[^>]*>/g, '');
  // 移除多余空白字符
  const cleanText = plainText.replace(/\s+/g, ' ').trim();
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // 在单词边界截断
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

/**
 * 估算文章字数
 */
function estimateWordCount(content: string): number {
  const plainText = content.replace(/<[^>]*>/g, '');
  const words = plainText.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
}

// 基础SEO配置
export const SEO_DEFAULTS = {
  siteName: 'Damon Stack',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://damon-stack.com',
  defaultTitle: 'Damon Stack - 现代化全栈开发平台',
  defaultDescription: '基于 Next.js 15 + Mantine 8 + tRPC 的现代化全栈开发平台，提供完整的企业级解决方案',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@damonstack',
  locale: 'zh-CN',
} as const;

// 文章相关类型
export interface PostSEOData {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  featuredImage?: string;
  publishedAt: Date;
  updatedAt: Date;
  author?: {
    name: string;
    image?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  tags?: Array<{
    name: string;
    slug: string;
  }>;
  slug: string;
}

// 页面SEO数据类型
export interface PageSEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

// 商品SEO数据类型
export interface ProductSEOData {
  name: string;
  description: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  images: string[];
  brand?: string;
  category?: string;
  sku?: string;
  reviews?: {
    count: number;
    average: number;
  };
}

// 默认导出
export default seoUtils; 