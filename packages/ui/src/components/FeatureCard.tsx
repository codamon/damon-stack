'use client';

import React from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  Box,
  ThemeIcon,
  Badge,
  Button,
  Anchor,
  Image,
  Center,
  rem,
  useMantineTheme,
  Overlay,
  BackgroundImage,
} from '@mantine/core';
import {
  IconArrowRight,
  IconExternalLink,
  IconStar,
  IconTrendingUp,
  IconBolt,
  IconShield,
  IconCode,
  IconUsers,
  IconCheck,
  IconHeart,
} from '@tabler/icons-react';

export interface FeatureCardProps {
  /** 特性图标 */
  icon?: React.ReactNode;
  /** 特性标题 */
  title: string;
  /** 特性描述 */
  description: string;
  /** 特性图片 */
  image?: string;
  /** 特性标签/分类 */
  badge?: {
    label: string;
    color?: string;
    variant?: 'filled' | 'light' | 'outline' | 'dot' | 'gradient';
  };
  /** 行动按钮 */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'filled' | 'outline' | 'light' | 'default' | 'subtle';
    color?: string;
    external?: boolean;
  };
  /** 卡片布局类型 */
  layout?: 'vertical' | 'horizontal' | 'overlay';
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
  /** 卡片高度 */
  height?: string | number;
  /** 点击事件 */
  onClick?: () => void;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 是否禁用 */
  disabled?: boolean;
}

export function FeatureCard({
  icon,
  title,
  description,
  image,
  badge,
  action,
  layout = 'vertical',
  hoverable = true,
  withShadow = true,
  withBorder = false,
  radius = 'lg',
  padding = 'lg',
  height,
  onClick,
  style,
  disabled = false,
}: FeatureCardProps) {
  const theme = useMantineTheme();

  const renderIcon = () => {
    if (!icon) return null;

    return (
      <ThemeIcon
        size="xl"
        radius="md"
        variant="gradient"
        gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
      >
        {icon}
      </ThemeIcon>
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

  const renderAction = () => {
    if (!action) return null;

    const buttonContent = (
      <Group gap="xs">
        <Text size="sm" fw={500}>
          {action.label}
        </Text>
        {action.external ? (
          <IconExternalLink size={14} />
        ) : (
          <IconArrowRight size={14} />
        )}
      </Group>
    );

    if (action.href) {
      return (
        <Button
          component="a"
          href={action.href}
          target={action.external ? '_blank' : undefined}
          rel={action.external ? 'noopener noreferrer' : undefined}
          variant={action.variant || 'light'}
          color={action.color || 'blue'}
          size="sm"
          radius="md"
          style={{ alignSelf: 'flex-start' }}
        >
          {buttonContent}
        </Button>
      );
    }

    return (
      <Button
        onClick={action.onClick}
        variant={action.variant || 'light'}
        color={action.color || 'blue'}
        size="sm"
        radius="md"
        style={{ alignSelf: 'flex-start' }}
      >
        {buttonContent}
      </Button>
    );
  };

  const renderContent = () => (
    <Stack gap="md" style={{ flex: 1 }}>
      <Group justify="space-between" align="flex-start">
        <Stack gap="sm" style={{ flex: 1 }}>
          <Group gap="sm">
            {renderIcon()}
            {renderBadge()}
          </Group>
          <Text fw={700} size="lg" lh={1.3}>
            {title}
          </Text>
        </Stack>
      </Group>

      <Text c="dimmed" size="sm" lh={1.5}>
        {description}
      </Text>

      {renderAction()}
    </Stack>
  );

  const cardProps = {
    shadow: withShadow ? 'sm' : undefined,
    withBorder,
    radius,
    padding,
    h: height,
    style: {
      cursor: (hoverable || onClick) && !disabled ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.6 : 1,
      pointerEvents: disabled ? ('none' as const) : ('auto' as const),
      ...style,
    } as React.CSSProperties,
    onClick: disabled ? undefined : onClick,
  };

  // 水平布局
  if (layout === 'horizontal') {
    return (
              <Card
          {...cardProps}
          style={{
            ...cardProps.style,
          }}
        >
        <Group gap="lg" align="flex-start">
          {image && (
            <Image
              src={image}
              alt={title}
              w={120}
              h={80}
              radius="sm"
              style={{ flexShrink: 0 }}
            />
          )}
          {renderContent()}
        </Group>
      </Card>
    );
  }

  // 覆盖层布局
  if (layout === 'overlay' && image) {
    return (
      <Card
        {...cardProps}
        padding={0}
        style={{
          ...cardProps.style,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <BackgroundImage src={image} h={height || 300}>
          <Overlay opacity={0.4} color="dark" />
          <Box
            style={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: theme.spacing.lg,
            }}
          >
            <Stack gap="sm">
              <Group>
                {renderBadge()}
              </Group>
              <Text fw={700} size="xl" c="white">
                {title}
              </Text>
              <Text c="gray.2" size="sm" lineClamp={2}>
                {description}
              </Text>
              {action && (
                <Box mt="xs">
                  {renderAction()}
                </Box>
              )}
            </Stack>
          </Box>
        </BackgroundImage>
      </Card>
    );
  }

  // 垂直布局（默认）
  return (
    <Card
      {...cardProps}
      style={{
        ...cardProps.style,
        display: 'flex',
        flexDirection: 'column',
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

// 预设的特性卡片变体
export function FeatureCardVertical(props: Omit<FeatureCardProps, 'layout'>) {
  return <FeatureCard {...props} layout="vertical" />;
}

export function FeatureCardHorizontal(props: Omit<FeatureCardProps, 'layout'>) {
  return <FeatureCard {...props} layout="horizontal" />;
}

export function FeatureCardOverlay(props: Omit<FeatureCardProps, 'layout'>) {
  return <FeatureCard {...props} layout="overlay" />;
}

// 特性卡片网格容器
export interface FeatureGridProps {
  features: FeatureCardProps[];
  cols?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'vertical' | 'horizontal' | 'overlay';
}

export function FeatureGrid({
  features,
  cols = { base: 1, sm: 2, lg: 3 },
  spacing = 'lg',
  layout = 'vertical',
}: FeatureGridProps) {
  return (
    <Box>
      <Stack gap={spacing}>
        {Array.from({ length: Math.ceil(features.length / (cols.lg || 3)) }).map((_, rowIndex) => (
          <Group key={rowIndex} gap={spacing} align="stretch">
            {features
              .slice(rowIndex * (cols.lg || 3), (rowIndex + 1) * (cols.lg || 3))
              .map((feature, index) => (
                <Box key={index} style={{ flex: 1 }}>
                  <FeatureCard {...feature} layout={layout} />
                </Box>
              ))}
          </Group>
        ))}
      </Stack>
    </Box>
  );
}

export default FeatureCard; 