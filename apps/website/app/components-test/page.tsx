'use client';

import React, { useState } from 'react';
import {
  Container,
  Stack,
  Title,
  Text,
  Divider,
  Badge,
  Group,
  Button,
  Paper,
  Box,
} from '@mantine/core';
import {
  WebsiteHeader,
  WebsiteFooter,
  HeroSection,
  FeatureCard,
  FeatureGrid,
  TestimonialCard,
  TestimonialGrid,
  BlogCard,
  BlogGrid,
  ContactForm,
  NewsletterSignup,
  type NavigationItem,
  type FeatureCardProps,
  type TestimonialCardProps,
  type BlogCardProps,
  type ContactFormData,
  type NewsletterSignupData,
} from '@damon-stack/ui';
import {
  IconBolt,
  IconShield,
  IconCode,
  IconRocket,
  IconStar,
  IconHeart,
  IconUsers,
  IconTrendingUp,
} from '@tabler/icons-react';

// 模拟数据
const navigationItems: NavigationItem[] = [
  { label: '首页', href: '/' },
  { label: '产品', href: '/products' },
  { label: '解决方案', href: '/solutions' },
  {
    label: '资源',
    href: '/resources',
    links: [
      { label: '文档', href: '/docs', description: '查看技术文档' },
      { label: '博客', href: '/blog', description: '最新技术文章' },
      { label: '示例', href: '/examples', description: '代码示例' },
    ],
  },
  { label: '关于我们', href: '/about' },
];

const featuresData: FeatureCardProps[] = [
  {
    icon: <IconBolt size={24} />,
    title: '快速部署',
    description: '5分钟内完成部署，开箱即用的现代化解决方案。',
    badge: { label: '推荐', color: 'blue' },
    action: { label: '了解更多', href: '/features/deployment' },
  },
  {
    icon: <IconShield size={24} />,
    title: '安全可靠',
    description: '企业级安全保障，符合国际安全标准。',
    badge: { label: '安全', color: 'green' },
    action: { label: '查看详情', href: '/features/security' },
  },
  {
    icon: <IconCode size={24} />,
    title: '开源免费',
    description: '完全开源，免费使用，社区驱动的持续发展。',
    badge: { label: '免费', color: 'orange' },
    action: { label: '访问代码', href: 'https://github.com', external: true },
  },
];

