'use client';

import React from 'react';
import {
  Container,
  Group,
  Text,
  Anchor,
  Stack,
  SimpleGrid,
  Divider,
  ActionIcon,
  Box,
  Image,
  ThemeIcon,
  Badge,
  rem,
  useMantineTheme,
  Paper,
} from '@mantine/core';
import {
  IconBrandTwitter,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandFacebook,
  IconMail,
  IconPhone,
  IconMapPin,
  IconArrowUp,
  IconHeart,
} from '@tabler/icons-react';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: 'twitter' | 'github' | 'linkedin' | 'instagram' | 'facebook' | 'email';
  href: string;
  label?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface WebsiteFooterProps {
  /** 网站Logo文本或图片URL */
  logo?: string | React.ReactNode;
  /** 公司描述 */
  description?: string;
  /** 页脚链接分组 */
  sections?: FooterSection[];
  /** 社交媒体链接 */
  socialLinks?: SocialLink[];
  /** 联系信息 */
  contactInfo?: ContactInfo;
  /** 版权信息 */
  copyright?: string;
  /** 是否显示回到顶部按钮 */
  showScrollToTop?: boolean;
  /** 容器最大宽度 */
  containerSize?: string | number;
  /** 是否显示分隔线 */
  withBorder?: boolean;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

const defaultSections: FooterSection[] = [
  {
    title: '产品',
    links: [
      { label: '功能特性', href: '/features' },
      { label: '定价方案', href: '/pricing' },
      { label: '使用案例', href: '/use-cases' },
      { label: '集成方案', href: '/integrations' },
    ],
  },
  {
    title: '开发者',
    links: [
      { label: 'API文档', href: '/docs/api' },
      { label: '开发指南', href: '/docs/guide' },
      { label: 'SDK下载', href: '/sdk' },
      { label: '示例代码', href: '/examples' },
    ],
  },
  {
    title: '支持',
    links: [
      { label: '帮助中心', href: '/help' },
      { label: '联系我们', href: '/contact' },
      { label: '服务状态', href: '/status' },
      { label: '社区论坛', href: '/community' },
    ],
  },
  {
    title: '公司',
    links: [
      { label: '关于我们', href: '/about' },
      { label: '团队介绍', href: '/team' },
      { label: '招聘信息', href: '/careers' },
      { label: '新闻动态', href: '/news' },
    ],
  },
];

const defaultSocialLinks: SocialLink[] = [
  { platform: 'github', href: 'https://github.com', label: 'GitHub' },
  { platform: 'twitter', href: 'https://twitter.com', label: 'Twitter' },
  { platform: 'linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
];

const getSocialIcon = (platform: SocialLink['platform']) => {
  const iconProps = { size: 18, stroke: 1.5 };
  
  switch (platform) {
    case 'twitter':
      return <IconBrandTwitter {...iconProps} />;
    case 'github':
      return <IconBrandGithub {...iconProps} />;
    case 'linkedin':
      return <IconBrandLinkedin {...iconProps} />;
    case 'instagram':
      return <IconBrandInstagram {...iconProps} />;
    case 'facebook':
      return <IconBrandFacebook {...iconProps} />;
    case 'email':
      return <IconMail {...iconProps} />;
    default:
      return null;
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function WebsiteFooter({
  logo,
  description,
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  contactInfo,
  copyright,
  showScrollToTop = true,
  containerSize = 'xl',
  withBorder = true,
  style,
}: WebsiteFooterProps) {
  const theme = useMantineTheme();

  const renderLogo = () => {
    if (typeof logo === 'string') {
      return (
        <Text size="xl" fw={700} c="blue">
          {logo}
        </Text>
      );
    }
    return logo || (
      <Text size="xl" fw={700} c="blue">
        Damon Stack
      </Text>
    );
  };

  const renderContactInfo = () => {
    if (!contactInfo) return null;

    return (
      <Stack gap="xs">
        <Text fw={600} mb="xs">
          联系我们
        </Text>
        {contactInfo.email && (
          <Group gap="xs">
            <ThemeIcon variant="light" size="sm">
              <IconMail size={16} />
            </ThemeIcon>
            <Anchor href={`mailto:${contactInfo.email}`} size="sm">
              {contactInfo.email}
            </Anchor>
          </Group>
        )}
        {contactInfo.phone && (
          <Group gap="xs">
            <ThemeIcon variant="light" size="sm">
              <IconPhone size={16} />
            </ThemeIcon>
            <Text size="sm">{contactInfo.phone}</Text>
          </Group>
        )}
        {contactInfo.address && (
          <Group gap="xs" align="flex-start">
            <ThemeIcon variant="light" size="sm" mt={2}>
              <IconMapPin size={16} />
            </ThemeIcon>
            <Text size="sm" style={{ flex: 1 }}>
              {contactInfo.address}
            </Text>
          </Group>
        )}
      </Stack>
    );
  };

  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} Damon Stack. 保留所有权利。`;

  return (
    <Paper
      p={0}
      style={{
        borderTop: withBorder ? `1px solid ${theme.colors.gray[3]}` : 'none',
        ...style,
      }}
    >
      <Container size={containerSize} py="xl">
        {/* Main Footer Content */}
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: contactInfo ? 3 : 2, lg: contactInfo ? 5 : 4 }}
          spacing="xl"
          mb="xl"
        >
          {/* Company Info */}
          <Box>
            <Stack gap="md">
              {renderLogo()}
              {description && (
                <Text size="sm" c="dimmed" maw={300}>
                  {description}
                </Text>
              )}
              
              {/* Social Links */}
              {socialLinks && socialLinks.length > 0 && (
                <Group gap="xs">
                  {socialLinks.map((social) => (
                    <ActionIcon
                      key={social.platform}
                      component="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="light"
                      size="lg"
                      aria-label={social.label || social.platform}
                    >
                      {getSocialIcon(social.platform)}
                    </ActionIcon>
                  ))}
                </Group>
              )}
            </Stack>
          </Box>

          {/* Footer Sections */}
          {sections.map((section) => (
            <Box key={section.title}>
              <Text fw={600} mb="md">
                {section.title}
              </Text>
              <Stack gap="xs">
                {section.links.map((link) => (
                  <Anchor
                    key={link.href}
                    href={link.href}
                    size="sm"
                    c="dimmed"
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    style={{
                      textDecoration: 'none',
                    }}
                  >
                    {link.label}
                  </Anchor>
                ))}
              </Stack>
            </Box>
          ))}

          {/* Contact Info */}
          {contactInfo && (
            <Box>
              {renderContactInfo()}
            </Box>
          )}
        </SimpleGrid>

        <Divider my="xl" />

        {/* Bottom Section */}
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              {copyright || defaultCopyright}
            </Text>
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Made with
              </Text>
              <IconHeart size={16} style={{ color: theme.colors.red[6] }} />
              <Text size="sm" c="dimmed">
                by Damon Stack Team
              </Text>
            </Group>
          </Group>

          <Group gap="md">
            <Anchor href="/privacy" size="sm" c="dimmed">
              隐私政策
            </Anchor>
            <Anchor href="/terms" size="sm" c="dimmed">
              服务条款
            </Anchor>
            {showScrollToTop && (
              <ActionIcon
                variant="light"
                size="lg"
                onClick={scrollToTop}
                aria-label="回到顶部"
              >
                <IconArrowUp size={18} />
              </ActionIcon>
            )}
          </Group>
        </Group>

        {/* Status Badge */}
        <Group justify="center" mt="md">
          <Badge variant="light" color="green" size="sm">
            <Group gap={4}>
              <Box
                w={8}
                h={8}
                style={{
                  borderRadius: '50%',
                  backgroundColor: theme.colors.green[6],
                }}
              />
              系统运行正常
            </Group>
          </Badge>
        </Group>
      </Container>
    </Paper>
  );
}

export default WebsiteFooter; 