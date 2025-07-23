'use client';

import { BlogLayout } from '../../../components/BlogLayout';
import { 
  Container, 
  Title, 
  Text, 
  Stack,
  Group,
  Badge,
  Paper,
  Grid,
  Card,
  Anchor,
  ActionIcon,
  Box,
  Skeleton,
  Button,
  Alert,
  Divider,
  Center,
  Pagination
} from '@mantine/core';
import { 
  IconCalendar, 
  IconUser, 
  IconEye, 
  IconArrowRight,
  IconArrowLeft,
  IconFolders,
  IconAlertCircle,
  IconHash
} from '@tabler/icons-react';
import Link from 'next/link';
import { api } from '../../../trpc/react';
import { useState } from 'react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // 获取分类信息
  const { 
    data: category, 
    isLoading: categoryLoading,
    error: categoryError
  } = api.category.getBySlug.useQuery({ slug: params.slug });

  // 获取该分类下的文章
  const { 
    data: postsData, 
    isLoading: postsLoading,
    error: postsError
  } = api.post.getPublished.useQuery({
    page: currentPage,
    pageSize,
    categoryId: category?.id,
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  }, { enabled: !!category?.id });

  // 获取所有分类（用于相关分类推荐）
  const { 
    data: allCategories, 
    isLoading: allCategoriesLoading 
  } = api.category.getAll.useQuery();

  // 渲染文章卡片
  const renderPostCard = (post: any) => (
    <Card key={post.id} withBorder p="lg" className="hover-glow" style={{ height: '100%' }}>
      <Stack gap="md" style={{ height: '100%' }}>
        {/* 文章标题和特色标识 */}
        <Box>
          <Group justify="space-between" mb="xs">
            <Badge 
              variant="outline" 
              size="sm"
              style={{ 
                borderColor: 'var(--neon-cyan)',
                color: 'var(--neon-cyan)'
              }}
            >
              {category?.name}
            </Badge>
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

  if (categoryError) {
    return (
      <BlogLayout>
        <Container size="lg" py="xl">
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="分类加载失败" 
            color="red"
            variant="outline"
          >
            <Text mb="md">{categoryError.message}</Text>
            <Button component={Link} href="/" variant="outline" size="sm">
              返回首页
            </Button>
          </Alert>
        </Container>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* 返回按钮 */}
          <Button 
            component={Link} 
            href="/" 
            variant="subtle" 
            leftSection={<IconArrowLeft size={16} />}
            className="hover-glow"
          >
            返回首页
          </Button>

          {categoryLoading ? (
            <Stack gap="xl">
              <Skeleton height={60} />
              <Skeleton height={100} />
              <Grid gutter="lg">
                {Array(8).fill(0).map((_, index) => (
                  <Grid.Col key={index} span={{ base: 12, md: 6, lg: 3 }}>
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
            </Stack>
          ) : category ? (
            <Grid gutter="xl">
              {/* 主内容区域 */}
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Stack gap="xl">
                  {/* 分类头部信息 */}
                  <Paper withBorder p="xl" className="code-border">
                    <Group gap="md" mb="lg" align="center">
                      <Box
                        style={{
                          background: 'linear-gradient(45deg, var(--neon-cyan), var(--neon-blue))',
                          borderRadius: '8px',
                          padding: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <IconFolders size={24} color="black" />
                      </Box>
                      <Box style={{ flex: 1 }}>
                        <Title order={1} size="2.5rem" className="tech-title" mb="xs">
                          {category.name}
                        </Title>
                        <Text size="lg" c="var(--text-secondary)">
                          📂 分类下共有 {category.postCount || 0} 篇文章
                        </Text>
                      </Box>
                    </Group>
                    
                    {category.description && (
                      <>
                        <Divider color="var(--neon-cyan)" mb="md" />
                        <Text size="md" style={{ lineHeight: 1.6 }}>
                          {category.description}
                        </Text>
                      </>
                    )}
                  </Paper>

                  {/* 文章列表标题 */}
                  <Box>
                    <Group justify="space-between" align="center" mb="lg">
                      <Title order={2} className="neon-text">
                        📚 文章列表
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
                      {Array(8).fill(0).map((_, index) => (
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
                      <Text c="var(--text-muted)" size="lg" mb="md">
                        该分类下暂无文章
                      </Text>
                      <Button component={Link} href="/" variant="outline">
                        浏览其他文章
                      </Button>
                    </Paper>
                  )}
                </Stack>
              </Grid.Col>

              {/* 侧边栏 */}
              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Stack gap="xl">
                  {/* 分类统计 */}
                  <Paper withBorder p="lg" className="code-border">
                    <Title order={3} size="h5" className="neon-text" mb="md">
                      📊 分类统计
                    </Title>
                    <Divider color="var(--neon-cyan)" mb="md" />
                    
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm" c="var(--text-muted)">总文章数</Text>
                        <Badge variant="outline" size="sm">
                          {category.postCount || 0}
                        </Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="var(--text-muted)">创建时间</Text>
                        <Text size="xs" c="var(--text-muted)">
                          {category.createdAt ? new Date(category.createdAt).toLocaleDateString('zh-CN') : ''}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="var(--text-muted)">排序</Text>
                        <Badge variant="outline" size="xs">
                          #{category.order || 0}
                        </Badge>
                      </Group>
                    </Stack>
                  </Paper>

                  {/* 其他分类 */}
                  <Paper withBorder p="lg" className="code-border">
                    <Title order={3} size="h5" className="neon-text" mb="md">
                      📂 其他分类
                    </Title>
                    <Divider color="var(--neon-cyan)" mb="md" />
                    
                    {allCategoriesLoading ? (
                      <Stack gap="xs">
                        {Array(6).fill(0).map((_, index) => (
                          <Skeleton key={index} height={32} />
                        ))}
                      </Stack>
                    ) : allCategories && allCategories.length > 0 ? (
                      <Stack gap="xs">
                        {allCategories
                          .filter(cat => cat.id !== category.id)
                          .slice(0, 8)
                          .map((cat) => (
                            <Button
                              key={cat.id}
                              component={Link}
                              href={`/category/${cat.slug}`}
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
                              <Text size="sm">{cat.name}</Text>
                              <Badge variant="outline" size="xs">
                                {cat.postCount || 0}
                              </Badge>
                            </Button>
                          ))}
                      </Stack>
                    ) : (
                      <Text size="sm" c="var(--text-muted)">
                        暂无其他分类
                      </Text>
                    )}
                  </Paper>

                  {/* 快速导航 */}
                  <Paper withBorder p="lg" className="code-border">
                    <Title order={3} size="h5" className="neon-text" mb="md">
                      🚀 快速导航
                    </Title>
                    <Divider color="var(--neon-cyan)" mb="md" />
                    
                    <Stack gap="xs">
                      <Button
                        component={Link}
                        href="/"
                        variant="subtle"
                        fullWidth
                        leftSection={<IconHash size={14} />}
                        className="hover-glow"
                        styles={{
                          root: {
                            justifyContent: 'flex-start',
                            border: '1px solid var(--neon-cyan)',
                            color: 'var(--text-primary)',
                          }
                        }}
                      >
                        最新文章
                      </Button>
                      <Button
                        component={Link}
                        href="/search"
                        variant="subtle"
                        fullWidth
                        leftSection={<IconHash size={14} />}
                        className="hover-glow"
                        styles={{
                          root: {
                            justifyContent: 'flex-start',
                            border: '1px solid var(--neon-cyan)',
                            color: 'var(--text-primary)',
                          }
                        }}
                      >
                        搜索文章
                      </Button>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid.Col>
            </Grid>
          ) : null}
        </Stack>
      </Container>
    </BlogLayout>
  );
} 