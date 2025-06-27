'use client';

/**
 * 数据格式化工具函数集合
 */
export const formatUtils = {
  /**
   * 日期时间格式化
   */
  date: {
    /**
     * 格式化为相对时间 (如: 2小时前、3天前)
     */
    relative: (date: Date | string): string => {
      const now = new Date();
      const target = new Date(date);
      const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

      if (diffInSeconds < 60) {
        return '刚刚';
      }

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`;
      }

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours}小时前`;
      }

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) {
        return `${diffInDays}天前`;
      }

      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) {
        return `${diffInMonths}个月前`;
      }

      const diffInYears = Math.floor(diffInMonths / 12);
      return `${diffInYears}年前`;
    },

    /**
     * 格式化为短日期 (如: 2024-01-28)
     */
    short: (date: Date | string): string => {
      const target = new Date(date);
      return target.toISOString().split('T')[0];
    },

    /**
     * 格式化为长日期 (如: 2024年1月28日)
     */
    long: (date: Date | string): string => {
      const target = new Date(date);
      return target.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },

    /**
     * 格式化为日期时间 (如: 2024-01-28 15:30)
     */
    datetime: (date: Date | string): string => {
      const target = new Date(date);
      return target.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    },

    /**
     * 格式化为时间 (如: 15:30)
     */
    time: (date: Date | string): string => {
      const target = new Date(date);
      return target.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    },

    /**
     * 判断是否是今天
     */
    isToday: (date: Date | string): boolean => {
      const today = new Date();
      const target = new Date(date);
      return (
        today.getFullYear() === target.getFullYear() &&
        today.getMonth() === target.getMonth() &&
        today.getDate() === target.getDate()
      );
    },

    /**
     * 判断是否是本周
     */
    isThisWeek: (date: Date | string): boolean => {
      const today = new Date();
      const target = new Date(date);
      const diffInDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
      return diffInDays >= 0 && diffInDays < 7;
    },
  },

  /**
   * 数字格式化
   */
  number: {
    /**
     * 格式化大数字 (如: 1.2K, 3.4M)
     */
    compact: (num: number): string => {
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
      }
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    },

    /**
     * 格式化为千分位 (如: 1,234,567)
     */
    currency: (num: number): string => {
      return new Intl.NumberFormat('zh-CN').format(num);
    },

    /**
     * 格式化为百分比 (如: 25.5%)
     */
    percentage: (num: number, decimals = 1): string => {
      return (num * 100).toFixed(decimals) + '%';
    },

    /**
     * 格式化文件大小 (如: 1.2MB)
     */
    fileSize: (bytes: number): string => {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let size = bytes;
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      return size.toFixed(1) + units[unitIndex];
    },

    /**
     * 格式化评分 (如: 4.5/5.0)
     */
    rating: (rating: number, maxRating = 5): string => {
      return `${rating.toFixed(1)}/${maxRating.toFixed(1)}`;
    },
  },

  /**
   * 文本格式化
   */
  text: {
    /**
     * 截断文本
     */
    truncate: (text: string, maxLength: number, suffix = '...'): string => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength - suffix.length) + suffix;
    },

    /**
     * 首字母大写
     */
    capitalize: (text: string): string => {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },

    /**
     * 单词首字母大写
     */
    titleCase: (text: string): string => {
      return text.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    },

    /**
     * 转换为slug格式
     */
    slugify: (text: string): string => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // 移除特殊字符
        .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
        .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
    },

    /**
     * 移除HTML标签
     */
    stripHtml: (html: string): string => {
      return html.replace(/<[^>]*>/g, '');
    },

    /**
     * 高亮搜索关键词
     */
    highlight: (text: string, keywords: string[], className = 'highlight'): string => {
      if (!keywords.length) return text;
      
      const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
      return text.replace(regex, `<span class="${className}">$1</span>`);
    },

    /**
     * 生成摘要
     */
    excerpt: (text: string, maxLength = 160): string => {
      const plainText = formatUtils.text.stripHtml(text);
      return formatUtils.text.truncate(plainText, maxLength);
    },

    /**
     * 估算阅读时间 (分钟)
     */
    readingTime: (text: string, wordsPerMinute = 200): number => {
      const plainText = formatUtils.text.stripHtml(text);
      const wordCount = plainText.trim().split(/\s+/).length;
      return Math.ceil(wordCount / wordsPerMinute);
    },
  },

  /**
   * 数组格式化
   */
  array: {
    /**
     * 格式化标签列表
     */
    tags: (tags: string[], maxCount = 3, separator = ', '): string => {
      if (tags.length <= maxCount) {
        return tags.join(separator);
      }
      const visibleTags = tags.slice(0, maxCount);
      const hiddenCount = tags.length - maxCount;
      return visibleTags.join(separator) + ` +${hiddenCount}个`;
    },

    /**
     * 格式化作者列表
     */
    authors: (authors: string[]): string => {
      if (authors.length === 0) return '匿名';
      if (authors.length === 1) return authors[0];
      if (authors.length === 2) return authors.join(' 和 ');
      
      const lastAuthor = authors[authors.length - 1];
      const otherAuthors = authors.slice(0, -1);
      return otherAuthors.join(', ') + ' 和 ' + lastAuthor;
    },

    /**
     * 格式化分类路径
     */
    breadcrumb: (items: string[], separator = ' > '): string => {
      return items.join(separator);
    },
  },

  /**
   * 状态格式化
   */
  status: {
    /**
     * 格式化发布状态
     */
    publish: (published: boolean, featured = false) => {
      if (!published) {
        return { text: '草稿', color: 'gray', variant: 'light' };
      }
      if (featured) {
        return { text: '特色', color: 'blue', variant: 'filled' };
      }
      return { text: '已发布', color: 'green', variant: 'light' };
    },

    /**
     * 格式化用户角色
     */
    userRole: (role: string) => {
      const roleMap: Record<string, { text: string; color: string }> = {
        ADMIN: { text: '管理员', color: 'red' },
        EDITOR: { text: '编辑', color: 'blue' },
        USER: { text: '用户', color: 'gray' },
      };
      
      return roleMap[role] || { text: '未知', color: 'gray' };
    },

    /**
     * 格式化活动状态
     */
    activity: (isActive: boolean) => {
      return isActive
        ? { text: '活跃', color: 'green', icon: '●' }
        : { text: '离线', color: 'gray', icon: '○' };
    },
  },

  /**
   * URL格式化
   */
  url: {
    /**
     * 确保URL有协议前缀
     */
    ensureProtocol: (url: string): string => {
      if (!url) return '';
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return 'https://' + url;
    },

    /**
     * 获取域名
     */
    getDomain: (url: string): string => {
      try {
        const urlObj = new URL(formatUtils.url.ensureProtocol(url));
        return urlObj.hostname;
      } catch {
        return url;
      }
    },

    /**
     * 构建查询参数
     */
    buildQuery: (params: Record<string, any>): string => {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      return queryString ? '?' + queryString : '';
    },

    /**
     * 解析查询参数
     */
    parseQuery: (queryString: string): Record<string, string> => {
      const params = new URLSearchParams(queryString);
      const result: Record<string, string> = {};
      
      params.forEach((value, key) => {
        result[key] = value;
      });
      
      return result;
    },
  },

  /**
   * 颜色格式化
   */
  color: {
    /**
     * 生成随机颜色
     */
    random: (): string => {
      const colors = [
        'blue', 'green', 'red', 'yellow', 'purple',
        'cyan', 'orange', 'pink', 'indigo', 'teal'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    },

    /**
     * 根据文本生成一致的颜色
     */
    fromText: (text: string): string => {
      const colors = [
        'blue', 'green', 'red', 'yellow', 'purple',
        'cyan', 'orange', 'pink', 'indigo', 'teal'
      ];
      
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      return colors[Math.abs(hash) % colors.length];
    },
  },
}; 