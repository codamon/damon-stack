/**
 * Dashboard tRPC 路由
 * 提供仪表盘相关的统计数据接口
 */

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../trpc';

/**
 * Dashboard 统计数据响应类型
 */
export interface DashboardStats {
  userStats: {
    total: number;
    active: number;
    admin: number;
    recentRegistrations: number;
    withLoginHistory: number;
  };
  systemStats: {
    uptime: string;
    lastDataUpdate: Date;
  };
  trends: {
    userGrowth: {
      value: number;
      percentage: number;
      trend: 'up' | 'down' | 'neutral';
      period: string;
    };
    activityTrend: {
      value: number;
      percentage: number;
      trend: 'up' | 'down' | 'neutral';
      period: string;
    };
  };
}

/**
 * 用户增长图表数据类型
 */
export interface UserGrowthChartData {
  date: string;
  count: number;
  cumulative: number;
  label: string; // 用于展示的日期标签
}

/**
 * Dashboard 路由定义
 */
export const dashboardRouter = createTRPCRouter({
  /**
   * 获取仪表盘统计数据
   * 需要用户登录访问
   */
  getStats: protectedProcedure
    .query(async ({ ctx }): Promise<DashboardStats> => {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      try {
        // 并行执行所有数据库查询，提高性能
        const [
          totalUsers,
          activeUsers,
          adminUsers,
          recentRegistrations,
          usersWithLoginHistory,
          recentRegistrationsLast30Days,
          totalUsersLast30Days,
        ] = await Promise.all([
          // 总用户数
          ctx.db.user.count(),
          
          // 活跃用户数 (status = 'active')
          ctx.db.user.count({
            where: { status: 'active' }
          }),
          
          // 管理员数量 (role = 'admin')
          ctx.db.user.count({
            where: { role: 'admin' }
          }),
          
          // 最近7天注册用户
          ctx.db.user.count({
            where: {
              createdAt: {
                gte: sevenDaysAgo
              }
            }
          }),
          
          // 有登录历史的用户
          ctx.db.user.count({
            where: {
              lastLoginAt: {
                not: null
              }
            }
          }),

          // 最近30天注册用户（用于计算增长趋势）
          ctx.db.user.count({
            where: {
              createdAt: {
                gte: thirtyDaysAgo
              }
            }
          }),

          // 30天前的总用户数（用于计算增长百分比）
          ctx.db.user.count({
            where: {
              createdAt: {
                lt: thirtyDaysAgo
              }
            }
          }),
        ]);

        // 计算用户增长趋势
        const userGrowthValue = recentRegistrationsLast30Days;
        const userGrowthPercentage = totalUsersLast30Days > 0 
          ? Math.round((userGrowthValue / totalUsersLast30Days) * 100 * 100) / 100
          : 0;
        
        // 计算活跃度趋势（活跃用户占总用户的百分比）
        const activityPercentage = totalUsers > 0 
          ? Math.round((activeUsers / totalUsers) * 100 * 100) / 100
          : 0;

        // 模拟活跃度趋势变化（实际项目中应该从历史数据计算）
        const activityTrendValue = Math.round((activityPercentage - 85) * 100) / 100; // 假设上月活跃度是85%
        
        const result: DashboardStats = {
          userStats: {
            total: totalUsers,
            active: activeUsers,
            admin: adminUsers,
            recentRegistrations,
            withLoginHistory: usersWithLoginHistory,
          },
          systemStats: {
            uptime: getSystemUptime(),
            lastDataUpdate: now,
          },
          trends: {
            userGrowth: {
              value: userGrowthValue,
              percentage: userGrowthPercentage,
              trend: userGrowthValue > 0 ? 'up' : userGrowthValue < 0 ? 'down' : 'neutral',
              period: '较上月',
            },
            activityTrend: {
              value: Math.abs(activityTrendValue),
              percentage: Math.abs(activityTrendValue),
              trend: activityTrendValue > 0 ? 'up' : activityTrendValue < 0 ? 'down' : 'neutral',
              period: '较上月',
            },
          },
        };

        return result;
      } catch (error) {
        console.error('获取仪表盘统计数据失败:', error);
        throw new Error('无法获取统计数据，请稍后重试');
      }
    }),

  /**
   * 获取用户增长趋势图表数据
   * 用于可视化展示用户注册增长情况
   * 需要管理员权限
   */
  getUserGrowth: adminProcedure
    .input(
      z.object({
        days: z.number().min(7).max(90).default(30), // 7-90天范围
        granularity: z.enum(['daily', 'weekly']).default('daily'), // 数据粒度
      })
    )
    .query(async ({ ctx, input }): Promise<UserGrowthChartData[]> => {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - input.days * 24 * 60 * 60 * 1000);

      try {
        // 获取指定时间范围内的所有用户注册数据
        const users = await ctx.db.user.findMany({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        });

        // 获取起始日期之前的总用户数（用于计算累计数）
        const baseUserCount = await ctx.db.user.count({
          where: {
            createdAt: {
              lt: startDate,
            },
          },
        });

        // 根据粒度生成日期范围
        const dateRanges = generateDateRanges(startDate, endDate, input.granularity);
        
        // 按时间粒度分组统计
        const chartData: UserGrowthChartData[] = [];
        let cumulativeCount = baseUserCount;

        for (const { start, end, label, dateKey } of dateRanges) {
          // 统计该时间段内的注册用户数
          const periodUsers = users.filter(user => 
            user.createdAt >= start && user.createdAt < end
          );

          const count = periodUsers.length;
          cumulativeCount += count;

          chartData.push({
            date: dateKey,
            count,
            cumulative: cumulativeCount,
            label,
          });
        }

        return chartData;
      } catch (error) {
        console.error('获取用户增长图表数据失败:', error);
        throw new Error('无法获取图表数据，请稍后重试');
      }
    }),

  /**
   * 获取用户注册趋势数据（按天）
   * 用于趋势图表展示
   */
  getUserRegistrationTrend: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(365).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - input.days * 24 * 60 * 60 * 1000);

      try {
        // 获取指定时间范围内的用户注册数据
        const users = await ctx.db.user.findMany({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        });

        // 按日期分组统计
        const dailyStats = new Map<string, number>();
        
        // 初始化所有日期为0
        for (let i = 0; i < input.days; i++) {
          const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
          const dateKey = date.toISOString().split('T')[0];
          dailyStats.set(dateKey, 0);
        }

        // 统计每日注册数
        users.forEach(user => {
          const dateKey = user.createdAt.toISOString().split('T')[0];
          dailyStats.set(dateKey, (dailyStats.get(dateKey) || 0) + 1);
        });

        // 转换为数组格式
        const trendData = Array.from(dailyStats.entries()).map(([date, count]) => ({
          date,
          registrations: count,
        }));

        return trendData;
      } catch (error) {
        console.error('获取用户注册趋势失败:', error);
        throw new Error('无法获取趋势数据，请稍后重试');
      }
    }),
});

