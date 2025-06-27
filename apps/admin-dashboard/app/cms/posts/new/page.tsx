'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Stack, 
  Group, 
  Button, 
  TextInput, 
  Textarea, 
  Select, 
  Switch, 
  Paper,
  Text,
  Grid,
  Alert,
  Divider,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconDeviceFloppy, IconSend, IconHome, IconFolder, IconNews, IconPlus } from '@tabler/icons-react';
import { RichTextEditor, PageHeader, type BreadcrumbItem } from '@damon-stack/ui';
import { api } from '../../../../trpc/react';
import { useSession } from 'next-auth/react';
import type { PostStatus, CreatePostInput } from '@damon-stack/feature-cms';

// 状态选项
const statusOptions = [
  { value: 'DRAFT', label: '草稿' },
  { value: 'PUBLISHED', label: '已发布' },
  { value: 'SCHEDULED', label: '定时发布' },
  { value: 'ARCHIVED', label: '已归档' },
];

// 生成 slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewPostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 面包屑导航配置
  const breadcrumbItems: BreadcrumbItem[] = [
    { title: '首页', href: '/dashboard', icon: IconHome },
    { title: 'CMS', href: '/cms', icon: IconFolder },
    { title: '文章管理', href: '/cms/posts', icon: IconNews },
    { title: '新建文章' },
  ];

  // 获取分类列表
  const { data: categoriesData } = api.category.list.useQuery();

  // 创建文章
  const createMutation = api.post.create.useMutation({
    onSuccess: (data) => {
      notifications.show({
        title: '成功',
        message: '文章已创建',
        color: 'green',
      });
      router.push(`/cms/posts/${data.id}/edit`);
    },
    onError: (error) => {
      notifications.show({
        title: '错误',
        message: error.message,
        color: 'red',
      });
      setIsSubmitting(false);
    },
  });

  // 表单配置
  const form = useForm<{
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    status: PostStatus;
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    featured: boolean;
    publishedAt: Date | null;
    scheduledAt: Date | null;
    categoryId: string;
  }>({
    initialValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      coverImage: '',
      status: 'DRAFT',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      featured: false,
      publishedAt: null,
      scheduledAt: null,
      categoryId: '',
    },
    validate: {
      title: (value) => value.length < 1 ? '文章标题不能为空' : null,
      content: (value) => value.length < 1 ? '文章内容不能为空' : null,
      slug: (value) => {
        if (value.length < 1) return 'URL标识符不能为空';
        if (!/^[a-z0-9-]+$/.test(value)) return 'URL标识符只能包含小写字母、数字和连字符';
        return null;
      },
    },
  });

  // 分类选项
  const categoryOptions = React.useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data.map((cat: any) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categoriesData]);

  // 处理标题变化，自动生成 slug
  const handleTitleChange = (title: string) => {
    form.setFieldValue('title', title);
    if (!form.values.slug || form.values.slug === generateSlug(form.values.title)) {
      form.setFieldValue('slug', generateSlug(title));
    }
  };

  // 提交表单
  const handleSubmit = async (values: typeof form.values, status?: PostStatus) => {
    if (!session?.user?.id) {
      notifications.show({
        title: '错误',
        message: '请先登录',
        color: 'red',
      });
      return;
    }

    setIsSubmitting(true);

    const submitData: CreatePostInput = {
      title: values.title,
      slug: values.slug,
      content: values.content,
      excerpt: values.excerpt || undefined,
      coverImage: values.coverImage || undefined,
      status: status || values.status,
      metaTitle: values.metaTitle || undefined,
      metaDescription: values.metaDescription || undefined,
      keywords: values.keywords || undefined,
      featured: values.featured,
      publishedAt: status === 'PUBLISHED' ? new Date() : values.publishedAt || undefined,
      scheduledAt: values.scheduledAt || undefined,
      authorId: session.user.id,
      categoryId: values.categoryId || undefined,
    };

    createMutation.mutate(submitData);
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* 页面头部 */}
        <PageHeader
          title="新建文章"
          description="创建一篇新的博客文章"
          icon={<IconPlus size={24} />}
          breadcrumbs={breadcrumbItems}
          action={{
            label: '返回',
            icon: <IconArrowLeft size={16} />,
            onClick: () => router.back(),
            variant: 'default'
          }}
        />

        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Grid>
            {/* 主要内容区域 */}
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Stack gap="xl">
                {/* 基础信息 */}
                <Paper shadow="sm" p="xl">
                  <Stack gap="md">
                    <Text fw={500} size="lg">基础信息</Text>
                    
                    <TextInput
                      label="文章标题"
                      placeholder="输入文章标题..."
                      required
                      {...form.getInputProps('title')}
                      onChange={(event) => handleTitleChange(event.currentTarget.value)}
                    />

                    <TextInput
                      label="URL标识符"
                      placeholder="url-friendly-slug"
                      description="用于生成文章的访问链接，只能包含小写字母、数字和连字符"
                      required
                      {...form.getInputProps('slug')}
                    />

                    <Textarea
                      label="文章摘要"
                      placeholder="简要描述文章内容..."
                      description="用于文章列表和搜索引擎优化"
                      rows={3}
                      {...form.getInputProps('excerpt')}
                    />

                    <TextInput
                      label="封面图片"
                      placeholder="https://example.com/image.jpg"
                      description="文章封面图片的URL地址"
                      {...form.getInputProps('coverImage')}
                    />
                  </Stack>
                </Paper>

                {/* 文章内容 */}
                <Paper shadow="sm" p="xl">
                  <Stack gap="md">
                    <Text fw={500} size="lg">文章内容</Text>
                    
                    <RichTextEditor
                      value={form.values.content}
                      onChange={(html) => form.setFieldValue('content', html)}
                      placeholder="开始编写您的文章内容..."
                      minHeight={400}
                    />
                    
                    {form.errors.content && (
                      <Text size="sm" c="red">
                        {form.errors.content}
                      </Text>
                    )}
                  </Stack>
                </Paper>

                {/* SEO 设置 */}
                <Paper shadow="sm" p="xl">
                  <Stack gap="md">
                    <Text fw={500} size="lg">SEO 设置</Text>
                    
                    <TextInput
                      label="SEO 标题"
                      placeholder="搜索引擎优化标题..."
                      description="如果留空，将使用文章标题"
                      {...form.getInputProps('metaTitle')}
                    />

                    <Textarea
                      label="SEO 描述"
                      placeholder="搜索引擎优化描述..."
                      description="建议长度 120-160 字符"
                      rows={3}
                      {...form.getInputProps('metaDescription')}
                    />

                    <TextInput
                      label="关键词"
                      placeholder="关键词1, 关键词2, 关键词3"
                      description="多个关键词用逗号分隔"
                      {...form.getInputProps('keywords')}
                    />
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>

            {/* 侧边栏 */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap="xl">
                {/* 发布设置 */}
                <Paper shadow="sm" p="xl">
                  <Stack gap="md">
                    <Text fw={500} size="lg">发布设置</Text>
                    
                    <Select
                      label="发布状态"
                      data={statusOptions}
                      {...form.getInputProps('status')}
                    />

                    <Select
                      label="文章分类"
                      placeholder="选择分类..."
                      data={[
                        { value: '', label: '无分类' },
                        ...categoryOptions
                      ]}
                      {...form.getInputProps('categoryId')}
                      clearable
                    />

                    <Switch
                      label="精选文章"
                      description="是否在首页或特殊位置展示"
                      {...form.getInputProps('featured', { type: 'checkbox' })}
                    />

                    {form.values.status === 'PUBLISHED' && (
                      <DateTimePicker
                        label="发布时间"
                        placeholder="选择发布时间..."
                        description="留空则使用当前时间"
                        {...form.getInputProps('publishedAt')}
                      />
                    )}

                    {form.values.status === 'SCHEDULED' && (
                      <DateTimePicker
                        label="定时发布"
                        placeholder="选择发布时间..."
                        required
                        {...form.getInputProps('scheduledAt')}
                      />
                    )}
                  </Stack>
                </Paper>

                {/* 操作按钮 */}
                <Paper shadow="sm" p="xl">
                  <Stack gap="md">
                    <Text fw={500} size="lg">操作</Text>
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="default"
                      loading={isSubmitting && form.values.status === 'DRAFT'}
                      leftSection={<IconDeviceFloppy size={16} />}
                      onClick={() => {
                        form.setFieldValue('status', 'DRAFT');
                        form.onSubmit((values) => handleSubmit(values, 'DRAFT'))();
                      }}
                    >
                      保存为草稿
                    </Button>

                    <Button
                      fullWidth
                      color="green"
                      loading={isSubmitting && form.values.status === 'PUBLISHED'}
                      leftSection={<IconSend size={16} />}
                      onClick={() => {
                        if (form.validate().hasErrors) {
                          notifications.show({
                            title: '表单验证失败',
                            message: '请检查表单中的错误',
                            color: 'red',
                          });
                          return;
                        }
                        handleSubmit(form.values, 'PUBLISHED');
                      }}
                    >
                      发布文章
                    </Button>
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </form>
      </Stack>
    </Container>
  );
} 