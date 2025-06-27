'use client';

import React, { useState } from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  Box,
  TextInput,
  Button,
  Badge,
  ThemeIcon,
  Checkbox,
  Switch,
  Paper,
  BackgroundImage,
  Overlay,
  Container,
  SimpleGrid,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  IconMail,
  IconSend,
  IconCheck,
  IconX,
  IconMail as IconNewsletter,
  IconBell,
  IconUser,
  IconGift,
  IconStar,
  IconTrendingUp,
  IconRocket,
  IconHeart,
  IconShield,
} from '@tabler/icons-react';

export interface NewsletterSignupData {
  /** 电子邮箱 */
  email: string;
  /** 姓名（可选） */
  name?: string;
  /** 订阅偏好 */
  preferences?: {
    news?: boolean;
    updates?: boolean;
    promotions?: boolean;
    events?: boolean;
  };
}

export interface NewsletterBenefit {
  /** 图标 */
  icon: React.ReactNode;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
}

export interface NewsletterSignupProps {
  /** 组件标题 */
  title?: string;
  /** 组件描述 */
  description?: string;
  /** 订阅成功消息 */
  successMessage?: string;
  /** 订阅福利列表 */
  benefits?: NewsletterBenefit[];
  /** 是否显示姓名字段 */
  showNameField?: boolean;
  /** 是否显示订阅偏好 */
  showPreferences?: boolean;
  /** 是否显示福利列表 */
  showBenefits?: boolean;
  /** 布局类型 */
  layout?: 'card' | 'inline' | 'banner' | 'minimal' | 'featured';
  /** 背景图片（用于banner布局） */
  backgroundImage?: string;
  /** 提交回调函数 */
  onSubmit?: (data: NewsletterSignupData) => Promise<void>;
  /** 加载状态 */
  loading?: boolean;
  /** 成功状态 */
  success?: boolean;
  /** 错误信息 */
  error?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

const defaultBenefits: NewsletterBenefit[] = [
  {
    icon: <IconNewsletter size={20} />,
    title: '独家内容',
    description: '获取最新的行业动态和技术文章',
  },
  {
    icon: <IconGift size={20} />,
    title: '专属优惠',
    description: '享受订阅者专属折扣和促销活动',
  },
  {
    icon: <IconBell size={20} />,
    title: '及时通知',
    description: '第一时间了解重要更新和新功能',
  },
  {
    icon: <IconStar size={20} />,
    title: '优先体验',
    description: '抢先体验新产品和功能的内测版本',
  },
];

export function NewsletterSignup({
  title = '订阅我们的资讯',
  description = '获取最新的产品更新、技术文章和行业洞察，直接送达您的邮箱。',
  successMessage = '订阅成功！欢迎加入我们的社区。',
  benefits = defaultBenefits,
  showNameField = false,
  showPreferences = false,
  showBenefits = true,
  layout = 'card',
  backgroundImage,
  onSubmit,
  loading = false,
  success = false,
  error,
  style,
}: NewsletterSignupProps) {
  const theme = useMantineTheme();
  const [formData, setFormData] = useState<NewsletterSignupData>({
    email: '',
    name: '',
    preferences: {
      news: true,
      updates: true,
      promotions: false,
      events: false,
    },
  });

  const [emailError, setEmailError] = useState<string>('');

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('请输入您的邮箱地址');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('请输入有效的邮箱地址');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      return;
    }

