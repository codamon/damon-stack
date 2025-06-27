'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Title, Stack, Group, SimpleGrid, Alert, Text, Center, Loader, Divider } from '@mantine/core';
import { 
  IconUsers, 
  IconUserCheck, 
  IconShield, 
  IconActivity,
  IconUserPlus,
  IconAlertCircle
} from '@tabler/icons-react';
import { StatCard } from '@damon-stack/ui';
import { UserGrowthChart } from '../../components';
import { api } from '../../trpc/react';

/**
 * Dashboard 页面
 * 展示系统的核心统计数据和关键绩效指标
 * 使用 tRPC API 获取真实数据
 */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 认证检查
  useEffect(() => {
    if (status === 'loading') return; // 仍在加载
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
  }, [status, router]);

  // 使用 tRPC 获取仪表盘统计数据
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = api.dashboard.getStats.useQuery(undefined, {
    refetchInterval: 30000, // 每30秒刷新一次数据
    staleTime: 10000, // 10秒内的数据认为是新鲜的
    enabled: !!session, // 只有在有会话时才执行查询
  });

  // 获取用户增长图表数据 (只有管理员可以查看)
  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError,
    refetch: refetchChart
  } = api.dashboard.getUserGrowth.useQuery(
    { days: 30, granularity: 'daily' }, 
    {
      enabled: !!session && session.user.role === 'admin', // 只有管理员才能获取图表数据
      refetchInterval: 60000, // 每分钟刷新图表数据
      staleTime: 30000, // 30秒内的数据认为是新鲜的
    }
  );

  // 认证加载状态
  if (status === 'loading') {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" color="blue" />
          <Text c="dimmed">验证用户身份...</Text>
        </Stack>
      </Center>
    );
  }

  // 如果未认证，显示重定向信息
  if (status === 'unauthenticated') {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Stack align="center" gap="md">
          <Text>正在重定向到登录页...</Text>
        </Stack>
      </Center>
    );
  }

  // 数据加载状态
  if (statsLoading) {
    return (
      <Stack gap="xl">
        {/* 页面标题 */}
        <Group justify="space-between" align="center">
          <Title order={1}>仪表盘概览</Title>
        </Group>

        {/* 加载状态的骨架屏 */}
        <SimpleGrid 
          cols={{ base: 1, sm: 2, lg: 4 }} 
          spacing="lg"
          verticalSpacing="lg"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCard
              key={index}
              title="加载中..."
              value={0}
              icon={<IconUsers size={24} />}
              loading={true}
            />
          ))}
        </SimpleGrid>

        {/* 系统信息加载状态 */}
        <SimpleGrid 
          cols={{ base: 1, sm: 2, lg: 3 }} 
          spacing="lg"
          verticalSpacing="lg"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <StatCard
              key={index}
              title="系统信息加载中..."
              value="..."
              icon={<IconActivity size={24} />}
              loading={true}
              size="sm"
            />
          ))}
        </SimpleGrid>

        {/* 图表加载状态 */}
        {session?.user.role === 'admin' && (
          <>
            <Divider label="用户增长分析" labelPosition="center" />
            <UserGrowthChart 
              isLoading={true}
              height={400}
            />
          </>
        )}
      </Stack>
    );
  }

  // 错误状态
  if (statsError) {
    return (
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={1}>仪表盘概览</Title>
        </Group>

        <Alert
          icon={<IconAlertCircle size={16} />}
          title="加载失败"
          color="red"
          variant="light"
        >
          <Stack gap="sm">
            <Text size="sm">
              无法加载仪表盘数据: {statsError.message}
            </Text>
            <Text 
              size="sm" 
              c="blue" 
              style={{ cursor: 'pointer' }}
              onClick={() => refetchStats()}
            >
              点击重试
            </Text>
          </Stack>
        </Alert>
      </Stack>
    );
  }

  // 确保数据存在
  if (!stats) {
    return (
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={1}>仪表盘概览</Title>
        </Group>
        <Text>暂无数据</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      {/* 页面标题和最后更新时间 */}
      <Group justify="space-between" align="center">
        <Title order={1}>仪表盘概览</Title>
        <Text size="sm" c="dimmed">
          最后更新: {new Date(stats.systemStats.lastDataUpdate).toLocaleString('zh-CN')}
        </Text>
      </Group>

      {/* 主要用户统计卡片 */}
      <SimpleGrid 
        cols={{ base: 1, sm: 2, lg: 4 }} 
        spacing="lg"
        verticalSpacing="lg"
      >
        {/* 总用户数 */}
        <StatCard
          title="总用户数"
          value={stats.userStats.total}
          icon={<IconUsers size={24} />}
          iconColor="blue"
          diff={{
            value: stats.trends.userGrowth.value,
            percentage: stats.trends.userGrowth.percentage,
            trend: stats.trends.userGrowth.trend,
            period: stats.trends.userGrowth.period
          }}
        />

        {/* 活跃用户 */}
        <StatCard
          title="活跃用户"
          value={stats.userStats.active}
          icon={<IconUserCheck size={24} />}
          iconColor="green"
          diff={{
            value: stats.trends.activityTrend.value,
            percentage: stats.trends.activityTrend.percentage,
            trend: stats.trends.activityTrend.trend,
            period: stats.trends.activityTrend.period
          }}
        />

        {/* 管理员数量 */}
        <StatCard
          title="管理员"
          value={stats.userStats.admin}
          icon={<IconShield size={24} />}
          iconColor="red"
          diff={{
            value: 0,
            trend: 'neutral',
            period: '保持稳定'
          }}
        />

        {/* 活跃度百分比 */}
        <StatCard
          title="用户活跃度"
          value={`${Math.round((stats.userStats.active / stats.userStats.total) * 100)}%`}
          icon={<IconActivity size={24} />}
          iconColor="cyan"
          diff={{
            value: stats.trends.activityTrend.value,
            percentage: stats.trends.activityTrend.percentage,
            trend: stats.trends.activityTrend.trend,
            period: stats.trends.activityTrend.period
          }}
        />
      </SimpleGrid>

      {/* 辅助统计卡片 */}
      <SimpleGrid 
        cols={{ base: 1, sm: 2, lg: 3 }} 
        spacing="lg"
        verticalSpacing="lg"
      >
        {/* 最近注册用户 */}
        <StatCard
          title="近7天注册"
          value={stats.userStats.recentRegistrations}
          icon={<IconUserPlus size={20} />}
          iconColor="orange"
          size="sm"
          diff={{
            value: stats.userStats.recentRegistrations,
            trend: stats.userStats.recentRegistrations > 0 ? 'up' : 'neutral',
            period: '本周'
          }}
        />

        {/* 有登录记录用户 */}
        <StatCard
          title="有登录记录"
          value={stats.userStats.withLoginHistory}
          icon={<IconActivity size={20} />}
          iconColor="violet"
          size="sm"
          formatValue={(value) => `${value} 人`}
        />

        {/* 系统运行时间 */}
        <StatCard
          title="系统运行时间"
          value={stats.systemStats.uptime}
          icon={<IconActivity size={20} />}
          iconColor="teal"
          size="sm"
          diff={{
            value: 0,
            trend: 'up',
            period: '持续运行'
          }}
        />
      </SimpleGrid>

      {/* 管理员专属：用户增长趋势图表 */}
      {session?.user.role === 'admin' && (
        <>
          <Divider 
            label="用户增长分析（管理员专属）" 
            labelPosition="center" 
            size="sm"
            color="blue"
          />
          
          <UserGrowthChart
            data={chartData}
            isLoading={chartLoading}
            error={chartError}
            onRefresh={() => refetchChart()}
            title="用户增长趋势 (近30天)"
            height={400}
            showToggle={true}
          />
        </>
      )}

      {/* 非管理员用户的提示 */}
      {session?.user.role !== 'admin' && (
        <>
          <Divider label="高级数据分析" labelPosition="center" size="sm" />
          
          <Alert color="blue" variant="light">
            <Text size="sm">
              💡 想要查看更详细的数据分析图表？请联系管理员获取高级权限。
            </Text>
          </Alert>
        </>
      )}

      {/* 数据说明 */}
      <Alert color="blue" variant="light">
        <Text size="sm">
          💡 数据每30秒自动刷新。统计基于当前数据库中的真实用户数据，
          包括用户角色、状态和注册时间等信息。
          {session?.user.role === 'admin' && '图表数据每分钟更新一次。'}
        </Text>
      </Alert>
    </Stack>
  );
} 