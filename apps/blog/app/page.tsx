import { BlogLayout } from '../components/BlogLayout';
import { Container, Title, Text, Stack } from '@mantine/core';

export default function BlogHomePage() {
  return (
    <BlogLayout>
      <Container size="lg" py="xl">
        <Stack gap="xl" align="center" ta="center">
          <Title size="3rem" fw={900} className="tech-title">
            &gt; DAMON_STACK.BLOG_
          </Title>
          <Text size="xl" c="var(--text-secondary)">
            🔥 技术感深色主题设计完成！
          </Text>
          <Text size="lg" className="neon-text">
            探索 Next.js、React、TypeScript、AI 等前沿技术
          </Text>
        </Stack>
      </Container>
    </BlogLayout>
  );
} 