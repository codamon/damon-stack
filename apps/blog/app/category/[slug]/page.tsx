import { BlogLayout } from '../../../components/BlogLayout';
import { 
  Container, 
  Title, 
  Text, 
  Stack,
  Grid,
  Paper,
  Group,
  Badge,
  Button
} from '@mantine/core';
import { IconCalendar, IconUser, IconArrowRight } from '@tabler/icons-react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// 模拟分类数据
const categoryData = {
  frontend: {
    name: '前端开发',
    description: '现代前端开发技术、框架和最佳实践',
    posts: [
      {
        id: '1',
        title: 'Next.js 15 与 React 19 新特性深度解析',
        excerpt: '探索Next.js 15和React 19带来的革命性变化...',
        slug: 'nextjs-15-react-19-deep-dive',
        publishedAt: '2025-01-15',
        author: 'Damon',
        tags: ['Next.js', 'React'],
        readingTime: '8 min read'
      },
      {
        id: '3',
        title: 'Mantine 8 UI 组件库实战指南',
        excerpt: '学习如何使用Mantine 8构建现代化、响应式的用户界面...',
        slug: 'mantine-8-ui-guide',
        publishedAt: '2025-01-05',
        author: 'Damon',
        tags: ['Mantine', 'UI'],
        readingTime: '6 min read'
      }
    ]
  },
  backend: {
    name: '后端开发',
    description: '服务器端开发、API设计和数据库技术',
    posts: [
      {
        id: '2',
        title: 'tRPC 全栈类型安全最佳实践',
        excerpt: '深入了解如何在现代全栈应用中实现端到端类型安全...',
        slug: 'trpc-fullstack-type-safety',
        publishedAt: '2025-01-10',
        author: 'Damon',
        tags: ['tRPC', 'TypeScript'],
        readingTime: '12 min read'
      }
    ]
  }
};

function PostCard({ post }: { post: any }) {
  return (
    <Paper withBorder p="lg" h="100%">
      <Stack gap="md" h="100%">
        <div>
          <Title order={3} lineClamp={2} mb="xs">
            {post.title}
          </Title>
          <Text c="dimmed" lineClamp={3} mb="md">
            {post.excerpt}
          </Text>
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <Group justify="space-between" align="center" mb="sm">
            <Group gap="xs">
              <IconUser size={16} />
              <Text size="sm">{post.author}</Text>
              <IconCalendar size={16} />
              <Text size="sm">{post.publishedAt}</Text>
            </Group>
            <Text size="sm" c="dimmed">{post.readingTime}</Text>
          </Group>
          
          <Group justify="space-between" align="center">
            <Group gap="xs">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" size="xs">
                  {tag}
                </Badge>
              ))}
            </Group>
            <Button 
              variant="light" 
              size="sm"
              rightSection={<IconArrowRight size={16} />}
            >
              阅读
            </Button>
          </Group>
        </div>
      </Stack>
    </Paper>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = params.slug;
  const category = categoryData[categorySlug as keyof typeof categoryData];
  
  if (!category) {
    return (
      <BlogLayout>
        <Container size="lg" py="xl">
          <Title order={1}>分类不存在</Title>
          <Text>抱歉，请求的分类不存在。</Text>
        </Container>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* 分类头部 */}
          <div>
            <Title order={1} size="2.5rem" mb="md">
              {category.name}
            </Title>
            <Text size="lg" c="dimmed" mb="lg">
              {category.description}
            </Text>
            <Text size="sm" c="dimmed">
              共 {category.posts.length} 篇文章
            </Text>
          </div>
          
          {/* 文章列表 */}
          <Grid>
            {category.posts.map((post) => (
              <Grid.Col key={post.id} span={{ base: 12, md: 6 }}>
                <PostCard post={post} />
              </Grid.Col>
            ))}
          </Grid>
          
          {/* 分页或加载更多 */}
          <Group justify="center" mt="xl">
            <Button variant="outline">
              加载更多文章
            </Button>
          </Group>
        </Stack>
      </Container>
    </BlogLayout>
  );
} 