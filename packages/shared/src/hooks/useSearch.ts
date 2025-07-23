'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '../api/client';

// 搜索筛选器类型
export interface SearchFilters {
  category?: string;
  tags?: string[];
  dateRange?: [Date, Date];
  author?: string;
  sortBy?: 'relevance' | 'date' | 'popularity';
}

// 搜索历史管理
export function useSearchHistory(source: 'website' | 'blog' | 'shop' = 'website') {
  const [history, setHistory] = useState<string[]>([]);

  // 从本地存储加载历史
  useEffect(() => {
    const saved = localStorage.getItem(`search-history-${source}`);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('加载搜索历史失败:', error);
      }
    }
  }, [source]);

  // 添加搜索历史
  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setHistory(prev => {
      const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 10);
      localStorage.setItem(`search-history-${source}`, JSON.stringify(newHistory));
      return newHistory;
    });
  }, [source]);

  // 清除搜索历史
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(`search-history-${source}`);
  }, [source]);

  return {
    history,
    addToHistory,
    clearHistory,
  };
}

// 全文搜索hook
export function useFullTextSearch(source: 'website' | 'blog' | 'shop' = 'website') {
  const fullTextQuery = api.search.fullText.useQuery;
  
  return {
    search: (params: {
      query: string;
      filters?: SearchFilters;
      page?: number;
      limit?: number;
    }) => fullTextQuery({
      ...params,
      source,
    }),
  };
}

// 搜索建议hook
export function useSearchSuggestions(source: 'website' | 'blog' | 'shop' = 'website') {
  const suggestionsQuery = api.search.suggestions.useQuery;
  
  const getSuggestions = useCallback(async (query: string): Promise<Array<{
    text: string;
    type: 'custom' | 'trending' | 'title';
    priority: number;
  }>> => {
    if (query.trim().length < 2) return [];
    
    try {
      const result = await suggestionsQuery({
        query,
        source,
        limit: 8,
      });
      return result || [];
    } catch (error) {
      console.error('获取搜索建议失败:', error);
      return [];
    }
  }, [source, suggestionsQuery]);

  return { getSuggestions };
}

// 热门搜索hook
export function useTrendingSearch(source: 'website' | 'blog' | 'shop' = 'website') {
  const trendingQuery = api.search.trending.useQuery;
  
  const getTrending = useCallback(async (): Promise<Array<{
    query: string;
    searchCount: number;
  }>> => {
    try {
      const result = await trendingQuery({
        source,
        limit: 10,
      });
      return result || [];
    } catch (error) {
      console.error('获取热门搜索失败:', error);
      return [];
    }
  }, [source, trendingQuery]);

  return { getTrending };
}

// 搜索点击记录hook
export function useSearchClickTracking(source: 'website' | 'blog' | 'shop' = 'website') {
  const recordClickMutation = api.search.recordClick.useMutation();
  
  const recordClick = useCallback((params: {
    query: string;
    resultId: string;
    resultType: 'post' | 'category' | 'tag';
    position: number;
  }) => {
    recordClickMutation.mutate({
      ...params,
      source,
    });
  }, [source, recordClickMutation]);

  return { recordClick };
}

// 完整搜索管理hook
export function useSearch(source: 'website' | 'blog' | 'shop' = 'website') {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const { history, addToHistory, clearHistory } = useSearchHistory(source);
  const { getSuggestions } = useSearchSuggestions(source);
  const { getTrending } = useTrendingSearch(source);
  const { recordClick } = useSearchClickTracking(source);

  // 执行搜索
  const search = api.search.fullText.useQuery(
    {
      query: query.trim(),
      filters,
      page,
      source,
      limit: 10,
    },
    {
      enabled: query.trim().length > 0,
      staleTime: 1000 * 60 * 5, // 5分钟
    }
  );

  // 搜索处理函数
  const handleSearch = useCallback((newQuery: string, newFilters?: SearchFilters) => {
    if (newQuery.trim()) {
      setQuery(newQuery);
      setFilters(newFilters || {});
      setPage(1);
      setIsSearching(true);
      addToHistory(newQuery);
    }
  }, [addToHistory]);

  // 更新筛选器
  const updateFilters = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  // 翻页
  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
    setPage(1);
    setIsSearching(false);
  }, []);

  // 搜索状态变化时更新isSearching
  useEffect(() => {
    if (search.data || search.error) {
      setIsSearching(false);
    }
  }, [search.data, search.error]);

  return {
    // 搜索状态
    query,
    filters,
    page,
    isSearching: isSearching || search.isLoading,
    
    // 搜索结果
    results: search.data?.results || [],
    pagination: search.data?.pagination || null,
    error: search.error,
    
    // 搜索操作
    handleSearch,
    updateFilters,
    goToPage,
    clearSearch,
    
    // 辅助功能
    history,
    clearHistory,
    getSuggestions,
    getTrending,
    recordClick,
    
    // 原始查询对象
    searchQuery: search,
  };
}

// 搜索分析hook (管理员)
export function useSearchAnalytics() {
  return api.search.analytics.useQuery({
    dateRange: [
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
      new Date(),
    ],
    limit: 50,
  }, {
    staleTime: 1000 * 60 * 15, // 15分钟
  });
} 