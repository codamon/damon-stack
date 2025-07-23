'use client';

import { useState, useEffect, useRef } from 'react';
import {
  TextInput,
  Paper,
  Stack,
  Text,
  Group,
  ActionIcon,
  Loader,
  Badge,
  Box,
  Highlight,
  UnstyledButton,
} from '@mantine/core';
import {
  IconSearch,
  IconX,
  IconClock,
  IconTrendingUp,
  IconFile,
} from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';

export interface SearchSuggestion {
  text: string;
  type: 'custom' | 'trending' | 'title';
  priority: number;
}

export interface SearchBoxProps {
  /** 搜索值 */
  value?: string;
  /** 搜索值变化回调 */
  onChange?: (value: string) => void;
  /** 搜索提交回调 */
  onSearch?: (query: string) => void;
  /** 获取搜索建议的函数 */
  onGetSuggestions?: (query: string) => Promise<SearchSuggestion[]>;
  /** 获取热门搜索词的函数 */
  onGetTrending?: () => Promise<Array<{ query: string; searchCount: number }>>;
  /** 占位符文本 */
  placeholder?: string;
  /** 尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 是否显示清除按钮 */
  clearable?: boolean;
  /** 是否自动聚焦 */
  autoFocus?: boolean;
  /** 最大建议数量 */
  maxSuggestions?: number;
  /** 搜索历史 */
  searchHistory?: string[];
  /** 清除搜索历史回调 */
  onClearHistory?: () => void;
  /** 数据源 */
  source?: 'website' | 'blog' | 'shop';
}

