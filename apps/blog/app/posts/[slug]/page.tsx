import { BlogLayout } from '../../../components/BlogLayout';
import { 
  Container, 
  Title, 
  Text, 
  Stack,
  Group,
  Badge,
  Divider,
  Paper
} from '@mantine/core';
import { IconCalendar, IconUser, IconClock } from '@tabler/icons-react';

interface PostPageProps {
  params: {
    slug: string;
  };
}

// 模拟文章数据，实际应该从API获取
const mockPost = {
  id: '1',
  title: 'Next.js 15 与 React 19 新特性深度解析',
  content: `
# Next.js 15 与 React 19 新特性深度解析

Next.js 15 和 React 19 带来了许多令人兴奋的新特性...

## 主要特性

### 1. React 19 新特性
- **Server Components** - 在服务器端渲染组件
- **Actions** - 简化表单处理
- **use() Hook** - 新的数据获取模式

### 2. Next.js 15 改进
- **Turbopack** - 更快的构建速度
- **App Router** - 基于文件系统的路由
- **Streaming** - 渐进式页面加载

## 代码示例

\`\`\`typescript
'use client';

export default function MyComponent() {
  return <div>Hello from React 19!</div>;
}
\`\`\`

## 总结

这些新特性将大大提升开发体验和应用性能...
  `,
  slug: 'nextjs-15-react-19-deep-dive',
  publishedAt: '2025-01-15',
  author: 'Damon',
  category: 'Frontend',
  tags: ['Next.js', 'React', 'Frontend'],
  readingTime: '8 min read'
};

export default function PostPage({ params }: PostPageProps) {
  // 在实际应用中，这里应该根据 slug 从 API 获取文章数据
  const post = mockPost;

  return (
    <BlogLayout>
      <Container size="md" py="xl">
        <Stack gap="xl">
          {/* 文章头部 */}
          <div>
            <Group gap="xs" mb="md">
              <Badge variant="light" size="lg">{post.category}</Badge>
              <Text size="sm" c="dimmed">{post.readingTime}</Text>
            </Group>
            
            <Title order={1} size="2.5rem" mb="lg">
              {post.title}
            </Title>
            
            <Group gap="lg" mb="lg">
              <Group gap="xs">
                <IconUser size={16} />
                <Text size="sm" fw={500}>{post.author}</Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm">{post.publishedAt}</Text>
              </Group>
              <Group gap="xs">
                <IconClock size={16} />
                <Text size="sm">{post.readingTime}</Text>
              </Group>
            </Group>
            
            <Group gap="xs" mb="xl">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </Group>
            
            <Divider mb="xl" />
          </div>
          
          {/* 文章内容 */}
          <Paper withBorder p="xl">
            <div style={{ lineHeight: 1.6 }}>
              <Text component="div" style={{ whiteSpace: 'pre-line' }}>
                {post.content}
              </Text>
            </div>
          </Paper>
          
          {/* 文章底部 */}
          <Divider />
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              发布于 {post.publishedAt}
            </Text>
            <Group gap="xs">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" size="sm">
                  #{tag}
                </Badge>
              ))}
            </Group>
          </Group>
        </Stack>
      </Container>
    </BlogLayout>
  );
} 