    if (onSubmit) {
      try {
        await onSubmit(formData);
        // 成功后重置表单
        setFormData({
          email: '',
          name: '',
          preferences: {
            news: true,
            updates: true,
            promotions: false,
            events: false,
          },
        });
      } catch (err) {
        console.error('Newsletter subscription error:', err);
      }
    }
  };

  const renderBenefits = () => {
    if (!showBenefits || benefits.length === 0) return null;

    return (
      <Box>
        <Text fw={600} size="md" mb="md">
          订阅福利
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {benefits.map((benefit, index) => (
            <Group key={index} gap="sm" align="flex-start">
              <ThemeIcon variant="light" size="md" color="blue">
                {benefit.icon}
              </ThemeIcon>
              <Box>
                <Text fw={500} size="sm">
                  {benefit.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {benefit.description}
                </Text>
              </Box>
            </Group>
          ))}
        </SimpleGrid>
      </Box>
    );
  };

  const renderPreferences = () => {
    if (!showPreferences) return null;

    return (
      <Box>
        <Text fw={500} size="sm" mb="sm">
          订阅偏好
        </Text>
        <Stack gap="xs">
          <Checkbox
            label="产品新闻和公告"
            checked={formData.preferences?.news}
            onChange={(e) => setFormData({
              ...formData,
              preferences: { ...formData.preferences, news: e.target.checked }
            })}
          />
          <Checkbox
            label="产品更新和功能发布"
            checked={formData.preferences?.updates}
            onChange={(e) => setFormData({
              ...formData,
              preferences: { ...formData.preferences, updates: e.target.checked }
            })}
          />
          <Checkbox
            label="促销活动和特别优惠"
            checked={formData.preferences?.promotions}
            onChange={(e) => setFormData({
              ...formData,
              preferences: { ...formData.preferences, promotions: e.target.checked }
            })}
          />
          <Checkbox
            label="活动邀请和网络研讨会"
            checked={formData.preferences?.events}
            onChange={(e) => setFormData({
              ...formData,
              preferences: { ...formData.preferences, events: e.target.checked }
            })}
          />
        </Stack>
      </Box>
    );
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {showNameField && (
          <TextInput
            label="姓名"
            placeholder="请输入您的姓名"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            leftSection={<IconUser size={16} />}
          />
        )}
        
        <TextInput
          label={layout === 'inline' || layout === 'minimal' ? '' : '邮箱地址'}
          placeholder="请输入您的邮箱地址"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={emailError}
          leftSection={<IconMail size={16} />}
          required
        />

        {renderPreferences()}

        <Button
          type="submit"
          size={layout === 'inline' || layout === 'minimal' ? 'md' : 'lg'}
          leftSection={<IconSend size={16} />}
          loading={loading}
          disabled={success}
          gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
          variant="gradient"
          fullWidth={layout !== 'inline'}
        >
          {loading ? '订阅中...' : success ? '订阅成功' : '立即订阅'}
        </Button>
      </Stack>
    </form>
  );

  // 内联布局
  if (layout === 'inline') {
    return (
      <Group gap="md" style={style}>
        <TextInput
          placeholder="请输入您的邮箱地址"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={emailError}
          leftSection={<IconMail size={16} />}
          style={{ flex: 1 }}
        />
        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={success}
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan' }}
        >
          订阅
        </Button>
      </Group>
    );
  }

  // 最小化布局
  if (layout === 'minimal') {
    return (
      <Paper withBorder p="md" radius="md" style={style}>
        <Stack gap="sm">
          <Group gap="xs">
            <ThemeIcon variant="light" size="sm">
              <IconNewsletter size={16} />
            </ThemeIcon>
            <Text fw={500} size="sm">
              {title}
            </Text>
          </Group>
          <Text size="xs" c="dimmed">
            {description}
          </Text>
          {success ? (
            <Group gap="xs" c="green">
              <IconCheck size={16} />
              <Text size="sm">{successMessage}</Text>
            </Group>
          ) : (
            renderForm()
          )}
        </Stack>
      </Paper>
    );
  }

  // Banner布局
  if (layout === 'banner') {
    return (
      <Box style={{ position: 'relative', ...style }}>
        {backgroundImage && (
          <BackgroundImage src={backgroundImage} radius="lg">
            <Overlay opacity={0.4} color="dark" />
            <Container size="md" py="xl">
              <Box style={{ position: 'relative', zIndex: 1 }}>
                <Stack gap="lg" align="center" ta="center">
                  <Badge variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="lg">
                    📧 Newsletter
                  </Badge>
                  <Text fw={700} size="2rem" c="white">
                    {title}
                  </Text>
                  <Text size="lg" c="gray.2" maw={600}>
                    {description}
                  </Text>
                  {success ? (
                    <Group gap="md" c="green.3">
                      <IconCheck size={24} />
                      <Text size="lg" fw={500}>
                        {successMessage}
                      </Text>
                    </Group>
                  ) : (
                    <Box maw={400} w="100%">
                      {renderForm()}
                    </Box>
                  )}
                </Stack>
              </Box>
            </Container>
          </BackgroundImage>
        )}
      </Box>
    );
  }

  // 特色布局
  if (layout === 'featured') {
    return (
      <Card
        withBorder
        radius="lg"
        p="xl"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.blue[0]}, ${theme.colors.cyan[0]})`,
          border: `2px solid ${theme.colors.blue[3]}`,
          ...style,
        }}
      >
        <Stack gap="lg">
          <Group justify="center">
            <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="xl">
              <IconRocket size={32} />
            </ThemeIcon>
          </Group>
          
          <Box ta="center">
            <Text fw={700} size="xl" mb="xs">
              {title}
            </Text>
            <Text c="dimmed">
              {description}
            </Text>
          </Box>

          {success ? (
            <Group justify="center" gap="md" c="green">
              <IconCheck size={24} />
              <Text size="lg" fw={500}>
                {successMessage}
              </Text>
            </Group>
          ) : (
            <Box>
              {renderForm()}
            </Box>
          )}

          {renderBenefits()}
          
          <Text size="xs" c="dimmed" ta="center">
            我们承诺保护您的隐私，不会向第三方泄露您的信息。您可以随时取消订阅。
          </Text>
        </Stack>
      </Card>
    );
  }

  // 标准卡片布局（默认）
  return (
    <Card withBorder radius="lg" p="xl" style={style}>
      <Stack gap="lg">
        <Box>
          <Group gap="sm" mb="xs">
            <ThemeIcon variant="light" color="blue">
              <IconNewsletter size={20} />
            </ThemeIcon>
            <Text fw={700} size="lg">
              {title}
            </Text>
          </Group>
          <Text c="dimmed">
            {description}
          </Text>
        </Box>

        {error && (
          <Group gap="xs" c="red">
            <IconX size={16} />
            <Text size="sm">{error}</Text>
          </Group>
        )}

        {success ? (
          <Group gap="md" c="green">
            <IconCheck size={20} />
            <Text fw={500}>{successMessage}</Text>
          </Group>
        ) : (
          renderForm()
        )}

        {renderBenefits()}

        <Text size="xs" c="dimmed">
          订阅即表示您同意我们的隐私政策。您可以随时取消订阅。
        </Text>
      </Stack>
    </Card>
  );
}

// 预设的新闻订阅变体
export function NewsletterSignupCard(props: Omit<NewsletterSignupProps, 'layout'>) {
  return <NewsletterSignup {...props} layout="card" />;
}

export function NewsletterSignupInline(props: Omit<NewsletterSignupProps, 'layout'>) {
  return <NewsletterSignup {...props} layout="inline" />;
}

export function NewsletterSignupBanner(props: Omit<NewsletterSignupProps, 'layout'>) {
  return <NewsletterSignup {...props} layout="banner" />;
}

export function NewsletterSignupMinimal(props: Omit<NewsletterSignupProps, 'layout'>) {
  return <NewsletterSignup {...props} layout="minimal" />;
}

export function NewsletterSignupFeatured(props: Omit<NewsletterSignupProps, 'layout'>) {
  return <NewsletterSignup {...props} layout="featured" />;
}

export default NewsletterSignup; 