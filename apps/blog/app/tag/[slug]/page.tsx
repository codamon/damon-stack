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
import { IconCalendar, IconUser, IconArrowRight, IconTag } from '@tabler/icons-react';

interface TagPageProps {
  params: {
    slug: string;
  };
}

// 模拟标签数据
const tagData = {
  nextjs: {
    name: 'Next.js',
    description: 'React全栈框架，用于构建现代Web应用',
    color: 'blue',
    posts: [
      {
        id: '1',
        title: 'Next.js 15 与 React 19 新特性深度解析',
        excerpt: '探索Next.js 15和React 19带来的革命性变化...',
        slug: 'nextjs-15-react-19-deep-dive',
        publishedAt: '2025-01-15',
        author: 'Damon',
        category: 'Frontend',
        readingTime: '8 min read'
      }
    ]
  },
  react: {
    name: 'React',
    description: '用于构建用户界面的JavaScript库',
    color: 'cyan',
    posts: [
      {
        id: '1',
        title: 'Next.js 15 与 React 19 新特性深度解析',
        excerpt: '探索Next.js 15和React 19带来的革命性变化...',
        slug: 'nextjs-15-react-19-deep-dive',
        publishedAt: '2025-01-15',
        author: 'Damon',
        category: 'Frontend',
        readingTime: '8 min read'
      }
    ]
  },
  typescript: {
    name: 'TypeScript',
    description: '为JavaScript添加静态类型定义的超集',
    color: 'violet',
    posts: [
      {
        id: '2',
        title: 'tRPC 全栈类型安全最佳实践',
        excerpt: '深入了解如何在现代全栈应用中实现端到端类型安全...',
        slug: 'trpc-fullstack-type-safety',
        publishedAt: '2025-01-10',
        author: 'Damon',
        category: 'Backend',
        readingTime: '12 min read'
      }
    ]
  },
  trpc: {
    name: 'tRPC',
    description: '端到端类型安全的API框架',
    color: 'indigo',
    posts: [
      {
        id: '2',
        title: 'tRPC 全栈类型安全最佳实践',
        excerpt: '深入了解如何在现代全栈应用中实现端到端类型安全...',
        slug: 'trpc-fullstack-type-safety',
        publishedAt: '2025-01-10',
        author: 'Damon',
        category: 'Backend',
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
          <Group gap="xs" mb="xs">
            <Badge variant="light" size="sm">{post.category}</Badge>
            <Text size="sm" c="dimmed">{post.readingTime}</Text>
          </Group>
          <Title order={3} lineClamp={2} mb="xs">
            {post.title}
          </Title>
          <Text c="dimmed" lineClamp={3}>
            {post.excerpt}
          </Text>
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <Group justify="space-between" align="center" mt="md">
            <Group gap="xs">
              <IconUser size={16} />
              <Text size="sm">{post.author}</Text>
              <IconCalendar size={16} />
              <Text size="sm">{post.publishedAt}</Text>
            </Group>
            <Button 
              variant="light" 
              size="sm"
              rightSection={<IconArrowRight size={16} />}
            >
              阅读更多
            </Button>
          </Group>
        </div>
      </Stack>
    </Paper>
  );
}

export default function TagPage({ params }: TagPageProps) {
  const tagSlug = params.slug;
  const tag = tagData[tagSlug as keyof typeof tagData];
  
  if (!tag) {
    return (
      <BlogLayout>
        <Container size="lg" py="xl">
          <Title order={1}>标签不存在</Title>
          <Text>抱歉，请求的标签不存在。</Text>
        </Container>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* 标签头部 */}
          <div>
            <Group gap="md" mb="md">
              <IconTag size={32} color={tag.color} />
              <div>
                <Title order={1} size="2.5rem">
                  #{tag.name}
                </Title>
                <Badge variant="light" color={tag.color} size="lg" mt="xs">
                  {tag.posts.length} 篇文章
                </Badge>
              </div>
            </Group>
            <Text size="lg" c="dimmed">
              {tag.description}
            </Text>
          </div>
          
          {/* 文章列表 */}
          <Grid>
            {tag.posts.map((post) => (
              <Grid.Col key={post.id} span={{ base: 12, md: 6 }}>
                <PostCard post={post} />
              </Grid.Col>
            ))}
          </Grid>
          
          {/* 相关标签 */}
          <Paper withBorder p="lg">
            <Title order={3} mb="md">相关标签</Title>
            <Group gap="md">
              {Object.entries(tagData)
                .filter(([key]) => key !== tagSlug)
                .map(([key, relatedTag]) => (
                  <Badge 
                    key={key}
                    variant="outline" 
                    color={relatedTag.color}
                    size="lg"
                    style={{ cursor: 'pointer' }}
                  >
                    #{relatedTag.name}
                  </Badge>
                ))}
            </Group>
          </Paper>
        </Stack>
      </Container>
    </BlogLayout>
  );
} 