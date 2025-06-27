/**
 * @damon-stack/db 数据库包
 * 
 * 导出 Prisma 客户端实例和相关类型
 */

import { PrismaClient } from '@prisma/client';

/**
 * 全局 Prisma 客户端实例
 * 在开发环境中复用连接，避免过多的数据库连接
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma 客户端实例
 * 
 * 在开发环境中使用全局实例以避免热重载时创建过多连接
 * 在生产环境中创建新实例
 */
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// 在开发环境中将实例保存到全局对象
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

/**
 * 重新导出 Prisma 类型
 */
export * from '@prisma/client';

/**
 * 默认导出数据库实例
 */
export default db; 