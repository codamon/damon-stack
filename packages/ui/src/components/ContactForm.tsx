'use client';

import React, { useState } from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  Box,
  TextInput,
  Textarea,
  Select,
  Button,
  Badge,
  ThemeIcon,
  SimpleGrid,
  Divider,
  Anchor,
  ActionIcon,
  Notification,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconUser,
  IconBuilding,
  IconHash as IconSubject,
  IconMessage,
  IconSend,
  IconCheck,
  IconX,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandGithub,
  IconClock,
  IconCalendar,
} from '@tabler/icons-react';

export interface ContactInfo {
  /** 电子邮箱 */
  email: string;
  /** 电话号码 */
  phone?: string;
  /** 地址 */
  address?: string;
  /** 工作时间 */
  workingHours?: string;
  /** 社交媒体链接 */
  social?: {
    platform: 'twitter' | 'linkedin' | 'github';
    href: string;
    label?: string;
  }[];
}

export interface ContactFormData {
  /** 姓名 */
  name: string;
  /** 电子邮箱 */
  email: string;
  /** 电话号码 */
  phone?: string;
  /** 公司名称 */
  company?: string;
  /** 联系主题 */
  subject: string;
  /** 消息内容 */
  message: string;
  /** 联系类型 */
  type?: string;
}

export interface ContactFormProps {
  /** 表单标题 */
  title?: string;
  /** 表单描述 */
  description?: string;
  /** 联系信息 */
  contactInfo?: ContactInfo;
  /** 联系类型选项 */
  typeOptions?: { value: string; label: string }[];
  /** 是否显示联系信息卡片 */
  showContactCard?: boolean;
  /** 表单布局 */
  layout?: 'stacked' | 'side-by-side';
  /** 提交回调函数 */
  onSubmit?: (data: ContactFormData) => Promise<void>;
  /** 是否显示社交媒体链接 */
  showSocial?: boolean;
  /** 加载状态 */
  loading?: boolean;
  /** 成功状态 */
  success?: boolean;
  /** 错误信息 */
  error?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

const defaultTypeOptions = [
  { value: 'general', label: '一般咨询' },
  { value: 'sales', label: '销售咨询' },
  { value: 'support', label: '技术支持' },
  { value: 'partnership', label: '合作洽谈' },
  { value: 'career', label: '招聘相关' },
  { value: 'other', label: '其他' },
];

const defaultContactInfo: ContactInfo = {
  email: 'contact@damonstack.com',
  phone: '+86 400-123-4567',
  address: '北京市朝阳区创业大街123号',
  workingHours: '周一至周五 9:00-18:00',
  social: [
    { platform: 'twitter', href: 'https://twitter.com/damonstack', label: 'Twitter' },
    { platform: 'linkedin', href: 'https://linkedin.com/company/damonstack', label: 'LinkedIn' },
    { platform: 'github', href: 'https://github.com/damonstack', label: 'GitHub' },
  ],
};

export function ContactForm({
  title = '联系我们',
  description = '有任何问题或建议，欢迎随时与我们联系。我们会在24小时内回复您。',
  contactInfo = defaultContactInfo,
  typeOptions = defaultTypeOptions,
  showContactCard = true,
  layout = 'side-by-side',
  onSubmit,
  showSocial = true,
  loading = false,
  success = false,
  error,
  style,
}: ContactFormProps) {
  const theme = useMantineTheme();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    type: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入您的邮箱';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '请输入联系主题';
    }

