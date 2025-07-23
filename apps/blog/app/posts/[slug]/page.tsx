'use client';

import { BlogLayout } from '../../../components/BlogLayout';
import { 
  Container, 
  Title, 
  Text, 
  Stack,
  Group,
  Badge,
  Divider,
  Paper,
  Grid,
  Card,
  Anchor,
  ActionIcon,
  Box,
  Skeleton,
  Button,
  Alert
} from '@mantine/core';
import { 
  IconCalendar, 
  IconUser, 
  IconClock, 
  IconEye,
  IconArrowLeft,
  IconShare,
  IconHeart,
  IconBookmark,
  IconBrandTwitter,
  IconBrandFacebook,
  IconLink,
  IconAlertCircle
} from '@tabler/icons-react';
import Link from 'next/link';
import { api } from '../../../trpc/react';
import { notFound } from 'next/navigation';
import { useState } from 'react';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  // 获取文章详情
  const { 
    data: post, 
    isLoading: postLoading,
    error: postError
  } = api.post.getBySlug.useQuery({ slug: params.slug });

  // 获取相关文章
  const { 
    data: relatedPosts, 
    isLoading: relatedLoading 
  } = api.post.getRelated.useQuery(
    { postId: post?.id || '', limit: 4 },
    { enabled: !!post?.id }
  );

  // 分享功能
  const sharePost = async (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error('复制失败:', err);
        }
        break;
    }
  };

  // 渲染文章内容
  const renderContent = (content: string) => {
    // 简单的Markdown样式处理
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <Title key={index} order={1} size="h2" className="neon-text" mt="xl" mb="md">
            {line.substring(2)}
          </Title>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <Title key={index} order={2} size="h3" className="neon-text" mt="lg" mb="sm">
            {line.substring(3)}
          </Title>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <Title key={index} order={3} size="h4" className="neon-text" mt="md" mb="xs">
            {line.substring(4)}
          </Title>
        );
      }
      if (line.startsWith('```')) {
        return null; // 代码块需要特殊处理，这里简化
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <Text key={index} mb="sm" style={{ lineHeight: 1.7 }}>
          {line}
        </Text>
      );
    });
  };

  // 渲染相关文章卡片
  const renderRelatedPostCard = (relatedPost: any) => (
    <Card key={relatedPost.id} withBorder p="md" className="hover-glow">
      <Stack gap="sm">
        {relatedPost.category && (
          <Badge variant="outline" size="xs" style={{ alignSelf: 'flex-start' }}>
            {relatedPost.category.name}
          </Badge>
        )}
        
        <Title order={4} size="h6" lineClamp={2}>
          <Anchor 
            component={Link} 
            href={`/posts/${relatedPost.slug}`}
            className="hover-glow"
            style={{ textDecoration: 'none', color: 'var(--text-primary)' }}
          >
            {relatedPost.title}
          </Anchor>
        </Title>
        
        <Text size="xs" c="var(--text-muted)" lineClamp={2}>
          {relatedPost.excerpt || relatedPost.content.substring(0, 100) + '...'}
        </Text>
        
        <Group justify="space-between" mt="xs">
          <Group gap="xs">
            <IconEye size={12} />
            <Text size="xs" c="var(--text-muted)">
              {relatedPost.viewCount || 0}
            </Text>
          </Group>
          <Text size="xs" c="var(--text-muted)">
            {relatedPost.publishedAt ? new Date(relatedPost.publishedAt).toLocaleDateString('zh-CN') : ''}
          </Text>
        </Group>
      </Stack>
    </Card>
  );

  if (postError) {
    return (
      <BlogLayout>
        <Container size="md" py="xl">
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="文章加载失败" 
            color="red"
            variant="outline"
          >
            <Text mb="md">{postError.message}</Text>
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
      <Container size="lg" py="xl">
        {postLoading ? (
          <Stack gap="xl">
            <Button component={Link} href="/" variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              返回首页
            </Button>
            <Skeleton height={40} />
            <Group gap="md">
              <Skeleton height={20} width={80} />
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={60} />
            </Group>
            <Skeleton height={300} />
            <Skeleton height={200} />
          </Stack>
        ) : post ? (
          <Grid gutter="xl">
            {/* 主文章内容 */}
            <Grid.Col span={{ base: 12, lg: 8 }}>
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

                {/* 文章头部信息 */}
                <Box>
                  <Group gap="xs" mb="md">
                    {post.category && (
                      <Badge 
                        variant="outline" 
                        size="lg"
                        style={{ 
                          borderColor: 'var(--neon-cyan)',
                          color: 'var(--neon-cyan)'
                        }}
                      >
                        {post.category.name}
                      </Badge>
                    )}
                    {post.featured && (
                      <Badge variant="filled" color="red" size="lg">
                        精选文章
                      </Badge>
                    )}
                  </Group>
                  
                  <Title order={1} size="2.5rem" mb="lg" className="tech-title">
                    {post.title}
                  </Title>
                  
                  <Group gap="lg" mb="lg" wrap="wrap">
                    <Group gap="xs">
                      <IconUser size={16} className="neon-text" />
                      <Text size="sm" fw={500}>{post.author?.name || '未知作者'}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconCalendar size={16} className="neon-text" />
                      <Text size="sm">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('zh-CN') : ''}
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <IconEye size={16} className="neon-text" />
                      <Text size="sm">{post.viewCount || 0} 次阅读</Text>
                    </Group>
                    <Group gap="xs">
                      <IconClock size={16} className="neon-text" />
                      <Text size="sm">约 {Math.ceil((post.content?.length || 0) / 400)} 分钟阅读</Text>
                    </Group>
                  </Group>
                  
                  {/* 摘要 */}
                  {post.excerpt && (
                    <Paper withBorder p="lg" mb="xl" style={{ backgroundColor: 'rgba(22, 244, 208, 0.05)' }}>
                      <Text size="lg" style={{ lineHeight: 1.6 }} className="neon-text">
                        📝 {post.excerpt}
                      </Text>
                    </Paper>
                  )}
                  
                  {/* 标签 */}
                  {post.tags && post.tags.length > 0 && (
                    <Group gap="xs" mb="xl">
                      {post.tags.map((tag: any) => (
                        <Badge 
                          key={tag.id}
                          variant="outline" 
                          size="sm"
                          style={{ 
                            borderColor: 'var(--neon-cyan)',
                            color: 'var(--neon-cyan)'
                          }}
                        >
                          #{tag.name}
                        </Badge>
                      ))}
                    </Group>
                  )}
                  
                  <Divider color="var(--neon-cyan)" />
                </Box>
                
                {/* 文章内容 */}
                <Paper withBorder p="xl" className="code-border">
                  <Box style={{ lineHeight: 1.6 }}>
                    {renderContent(post.content || '')}
                  </Box>
                </Paper>
                
                {/* 文章底部操作 */}
                <Divider color="var(--neon-cyan)" />
                <Group justify="space-between" align="center">
                  <Group gap="md">
                    <Text size="sm" c="var(--text-muted)">
                      发布于 {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('zh-CN') : ''}
                    </Text>
                    <Text size="sm" c="var(--text-muted)">•</Text>
                    <Text size="sm" c="var(--text-muted)">
                      {post.viewCount || 0} 次阅读
                    </Text>
                  </Group>
                  
                  <Group gap="xs">
                    <ActionIcon variant="subtle" className="hover-glow">
                      <IconHeart size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" className="hover-glow">
                      <IconBookmark size={16} />
                    </ActionIcon>
                  </Group>
                </Group>

                {/* 分享按钮 */}
                <Paper withBorder p="lg" className="code-border">
                  <Group justify="space-between" align="center">
                    <Text fw={500} className="neon-text">分享这篇文章</Text>
                    <Group gap="md">
                      <ActionIcon
                        variant="outline"
                        size="lg"
                        className="hover-glow"
                        onClick={() => sharePost('twitter')}
                      >
                        <IconBrandTwitter size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="outline"
                        size="lg"
                        className="hover-glow"
                        onClick={() => sharePost('facebook')}
                      >
                        <IconBrandFacebook size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="outline"
                        size="lg"
                        className="hover-glow"
                        onClick={() => sharePost('copy')}
                        color={copySuccess ? 'green' : undefined}
                      >
                        <IconLink size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  {copySuccess && (
                    <Text size="xs" c="green" ta="right" mt="xs">
                      链接已复制到剪贴板！
                    </Text>
                  )}
                </Paper>
              </Stack>
            </Grid.Col>

            {/* 侧边栏 */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap="xl">
                {/* 作者信息 */}
                <Paper withBorder p="lg" className="code-border">
                  <Title order={3} size="h5" className="neon-text" mb="md">
                    👨‍💻 作者信息
                  </Title>
                  <Divider color="var(--neon-cyan)" mb="md" />
                  <Stack gap="sm">
                    <Text fw={500}>{post.author?.name || '未知作者'}</Text>
                    <Text size="sm" c="var(--text-muted)">
                      全栈开发工程师，专注于前端技术和用户体验
                    </Text>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" size="sm">
                        <IconBrandTwitter size={14} />
                      </ActionIcon>
                      <Text size="xs" c="var(--text-muted)">@{post.author?.name || 'author'}</Text>
                    </Group>
                  </Stack>
                </Paper>

                {/* 文章目录 */}
                <Paper withBorder p="lg" className="code-border">
                  <Title order={3} size="h5" className="neon-text" mb="md">
                    📋 目录
                  </Title>
                  <Divider color="var(--neon-cyan)" mb="md" />
                  <Stack gap="xs">
                    <Text size="sm" c="var(--text-muted)">
                      目录功能开发中...
                    </Text>
                  </Stack>
                </Paper>

                {/* 相关文章 */}
                {relatedPosts && relatedPosts.length > 0 && (
                  <Paper withBorder p="lg" className="code-border">
                    <Title order={3} size="h5" className="neon-text" mb="md">
                      🔗 相关文章
                    </Title>
                    <Divider color="var(--neon-cyan)" mb="md" />
                    
                    {relatedLoading ? (
                      <Stack gap="md">
                        {Array(4).fill(0).map((_, index) => (
                          <Card key={index} withBorder p="md">
                            <Stack gap="xs">
                              <Skeleton height={16} />
                              <Skeleton height={12} width="80%" />
                              <Skeleton height={10} width="60%" />
                            </Stack>
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <Stack gap="md">
                        {relatedPosts.slice(0, 4).map(renderRelatedPostCard)}
                      </Stack>
                    )}
                  </Paper>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        ) : null}
      </Container>
    </BlogLayout>
  );
} 