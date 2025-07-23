'use client';

import React from 'react';
import { 
  Stack, 
  Group, 
  Button, 
  Title,
  Text,
  Paper,
  Image,
  Badge,
  Center,
  Loader,
  Alert,
  Box
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconEdit } from '@tabler/icons-react';
import { api } from '@/trpc/react';

// 状态映射
const statusMap = {
  DRAFT: { label: '草稿', color: 'gray' },
  PUBLISHED: { label: '已发布', color: 'green' },
  ARCHIVED: { label: '已归档', color: 'orange' },
  SCHEDULED: { label: '定时发布', color: 'blue' },
} as const;

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function PreviewPostPage({ params }: Props) {
  const [postId, setPostId] = React.useState<string>('');
  const router = useRouter();

  // 解析异步参数
  React.useEffect(() => {
    params.then((resolvedParams) => {
      setPostId(resolvedParams.id);
    });
  }, [params]);

  // 获取文章数据
  const { 
    data: post, 
    isLoading, 
    error 
  } = api.post.getById.useQuery({ id: postId }, {
    enabled: !!postId,
  });

  if (error) {
    return (
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={1}>文章预览</Title>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => router.back()}
            variant="default"
          >
            返回
          </Button>
        </Group>
        <Alert color="red" title="加载失败">
          {error.message}
        </Alert>
      </Stack>
    );
  }

  if (isLoading) {
    return (
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={1}>文章预览</Title>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => router.back()}
            variant="default"
          >
            返回
          </Button>
        </Group>
        <Center>
          <Loader size="lg" />
        </Center>
      </Stack>
    );
  }

  if (!post) {
    return (
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={1}>文章预览</Title>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => router.back()}
            variant="default"
          >
            返回
          </Button>
        </Group>
        <Alert color="red" title="文章不存在">
          请检查文章ID是否正确
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      {/* 页面标题 */}
      <Group justify="space-between" align="center">
        <Title order={1}>文章预览</Title>
        <Group gap="sm">
          <Button
            leftSection={<IconEdit size={16} />}
            onClick={() => router.push(`/cms/posts/${postId}/edit`)}
            variant="light"
          >
            编辑文章
          </Button>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => router.back()}
            variant="default"
          >
            返回
          </Button>
        </Group>
      </Group>

      {/* 预览警告 */}
      <Alert color="blue" title="预览模式">
        这是文章预览模式，显示的内容可能与最终发布版本不同。当前状态：
        <Badge color={statusMap[post.status].color} variant="light" size="sm" ml="xs">
          {statusMap[post.status].label}
        </Badge>
      </Alert>

      {/* 文章内容预览 */}
      <Paper p="xl" withBorder>
        <Stack gap="xl">
          {/* 文章头部 */}
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Title order={1} size="h1" style={{ lineHeight: 1.2 }}>
                {post.title}
              </Title>
              <Badge color={statusMap[post.status].color} variant="light">
                {statusMap[post.status].label}
              </Badge>
            </Group>

            <Group gap="md" c="dimmed">
              <Text size="sm">
                作者：{post.author.name || post.author.email}
              </Text>
              <Text size="sm">
                发布时间：{post.publishedAt 
                  ? new Date(post.publishedAt).toLocaleDateString('zh-CN')
                  : '未发布'
                }
              </Text>
              {post.category && (
                <Text size="sm">
                  分类：{post.category.name}
                </Text>
              )}
            </Group>

            {post.excerpt && (
              <Text size="lg" c="dimmed" style={{ fontStyle: 'italic' }}>
                {post.excerpt}
              </Text>
            )}
          </Stack>

          {/* 封面图片 */}
          {post.coverImage && (
            <Box>
              <Image
                src={post.coverImage}
                alt={post.title}
                radius="md"
                style={{ maxHeight: 400, objectFit: 'cover' }}
              />
            </Box>
          )}

          {/* 文章正文 */}
          <Box>
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                lineHeight: 1.6,
                fontSize: '16px',
              }}
            />
          </Box>

          {/* 文章元信息 */}
          <Paper p="md" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
            <Group justify="space-between">
              <Group gap="xl">
                <div>
                  <Text size="xs" c="dimmed">创建时间</Text>
                  <Text size="sm">
                    {new Date(post.createdAt).toLocaleString('zh-CN')}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">更新时间</Text>
                  <Text size="sm">
                    {new Date(post.updatedAt).toLocaleString('zh-CN')}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">浏览次数</Text>
                  <Text size="sm">
                    {post.viewCount.toLocaleString()}
                  </Text>
                </div>
                {post.readingTime && (
                  <div>
                    <Text size="xs" c="dimmed">阅读时间</Text>
                    <Text size="sm">
                      约 {post.readingTime} 分钟
                    </Text>
                  </div>
                )}
              </Group>
            </Group>
          </Paper>
        </Stack>
      </Paper>
    </Stack>
  );
} 