'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Stack,
  Group,
  Button,
  TextInput,
  Textarea,
  Switch,
  Tabs,
  Grid,
  Text,
  Notification,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { api } from '@/trpc/react';
import { 
  IconDeviceFloppy, 
  IconSettings, 
  IconWorld, 
  IconShare, 
  IconMail, 
  IconRocket,
  IconCheck,
  IconX
} from '@tabler/icons-react';

interface SiteConfigForm {
  siteName: string;
  siteUrl: string;
  description: string;
  logo: string;
  favicon: string;
  defaultTitle: string;
  defaultDescription: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  email: string;
  phone: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroButtonText: string;
  heroButtonLink: string;
  enableComments: boolean;
  enableNewsletter: boolean;
  enableSearch: boolean;
  googleAnalyticsId: string;
  baiduAnalyticsId: string;
}

export default function SiteConfigPage() {
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 获取网站配置
  const { data: config, isLoading, refetch } = api.siteConfig.get.useQuery();

  // 更新网站配置
  const updateConfig = api.siteConfig.upsert.useMutation({
    onSuccess: () => {
      setNotification({ type: 'success', message: '网站配置已保存成功！' });
      refetch();
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error) => {
      setNotification({ type: 'error', message: error.message || '保存失败，请稍后重试' });
      setTimeout(() => setNotification(null), 3000);
    },
  });

  const form = useForm<SiteConfigForm>({
    initialValues: {
      siteName: '',
      siteUrl: '',
      description: '',
      logo: '',
      favicon: '',
      defaultTitle: '',
      defaultDescription: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: '',
      email: '',
      phone: '',
      address: '',
      heroTitle: '',
      heroSubtitle: '',
      heroImage: '',
      heroButtonText: '',
      heroButtonLink: '',
      enableComments: true,
      enableNewsletter: false,
      enableSearch: true,
      googleAnalyticsId: '',
      baiduAnalyticsId: '',
    },
    validate: {
      siteName: (value) => (!value ? '网站名称不能为空' : null),
      siteUrl: (value) => (!value ? '网站URL不能为空' : !/^https?:\/\/.+/.test(value) ? '请输入有效的URL' : null),
      email: (value) => (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '请输入有效的邮箱地址' : null),
    },
  });

  // 加载配置数据到表单
  useEffect(() => {
    if (config) {
      form.setValues({
        siteName: config.siteName || '',
        siteUrl: config.siteUrl || '',
        description: config.description || '',
        logo: config.logo || '',
        favicon: config.favicon || '',
        defaultTitle: config.defaultTitle || '',
        defaultDescription: config.defaultDescription || '',
        facebook: config.facebook || '',
        twitter: config.twitter || '',
        linkedin: config.linkedin || '',
        instagram: config.instagram || '',
        youtube: config.youtube || '',
        email: config.email || '',
        phone: config.phone || '',
        address: config.address || '',
        heroTitle: config.heroTitle || '',
        heroSubtitle: config.heroSubtitle || '',
        heroImage: config.heroImage || '',
        heroButtonText: config.heroButtonText || '',
        heroButtonLink: config.heroButtonLink || '',
        enableComments: config.enableComments,
        enableNewsletter: config.enableNewsletter,
        enableSearch: config.enableSearch,
        googleAnalyticsId: config.googleAnalyticsId || '',
        baiduAnalyticsId: config.baiduAnalyticsId || '',
      });
    }
  }, [config]);

  const handleSubmit = (values: SiteConfigForm) => {
    // 过滤空字符串，转换为undefined
    const cleanValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (typeof value === 'string' && value === '') {
        acc[key] = undefined;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    updateConfig.mutate(cleanValues);
  };

  return (
    <Stack gap="xl">
      {/* 页面头部 */}
      <Group justify="space-between" align="center">
        <Title order={1}>网站配置</Title>
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          variant="filled"
          loading={updateConfig.isPending}
          onClick={() => form.onSubmit(handleSubmit)()}
        >
          保存配置
        </Button>
      </Group>

      {/* 通知消息 */}
      {notification && (
        <Notification
          icon={notification.type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
          color={notification.type === 'success' ? 'green' : 'red'}
          title={notification.type === 'success' ? '保存成功' : '保存失败'}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Notification>
      )}

      {/* 配置表单 */}
      <Paper withBorder p="xl" pos="relative">
        <LoadingOverlay visible={isLoading} />
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Tabs defaultValue="basic">
            <Tabs.List>
              <Tabs.Tab value="basic" leftSection={<IconSettings size={16} />}>
                基础信息
              </Tabs.Tab>
              <Tabs.Tab value="seo" leftSection={<IconWorld size={16} />}>
                SEO设置
              </Tabs.Tab>
              <Tabs.Tab value="social" leftSection={<IconShare size={16} />}>
                社交媒体
              </Tabs.Tab>
              <Tabs.Tab value="contact" leftSection={<IconMail size={16} />}>
                联系信息
              </Tabs.Tab>
              <Tabs.Tab value="homepage" leftSection={<IconRocket size={16} />}>
                首页配置
              </Tabs.Tab>
            </Tabs.List>

            {/* 基础信息 */}
            <Tabs.Panel value="basic" pt="xl">
              <Stack gap="md">
                <Text fw={500} size="lg">基础信息</Text>
                
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="网站名称"
                      placeholder="输入网站名称..."
                      required
                      {...form.getInputProps('siteName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="网站URL"
                      placeholder="https://example.com"
                      required
                      {...form.getInputProps('siteUrl')}
                    />
                  </Grid.Col>
                </Grid>

                <Textarea
                  label="网站描述"
                  placeholder="简要描述网站的用途和特色..."
                  rows={3}
                  {...form.getInputProps('description')}
                />

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Logo URL"
                      placeholder="https://example.com/logo.png"
                      {...form.getInputProps('logo')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Favicon URL"
                      placeholder="https://example.com/favicon.ico"
                      {...form.getInputProps('favicon')}
                    />
                  </Grid.Col>
                </Grid>

                <Stack gap="xs">
                  <Text fw={500}>功能开关</Text>
                  <Group gap="xl">
                    <Switch
                      label="启用评论功能"
                      {...form.getInputProps('enableComments', { type: 'checkbox' })}
                    />
                    <Switch
                      label="启用邮件订阅"
                      {...form.getInputProps('enableNewsletter', { type: 'checkbox' })}
                    />
                    <Switch
                      label="启用搜索功能"
                      {...form.getInputProps('enableSearch', { type: 'checkbox' })}
                    />
                  </Group>
                </Stack>
              </Stack>
            </Tabs.Panel>

            {/* SEO设置 */}
            <Tabs.Panel value="seo" pt="xl">
              <Stack gap="md">
                <Text fw={500} size="lg">SEO设置</Text>
                
                <TextInput
                  label="默认页面标题"
                  placeholder="网站名称 - 简短描述"
                  {...form.getInputProps('defaultTitle')}
                />

                <Textarea
                  label="默认页面描述"
                  placeholder="网站的默认描述，用于搜索引擎和社交媒体分享..."
                  rows={3}
                  {...form.getInputProps('defaultDescription')}
                />

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Google Analytics ID"
                      placeholder="G-XXXXXXXXXX"
                      {...form.getInputProps('googleAnalyticsId')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="百度统计 ID"
                      placeholder="输入百度统计ID..."
                      {...form.getInputProps('baiduAnalyticsId')}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Tabs.Panel>

            {/* 社交媒体 */}
            <Tabs.Panel value="social" pt="xl">
              <Stack gap="md">
                <Text fw={500} size="lg">社交媒体链接</Text>
                
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Facebook"
                      placeholder="https://facebook.com/yourpage"
                      {...form.getInputProps('facebook')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Twitter"
                      placeholder="https://twitter.com/youraccount"
                      {...form.getInputProps('twitter')}
                    />
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="LinkedIn"
                      placeholder="https://linkedin.com/in/yourprofile"
                      {...form.getInputProps('linkedin')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Instagram"
                      placeholder="https://instagram.com/youraccount"
                      {...form.getInputProps('instagram')}
                    />
                  </Grid.Col>
                </Grid>

                <TextInput
                  label="YouTube"
                  placeholder="https://youtube.com/c/yourchannel"
                  {...form.getInputProps('youtube')}
                />
              </Stack>
            </Tabs.Panel>

            {/* 联系信息 */}
            <Tabs.Panel value="contact" pt="xl">
              <Stack gap="md">
                <Text fw={500} size="lg">联系信息</Text>
                
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="联系邮箱"
                      placeholder="contact@example.com"
                      {...form.getInputProps('email')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="联系电话"
                      placeholder="+86 138 0000 0000"
                      {...form.getInputProps('phone')}
                    />
                  </Grid.Col>
                </Grid>

                <Textarea
                  label="联系地址"
                  placeholder="公司或机构的详细地址..."
                  rows={3}
                  {...form.getInputProps('address')}
                />
              </Stack>
            </Tabs.Panel>

            {/* 首页配置 */}
            <Tabs.Panel value="homepage" pt="xl">
              <Stack gap="md">
                <Text fw={500} size="lg">首页配置</Text>
                
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="首页主标题"
                      placeholder="现代化全栈开发"
                      {...form.getInputProps('heroTitle')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="首页副标题"
                      placeholder="分享技术、传递价值、创造未来"
                      {...form.getInputProps('heroSubtitle')}
                    />
                  </Grid.Col>
                </Grid>

                <TextInput
                  label="首页背景图"
                  placeholder="https://example.com/hero-image.jpg"
                  {...form.getInputProps('heroImage')}
                />

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="按钮文字"
                      placeholder="开始阅读"
                      {...form.getInputProps('heroButtonText')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="按钮链接"
                      placeholder="/posts"
                      {...form.getInputProps('heroButtonLink')}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </form>
      </Paper>
    </Stack>
  );
} 