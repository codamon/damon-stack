'use client';

import React from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Box,
  Image,
  BackgroundImage,
  Overlay,
  Center,
  SimpleGrid,
  ThemeIcon,
  Badge,
  Flex,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  IconRocket,
  IconCheck,
  IconStar,
  IconTrendingUp,
  IconUsers,
  IconCode,
  IconBolt,
  IconShield,
  IconPlayerPlay,
  IconDownload,
  IconArrowRight,
} from '@tabler/icons-react';

export interface HeroAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'filled' | 'outline' | 'light' | 'default' | 'subtle' | 'gradient';
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export interface HeroFeature {
  icon: React.ReactNode;
  label: string;
  description?: string;
}

export interface HeroStats {
  value: string | number;
  label: string;
  suffix?: string;
  prefix?: string;
}

export interface HeroSectionProps {
  /** 主标题 */
  title: string | React.ReactNode;
  /** 副标题/描述 */
  subtitle?: string;
  /** 操作按钮组 */
  actions?: HeroAction[];
  /** 特性列表 */
  features?: HeroFeature[];
  /** 统计数据 */
  stats?: HeroStats[];
  /** 主图片/视频 */
  media?: {
    type: 'image' | 'video';
    src: string;
    alt?: string;
    autoPlay?: boolean;
    loop?: boolean;
  };
  /** 背景图片 */
  backgroundImage?: string;
  /** 是否显示覆盖层 */
  withOverlay?: boolean;
  /** 覆盖层透明度 */
  overlayOpacity?: number;
  /** 布局类型 */
  layout?: 'centered' | 'split' | 'stacked';
  /** 内容对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 容器最大宽度 */
  containerSize?: string | number;
  /** 内边距 */
  padding?: string | number;
  /** 最小高度 */
  minHeight?: string | number;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

const defaultFeatures: HeroFeature[] = [
  {
    icon: <IconBolt size={20} />,
    label: '快速部署',
    description: '5分钟内完成部署',
  },
  {
    icon: <IconShield size={20} />,
    label: '安全可靠',
    description: '企业级安全保障',
  },
  {
    icon: <IconCode size={20} />,
    label: '开源免费',
    description: '完全开源，免费使用',
  },
];

const defaultStats: HeroStats[] = [
  { value: '10K+', label: '活跃用户' },
  { value: '99.9', label: '可用性', suffix: '%' },
  { value: '24/7', label: '技术支持' },
  { value: '50+', label: '集成方案' },
];

export function HeroSection({
  title,
  subtitle,
  actions,
  features,
  stats,
  media,
  backgroundImage,
  withOverlay = false,
  overlayOpacity = 0.4,
  layout = 'centered',
  align = 'center',
  containerSize = 'xl',
  padding = 'xl',
  minHeight = '60vh',
  style,
}: HeroSectionProps) {
  const theme = useMantineTheme();

  const renderTitle = () => {
    if (typeof title === 'string') {
      return (
        <Title
          order={1}
          size="3.5rem"
          fw={900}
          lh={1.1}
          ta={align}
          style={{
            background: `linear-gradient(45deg, ${theme.colors.blue[6]}, ${theme.colors.cyan[5]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </Title>
      );
    }
    return title;
  };

  const renderActions = () => {
    if (!actions || actions.length === 0) return null;

    return (
      <Group gap="md" justify={align}>
        {actions.map((action, index) => (
          <Button
            key={index}
            component={action.href ? 'a' : 'button'}
            href={action.href}
            onClick={action.onClick}
            variant={action.variant || (index === 0 ? 'gradient' : 'outline')}
            gradient={index === 0 ? { from: 'blue', to: 'cyan', deg: 45 } : undefined}
            color={action.color}
            size={action.size || 'lg'}
            leftSection={action.leftSection}
            rightSection={action.rightSection}
            loading={action.loading}
            disabled={action.disabled}
            radius="xl"
            style={{
              minWidth: rem(120),
            }}
          >
            {action.label}
          </Button>
        ))}
      </Group>
    );
  };

  const renderFeatures = () => {
    if (!features || features.length === 0) return null;

    return (
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {features.map((feature, index) => (
          <Group key={index} gap="sm" justify={align === 'center' ? 'center' : 'flex-start'}>
            <ThemeIcon variant="light" size="md" radius="md">
              {feature.icon}
            </ThemeIcon>
            <Box>
              <Text fw={600} size="sm">
                {feature.label}
              </Text>
              {feature.description && (
                <Text size="xs" c="dimmed">
                  {feature.description}
                </Text>
              )}
            </Box>
          </Group>
        ))}
      </SimpleGrid>
    );
  };

  const renderStats = () => {
    if (!stats || stats.length === 0) return null;

    return (
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        {stats.map((stat, index) => (
          <Box key={index} ta="center">
            <Text size="2rem" fw={900} c="blue">
              {stat.prefix}
              {stat.value}
              {stat.suffix}
            </Text>
            <Text size="sm" c="dimmed" fw={500}>
              {stat.label}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    );
  };

  const renderMedia = () => {
    if (!media) return null;

    if (media.type === 'video') {
      return (
        <Box style={{ borderRadius: theme.radius.lg, overflow: 'hidden' }}>
          <video
            src={media.src}
            autoPlay={media.autoPlay}
            loop={media.loop}
            muted
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      );
    }

    return (
      <Image
        src={media.src}
        alt={media.alt || 'Hero image'}
        radius="lg"
        style={{
          maxHeight: rem(400),
          objectFit: 'cover',
        }}
      />
    );
  };

  const renderContent = () => {
    const content = (
      <Stack gap="xl" align={align === 'center' ? 'center' : 'flex-start'}>
        {/* Badge */}
        <Badge
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
          size="lg"
          radius="xl"
        >
          🚀 新版本发布
        </Badge>

        {/* Title */}
        {renderTitle()}

        {/* Subtitle */}
        {subtitle && (
          <Text
            size="xl"
            c="dimmed"
            ta={align}
            maw={600}
            style={{ lineHeight: 1.6 }}
          >
            {subtitle}
          </Text>
        )}

        {/* Features */}
        {renderFeatures()}

        {/* Actions */}
        {renderActions()}

        {/* Stats */}
        {renderStats()}
      </Stack>
    );

    if (layout === 'split') {
      return (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Box>{content}</Box>
          <Box>{renderMedia()}</Box>
        </SimpleGrid>
      );
    }

    if (layout === 'stacked') {
      return (
        <Stack gap="xl" align="center">
          {content}
          {renderMedia()}
        </Stack>
      );
    }

    return content;
  };

  const heroContent = (
    <Container size={containerSize} p={padding} style={{ minHeight }}>
      <Center style={{ minHeight: 'inherit' }}>
        {renderContent()}
      </Center>
    </Container>
  );

  if (backgroundImage) {
    return (
      <BackgroundImage src={backgroundImage} style={style}>
        {withOverlay && <Overlay opacity={overlayOpacity} />}
        <Box style={{ position: 'relative', zIndex: 1 }}>
          {heroContent}
        </Box>
      </BackgroundImage>
    );
  }

  return (
    <Box style={{ position: 'relative', ...style }}>
      {heroContent}
    </Box>
  );
}

// 预设的Hero组件变体
export function HeroSectionCentered(props: Omit<HeroSectionProps, 'layout'>) {
  return <HeroSection {...props} layout="centered" />;
}

export function HeroSectionSplit(props: Omit<HeroSectionProps, 'layout'>) {
  return <HeroSection {...props} layout="split" />;
}

export function HeroSectionStacked(props: Omit<HeroSectionProps, 'layout'>) {
  return <HeroSection {...props} layout="stacked" />;
}

export default HeroSection; 