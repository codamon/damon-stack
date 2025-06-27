'use client';

import { 
  Container, 
  Title, 
  Text, 
  Paper, 
  Group, 
  Badge, 
  LoadingOverlay, 
  Alert, 
  Stack,
  Card,
  Button,
  SimpleGrid
} from '@mantine/core';
import { IconInfoCircle, IconCalendar, IconEye, IconHeart, IconClock } from '@tabler/icons-react';
import { 
  usePublishedPosts, 
  useFeaturedPosts, 
  useCategories, 
  useDashboardStats,
  formatUtils,
  seoUtils 
} from '@damon-stack/shared';

export default function BlogDemoPage() {
  // 使用shared包的hooks获取数据
  const { data: posts, isLoading: postsLoading, error: postsError } = usePublishedPosts({ limit: 6 });
  const { data: featuredPosts, isLoading: featuredLoading } = useFeaturedPosts(3);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  return (
    <Container size="lg" py="xl">
      {/* 页面标题 */}
      <Stack gap="xl">
        <Paper withBorder p="xl">
          <Group justify="space-between" align="center">
            <div>
              <Title order={1} size="h2" mb="xs">
                🚀 跨应用数据共享演示
              </Title>
              <Text c="dimmed">
                这个页面演示了如何使用 @damon-stack/shared 包在前端应用中访问后台数据
              </Text>
            </div>
            <Badge size="lg" variant="light" color="blue">
              实时数据
            </Badge>
          </Group>
        </Paper>

        {/* 统计数据展示 */}
        <Paper withBorder p="xl">
          <Title order={2} size="h3" mb="md">
            📊 后台统计数据
          </Title>
          <LoadingOverlay visible={statsLoading} />
          
          {stats && (
            <SimpleGrid cols={4} spacing="md">
              <Card withBorder p="md" radius="md">
                <Text size="sm" c="dimmed" mb="xs">总文章数</Text>
                <Text size="xl" fw={700}>{formatUtils.number.compact(stats.totalPosts)}</Text>
              </Card>
              <Card withBorder p="md" radius="md">
                <Text size="sm" c="dimmed" mb="xs">已发布</Text>
                <Text size="xl" fw={700} c="green">{formatUtils.number.compact(stats.publishedPosts)}</Text>
              </Card>
              <Card withBorder p="md" radius="md">
                <Text size="sm" c="dimmed" mb="xs">总浏览量</Text>
                <Text size="xl" fw={700} c="blue">{formatUtils.number.compact(stats.totalViews)}</Text>
              </Card>
              <Card withBorder p="md" radius="md">
                <Text size="sm" c="dimmed" mb="xs">总用户数</Text>
                <Text size="xl" fw={700} c="violet">{formatUtils.number.compact(stats.totalUsers)}</Text>
              </Card>
            </SimpleGrid>
          )}
        </Paper>

        {/* 分类展示 */}
        <Paper withBorder p="xl">
          <Title order={2} size="h3" mb="md">
            📂 文章分类
          </Title>
          <LoadingOverlay visible={categoriesLoading} />
          
          {categories && (
            <Group gap="xs">
              {categories.slice(0, 8).map((category: any) => (
                <Badge 
                  key={category.id} 
                  variant="light" 
                  color={formatUtils.color.fromText(category.name)}
                  size="lg"
                >
                  {category.name} ({category._count?.posts || 0})
                </Badge>
              ))}
            </Group>
          )}
        </Paper>

        {/* 特色文章 */}
        <Paper withBorder p="xl">
          <Title order={2} size="h3" mb="md">
            ⭐ 特色文章
          </Title>
          <LoadingOverlay visible={featuredLoading} />
          
          {featuredPosts && featuredPosts.length > 0 && (
            <SimpleGrid cols={3} spacing="md">
              {featuredPosts.map((post: any) => (
                <Card key={post.id} withBorder p="md" radius="md">
                  <Badge color="yellow" variant="light" size="sm" mb="xs">
                    特色
                  </Badge>
                  <Text fw={600} size="sm" lineClamp={2} mb="xs">
                    {post.title}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={3} mb="md">
                    {formatUtils.text.excerpt(post.content, 100)}
                  </Text>
                  <Group gap="xs" justify="space-between">
                    <Group gap="xs">
                      <IconEye size={14} />
                      <Text size="xs" c="dimmed">{post.viewCount || 0}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconHeart size={14} />
                      <Text size="xs" c="dimmed">{post.likeCount || 0}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconClock size={14} />
                      <Text size="xs" c="dimmed">{post.readingTime || 5}min</Text>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Paper>

        {/* 最新文章列表 */}
        <Paper withBorder p="xl">
          <Title order={2} size="h3" mb="md">
            📝 最新文章
          </Title>
          <LoadingOverlay visible={postsLoading} />
          
          {postsError && (
            <Alert 
              icon={<IconInfoCircle size="1rem" />} 
              title="数据加载失败" 
              color="red" 
              mb="md"
            >
              {postsError.message}
            </Alert>
          )}
          
          {posts && posts.length > 0 && (
            <Stack gap="md">
              {posts.map((post: any) => (
                <Card key={post.id} withBorder p="md" radius="md">
                  <Group justify="space-between" align="flex-start">
                    <div style={{ flex: 1 }}>
                      <Group gap="xs" mb="xs">
                        <Badge 
                          variant="light" 
                          color={post.featured ? "yellow" : "gray"}
                          size="sm"
                        >
                          {post.featured ? "特色" : "普通"}
                        </Badge>
                        {post.category && (
                          <Badge 
                            variant="outline" 
                            color={formatUtils.color.fromText(post.category.name)}
                            size="sm"
                          >
                            {post.category.name}
                          </Badge>
                        )}
                      </Group>
                      
                      <Text fw={600} size="lg" mb="xs">
                        {post.title}
                      </Text>
                      
                      <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                        {formatUtils.text.excerpt(post.content, 150)}
                      </Text>
                      
                      <Group gap="md">
                        <Group gap="xs">
                          <IconCalendar size={14} />
                          <Text size="xs" c="dimmed">
                            {formatUtils.date.relative(post.publishedAt || post.createdAt)}
                          </Text>
                        </Group>
                        <Group gap="xs">
                          <IconEye size={14} />
                          <Text size="xs" c="dimmed">{post.viewCount || 0} 次浏览</Text>
                        </Group>
                        <Group gap="xs">
                          <IconHeart size={14} />
                          <Text size="xs" c="dimmed">{post.likeCount || 0} 个赞</Text>
                        </Group>
                        <Group gap="xs">
                          <IconClock size={14} />
                          <Text size="xs" c="dimmed">
                            {formatUtils.text.readingTime(post.content)} 分钟阅读
                          </Text>
                        </Group>
                      </Group>
                    </div>
                    
                    <Button variant="light" size="sm">
                      阅读更多
                    </Button>
                  </Group>
                </Card>
              ))}
            </Stack>
          )}
          
          {posts && posts.length === 0 && (
            <Alert 
              icon={<IconInfoCircle size="1rem" />} 
              title="暂无文章" 
              color="blue"
            >
              后台还没有发布任何文章，请先在管理后台添加一些内容。
            </Alert>
          )}
        </Paper>

        {/* 功能说明 */}
        <Paper withBorder p="xl">
          <Title order={2} size="h3" mb="md">
            💡 技术说明
          </Title>
          <Stack gap="md">
            <Text>
              <strong>跨应用数据共享：</strong> 这个页面演示了前端网站如何通过 @damon-stack/shared 包访问后台管理系统的数据。
            </Text>
            <Text>
              <strong>实时更新：</strong> 数据会自动缓存和更新，当后台数据发生变化时，前端会智能刷新。
            </Text>
            <Text>
              <strong>类型安全：</strong> 所有API调用都是完全类型安全的，提供优秀的开发体验。
            </Text>
            <Text>
              <strong>工具函数：</strong> 使用shared包提供的格式化工具，确保数据展示的一致性。
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
} 