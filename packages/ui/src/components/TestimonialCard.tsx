'use client';

import React from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  Box,
  Avatar,
  Rating,
  Badge,
  ThemeIcon,
  Blockquote,
  rem,
  useMantineTheme,
  SimpleGrid,
  Center,
  ActionIcon,
} from '@mantine/core';
import {
  IconQuote,
  IconStar,
  IconStarFilled,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconExternalLink,
  IconCheck,
  IconHeart,
  IconThumbUp,
} from '@tabler/icons-react';

export interface TestimonialAuthor {
  /** 用户姓名 */
  name: string;
  /** 用户头像URL */
  avatar?: string;
  /** 用户职位 */
  role?: string;
  /** 用户所在公司 */
  company?: string;
  /** 用户社交媒体链接 */
  social?: {
    platform: 'twitter' | 'linkedin';
    href: string;
  };
}

export interface TestimonialCardProps {
  /** 证言内容 */
  content: string;
  /** 用户信息 */
  author: TestimonialAuthor;
  /** 评分 */
  rating?: number;
  /** 最大评分 */
  maxRating?: number;
  /** 证言日期 */
  date?: string;
  /** 标签/分类 */
  badge?: {
    label: string;
    color?: string;
    variant?: 'filled' | 'light' | 'outline' | 'dot' | 'gradient';
  };
  /** 是否显示引号 */
  showQuote?: boolean;
  /** 卡片布局类型 */
  layout?: 'card' | 'minimal' | 'featured';
  /** 是否可悬停 */
  hoverable?: boolean;
  /** 是否显示阴影 */
  withShadow?: boolean;
  /** 是否显示边框 */
  withBorder?: boolean;
  /** 卡片圆角 */
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 内边距 */
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 点击事件 */
  onClick?: () => void;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

export function TestimonialCard({
  content,
  author,
  rating,
  maxRating = 5,
  date,
  badge,
  showQuote = true,
  layout = 'card',
  hoverable = true,
  withShadow = true,
  withBorder = false,
  radius = 'lg',
  padding = 'lg',
  onClick,
  style,
}: TestimonialCardProps) {
  const theme = useMantineTheme();

  const renderQuoteIcon = () => {
    if (!showQuote) return null;

    return (
      <ThemeIcon
        size="lg"
        radius="xl"
        variant="light"
        color="blue"
        style={{
          position: 'absolute',
          top: rem(-12),
          left: rem(16),
          zIndex: 1,
        }}
      >
        <IconQuote size={20} />
      </ThemeIcon>
    );
  };

  const renderRating = () => {
    if (rating === undefined) return null;

    return (
      <Group gap="xs">
        <Rating value={rating} readOnly size="sm" />
        <Text size="sm" c="dimmed">
          {rating}/{maxRating}
        </Text>
      </Group>
    );
  };

  const renderBadge = () => {
    if (!badge) return null;

    return (
      <Badge
        variant={badge.variant || 'light'}
        color={badge.color || 'blue'}
        size="sm"
        radius="sm"
      >
        {badge.label}
      </Badge>
    );
  };

  const renderSocialLink = () => {
    if (!author.social) return null;

    const Icon = author.social.platform === 'twitter' ? IconBrandTwitter : IconBrandLinkedin;
    
    return (
      <ActionIcon
        component="a"
        href={author.social.href}
        target="_blank"
        rel="noopener noreferrer"
        size="sm"
        variant="light"
        color={author.social.platform === 'twitter' ? 'blue' : 'blue'}
        style={{ cursor: 'pointer' }}
      >
        <Icon size={14} />
      </ActionIcon>
    );
  };

  const renderAuthor = () => (
    <Group gap="md">
      <Avatar
        src={author.avatar}
        alt={author.name}
        size="lg"
        radius="xl"
      >
        {author.name.slice(0, 2).toUpperCase()}
      </Avatar>
      <Box style={{ flex: 1 }}>
        <Group justify="space-between" align="flex-start">
          <Box>
            <Text fw={600} size="sm">
              {author.name}
            </Text>
            {author.role && (
              <Text size="xs" c="dimmed">
                {author.role}
                {author.company && ` at ${author.company}`}
              </Text>
            )}
          </Box>
          {renderSocialLink()}
        </Group>
      </Box>
    </Group>
  );

  const cardProps = {
    shadow: withShadow ? 'sm' : undefined,
    withBorder,
    radius,
    padding,
    style: {
      cursor: (hoverable || onClick) ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      position: 'relative' as const,
      ...style,
    },
    onClick,
  };

  // 最小化布局
  if (layout === 'minimal') {
    return (
      <Box
        style={{
          padding: theme.spacing.md,
          borderLeft: `4px solid ${theme.colors.blue[5]}`,
          backgroundColor: theme.colors.gray[0],
          borderRadius: theme.radius.md,
          ...style,
        }}
      >
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            {renderBadge()}
            {renderRating()}
          </Group>
          
          <Blockquote
            color="blue"
            cite={`— ${author.name}${author.company ? `, ${author.company}` : ''}`}
            icon={showQuote ? <IconQuote size={20} /> : null}
          >
            {content}
          </Blockquote>
          
          {date && (
            <Text size="xs" c="dimmed" ta="right">
              {date}
            </Text>
          )}
        </Stack>
      </Box>
    );
  }

  // 特色布局
  if (layout === 'featured') {
    return (
      <Card
        {...cardProps}
        style={{
          ...cardProps.style,
          background: `linear-gradient(135deg, ${theme.colors.blue[0]}, ${theme.colors.cyan[0]})`,
          border: `1px solid ${theme.colors.blue[2]}`,
          '&:hover': hoverable ? {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows.lg,
          } : {},
        }}
      >
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start">
            <Group gap="sm">
              {renderBadge()}
              <Badge variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="sm">
                ⭐ 推荐
              </Badge>
            </Group>
            {renderRating()}
          </Group>

          <Box style={{ position: 'relative' }}>
            {showQuote && (
              <ThemeIcon
                size="xl"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                style={{
                  position: 'absolute',
                  top: rem(-8),
                  left: rem(-8),
                  opacity: 0.1,
                }}
              >
                <IconQuote size={32} />
              </ThemeIcon>
            )}
            <Text
              size="lg"
              lh={1.6}
              fw={500}
              style={{
                position: 'relative',
                zIndex: 1,
                fontStyle: 'italic',
              }}
            >
              "{content}"
            </Text>
          </Box>

          <Group justify="space-between" align="center">
            {renderAuthor()}
            {date && (
              <Text size="xs" c="dimmed">
                {date}
              </Text>
            )}
          </Group>
        </Stack>
      </Card>
    );
  }

  // 标准卡片布局（默认）
  return (
    <Card
      {...cardProps}
      style={{
        ...cardProps.style,
        '&:hover': hoverable ? {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.md,
        } : {},
      }}
    >
      {renderQuoteIcon()}
      
      <Stack gap="md" pt={showQuote ? 'sm' : 0}>
        <Group justify="space-between" align="flex-start">
          {renderBadge()}
          {renderRating()}
        </Group>

        <Text size="md" lh={1.6} style={{ fontStyle: 'italic' }}>
          "{content}"
        </Text>

        <Group justify="space-between" align="center" mt="md">
          {renderAuthor()}
          {date && (
            <Text size="xs" c="dimmed">
              {date}
            </Text>
          )}
        </Group>
      </Stack>
    </Card>
  );
}

// 预设的证言卡片变体
export function TestimonialCardStandard(props: Omit<TestimonialCardProps, 'layout'>) {
  return <TestimonialCard {...props} layout="card" />;
}

export function TestimonialCardMinimal(props: Omit<TestimonialCardProps, 'layout'>) {
  return <TestimonialCard {...props} layout="minimal" />;
}

export function TestimonialCardFeatured(props: Omit<TestimonialCardProps, 'layout'>) {
  return <TestimonialCard {...props} layout="featured" />;
}

// 证言网格容器
export interface TestimonialGridProps {
  testimonials: TestimonialCardProps[];
  cols?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'card' | 'minimal' | 'featured';
}

export function TestimonialGrid({
  testimonials,
  cols = { base: 1, md: 2, lg: 3 },
  spacing = 'lg',
  layout = 'card',
}: TestimonialGridProps) {
  return (
    <SimpleGrid cols={cols} spacing={spacing}>
      {testimonials.map((testimonial, index) => (
        <TestimonialCard key={index} {...testimonial} layout={layout} />
      ))}
    </SimpleGrid>
  );
}

// 证言轮播统计
export interface TestimonialStatsProps {
  stats: {
    totalReviews: number;
    averageRating: number;
    fiveStarPercentage: number;
    recommendationRate: number;
  };
}

export function TestimonialStats({ stats }: TestimonialStatsProps) {
  const theme = useMantineTheme();

  return (
    <Card withBorder radius="lg" p="xl">
      <Stack gap="lg">
        <Text fw={700} size="lg" ta="center">
          用户反馈统计
        </Text>
        
        <SimpleGrid cols={2} spacing="lg">
          <Center>
            <Stack gap="xs" align="center">
              <Text size="2.5rem" fw={900} c="blue">
                {stats.averageRating.toFixed(1)}
              </Text>
              <Rating value={stats.averageRating} readOnly size="sm" />
              <Text size="sm" c="dimmed">
                平均评分
              </Text>
            </Stack>
          </Center>
          
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="sm">总评价数</Text>
              <Text fw={600}>{stats.totalReviews.toLocaleString()}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">五星好评</Text>
              <Text fw={600} c="yellow">{stats.fiveStarPercentage}%</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">推荐率</Text>
              <Text fw={600} c="green">{stats.recommendationRate}%</Text>
            </Group>
          </Stack>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}

export default TestimonialCard; 