export function SearchBox({
  value = '',
  onChange,
  onSearch,
  onGetSuggestions,
  onGetTrending,
  placeholder = '搜索内容...',
  size = 'md',
  clearable = true,
  autoFocus = false,
  maxSuggestions = 8,
  searchHistory = [],
  onClearHistory,
  source = 'website',
}: SearchBoxProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [trending, setTrending] = useState<Array<{ query: string; searchCount: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 处理输入变化
  const handleInputChange = (newValue: string) => {
    setQuery(newValue);
    onChange?.(newValue);
    setSelectedIndex(-1);
    
    if (newValue.trim()) {
      setShowSuggestions(true);
    }
  };

  // 处理搜索提交
  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      onSearch?.(finalQuery);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // 清除搜索
  const handleClear = () => {
    setQuery('');
    onChange?.('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // 选择建议
  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    onChange?.(suggestion);
    handleSearch(suggestion);
  };

  // 键盘导航
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const totalItems = suggestions.length + trending.length + searchHistory.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : -1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : totalItems - 1));
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0) {
          const allItems = [...suggestions, ...trending.map(t => ({ text: t.query, type: 'trending' as const, priority: t.searchCount })), ...searchHistory.map(h => ({ text: h, type: 'history' as const, priority: 0 }))];
          if (allItems[selectedIndex]) {
            handleSelectSuggestion(allItems[selectedIndex].text);
          }
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 获取搜索建议
  useEffect(() => {
    if (debouncedQuery.trim() && debouncedQuery.length >= 2) {
      setLoading(true);
      onGetSuggestions?.(debouncedQuery)
        .then(results => {
          setSuggestions(results.slice(0, maxSuggestions));
        })
        .catch(error => {
          console.error('获取搜索建议失败:', error);
          setSuggestions([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  }, [debouncedQuery, onGetSuggestions, maxSuggestions]);

  // 获取热门搜索词
  useEffect(() => {
    if (!query.trim() && showSuggestions) {
      onGetTrending?.()
        .then(results => {
          setTrending(results.slice(0, 5));
        })
        .catch(error => {
          console.error('获取热门搜索失败:', error);
          setTrending([]);
        });
    }
  }, [query, showSuggestions, onGetTrending]);

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 获取建议图标
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return <IconTrendingUp size={14} />;
      case 'title':
        return <IconFile size={14} />;
      case 'history':
        return <IconClock size={14} />;
      default:
        return <IconSearch size={14} />;
    }
  };

  // 渲染建议项
  const renderSuggestionItem = (item: { text: string; type: string; priority: number }, index: number, isSelected: boolean) => (
    <UnstyledButton
      key={`${item.type}-${index}`}
      onClick={() => handleSelectSuggestion(item.text)}
      w="100%"
      p="xs"
      style={(theme) => ({
        backgroundColor: isSelected ? theme.colors.blue[0] : 'transparent',
        borderRadius: theme.radius.sm,
        cursor: 'pointer',
      })}
    >
      <Group gap="xs" wrap="nowrap">
        <Box c="dimmed">{getSuggestionIcon(item.type)}</Box>
        <Text size="sm" style={{ flex: 1 }} lineClamp={1}>
          {query.trim() ? (
            <Highlight highlight={query} highlightStyles={{ backgroundColor: 'yellow', padding: 0 }}>
              {item.text}
            </Highlight>
          ) : (
            item.text
          )}
        </Text>
        {item.type === 'trending' && (
          <Badge size="xs" variant="light" color="orange">
            {item.priority}
          </Badge>
        )}
      </Group>
    </UnstyledButton>
  );

  return (
    <Box style={{ position: 'relative' }}>
      <TextInput
        ref={inputRef}
        value={query}
        onChange={(event) => handleInputChange(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        size={size}
        autoFocus={autoFocus}
        leftSection={<IconSearch size={16} />}
        rightSection={
          query && clearable ? (
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={handleClear}
              style={{ cursor: 'pointer' }}
            >
              <IconX size={16} />
            </ActionIcon>
          ) : loading ? (
            <Loader size="sm" />
          ) : null
        }
        styles={{
          input: {
            '&:focus': {
              borderColor: 'var(--mantine-color-blue-filled)',
            },
          },
        }}
      />

      {showSuggestions && (
        <Paper
          ref={suggestionsRef}
          shadow="md"
          p="xs"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: 4,
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          <Stack gap="xs">
            {/* 搜索建议 */}
            {suggestions.length > 0 && (
              <div>
                <Text size="xs" c="dimmed" fw={500} mb="xs">
                  搜索建议
                </Text>
                {suggestions.map((suggestion, index) => 
                  renderSuggestionItem(suggestion, index, index === selectedIndex)
                )}
              </div>
            )}

            {/* 搜索历史 */}
            {!query.trim() && searchHistory.length > 0 && (
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="xs" c="dimmed" fw={500}>
                    搜索历史
                  </Text>
                  {onClearHistory && (
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size="xs"
                      onClick={onClearHistory}
                    >
                      <IconX size={12} />
                    </ActionIcon>
                  )}
                </Group>
                {searchHistory.slice(0, 5).map((historyItem, index) => {
                  const adjustedIndex = suggestions.length + index;
                  return renderSuggestionItem(
                    { text: historyItem, type: 'history', priority: 0 },
                    adjustedIndex,
                    adjustedIndex === selectedIndex
                  );
                })}
              </div>
            )}

            {/* 热门搜索 */}
            {!query.trim() && trending.length > 0 && (
              <div>
                <Text size="xs" c="dimmed" fw={500} mb="xs">
                  热门搜索
                </Text>
                {trending.map((trendingItem, index) => {
                  const adjustedIndex = suggestions.length + searchHistory.length + index;
                  return renderSuggestionItem(
                    { text: trendingItem.query, type: 'trending', priority: trendingItem.searchCount },
                    adjustedIndex,
                    adjustedIndex === selectedIndex
                  );
                })}
              </div>
            )}

            {/* 无建议时的提示 */}
            {query.trim() && suggestions.length === 0 && !loading && (
              <Text size="sm" c="dimmed" ta="center" p="md">
                未找到相关建议
              </Text>
            )}
          </Stack>
        </Paper>
      )}
    </Box>
  );
} 