/**
 * 生成日期范围的辅助函数
 */
function generateDateRanges(
  startDate: Date, 
  endDate: Date, 
  granularity: 'daily' | 'weekly'
): Array<{ start: Date; end: Date; label: string; dateKey: string }> {
  const ranges: Array<{ start: Date; end: Date; label: string; dateKey: string }> = [];
  const current = new Date(startDate);

  while (current < endDate) {
    const rangeStart = new Date(current);
    const rangeEnd = new Date(current);

    if (granularity === 'daily') {
      rangeEnd.setDate(rangeEnd.getDate() + 1);
    } else { // weekly
      rangeEnd.setDate(rangeEnd.getDate() + 7);
    }

    // 确保不超过结束日期
    if (rangeEnd > endDate) {
      rangeEnd.setTime(endDate.getTime());
    }

    // 生成标签和键
    const label = granularity === 'daily' 
      ? `${rangeStart.getMonth() + 1}/${rangeStart.getDate()}`
      : `${rangeStart.getMonth() + 1}/${rangeStart.getDate()}-${rangeEnd.getMonth() + 1}/${rangeEnd.getDate()}`;
    
    const dateKey = granularity === 'daily'
      ? rangeStart.toISOString().split('T')[0]
      : `${rangeStart.toISOString().split('T')[0]}_${rangeEnd.toISOString().split('T')[0]}`;

    ranges.push({
      start: rangeStart,
      end: rangeEnd,
      label,
      dateKey,
    });

    // 移动到下一个时间段
    if (granularity === 'daily') {
      current.setDate(current.getDate() + 1);
    } else {
      current.setDate(current.getDate() + 7);
    }
  }

  return ranges;
}

/**
 * 获取系统运行时间
 * 简单的系统运行时间计算
 */
function getSystemUptime(): string {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
  const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);

  if (days > 0) {
    return `${days}天 ${hours}小时`;
  } else if (hours > 0) {
    return `${hours}小时 ${minutes}分钟`;
  } else {
    return `${minutes}分钟`;
  }
} 