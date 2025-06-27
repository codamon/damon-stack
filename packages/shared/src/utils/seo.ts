'use client';

import type { SEOData, Post, Category } from '../api/types';

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
   * 验证SEO数据
   */
  validateSEO: (seoData: SEOData) => {
    const issues: string[] = [];

    if (!seoData.title) {
      issues.push('缺少标题');
    } else if (seoData.title.length > 60) {
      issues.push('标题过长（建议60字符以内）');
    } else if (seoData.title.length < 30) {
      issues.push('标题过短（建议30-60字符）');
    }

    if (!seoData.description) {
      issues.push('缺少描述');
    } else if (seoData.description.length > 160) {
      issues.push('描述过长（建议160字符以内）');
    } else if (seoData.description.length < 120) {
      issues.push('描述过短（建议120-160字符）');
    }

    if (!seoData.url) {
      issues.push('缺少URL');
    }

    if (seoData.type === 'article') {
      if (!seoData.publishedTime) {
        issues.push('文章缺少发布时间');
      }
      if (!seoData.author) {
        issues.push('文章缺少作者信息');
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      score: Math.max(0, 100 - issues.length * 20),
    };
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