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
  DatePickerInput,
  TextInput,
  Card,
  Avatar,
  Alert,
  Center,
  Highlight,
  Divider,
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
  IconAlertCircle,
  IconHeart,
  IconBookmark,
} from '@tabler/icons-react';
import Link from 'next/link';
import { SearchBox, useSearch, type SearchFilters } from '@damon-stack/shared';
import { api } from '../trpc/react';

// 博客搜索结果卡片
function BlogSearchResultCard({ 
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
      padding="xl" 
      component={Link} 
      href={`/posts/${post.slug}`}
      onClick={handleClick}
      style={{ 
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s ease',
      }}
      className="hover:shadow-lg hover:-translate-y-1"
    >
      <Stack gap="lg">
        {/* 文章元信息 */}
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs">
            {post.category && (
              <Badge variant="filled" color="blue" size="sm" radius="sm">
                {post.category.name}
              </Badge>
            )}
            <Badge variant="light" color="gray" size="sm" radius="sm">
              <IconClock size={12} style={{ marginRight: 4 }} />
              {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Badge>
          </Group>
          <Group gap="md" c="dimmed">
            <Group gap={4}>
              <IconEye size={14} />
              <Text size="xs">{post.views || 0}</Text>
            </Group>
            {post.featured && (
              <Badge variant="outline" color="orange" size="xs">
                精选
              </Badge>
            )}
          </Group>
        </Group>

        {/* 文章标题 - 高亮搜索词 */}
        <Title order={2} lineClamp={2} style={{ lineHeight: 1.4 }}>
          {query ? (
            <Highlight 
              highlight={query} 
              highlightStyles={{ backgroundColor: 'yellow', padding: '2px 4px', borderRadius: '2px' }}
            >
              {post.title}
            </Highlight>
          ) : (
            post.title
          )}
        </Title>

        {/* 文章摘要 - 高亮搜索词 */}
        {post.excerpt && (
          <Text size="md" c="dimmed" lineClamp={3} style={{ lineHeight: 1.6 }}>
            {query ? (
              <Highlight 
                highlight={query} 
                highlightStyles={{ backgroundColor: 'yellow', padding: '1px 2px', borderRadius: '2px' }}
              >
                {post.excerpt}
              </Highlight>
            ) : (
              post.excerpt
            )}
          </Text>
        )}

        <Divider />

        {/* 底部信息 */}
        <Group justify="space-between" wrap="nowrap">
          {/* 作者信息 */}
          {post.author && (
            <Group gap="sm">
              <Avatar 
                src={post.author.image} 
                size="sm" 
                radius="xl"
                style={{ border: '2px solid var(--mantine-color-gray-3)' }}
              >
                {post.author.name?.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Text size="sm" fw={500}>
                  {post.author.name}
                </Text>
                <Text size="xs" c="dimmed">
                  作者
                </Text>
              </div>
            </Group>
          )}

          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <Group gap="xs" wrap="nowrap">
              <IconTag size={14} color="gray" />
              <Group gap="xs">
                {post.tags.slice(0, 2).map((tag: any) => (
                  <Badge key={tag.id} variant="outline" size="xs" color="gray">
                    {tag.name}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Text size="xs" c="dimmed">
                    +{post.tags.length - 2}
                  </Text>
                )}
              </Group>
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  );
}

// 博客搜索筛选器
function BlogSearchFilters({ 
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
    { value: 'relevance', label: '最相关' },
    { value: 'date', label: '最新发布' },
    { value: 'popularity', label: '最受欢迎' },
  ];

  return (
    <Paper withBorder p="lg" radius="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Text fw={600} size="lg" c="dark">
            <IconFilter size={20} style={{ marginRight: 8 }} />
            筛选条件
          </Text>
          <Button 
            variant="subtle" 
            size="sm" 
            onClick={() => onFiltersChange({})}
            color="gray"
          >
            重置
          </Button>
        </Group>

        <Stack gap="md">
          {/* 分类筛选 */}
          <div>
            <Text size="sm" fw={500} mb="xs" c="dark">分类</Text>
            <Select
              placeholder="选择分类"
              data={categoryOptions}
              value={filters.category}
              onChange={(value) => onFiltersChange({ ...filters, category: value || undefined })}
              clearable
              leftSection={<IconCategory size={16} />}
              styles={{
                input: {
                  borderRadius: '8px',
                },
              }}
            />
          </div>

          {/* 排序方式 */}
          <div>
            <Text size="sm" fw={500} mb="xs" c="dark">排序</Text>
            <Select
              data={sortOptions}
              value={filters.sortBy || 'relevance'}
              onChange={(value) => onFiltersChange({ 
                ...filters, 
                sortBy: (value as 'relevance' | 'date' | 'popularity') || 'relevance' 
              })}
              leftSection={<IconSortDescending size={16} />}
              styles={{
                input: {
                  borderRadius: '8px',
                },
              }}
            />
          </div>

          {/* 发布时间 */}
          <div>
            <Text size="sm" fw={500} mb="xs" c="dark">发布时间</Text>
            <Stack gap="xs">
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
                styles={{
                  input: {
                    borderRadius: '8px',
                  },
                }}
              />
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
                styles={{
                  input: {
                    borderRadius: '8px',
                  },
                }}
              />
            </Stack>
          </div>

          {/* 作者 */}
          <div>
            <Text size="sm" fw={500} mb="xs" c="dark">作者</Text>
            <TextInput
              placeholder="输入作者名称"
              value={filters.author || ''}
              onChange={(event) => onFiltersChange({ 
                ...filters, 
                author: event.currentTarget.value || undefined 
              })}
              leftSection={<IconUser size={16} />}
              clearable
              styles={{
                input: {
                  borderRadius: '8px',
                },
              }}
            />
          </div>
        </Stack>
      </Stack>
    </Paper>
  );
}

// 搜索结果组件
function BlogSearchResults() {
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
  } = useSearch('blog');

  // 初始化搜索
  React.useEffect(() => {
    if (initialQuery && !query) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, query, handleSearch]);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* 博客搜索标题 */}
        <div style={{ textAlign: 'center' }}>
          <Title order={1} size="h1" mb="md" c="dark">
            博客搜索
          </Title>
          <Text size="lg" c="dimmed" maw={600} mx="auto">
            在我们的博客文章中搜索您感兴趣的内容，
            发现更多有价值的见解和知识
          </Text>
        </div>

        {/* 搜索框 */}
        <Center>
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <SearchBox
              value={query}
              onChange={() => {}} // 由内部管理
              onSearch={handleSearch}
              onGetSuggestions={getSuggestions}
              onGetTrending={getTrending}
              placeholder="搜索博客文章、技术话题、作者..."
              size="lg"
              searchHistory={history}
              onClearHistory={clearHistory}
              source="blog"
              autoFocus
            />
          </div>
        </Center>

        <Grid gutter="xl">
          {/* 筛选器侧边栏 */}
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <BlogSearchFilters 
              filters={filters} 
              onFiltersChange={updateFilters} 
            />
          </Grid.Col>

          {/* 搜索结果主区域 */}
          <Grid.Col span={{ base: 12, lg: 9 }}>
            <Stack gap="xl">
              {/* 搜索状态和结果统计 */}
              {query && (
                <Paper withBorder p="lg" radius="md">
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <div>
                      <Text size="xl" fw={600} c="dark">
                        搜索: "{query}"
                      </Text>
                      {pagination && (
                        <Text size="md" c="dimmed" mt="xs">
                          共找到 <strong>{pagination.totalCount}</strong> 篇相关文章
                          {filters.category && ` · 分类: ${filters.category}`}
                          {filters.author && ` · 作者: ${filters.author}`}
                        </Text>
                      )}
                    </div>
                    <Button 
                      variant="light" 
                      size="md" 
                      onClick={clearSearch}
                      radius="md"
                    >
                      清除搜索
                    </Button>
                  </Group>
                </Paper>
              )}

              {/* 加载状态 */}
              {isSearching && (
                <Center py="xl">
                  <Stack align="center" gap="lg">
                    <Loader size="xl" color="blue" />
                    <Text size="lg">正在搜索博客文章...</Text>
                  </Stack>
                </Center>
              )}

              {/* 错误状态 */}
              {error && (
                <Alert 
                  icon={<IconAlertCircle size={20} />} 
                  color="red" 
                  radius="md"
                  variant="light"
                >
                  搜索出错: {error.message}
                </Alert>
              )}

              {/* 无结果状态 */}
              {!isSearching && query && results.length === 0 && !error && (
                <Paper withBorder p="xl" ta="center" radius="md">
                  <Stack align="center" gap="xl">
                    <IconSearch size={64} color="gray" />
                    <div>
                      <Title order={2} c="dimmed" mb="md">
                        没有找到相关文章
                      </Title>
                      <Text c="dimmed" size="lg" mb="xl">
                        尝试使用其他关键词、调整筛选条件，或者浏览我们的热门文章
                      </Text>
                    </div>
                    <Group>
                      <Button 
                        variant="light" 
                        size="lg" 
                        onClick={() => updateFilters({})}
                        radius="md"
                      >
                        清除筛选
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={clearSearch}
                        radius="md"
                      >
                        重新搜索
                      </Button>
                    </Group>
                  </Stack>
                </Paper>
              )}

              {/* 搜索结果列表 */}
              {!isSearching && results.length > 0 && (
                <Stack gap="lg">
                  {results.map((post, index) => (
                    <BlogSearchResultCard
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
                    siblings={2}
                    boundaries={1}
                    size="lg"
                    radius="md"
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
export default function BlogSearchPage() {
  return (
    <Suspense fallback={
      <Container size="xl" py="xl">
        <Center>
          <Stack align="center" gap="lg">
            <Loader size="xl" color="blue" />
            <Text size="lg">加载搜索页面...</Text>
          </Stack>
        </Center>
      </Container>
    }>
      <BlogSearchResults />
    </Suspense>
  );
} 