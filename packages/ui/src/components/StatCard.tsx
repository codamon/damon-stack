'use client';

import React from 'react';
import {
  Paper,
  Group,
  Text,
  ThemeIcon,
  Badge,
  Stack,
  Skeleton,
  Box,
  type PaperProps,
  type MantineColor,
  type MantineSize,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
} from '@tabler/icons-react';

/**
 * 趋势类型定义
 */
export type TrendType = 'up' | 'down' | 'neutral';

/**
 * 趋势数据接口
 */
export interface TrendData {
  /** 变化数值 */
  value: number;
  /** 变化百分比 */
  percentage?: number;
  /** 趋势方向 */
  trend: TrendType;
  /** 对比期间描述 */
  period?: string;
}

/**
 * StatCard 组件 Props 接口
 */
export interface StatCardProps extends Omit<PaperProps, 'children'> {
  /** 卡片标题 */
  title: string;
  /** 显示的核心数值 */
  value: string | number;
  /** 图标 React 节点 */
  icon: React.ReactNode;
  /** 趋势数据（可选） */
  diff?: TrendData;
  /** 加载状态 */
  loading?: boolean;
  /** 图标颜色 */
  iconColor?: MantineColor;
  /** 卡片大小 */
  size?: MantineSize;
  /** 数值格式化函数 */
  formatValue?: (value: string | number) => string;
  /** 自定义样式类名 */
  className?: string;
  /** 点击事件 */
  onClick?: () => void;
}

/**
 * 获取趋势图标
 */
const getTrendIcon = (trend: TrendType, size: number = 14) => {
  switch (trend) {
    case 'up':
      return <IconTrendingUp size={size} />;
    case 'down':
      return <IconTrendingDown size={size} />;
    case 'neutral':
    default:
      return <IconMinus size={size} />;
  }
};

/**
 * 获取趋势颜色
 */
const getTrendColor = (trend: TrendType): MantineColor => {
  switch (trend) {
    case 'up':
      return 'green';
    case 'down':
      return 'red';
    case 'neutral':
    default:
      return 'gray';
  }
};

/**
 * 默认数值格式化函数
 */
const defaultFormatValue = (value: string | number): string => {
  if (typeof value === 'number') {
    // 格式化数字，添加千分位分隔符
    return value.toLocaleString();
  }
  return String(value);
};

/**
 * StatCard 组件
 * 
 * 可复用的数据统计卡片组件，用于展示关键绩效指标 (KPI)
 * 
 * @example
 * ```tsx
 * import { StatCard } from '@damon-stack/ui';
 * import { IconUsers } from '@tabler/icons-react';
 * 
 * <StatCard
 *   title="总用户数"
 *   value={1234}
 *   icon={<IconUsers />}
 *   diff={{
 *     value: 12,
 *     percentage: 8.5,
 *     trend: 'up',
 *     period: '较上月'
 *   }}
 *   iconColor="blue"
 * />
 * ```
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  diff,
  loading = false,
  iconColor = 'blue',
  size = 'md',
  formatValue = defaultFormatValue,
  className,
  onClick,
  ...paperProps
}) => {
  // 根据 size 确定尺寸
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 28 : 24;
  const titleSize = size === 'sm' ? 'xs' : size === 'lg' ? 'sm' : 'xs';
  const valueSize = size === 'sm' ? 'lg' : size === 'lg' ? '28' : 'xl';
  const padding = size === 'sm' ? 'sm' : size === 'lg' ? 'xl' : 'md';

  // 加载状态
  if (loading) {
    return (
      <Paper
        p={padding}
        withBorder
        radius="md"
        className={className}
        {...paperProps}
      >
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs" style={{ flex: 1 }}>
            <Skeleton height={16} width="60%" />
            <Skeleton height={28} width="40%" />
            {diff && <Skeleton height={20} width="50%" />}
          </Stack>
          <Skeleton height={iconSize + 16} width={iconSize + 16} circle />
        </Group>
      </Paper>
    );
  }

  return (
    <Paper
      p={padding}
      withBorder
      radius="md"
      className={className}
      style={{ 
        cursor: onClick ? 'pointer' : undefined,
        transition: onClick ? 'transform 0.1s ease' : undefined,
        ...paperProps.style,
      }}
      {...(onClick && {
        onMouseEnter: (e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        },
      })}
      onClick={onClick}
      {...paperProps}
    >
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs" style={{ flex: 1 }}>
          {/* 标题 */}
          <Text size={titleSize} c="dimmed" fw={500}>
            {title}
          </Text>
          
          {/* 数值 */}
          <Text size={valueSize} fw={700} lh={1.2}>
            {formatValue(value)}
          </Text>
          
          {/* 趋势信息 */}
          {diff && (
            <Box>
              <Badge
                size="sm"
                variant="light"
                color={getTrendColor(diff.trend)}
                leftSection={getTrendIcon(diff.trend, 12)}
              >
                <Group gap={4} wrap="nowrap">
                  <Text size="xs" fw={600}>
                    {diff.percentage ? `${diff.percentage}%` : diff.value}
                  </Text>
                  {diff.period && (
                    <Text size="xs" c="dimmed">
                      {diff.period}
                    </Text>
                  )}
                </Group>
              </Badge>
            </Box>
          )}
        </Stack>
        
        {/* 图标 */}
        <ThemeIcon
          size={iconSize + 16}
          radius="md"
          variant="light"
          color={iconColor}
        >
          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </Box>
        </ThemeIcon>
      </Group>
    </Paper>
  );
};

export default StatCard; 