const testimonialsData: TestimonialCardProps[] = [
  {
    content: 'Damon Stack 真的改变了我们的开发流程，现在我们的效率提升了300%！',
    author: {
      name: '张伟',
      role: '技术总监',
      company: '科技有限公司',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    rating: 5,
    date: '2024-01-15',
    badge: { label: 'VIP客户', color: 'gold' },
  },
  {
    content: '这是我用过最好的全栈解决方案，文档清晰，社区活跃。',
    author: {
      name: '李小梅',
      role: '前端工程师',
      company: '创新科技',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e2?w=150',
    },
    rating: 5,
    date: '2024-01-20',
  },
  {
    content: '从技术选型到上线部署，整个过程非常顺畅。强烈推荐！',
    author: {
      name: '王强',
      role: '创始人',
      company: '新兴科技',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    rating: 5,
    date: '2024-01-25',
    badge: { label: '创始人推荐', color: 'purple' },
  },
];

const blogPostsData: BlogCardProps[] = [
  {
    title: 'Next.js 15 + Mantine 8 完美集成指南',
    excerpt: '详细介绍如何将 Next.js 15 与 Mantine 8 完美结合，构建现代化的 Web 应用。',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    author: {
      name: 'Damon',
      role: '架构师',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    },
    publishedAt: '2024-01-28',
    readingTime: 8,
    tags: ['Next.js', 'Mantine', 'React'],
    stats: { views: 1234, likes: 89, comments: 23 },
    featured: true,
  },
  {
    title: 'tRPC + Prisma 数据库最佳实践',
    excerpt: '分享在生产环境中使用 tRPC 和 Prisma 的最佳实践和性能优化技巧。',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
    author: {
      name: 'Alex Chen',
      role: '后端工程师',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
    publishedAt: '2024-01-25',
    readingTime: 12,
    tags: ['tRPC', 'Prisma', 'Database'],
    stats: { views: 987, likes: 67, comments: 15 },
  },
  {
    title: 'Monorepo 架构设计与实践经验',
    excerpt: '深入探讨 Monorepo 架构的设计原则，以及在大型项目中的实践经验。',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    author: {
      name: 'Sarah Wang',
      role: '技术顾问',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e2?w=100',
    },
    publishedAt: '2024-01-22',
    readingTime: 15,
    tags: ['Monorepo', 'Architecture', 'DevOps'],
    stats: { views: 756, likes: 45, comments: 8 },
  },
];

export default function ComponentsTestPage() {
  const [contactFormData, setContactFormData] = useState<ContactFormData | null>(null);
  const [newsletterData, setNewsletterData] = useState<NewsletterSignupData | null>(null);

  const handleContactSubmit = async (data: ContactFormData) => {
    console.log('联系表单提交:', data);
    setContactFormData(data);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleNewsletterSubmit = async (data: NewsletterSignupData) => {
    console.log('新闻订阅提交:', data);
    setNewsletterData(data);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <Box>
      {/* 网站头部 */}
      <WebsiteHeader
        navigation={navigationItems}
        showThemeToggle={true}
        logo="Damon Stack"
      />

      <Container size="xl" py="xl" mt={60}>
        <Stack gap="xl">
          {/* 页面标题 */}
          <Paper withBorder p="xl" radius="lg">
            <Group justify="center" mb="lg">
              <Badge variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="lg">
                🧪 组件测试页面
              </Badge>
            </Group>
            <Title order={1} ta="center" mb="md">
              Damon Stack UI 组件展示
            </Title>
            <Text ta="center" c="dimmed" size="lg">
              这里展示了所有新创建的前端网站专用组件，包括布局、内容展示和交互组件。
            </Text>
          </Paper>

          {/* Hero 区域 */}
          <Paper withBorder p="xl" radius="lg">
            <Title order={2} mb="lg">
              🎯 Hero 区域组件
            </Title>
            <HeroSection
              title="欢迎使用 Damon Stack"
              subtitle="现代化全栈开发解决方案，让您的开发效率提升3倍！"
              actions={[
                { label: '开始使用', href: '/get-started', variant: 'gradient' },
                { label: '查看文档', href: '/docs', variant: 'outline' },
              ]}
              features={[
                { icon: <IconRocket size={20} />, label: '快速启动' },
                { icon: <IconShield size={20} />, label: '安全可靠' },
                { icon: <IconCode size={20} />, label: '开源免费' },
              ]}
              stats={[
                { value: '10K+', label: '开发者' },
                { value: '99.9%', label: '可用性', suffix: '%' },
                { value: '24/7', label: '支持' },
              ]}
              layout="centered"
            />
          </Paper>

          {/* 特性卡片 */}
          <Paper withBorder p="xl" radius="lg">
            <Title order={2} mb="lg">
              ⭐ 特性展示组件
            </Title>
            <FeatureGrid features={featuresData} />
          </Paper>

          {/* 客户证言 */}
          <Paper withBorder p="xl" radius="lg">
            <Title order={2} mb="lg">
              💬 客户证言组件
            </Title>
            <TestimonialGrid testimonials={testimonialsData} />
          </Paper>

          {/* 博客文章 */}
          <Paper withBorder p="xl" radius="lg">
            <Title order={2} mb="lg">
              📝 博客卡片组件
            </Title>
            <BlogGrid posts={blogPostsData} />
          </Paper>

          {/* 联系表单 */}
          <Paper withBorder p="xl" radius="lg">
            <Title order={2} mb="lg">
              📞 联系表单组件
            </Title>
            <ContactForm
              onSubmit={handleContactSubmit}
              contactInfo={{
                email: 'contact@damonstack.com',
                phone: '+86 400-123-4567',
                address: '北京市朝阳区创业大街123号',
                workingHours: '周一至周五 9:00-18:00',
              }}
            />
            {contactFormData && (
              <Paper withBorder p="md" mt="md" bg="green.0">
                <Text fw={500} c="green">✅ 表单提交成功！</Text>
                <Text size="sm" c="dimmed">
                  收到来自 {contactFormData.name} 的消息：{contactFormData.subject}
                </Text>
              </Paper>
            )}
          </Paper>

          {/* 新闻订阅 */}
          <Paper withBorder p="xl" radius="lg">
            <Title order={2} mb="lg">
              📧 新闻订阅组件
            </Title>
            <Stack gap="xl">
              <NewsletterSignup
                layout="featured"
                onSubmit={handleNewsletterSubmit}
                showNameField={true}
                showPreferences={true}
              />
              {newsletterData && (
                <Paper withBorder p="md" bg="blue.0">
                  <Text fw={500} c="blue">✅ 订阅成功！</Text>
                  <Text size="sm" c="dimmed">
                    感谢 {newsletterData.name || newsletterData.email} 的订阅！
                  </Text>
                </Paper>
              )}
            </Stack>
          </Paper>

          {/* 组件变体展示 */}
          <Paper withBorder p="xl" radius="lg">
            <Title order={2} mb="lg">
              🎨 组件变体展示
            </Title>
            <Stack gap="xl">
              {/* 不同布局的特性卡片 */}
              <Box>
                <Text fw={600} mb="md">特性卡片 - 水平布局</Text>
                <FeatureCard
                  {...featuresData[0]}
                  layout="horizontal"
                  image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200"
                />
              </Box>

              {/* 不同布局的证言卡片 */}
              <Box>
                <Text fw={600} mb="md">证言卡片 - 最小化布局</Text>
                <TestimonialCard {...testimonialsData[0]} layout="minimal" />
              </Box>

              {/* 不同布局的博客卡片 */}
              <Box>
                <Text fw={600} mb="md">博客卡片 - 水平布局</Text>
                <BlogCard {...blogPostsData[0]} layout="horizontal" />
              </Box>

              {/* 内联新闻订阅 */}
              <Box>
                <Text fw={600} mb="md">新闻订阅 - 内联布局</Text>
                <NewsletterSignup layout="inline" onSubmit={handleNewsletterSubmit} />
              </Box>
            </Stack>
          </Paper>

          {/* 返回首页 */}
          <Paper withBorder p="xl" radius="lg" ta="center">
            <Stack gap="md" align="center">
              <Title order={3}>🎉 组件展示完成</Title>
              <Text c="dimmed">
                以上展示了所有新创建的UI组件及其变体。
                这些组件都支持主题切换、响应式设计和完整的TypeScript类型定义。
              </Text>
              <Button 
                component="a" 
                href="/" 
                variant="gradient" 
                gradient={{ from: 'blue', to: 'cyan' }}
                size="lg"
                leftSection={<IconHeart size={20} />}
              >
                返回首页
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      {/* 网站页脚 */}
      <WebsiteFooter
        description="Damon Stack 是一个现代化的全栈开发解决方案，基于 Next.js 15 + Mantine 8 构建。"
        contactInfo={{
          email: 'contact@damonstack.com',
          phone: '+86 400-123-4567',
          address: '北京市朝阳区创业大街123号',
        }}
      />
    </Box>
  );
} 