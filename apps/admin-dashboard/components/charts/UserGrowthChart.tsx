'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { 
  Paper, 
  Title, 
  Group, 
  Text, 
  Stack, 
  Skeleton,
  Alert,
  SegmentedControl,
  ActionIcon,
  Loader,
  Center
} from '@mantine/core';
import { IconUsers, IconTrendingUp, IconRefresh, IconAlertCircle } from '@tabler/icons-react';
import { useMantineTheme } from '@mantine/core';

/**
 * 图表数据类型
 */
export interface UserGrowthChartData {
  date: string;
  count: number;
  cumulative: number;
  label: string;
}

/**
 * 图表组件 Props
 */
export interface UserGrowthChartProps {
  data?: UserGrowthChartData[];
  isLoading?: boolean;
  error?: { message: string } | null;
  onRefresh?: () => void;
  title?: string;
  height?: number;
  showToggle?: boolean;
  className?: string;
}

/**
 * 图表类型
 */
type ChartType = 'daily' | 'cumulative';

/**
 * 自定义 Tooltip 组件
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useMantineTheme();
  
  if (active && payload && payload.length) {
    return (
      <Paper 
        p="sm" 
        shadow="md" 
        style={{ 
          backgroundColor: theme.colors.gray[0],
          border: `1px solid ${theme.colors.gray[3]}`
        }}
      >
        <Text size="sm" fw={500} mb={4}>
          {payload[0]?.payload?.label || label}
        </Text>
        {payload.map((entry: any, index: number) => (
          <Text 
            key={index}
            size="sm" 
            c={entry.color}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <span 
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                backgroundColor: entry.color,
                borderRadius: '50%'
              }}
            />
            {entry.name}: {entry.value}
          </Text>
        ))}
      </Paper>
    );
  }
  return null;
};

/**
 * 用户增长趋势图表组件
 * 支持日新增和累计用户数两种视图
 */
export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({
  data = [],
  isLoading = false,
  error = null,
  onRefresh,
  title = "用户增长趋势",
  height = 300,
  showToggle = true,
  className
}) => {
  const theme = useMantineTheme();
  const [chartType, setChartType] = React.useState<ChartType>('daily');

  // 加载状态
  if (isLoading) {
    return (
      <Paper p="lg" shadow="sm" className={className}>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <IconUsers size={20} color={theme.colors.blue[6]} />
              <Title order={4}>{title}</Title>
            </Group>
            {onRefresh && (
              <ActionIcon 
                variant="subtle" 
                color="gray"
                disabled
              >
                <Loader size={16} />
              </ActionIcon>
            )}
          </Group>
          
          <Skeleton height={height} />
          
          <Center>
            <Text size="sm" c="dimmed">
              正在加载图表数据...
            </Text>
          </Center>
        </Stack>
      </Paper>
    );
  }

  // 错误状态
  if (error) {
    return (
      <Paper p="lg" shadow="sm" className={className}>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <IconUsers size={20} color={theme.colors.blue[6]} />
              <Title order={4}>{title}</Title>
            </Group>
            {onRefresh && (
              <ActionIcon 
                variant="subtle" 
                color="gray"
                onClick={onRefresh}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            )}
          </Group>
          
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="加载失败"
            color="red"
            variant="light"
          >
            <Stack gap="xs">
              <Text size="sm">
                无法加载图表数据: {error.message}
              </Text>
              {onRefresh && (
                <Text 
                  size="sm" 
                  c="blue" 
                  style={{ cursor: 'pointer' }}
                  onClick={onRefresh}
                >
                  点击重试
                </Text>
              )}
            </Stack>
          </Alert>
        </Stack>
      </Paper>
    );
  }

  // 数据为空状态
  if (!data || data.length === 0) {
    return (
      <Paper p="lg" shadow="sm" className={className}>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <IconUsers size={20} color={theme.colors.blue[6]} />
              <Title order={4}>{title}</Title>
            </Group>
            {onRefresh && (
              <ActionIcon 
                variant="subtle" 
                color="gray"
                onClick={onRefresh}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            )}
          </Group>
          
          <Center style={{ height }}>
            <Stack align="center" gap="sm">
              <IconTrendingUp size={48} color={theme.colors.gray[4]} />
              <Text size="sm" c="dimmed">
                暂无图表数据
              </Text>
            </Stack>
          </Center>
        </Stack>
      </Paper>
    );
  }

  // 渲染图表
  return (
    <Paper p="lg" shadow="sm" className={className}>
      <Stack gap="md">
        {/* 标题和控制栏 */}
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconUsers size={20} color={theme.colors.blue[6]} />
            <Title order={4}>{title}</Title>
          </Group>
          
          <Group gap="sm">
            {showToggle && (
              <SegmentedControl
                size="xs"
                value={chartType}
                onChange={(value) => setChartType(value as ChartType)}
                data={[
                  { label: '日新增', value: 'daily' },
                  { label: '累计', value: 'cumulative' }
                ]}
              />
            )}
            
            {onRefresh && (
              <ActionIcon 
                variant="subtle" 
                color="gray"
                onClick={onRefresh}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            )}
          </Group>
        </Group>

        {/* 图表区域 */}
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'daily' ? (
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.gray[3]} />
                <XAxis 
                  dataKey="label"
                  tick={{ fontSize: 12, fill: theme.colors.gray[6] }}
                  axisLine={{ stroke: theme.colors.gray[4] }}
                  tickLine={{ stroke: theme.colors.gray[4] }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: theme.colors.gray[6] }}
                  axisLine={{ stroke: theme.colors.gray[4] }}
                  tickLine={{ stroke: theme.colors.gray[4] }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke={theme.colors.blue[6]}
                  fill={theme.colors.blue[1]}
                  strokeWidth={2}
                  name="日新增用户"
                  fillOpacity={0.6}
                />
              </AreaChart>
            ) : (
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.gray[3]} />
                <XAxis 
                  dataKey="label"
                  tick={{ fontSize: 12, fill: theme.colors.gray[6] }}
                  axisLine={{ stroke: theme.colors.gray[4] }}
                  tickLine={{ stroke: theme.colors.gray[4] }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: theme.colors.gray[6] }}
                  axisLine={{ stroke: theme.colors.gray[4] }}
                  tickLine={{ stroke: theme.colors.gray[4] }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke={theme.colors.green[6]}
                  strokeWidth={3}
                  dot={{ r: 4, fill: theme.colors.green[6] }}
                  name="累计用户数"
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke={theme.colors.blue[6]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: theme.colors.blue[6] }}
                  name="日新增用户"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 图表说明 */}
        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed">
            {chartType === 'daily' 
              ? '展示每日新增用户数量趋势'
              : '展示用户总数增长趋势和每日新增对比'
            }
          </Text>
          
          {data.length > 0 && (
            <Group gap="lg">
              <Group gap="xs">
                <Text size="xs" c="dimmed">总计:</Text>
                <Text size="xs" fw={500} c="blue">
                  {data[data.length - 1]?.cumulative || 0} 用户
                </Text>
              </Group>
              <Group gap="xs">
                <Text size="xs" c="dimmed">最近新增:</Text>
                <Text size="xs" fw={500} c="green">
                  {data[data.length - 1]?.count || 0} 人
                </Text>
              </Group>
            </Group>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}; 