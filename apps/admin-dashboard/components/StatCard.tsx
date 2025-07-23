'use client';

import { ReactNode } from 'react';
import { 
  Paper, 
  Group, 
  Text, 
  ThemeIcon, 
  Stack,
  Skeleton,
  Badge,
  Tooltip
} from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react';

export interface StatCardDiff {
  value: number;
  percentage?: number;
  trend: 'up' | 'down' | 'neutral';
  period: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconColor?: string;
  diff?: StatCardDiff;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  formatValue?: (value: string | number) => string;
}

/**
 * 获取趋势图标
 */
function getTrendIcon(trend: 'up' | 'down' | 'neutral') {
  switch (trend) {
    case 'up':
      return <IconTrendingUp size={14} />;
    case 'down':
      return <IconTrendingDown size={14} />;
    case 'neutral':
    default:
      return <IconMinus size={14} />;
  }
}

/**
 * 获取趋势颜色
 */
function getTrendColor(trend: 'up' | 'down' | 'neutral') {
  switch (trend) {
    case 'up':
      return 'green';
    case 'down':
      return 'red';
    case 'neutral':
    default:
      return 'gray';
  }
}

/**
 * 格式化数字显示
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * StatCard 统计卡片组件
 * 用于展示关键统计数据，支持趋势变化和加载状态
 */
export function StatCard({
  title,
  value,
  icon,
  iconColor = 'blue',
  diff,
  size = 'md',
  loading = false,
  formatValue,
}: StatCardProps) {
  const padding = size === 'sm' ? 'md' : size === 'lg' ? 'xl' : 'lg';
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const valueSize = size === 'sm' ? 'lg' : size === 'lg' ? 'xl' : 'xl';

  if (loading) {
    return (
      <Paper withBorder p={padding} radius="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs" style={{ flex: 1 }}>
            <Skeleton height={16} width="60%" />
            <Skeleton height={size === 'lg' ? 32 : 28} width="80%" />
            {diff && <Skeleton height={14} width="40%" />}
          </Stack>
          <Skeleton height={iconSize} width={iconSize} circle />
        </Group>
      </Paper>
    );
  }

  const displayValue = formatValue ? formatValue(value) : 
    typeof value === 'number' ? formatNumber(value) : value;

  return (
    <Paper 
      withBorder 
      p={padding} 
      radius="md"
      style={{
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs" style={{ flex: 1 }}>
          {/* 标题 */}
          <Text size="sm" c="dimmed" fw={500}>
            {title}
          </Text>

          {/* 数值 */}
          <Text size={valueSize} fw={700} c="dark">
            {displayValue}
          </Text>

          {/* 趋势信息 */}
          {diff && (
            <Group gap="xs" align="center">
              <Badge
                size="sm"
                variant="light"
                color={getTrendColor(diff.trend)}
                leftSection={getTrendIcon(diff.trend)}
              >
                {diff.percentage !== undefined ? (
                  `${diff.percentage > 0 ? '+' : ''}${diff.percentage.toFixed(1)}%`
                ) : (
                  `${diff.value > 0 ? '+' : ''}${diff.value}`
                )}
              </Badge>
              <Tooltip label={diff.period}>
                <Text size="xs" c="dimmed">
                  {diff.period}
                </Text>
              </Tooltip>
            </Group>
          )}
        </Stack>

        {/* 图标 */}
        <ThemeIcon
          size={iconSize}
          radius="md"
          color={iconColor}
          variant="light"
        >
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
} 