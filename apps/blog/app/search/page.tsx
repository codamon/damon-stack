 import { BlogLayout } from '../../components/BlogLayout';
import { 
  Container, 
  Title, 
  Text, 
  Stack,
  Grid,
  Paper,
  Group,
  Badge,
  Button,
  TextInput,
  Select,
  Checkbox
} from '@mantine/core';
import { IconSearch, IconFilter, IconCalendar, IconUser, IconArrowRight } from '@tabler/icons-react';

// 模拟搜索结果
const mockSearchResults = [
  {
    id: '1',
    title: 'Next.js 15 与 React 19 新特性深度解析',
    excerpt: '探索Next.js 15和React 19带来的革命性变化，包括App Router、Server Components等核心特性...',
    slug: 'nextjs-15-react-19-deep-dive',
    publishedAt: '2025-01-15',
    author: 'Damon',
    category: 'Frontend',
    tags: ['Next.js', 'React', 'Frontend'],
    readingTime: '8 min read'
  },
  {
    id: '2',
    title: 'tRPC 全栈类型安全最佳实践',
    excerpt: '深入了解如何在现代全栈应用中实现端到端类型安全，提升开发效率和代码质量...',
    slug: 'trpc-fullstack-type-safety',
    publishedAt: '2025-01-10',
    author: 'Damon',
    category: 'Backend',
    tags: ['tRPC', 'TypeScript', 'API'],
    readingTime: '12 min read'
  }
];

function SearchResult({ post }: { post: typeof mockSearchResults[0] }) {
  return (
    <Paper withBorder p="lg">
      <Stack gap="md">
        <div>
          <Group gap="xs" mb="xs">
            <Badge variant="light" size="sm">{post.category}</Badge>
            <Text size="sm" c="dimmed">{post.readingTime}</Text>
          </Group>
          <Title order={3} mb="xs">
            {post.title}
          </Title>
          <Text c="dimmed" lineClamp={2}>
            {post.excerpt}
          </Text>
        </div>
        
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Group gap="xs">
              <IconUser size={16} />
              <Text size="sm">{post.author}</Text>
            </Group>
            <Group gap="xs">
              <IconCalendar size={16} />
              <Text size="sm">{post.publishedAt}</Text>
            </Group>
          </Group>
          <Button 
            variant="light" 
            size="sm"
            rightSection={<IconArrowRight size={16} />}
          >
            阅读文章
          </Button>
        </Group>
        
        <Group gap="xs">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" size="xs">
              {tag}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Paper>
  );
}

export default function SearchPage() {
  return (
    <BlogLayout>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* 搜索头部 */}
          <div>
            <Title order={1} size="2.5rem" mb="md">
              搜索文章
            </Title>
            <Text size="lg" c="dimmed">
              在技术博客中查找您感兴趣的内容
            </Text>
          </div>
          
          {/* 搜索表单 */}
          <Paper withBorder p="lg">
            <Stack gap="md">
              <TextInput
                placeholder="输入关键词搜索..."
                leftSection={<IconSearch size={20} />}
                size="lg"
              />
              
              <Group>
                <Select
                  placeholder="选择分类"
                  data={[
                    { value: 'all', label: '所有分类' },
                    { value: 'frontend', label: '前端开发' },
                    { value: 'backend', label: '后端开发' },
                    { value: 'ui-ux', label: 'UI/UX 设计' },
                    { value: 'devops', label: 'DevOps' }
                  ]}
                  leftSection={<IconFilter size={16} />}
                />
                
                <Select
                  placeholder="排序方式"
                  data={[
                    { value: 'newest', label: '最新发布' },
                    { value: 'oldest', label: '最早发布' },
                    { value: 'popular', label: '最受欢迎' },
                    { value: 'reading-time', label: '阅读时间' }
                  ]}
                />
                
                <Button leftSection={<IconSearch size={16} />}>
                  搜索
                </Button>
              </Group>
              
              {/* 高级筛选 */}
              <Group>
                <Text size="sm" fw={500}>标签筛选:</Text>
                <Checkbox.Group>
                  <Group>
                    <Checkbox value="nextjs" label="Next.js" />
                    <Checkbox value="react" label="React" />
                    <Checkbox value="typescript" label="TypeScript" />
                    <Checkbox value="trpc" label="tRPC" />
                    <Checkbox value="mantine" label="Mantine" />
                  </Group>
                </Checkbox.Group>
              </Group>
            </Stack>
          </Paper>
          
          {/* 搜索结果 */}
          <div>
            <Group justify="space-between" align="center" mb="lg">
              <Title order={2}>搜索结果</Title>
              <Text size="sm" c="dimmed">
                找到 {mockSearchResults.length} 篇相关文章
              </Text>
            </Group>
            
            <Stack gap="md">
              {mockSearchResults.map((post) => (
                <SearchResult key={post.id} post={post} />
              ))}
            </Stack>
          </div>
          
          {/* 分页 */}
          <Group justify="center" mt="xl">
            <Button variant="outline">
              加载更多结果
            </Button>
          </Group>
          
          {/* 热门搜索 */}
          <Paper withBorder p="lg">
            <Title order={3} mb="md">热门搜索</Title>
            <Group gap="md">
              <Badge variant="outline" size="lg">Next.js</Badge>
              <Badge variant="outline" size="lg">React 19</Badge>
              <Badge variant="outline" size="lg">TypeScript</Badge>
              <Badge variant="outline" size="lg">tRPC</Badge>
              <Badge variant="outline" size="lg">Mantine</Badge>
              <Badge variant="outline" size="lg">全栈开发</Badge>
            </Group>
          </Paper>
        </Stack>
      </Container>
    </BlogLayout>
  );
} 