    if (!formData.message.trim()) {
      newErrors.message = '请输入消息内容';
    } else if (formData.message.length < 10) {
      newErrors.message = '消息内容至少需要10个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      try {
        await onSubmit(formData);
        // 成功后重置表单
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          type: '',
        });
      } catch (err) {
        console.error('Form submission error:', err);
      }
    }
  };

  const getSocialIcon = (platform: 'twitter' | 'linkedin' | 'github') => {
    switch (platform) {
      case 'twitter':
        return <IconBrandTwitter size={18} />;
      case 'linkedin':
        return <IconBrandLinkedin size={18} />;
      case 'github':
        return <IconBrandGithub size={18} />;
      default:
        return null;
    }
  };

  const renderContactCard = () => {
    if (!showContactCard || !contactInfo) return null;

    return (
      <Card withBorder radius="lg" p="xl" h="fit-content">
        <Stack gap="lg">
          <Box>
            <Text fw={700} size="lg" mb="xs">
              联系方式
            </Text>
            <Text size="sm" c="dimmed">
              我们很乐意为您提供帮助
            </Text>
          </Box>

          <Stack gap="md">
            <Group gap="md">
              <ThemeIcon variant="light" size="lg" color="blue">
                <IconMail size={20} />
              </ThemeIcon>
              <Box>
                <Text fw={500} size="sm">
                  电子邮箱
                </Text>
                <Anchor href={`mailto:${contactInfo.email}`} size="sm" c="dimmed">
                  {contactInfo.email}
                </Anchor>
              </Box>
            </Group>

            {contactInfo.phone && (
              <Group gap="md">
                <ThemeIcon variant="light" size="lg" color="green">
                  <IconPhone size={20} />
                </ThemeIcon>
                <Box>
                  <Text fw={500} size="sm">
                    电话号码
                  </Text>
                  <Anchor href={`tel:${contactInfo.phone}`} size="sm" c="dimmed">
                    {contactInfo.phone}
                  </Anchor>
                </Box>
              </Group>
            )}

            {contactInfo.address && (
              <Group gap="md" align="flex-start">
                <ThemeIcon variant="light" size="lg" color="orange">
                  <IconMapPin size={20} />
                </ThemeIcon>
                <Box>
                  <Text fw={500} size="sm">
                    办公地址
                  </Text>
                  <Text size="sm" c="dimmed">
                    {contactInfo.address}
                  </Text>
                </Box>
              </Group>
            )}

            {contactInfo.workingHours && (
              <Group gap="md">
                <ThemeIcon variant="light" size="lg" color="purple">
                  <IconClock size={20} />
                </ThemeIcon>
                <Box>
                  <Text fw={500} size="sm">
                    工作时间
                  </Text>
                  <Text size="sm" c="dimmed">
                    {contactInfo.workingHours}
                  </Text>
                </Box>
              </Group>
            )}
          </Stack>

          {showSocial && contactInfo.social && contactInfo.social.length > 0 && (
            <>
              <Divider />
              <Box>
                <Text fw={500} size="sm" mb="sm">
                  关注我们
                </Text>
                <Group gap="xs">
                  {contactInfo.social.map((social) => (
                    <ActionIcon
                      key={social.platform}
                      component="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="light"
                      size="lg"
                      color="blue"
                      aria-label={social.label || social.platform}
                    >
                      {getSocialIcon(social.platform)}
                    </ActionIcon>
                  ))}
                </Group>
              </Box>
            </>
          )}
        </Stack>
      </Card>
    );
  };

  const renderForm = () => (
    <Card withBorder radius="lg" p="xl" style={{ flex: 1 }}>
      <Stack gap="lg">
        <Box>
          <Text fw={700} size="xl" mb="xs">
            {title}
          </Text>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Box>

        {success && (
          <Notification
            icon={<IconCheck size={18} />}
            color="green"
            title="发送成功"
            onClose={() => {}}
            withCloseButton={false}
          >
            您的消息已成功发送，我们会尽快回复您。
          </Notification>
        )}

        {error && (
          <Notification
            icon={<IconX size={18} />}
            color="red"
            title="发送失败"
            onClose={() => {}}
            withCloseButton={false}
          >
            {error}
          </Notification>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="姓名"
                placeholder="请输入您的姓名"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                leftSection={<IconUser size={16} />}
                required
              />
              <TextInput
                label="邮箱"
                placeholder="请输入您的邮箱"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                leftSection={<IconMail size={16} />}
                required
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="电话"
                placeholder="请输入您的电话号码"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                leftSection={<IconPhone size={16} />}
              />
              <TextInput
                label="公司"
                placeholder="请输入您的公司名称"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                leftSection={<IconBuilding size={16} />}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Select
                label="联系类型"
                placeholder="请选择联系类型"
                data={typeOptions}
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value || '' })}
              />
              <TextInput
                label="主题"
                placeholder="请输入联系主题"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                error={errors.subject}
                leftSection={<IconSubject size={16} />}
                required
              />
            </SimpleGrid>

            <Textarea
              label="消息内容"
              placeholder="请详细描述您的问题或需求..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              error={errors.message}
              minRows={4}
              maxRows={8}
              required
            />

            <Button
              type="submit"
              size="lg"
              leftSection={<IconSend size={18} />}
              loading={loading}
              disabled={success}
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              variant="gradient"
              fullWidth
            >
              {loading ? '发送中...' : success ? '发送成功' : '发送消息'}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Card>
  );

  if (layout === 'stacked') {
    return (
      <Stack gap="xl" style={style}>
        {renderForm()}
        {renderContactCard()}
      </Stack>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 1, lg: showContactCard ? 2 : 1 }}
      spacing="xl"
      style={style}
    >
      {renderForm()}
      {renderContactCard()}
    </SimpleGrid>
  );
}

// 简化版联系表单
export function ContactFormSimple({
  onSubmit,
  title = "快速联系",
  ...props
}: Omit<ContactFormProps, 'showContactCard' | 'layout'>) {
  return (
    <ContactForm
      {...props}
      title={title}
      showContactCard={false}
      layout="stacked"
      onSubmit={onSubmit}
    />
  );
}

// 侧边栏联系表单
export function ContactFormSidebar({
  onSubmit,
  title = "有问题？",
  description = "联系我们获取帮助",
  ...props
}: Omit<ContactFormProps, 'showContactCard' | 'layout'>) {
  return (
    <Box maw={400}>
      <ContactForm
        {...props}
        title={title}
        description={description}
        showContactCard={false}
        layout="stacked"
        onSubmit={onSubmit}
      />
    </Box>
  );
}

export default ContactForm; 