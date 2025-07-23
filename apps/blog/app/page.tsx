'use client';

import { BlogLayout } from '../components/BlogLayout';
import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Grid, 
  Card, 
  Group, 
  Badge, 
  Anchor, 
  Button,
  Paper,
  Skeleton,
  Box,
  Divider,
  ActionIcon,
  Pagination,
  Center
} from '@mantine/core';
import { 
  IconCalendar, 
  IconUser, 
  IconEye, 
  IconArrowRight,
  IconFlame,
  IconClock
} from '@tabler/icons-react';
import Link from 'next/link';
import { api } from '../trpc/react';
import { useState } from 'react';

export default function BlogHomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // 获取已发布文章列表
  const { 
    data: postsData, 
    isLoading: postsLoading,
    error: postsError
  } = api.post.getPublished.useQuery({
    page: currentPage,
    pageSize,
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });

  // 获取热门文章
  const { 
    data: popularPosts, 
    isLoading: popularLoading 
  } = api.post.getPopular.useQuery({
    limit: 5,
    days: 30
  });

  // 获取分类列表
  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = api.category.getAll.useQuery();

  // 渲染文章卡片
  const renderPostCard = (post: any) => (
    <Card key={post.id} withBorder p="lg" className="hover-glow" style={{ height: '100%' }}>
      <Stack gap="md" style={{ height: '100%' }}>
        {/* 文章标题和分类 */}
        <Box>
          <Group justify="space-between" mb="xs">
            {post.category && (
              <Badge 
                variant="outline" 
                size="sm"
                style={{ 
                  borderColor: 'var(--neon-cyan)',
                  color: 'var(--neon-cyan)'
                }}
              >
                {post.category.name}
              </Badge>
            )}
            {post.featured && (
              <Badge variant="filled" color="red" size="sm">
                精选
              </Badge>
            )}
          </Group>
          
          <Title 
            order={3} 
            size="h4" 
            mb="sm"
            className="neon-text"
            style={{ lineHeight: 1.3 }}
          >
            <Anchor 
              component={Link} 
              href={`/posts/${post.slug}`}
              className="hover-glow"
              style={{ textDecoration: 'none' }}
            >
              {post.title}
            </Anchor>
          </Title>
          
          <Text 
            size="sm" 
            c="var(--text-secondary)" 
            lineClamp={3}
            mb="md"
          >
            {post.excerpt || post.content.substring(0, 150) + '...'}
          </Text>
        </Box>

        {/* 文章元信息 */}
        <Group justify="space-between" mt="auto">
          <Group gap="lg">
            <Group gap="xs">
              <IconUser size={14} className="neon-text" />
              <Text size="xs" c="var(--text-muted)">
                {post.author?.name || '未知作者'}
              </Text>
            </Group>
            <Group gap="xs">
              <IconCalendar size={14} className="neon-text" />
              <Text size="xs" c="var(--text-muted)">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('zh-CN') : ''}
              </Text>
            </Group>
            <Group gap="xs">
              <IconEye size={14} className="neon-text" />
              <Text size="xs" c="var(--text-muted)">
                {post.viewCount || 0}
              </Text>
            </Group>
          </Group>

          <ActionIcon 
            variant="subtle" 
            component={Link} 
            href={`/posts/${post.slug}`}
            className="hover-glow"
          >
            <IconArrowRight size={16} className="neon-text" />
          </ActionIcon>
        </Group>

        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <Group gap="xs" mt="xs">
            {post.tags.slice(0, 3).map((tag: any) => (
              <Badge 
                key={tag.id}
                variant="dot" 
                size="xs"
                style={{ color: 'var(--text-muted)' }}
              >
                #{tag.name}
              </Badge>
            ))}
          </Group>
        )}
      </Stack>
    </Card>
  );

  return (
    <BlogLayout>
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* 页面标题区域 */}
          <Box ta="center" mb="xl">
            <Title size="3rem" fw={900} className="tech-title mb-4">
              &gt; DAMON_STACK.BLOG_
            </Title>
            <Text size="xl" c="var(--text-secondary)" mb="md">
              🚀 探索前沿技术，分享开发经验
            </Text>
            <Text size="lg" className="neon-text">
              Next.js • React • TypeScript • AI • DevOps
            </Text>
          </Box>

          <Grid gutter="xl">
            {/* 主内容区域 */}
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Stack gap="xl">
                {/* 最新文章标题 */}
                <Box>
                  <Group justify="space-between" align="center" mb="lg">
                    <Title order={2} className="neon-text">
                      📚 最新文章
                    </Title>
                    <Text size="sm" c="var(--text-muted)">
                      {postsData?.total || 0} 篇文章
                    </Text>
                  </Group>
                  <Divider color="var(--neon-cyan)" />
                </Box>

                {/* 文章列表 */}
                {postsLoading ? (
                  <Grid gutter="lg">
                    {Array(6).fill(0).map((_, index) => (
                      <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                        <Card withBorder p="lg">
                          <Stack gap="md">
                            <Skeleton height={20} width="60%" />
                            <Skeleton height={60} />
                            <Group justify="space-between">
                              <Skeleton height={16} width="40%" />
                              <Skeleton height={16} width={20} />
                            </Group>
                          </Stack>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid>
                ) : postsError ? (
                  <Paper withBorder p="xl" ta="center">
                    <Text c="red" mb="md">加载文章时出错</Text>
                    <Text size="sm" c="var(--text-muted)">
                      {postsError.message}
                    </Text>
                  </Paper>
                ) : postsData?.data && postsData.data.length > 0 ? (
                  <>
                    <Grid gutter="lg">
                      {postsData.data.map((post) => (
                        <Grid.Col key={post.id} span={{ base: 12, md: 6 }}>
                          {renderPostCard(post)}
                        </Grid.Col>
                      ))}
                    </Grid>

                    {/* 分页 */}
                    {postsData.totalPages > 1 && (
                      <Center mt="xl">
                        <Pagination
                          total={postsData.totalPages}
                          value={currentPage}
                          onChange={setCurrentPage}
                          color="cyan"
                          size="md"
                        />
                      </Center>
                    )}
                  </>
                ) : (
                  <Paper withBorder p="xl" ta="center">
                    <Text c="var(--text-muted)" size="lg">
                      暂无文章发布
                    </Text>
                  </Paper>
                )}
              </Stack>
            </Grid.Col>

            {/* 侧边栏 */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap="xl">
                {/* 热门文章 */}
                <Paper withBorder p="lg" className="code-border">
                  <Group gap="xs" mb="md">
                    <IconFlame size={18} className="neon-text" />
                    <Title order={3} size="h5" className="neon-text">
                      热门文章
                    </Title>
                  </Group>
                  <Divider color="var(--neon-cyan)" mb="md" />
                  
                  {popularLoading ? (
                    <Stack gap="md">
                      {Array(5).fill(0).map((_, index) => (
                        <Box key={index}>
                          <Skeleton height={16} mb="xs" />
                          <Skeleton height={12} width="70%" />
                        </Box>
                      ))}
                    </Stack>
                  ) : popularPosts && popularPosts.length > 0 ? (
                    <Stack gap="md">
                      {popularPosts.map((post, index) => (
                        <Box key={post.id}>
                          <Group gap="xs" mb="xs">
                            <Badge 
                              variant="filled" 
                              size="xs" 
                              color="cyan"
                              style={{ minWidth: 20 }}
                            >
                              {index + 1}
                            </Badge>
                            <Anchor
                              component={Link}
                              href={`/posts/${post.slug}`}
                              size="sm"
                              fw={500}
                              className="hover-glow"
                              style={{ 
                                textDecoration: 'none',
                                color: 'var(--text-primary)',
                                flex: 1
                              }}
                              lineClamp={2}
                            >
                              {post.title}
                            </Anchor>
                          </Group>
                          <Group gap="md" mb={index < popularPosts.length - 1 ? "md" : 0}>
                            <Group gap="xs">
                              <IconEye size={12} />
                              <Text size="xs" c="var(--text-muted)">
                                {post.viewCount}
                              </Text>
                            </Group>
                            <Group gap="xs">
                              <IconClock size={12} />
                              <Text size="xs" c="var(--text-muted)">
                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('zh-CN') : ''}
                              </Text>
                            </Group>
                          </Group>
                          {index < popularPosts.length - 1 && (
                            <Divider size="xs" color="var(--neon-cyan)" opacity={0.3} />
                          )}
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Text size="sm" c="var(--text-muted)">
                      暂无热门文章
                    </Text>
                  )}
                </Paper>

                {/* 分类导航 */}
                <Paper withBorder p="lg" className="code-border">
                  <Title order={3} size="h5" className="neon-text" mb="md">
                    📂 分类导航
                  </Title>
                  <Divider color="var(--neon-cyan)" mb="md" />
                  
                  {categoriesLoading ? (
                    <Stack gap="xs">
                      {Array(6).fill(0).map((_, index) => (
                        <Skeleton key={index} height={32} />
                      ))}
                    </Stack>
                  ) : categories && categories.length > 0 ? (
                    <Stack gap="xs">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          component={Link}
                          href={`/category/${category.slug}`}
                          variant="subtle"
                          justify="space-between"
                          fullWidth
                          className="hover-glow"
                          styles={{
                            root: {
                              border: '1px solid var(--neon-cyan)',
                              color: 'var(--text-primary)',
                              '&:hover': {
                                backgroundColor: 'rgba(22, 244, 208, 0.1)',
                                borderColor: 'var(--neon-cyan)',
                              }
                            }
                          }}
                        >
                          <Text size="sm">{category.name}</Text>
                          <Badge variant="outline" size="xs">
                            {category.postCount || 0}
                          </Badge>
                        </Button>
                      ))}
                    </Stack>
                  ) : (
                    <Text size="sm" c="var(--text-muted)">
                      暂无分类
                    </Text>
                  )}
                </Paper>

                {/* 最近更新 */}
                <Paper withBorder p="lg" className="code-border">
                  <Title order={3} size="h5" className="neon-text" mb="md">
                    🔄 网站状态
                  </Title>
                  <Divider color="var(--neon-cyan)" mb="md" />
                  
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm" c="var(--text-muted)">总文章数</Text>
                      <Badge variant="outline" size="sm">
                        {postsData?.total || 0}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="var(--text-muted)">分类数</Text>
                      <Badge variant="outline" size="sm">
                        {categories?.length || 0}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="var(--text-muted)">最后更新</Text>
                      <Text size="xs" c="var(--text-muted)">
                        {new Date().toLocaleDateString('zh-CN')}
                      </Text>
                    </Group>
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </BlogLayout>
  );
} 