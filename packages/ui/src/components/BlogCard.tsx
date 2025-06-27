'use client';

import React from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  Box,
  Image,
  Badge,
  Button,
  Avatar,
  Anchor,
  ActionIcon,
  rem,
  useMantineTheme,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import {
  IconCalendar,
  IconClock,
  IconEye,
  IconHeart,
  IconShare,
  IconBookmark,
  IconArrowRight,
  IconExternalLink,
  IconUser,
  IconTag,
  IconMessage,
  IconTrendingUp,
} from '@tabler/icons-react';

export interface BlogAuthor {
  /** 作者姓名 */
  name: string;
  /** 作者头像URL */
  avatar?: string;
  /** 作者简介 */
  bio?: string;
  /** 作者链接 */
  href?: string;
}

export interface BlogStats {
  /** 浏览量 */
  views?: number;
  /** 点赞数 */
  likes?: number;
  /** 评论数 */
  comments?: number;
  /** 分享数 */
  shares?: number;
}

export interface BlogCardProps {
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 封面图片 */
  image?: string;
  /** 作者信息 */
  author: BlogAuthor;
  /** 发布日期 */
  publishedAt: string;
  /** 阅读时间（分钟） */
  readingTime?: number;
  /** 文章标签 */
  tags?: string[];
  /** 文章统计数据 */
  stats?: BlogStats;
  /** 文章链接 */
  href?: string;
  /** 是否为特色文章 */
  featured?: boolean;
  /** 是否为置顶文章 */
  pinned?: boolean;
  /** 卡片布局类型 */
  layout?: 'card' | 'horizontal' | 'minimal' | 'featured';
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
  /** 收藏按钮点击事件 */
  onBookmark?: () => void;
  /** 分享按钮点击事件 */
  onShare?: () => void;
  /** 点赞按钮点击事件 */
  onLike?: () => void;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

export function BlogCard({
  title,
  excerpt,
  image,
  author,
  publishedAt,
  readingTime,
  tags = [],
  stats,
  href,
  featured = false,
  pinned = false,
  layout = 'card',
  hoverable = true,
  withShadow = true,
  withBorder = false,
  radius = 'lg',
  padding = 'lg',
  onClick,
  onBookmark,
  onShare,
  onLike,
  style,
}: BlogCardProps) {
  const theme = useMantineTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderBadges = () => (
    <Group gap="xs">
      {pinned && (
        <Badge variant="filled" color="red" size="sm">
          📌 置顶
        </Badge>
      )}
      {featured && (
        <Badge variant="gradient" gradient={{ from: 'orange', to: 'red' }} size="sm">
          ⭐ 精选
        </Badge>
      )}
    </Group>
  );

  const renderTags = () => {
    if (tags.length === 0) return null;

    return (
      <Group gap="xs">
        {tags.slice(0, 3).map((tag) => (
          <Badge
            key={tag}
            variant="light"
            color="blue"
            size="sm"
            leftSection={<IconTag size={12} />}
          >
            {tag}
          </Badge>
        ))}
        {tags.length > 3 && (
          <Badge variant="light" color="gray" size="sm">
            +{tags.length - 3}
          </Badge>
        )}
      </Group>
    );
  };

  const renderMeta = () => (
    <Group gap="md" c="dimmed">
      <Group gap="xs">
        <IconCalendar size={14} />
        <Text size="xs">{formatDate(publishedAt)}</Text>
      </Group>
      {readingTime && (
        <Group gap="xs">
          <IconClock size={14} />
          <Text size="xs">{readingTime} 分钟阅读</Text>
        </Group>
      )}
    </Group>
  );

  const renderStats = () => {
    if (!stats) return null;

    return (
      <Group gap="md" c="dimmed">
        {stats.views && (
          <Group gap="xs">
            <IconEye size={14} />
            <Text size="xs">{formatNumber(stats.views)}</Text>
          </Group>
        )}
        {stats.likes && (
          <Group gap="xs">
            <IconHeart size={14} />
            <Text size="xs">{formatNumber(stats.likes)}</Text>
          </Group>
        )}
        {stats.comments && (
          <Group gap="xs">
            <IconMessage size={14} />
            <Text size="xs">{formatNumber(stats.comments)}</Text>
          </Group>
        )}
      </Group>
    );
  };

  const renderAuthor = () => (
    <Group gap="sm">
      <Avatar
        src={author.avatar}
        alt={author.name}
        size="sm"
        component={author.href ? 'a' : 'div'}
        href={author.href}
      >
        {author.name.slice(0, 2).toUpperCase()}
      </Avatar>
      <Box>
        <Text
          size="sm"
          fw={500}
          component={author.href ? 'a' : 'span'}
          href={author.href}
          style={{
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          {author.name}
        </Text>
        {author.bio && (
          <Text size="xs" c="dimmed" lineClamp={1}>
            {author.bio}
          </Text>
        )}
      </Box>
    </Group>
  );

  const renderActions = () => (
    <Group gap="xs">
      {onLike && (
        <ActionIcon
          variant="light"
          color="red"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
        >
          <IconHeart size={14} />
        </ActionIcon>
      )}
      {onBookmark && (
        <ActionIcon
          variant="light"
          color="blue"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
        >
          <IconBookmark size={14} />
        </ActionIcon>
      )}
      {onShare && (
        <ActionIcon
          variant="light"
          color="green"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
        >
          <IconShare size={14} />
        </ActionIcon>
      )}
    </Group>
  );

  const renderContent = () => (
    <Stack gap="md" style={{ flex: 1 }}>
      <Stack gap="xs">
        {renderBadges()}
        <Text
          fw={700}
          size="lg"
          lh={1.3}
          lineClamp={2}
          component={href ? 'a' : 'div'}
          href={href}
          style={{
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          {title}
        </Text>
      </Stack>

      <Text c="dimmed" size="sm" lh={1.5} lineClamp={3}>
        {excerpt}
      </Text>

      <Stack gap="sm">
        {renderTags()}
        {renderMeta()}
        {renderStats()}
      </Stack>

      <Group justify="space-between" align="center">
        {renderAuthor()}
        {renderActions()}
      </Group>
    </Stack>
  );

  const cardProps = {
    shadow: withShadow ? 'sm' : undefined,
    withBorder,
    radius,
    padding,
    style: {
      cursor: (hoverable || onClick) ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      ...style,
    },
    onClick: onClick || (href ? () => window.open(href, '_blank') : undefined),
  };

  // 水平布局
  if (layout === 'horizontal') {
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
        <Group gap="lg" align="flex-start">
          {image && (
            <Image
              src={image}
              alt={title}
              w={200}
              h={120}
              radius="sm"
              style={{ flexShrink: 0 }}
            />
          )}
          {renderContent()}
        </Group>
      </Card>
    );
  }

  // 最小化布局
  if (layout === 'minimal') {
    return (
      <Box
        style={{
          padding: theme.spacing.md,
          borderLeft: `4px solid ${theme.colors.blue[5]}`,
          backgroundColor: theme.colors.gray[0],
          borderRadius: theme.radius.md,
          cursor: 'pointer',
          ...style,
        }}
        onClick={onClick || (href ? () => window.open(href, '_blank') : undefined)}
      >
        <Stack gap="sm">
          <Group justify="space-between" align="flex-start">
            {renderBadges()}
            {renderActions()}
          </Group>
          
          <Text fw={600} lineClamp={2}>
            {title}
          </Text>
          
          <Text size="sm" c="dimmed" lineClamp={2}>
            {excerpt}
          </Text>
          
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <Text size="xs" c="dimmed">
                {author.name}
              </Text>
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Text size="xs" c="dimmed">
                {formatDate(publishedAt)}
              </Text>
            </Group>
            {readingTime && (
              <Text size="xs" c="dimmed">
                {readingTime} min
              </Text>
            )}
          </Group>
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
          border: `2px solid ${theme.colors.blue[3]}`,
          '&:hover': hoverable ? {
            transform: 'translateY(-6px)',
            boxShadow: theme.shadows.xl,
          } : {},
        }}
      >
        {image && (
          <Card.Section>
            <Box style={{ position: 'relative' }}>
              <Image src={image} alt={title} h={250} />
              <Box
                style={{
                  position: 'absolute',
                  top: theme.spacing.md,
                  right: theme.spacing.md,
                }}
              >
                <Badge variant="filled" color="orange" size="lg">
                  特色文章
                </Badge>
              </Box>
            </Box>
          </Card.Section>
        )}
        {renderContent()}
      </Card>
    );
  }

  // 标准卡片布局（默认）
  return (
    <Card
      {...cardProps}
      style={{
        ...cardProps.style,
        display: 'flex',
        flexDirection: 'column',
        '&:hover': hoverable ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows.lg,
        } : {},
      }}
    >
      {image && (
        <Card.Section>
          <Image src={image} alt={title} h={200} />
        </Card.Section>
      )}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </Box>
    </Card>
  );
}

// 预设的博客卡片变体
export function BlogCardStandard(props: Omit<BlogCardProps, 'layout'>) {
  return <BlogCard {...props} layout="card" />;
}

export function BlogCardHorizontal(props: Omit<BlogCardProps, 'layout'>) {
  return <BlogCard {...props} layout="horizontal" />;
}

export function BlogCardMinimal(props: Omit<BlogCardProps, 'layout'>) {
  return <BlogCard {...props} layout="minimal" />;
}

export function BlogCardFeatured(props: Omit<BlogCardProps, 'layout'>) {
  return <BlogCard {...props} layout="featured" />;
}

// 博客网格容器
export interface BlogGridProps {
  posts: BlogCardProps[];
  cols?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'card' | 'horizontal' | 'minimal' | 'featured';
}

export function BlogGrid({
  posts,
  cols = { base: 1, md: 2, lg: 3 },
  spacing = 'lg',
  layout = 'card',
}: BlogGridProps) {
  return (
    <SimpleGrid cols={cols} spacing={spacing}>
      {posts.map((post, index) => (
        <BlogCard key={index} {...post} layout={layout} />
      ))}
    </SimpleGrid>
  );
}

// 博客侧边栏推荐
export interface BlogSidebarProps {
  posts: BlogCardProps[];
  title?: string;
}

export function BlogSidebar({ posts, title = "推荐阅读" }: BlogSidebarProps) {
  return (
    <Card withBorder radius="lg" p="lg">
      <Stack gap="lg">
        <Text fw={700} size="lg">
          {title}
        </Text>
        <Stack gap="md">
          {posts.slice(0, 5).map((post, index) => (
            <Box key={index}>
              <BlogCard {...post} layout="minimal" />
              {index < Math.min(posts.length - 1, 4) && <Divider my="sm" />}
            </Box>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

export default BlogCard; 