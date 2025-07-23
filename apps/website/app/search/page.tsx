'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Group,
  Title,
  Text,
  Paper,
  Stack,
  Grid,
  Badge,
  Button,
  Loader,
  Pagination,
  Select,
  MultiSelect,
  DatePickerInput,
  TextInput,
  Card,
  Avatar,
  ActionIcon,
  Divider,
  Alert,
  Center,
  Box,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconSortDescending,
  IconCalendar,
  IconUser,
  IconCategory,
  IconTag,
  IconClock,
  IconEye,
  IconMessageCircle,
  IconShare,
  IconBookmark,
  IconAlertCircle,
} from '@tabler/icons-react';
import Link from 'next/link';
import { SearchBox, useSearch, type SearchFilters } from '@damon-stack/shared';
import { api } from '../trpc/react';

// 搜索结果卡片组件
function SearchResultCard({ 
  post, 
  query, 
  position, 
  onRecordClick 
}: { 
  post: any; 
  query: string; 
  position: number;
  onRecordClick: (resultId: string, resultType: 'post' | 'category' | 'tag', position: number) => void;
}) {
  const handleClick = () => {
    onRecordClick(post.id, 'post', position);
  };

  return (
    <Card 
      withBorder 
      padding="lg" 
      component={Link} 
      href={`/posts/${post.slug}`}
      onClick={handleClick}
      style={{ 
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        transition: 'all 0.2s ease',
      }}
    >
      <Stack gap="md">
        {/* 文章头部信息 */}
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs">
            {post.category && (
              <Badge variant="light" color="blue" size="sm">
                {post.category.name}
              </Badge>
            )}
            <Text size="xs" c="dimmed">
              <IconClock size={12} style={{ marginRight: 4 }} />
              {new Date(post.publishedAt).toLocaleDateString()}
            </Text>
          </Group>
          <Group gap="xs">
            <Text size="xs" c="dimmed">
              <IconEye size={12} style={{ marginRight: 4 }} />
              {post.views || 0}
            </Text>
          </Group>
        </Group>

        {/* 文章标题 */}
        <Title order={3} lineClamp={2}>
          {post.title}
        </Title>

        {/* 文章摘要 */}
        {post.excerpt && (
          <Text size="sm" c="dimmed" lineClamp={3}>
            {post.excerpt}
          </Text>
        )}

        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <Group gap="xs">
            <IconTag size={14} color="gray" />
            {post.tags.slice(0, 3).map((tag: any) => (
              <Badge key={tag.id} variant="outline" size="xs">
                {tag.name}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Text size="xs" c="dimmed">
                +{post.tags.length - 3}
              </Text>
            )}
          </Group>
        )}

        {/* 作者信息 */}
        {post.author && (
          <Group gap="xs">
            <Avatar src={post.author.image} size="sm" radius="xl">
              {post.author.name?.charAt(0)}
            </Avatar>
            <Text size="sm" fw={500}>
              {post.author.name}
            </Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
}

// 搜索筛选器组件
function SearchFilters({ 
  filters, 
  onFiltersChange 
}: { 
  filters: SearchFilters; 
  onFiltersChange: (filters: SearchFilters) => void; 
}) {
  // 获取分类选项
  const { data: categories } = api.category.list.useQuery();
  const categoryOptions = categories?.map(cat => ({
    value: cat.slug,
    label: cat.name,
  })) || [];

  // 排序选项
  const sortOptions = [
    { value: 'relevance', label: '相关性' },
    { value: 'date', label: '发布时间' },
    { value: 'popularity', label: '热门度' },
  ];

  return (
    <Paper withBorder p="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={500} size="sm">
            <IconFilter size={16} style={{ marginRight: 8 }} />
            筛选条件
          </Text>
          <Button 
            variant="subtle" 
            size="xs" 
            onClick={() => onFiltersChange({})}
          >
            清除
          </Button>
        </Group>

        <Grid>
          {/* 分类筛选 */}
          <Grid.Col span={6}>
            <Select
              label="分类"
              placeholder="选择分类"
              data={categoryOptions}
              value={filters.category}
              onChange={(value) => onFiltersChange({ ...filters, category: value || undefined })}
              clearable
              leftSection={<IconCategory size={16} />}
            />
          </Grid.Col>

          {/* 排序方式 */}
          <Grid.Col span={6}>
            <Select
              label="排序方式"
              data={sortOptions}
              value={filters.sortBy || 'relevance'}
              onChange={(value) => onFiltersChange({ 
                ...filters, 
                sortBy: (value as 'relevance' | 'date' | 'popularity') || 'relevance' 
              })}
              leftSection={<IconSortDescending size={16} />}
            />
          </Grid.Col>

          {/* 日期范围 */}
          <Grid.Col span={12}>
            <Text size="sm" fw={500} mb="xs">发布时间</Text>
            <Group gap="xs">
              <DatePickerInput
                placeholder="开始日期"
                value={filters.dateRange?.[0]}
                onChange={(date) => onFiltersChange({
                  ...filters,
                  dateRange: date ? [date, filters.dateRange?.[1] || new Date()] : undefined
                })}
                leftSection={<IconCalendar size={16} />}
                clearable
                size="sm"
              />
              <Text size="sm" c="dimmed">至</Text>
              <DatePickerInput
                placeholder="结束日期"
                value={filters.dateRange?.[1]}
                onChange={(date) => onFiltersChange({
                  ...filters,
                  dateRange: filters.dateRange?.[0] && date ? [filters.dateRange[0], date] : undefined
                })}
                leftSection={<IconCalendar size={16} />}
                clearable
                size="sm"
              />
            </Group>
          </Grid.Col>

          {/* 作者筛选 */}
          <Grid.Col span={12}>
            <TextInput
              label="作者"
              placeholder="输入作者名称"
              value={filters.author || ''}
              onChange={(event) => onFiltersChange({ 
                ...filters, 
                author: event.currentTarget.value || undefined 
              })}
              leftSection={<IconUser size={16} />}
              clearable
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  );
}

// 搜索结果组件
function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const {
    query,
    filters,
    page,
    isSearching,
    results,
    pagination,
    error,
    handleSearch,
    updateFilters,
    goToPage,
    clearSearch,
    history,
    clearHistory,
    getSuggestions,
    getTrending,
    recordClick,
  } = useSearch('website');

  // 初始化搜索
  React.useEffect(() => {
    if (initialQuery && !query) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, query, handleSearch]);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* 搜索标题 */}
        <div>
          <Title order={1} mb="xs">搜索</Title>
          <Text c="dimmed">在我们的内容库中查找您需要的信息</Text>
        </div>

        {/* 搜索框 */}
        <SearchBox
          value={query}
          onChange={() => {}} // 由内部管理
          onSearch={handleSearch}
          onGetSuggestions={getSuggestions}
          onGetTrending={getTrending}
          placeholder="搜索文章、分类、标签..."
          size="lg"
          searchHistory={history}
          onClearHistory={clearHistory}
          source="website"
          autoFocus
        />

        <Grid>
          {/* 筛选器侧边栏 */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <SearchFilters 
              filters={filters} 
              onFiltersChange={updateFilters} 
            />
          </Grid.Col>

          {/* 搜索结果主区域 */}
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Stack gap="lg">
              {/* 搜索状态和结果统计 */}
              {query && (
                <Paper withBorder p="md">
                  <Group justify="space-between" wrap="nowrap">
                    <div>
                      <Text fw={500}>搜索: "{query}"</Text>
                      {pagination && (
                        <Text size="sm" c="dimmed">
                          找到 {pagination.totalCount} 个结果
                          {filters.category && ` · 分类: ${filters.category}`}
                          {filters.author && ` · 作者: ${filters.author}`}
                        </Text>
                      )}
                    </div>
                    <Button variant="light" size="sm" onClick={clearSearch}>
                      清除搜索
                    </Button>
                  </Group>
                </Paper>
              )}

              {/* 加载状态 */}
              {isSearching && (
                <Center py="xl">
                  <Stack align="center" gap="md">
                    <Loader size="lg" />
                    <Text>正在搜索...</Text>
                  </Stack>
                </Center>
              )}

              {/* 错误状态 */}
              {error && (
                <Alert icon={<IconAlertCircle size={16} />} color="red">
                  搜索出错: {error.message}
                </Alert>
              )}

              {/* 无结果状态 */}
              {!isSearching && query && results.length === 0 && !error && (
                <Paper withBorder p="xl" ta="center">
                  <Stack align="center" gap="md">
                    <IconSearch size={48} color="gray" />
                    <div>
                      <Title order={3} c="dimmed">未找到相关结果</Title>
                      <Text c="dimmed" mt="xs">
                        尝试使用其他关键词或调整筛选条件
                      </Text>
                    </div>
                    <Group>
                      <Button variant="light" onClick={() => updateFilters({})}>
                        清除筛选
                      </Button>
                      <Button variant="outline" onClick={clearSearch}>
                        重新搜索
                      </Button>
                    </Group>
                  </Stack>
                </Paper>
              )}

              {/* 搜索结果列表 */}
              {!isSearching && results.length > 0 && (
                <Stack gap="md">
                  {results.map((post, index) => (
                    <SearchResultCard
                      key={post.id}
                      post={post}
                      query={query}
                      position={index + 1 + (page - 1) * 10}
                      onRecordClick={recordClick}
                    />
                  ))}
                </Stack>
              )}

              {/* 分页 */}
              {pagination && pagination.totalPages > 1 && (
                <Group justify="center" mt="xl">
                  <Pagination
                    value={page}
                    onChange={goToPage}
                    total={pagination.totalPages}
                    siblings={1}
                    boundaries={1}
                  />
                </Group>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

// 主搜索页面组件
export default function SearchPage() {
  return (
    <Suspense fallback={
      <Container size="xl" py="xl">
        <Center>
          <Loader size="lg" />
        </Center>
      </Container>
    }>
      <SearchResults />
    </Suspense>
  );
} 