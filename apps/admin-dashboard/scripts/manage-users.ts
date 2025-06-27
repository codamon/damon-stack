/**
 * 用户管理脚本
 * 用于权限控制测试和用户角色管理
 * 
 * 使用方法：
 * pnpm tsx scripts/manage-users.ts --help
 */

import { db } from '@damon-stack/db';
import { hash } from 'bcryptjs';

interface CreateUserOptions {
  email: string;
  name?: string;
  password: string;
  role: 'user' | 'admin';
  status?: 'ACTIVE' | 'BANNED';
}

/**
 * 创建测试用户
 */
async function createTestUser(options: CreateUserOptions) {
  const { email, name, password, role, status = 'ACTIVE' } = options;

  try {
    // 检查用户是否已存在
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`❌ 用户 ${email} 已存在`);
      return existingUser;
    }

    // 加密密码
    const hashedPassword = await hash(password, 12);

    // 创建用户
    const user = await db.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        hashedPassword,
        role,
        status,
        emailVerified: new Date(), // 直接设为已验证
      },
    });

    console.log(`✅ 用户创建成功:`);
    console.log(`   邮箱: ${user.email}`);
    console.log(`   姓名: ${user.name}`);
    console.log(`   角色: ${user.role}`);
    console.log(`   状态: ${user.status}`);
    console.log(`   ID: ${user.id}`);
    
    return user;
  } catch (error) {
    console.error('❌ 创建用户失败:', error);
    throw error;
  }
}

/**
 * 更新用户角色
 */
async function updateUserRole(email: string, newRole: 'user' | 'admin') {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`❌ 用户 ${email} 不存在`);
      return null;
    }

    const updatedUser = await db.user.update({
      where: { email },
      data: { role: newRole },
    });

    console.log(`✅ 用户角色更新成功:`);
    console.log(`   邮箱: ${updatedUser.email}`);
    console.log(`   姓名: ${updatedUser.name}`);
    console.log(`   原角色: ${user.role} → 新角色: ${updatedUser.role}`);
    
    return updatedUser;
  } catch (error) {
    console.error('❌ 更新用户角色失败:', error);
    throw error;
  }
}

/**
 * 列出所有用户
 */
async function listUsers() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`\n📋 系统用户列表 (共 ${users.length} 个用户):`);
    console.log('=' .repeat(80));
    
    users.forEach((user, index) => {
      const roleEmoji = user.role === 'admin' ? '👑' : '👤';
      const statusEmoji = user.status === 'ACTIVE' ? '🟢' : '🔴';
      
      console.log(`${index + 1}. ${roleEmoji} ${user.name || user.email}`);
      console.log(`   📧 邮箱: ${user.email}`);
      console.log(`   🎭 角色: ${user.role}`);
      console.log(`   ${statusEmoji} 状态: ${user.status}`);
      console.log(`   📅 创建: ${user.createdAt.toLocaleDateString('zh-CN')}`);
      console.log(`   🕐 最后登录: ${user.lastLoginAt?.toLocaleDateString('zh-CN') || '从未登录'}`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log('─'.repeat(40));
    });
    
    return users;
  } catch (error) {
    console.error('❌ 获取用户列表失败:', error);
    throw error;
  }
}

/**
 * 创建默认测试用户
 */
async function createDefaultTestUsers() {
  console.log('🚀 创建默认测试用户...\n');

  // 创建管理员用户
  const admin = await createTestUser({
    email: 'admin@test.com',
    name: '系统管理员',
    password: 'admin123456',
    role: 'admin',
  });

  console.log('\n');

  // 创建普通用户
  const user = await createTestUser({
    email: 'user@test.com',
    name: '普通用户',
    password: 'user123456',
    role: 'user',
  });

  console.log('\n🎯 测试账户信息:');
  console.log('👑 管理员账户:');
  console.log('   邮箱: admin@test.com');
  console.log('   密码: admin123456');
  console.log('   角色: admin');
  
  console.log('\n👤 普通用户账户:');
  console.log('   邮箱: user@test.com');
  console.log('   密码: user123456');
  console.log('   角色: user');

  return { admin, user };
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'list':
        await listUsers();
        break;

      case 'create-admin':
        if (args.length < 3) {
          console.log('用法: pnpm tsx scripts/manage-users.ts create-admin <email> <password> [name]');
          process.exit(1);
        }
        await createTestUser({
          email: args[1],
          name: args[3] || args[1].split('@')[0],
          password: args[2],
          role: 'admin',
        });
        break;

      case 'create-user':
        if (args.length < 3) {
          console.log('用法: pnpm tsx scripts/manage-users.ts create-user <email> <password> [name]');
          process.exit(1);
        }
        await createTestUser({
          email: args[1],
          name: args[3] || args[1].split('@')[0],
          password: args[2],
          role: 'user',
        });
        break;

      case 'make-admin':
        if (args.length < 2) {
          console.log('用法: pnpm tsx scripts/manage-users.ts make-admin <email>');
          process.exit(1);
        }
        await updateUserRole(args[1], 'admin');
        break;

      case 'make-user':
        if (args.length < 2) {
          console.log('用法: pnpm tsx scripts/manage-users.ts make-user <email>');
          process.exit(1);
        }
        await updateUserRole(args[1], 'user');
        break;

      case 'create-test-users':
        await createDefaultTestUsers();
        break;

      case 'help':
      case '--help':
      case '-h':
      default:
        console.log(`
🎯 用户管理脚本 - 权限控制测试工具

📖 使用方法:
  pnpm tsx scripts/manage-users.ts <command> [options]

📋 可用命令:
  list                              列出所有用户
  create-admin <email> <password>   创建管理员用户
  create-user <email> <password>    创建普通用户
  make-admin <email>                将用户设为管理员
  make-user <email>                 将用户设为普通用户
  create-test-users                 创建默认测试用户
  help                             显示此帮助信息

💡 示例:
  pnpm tsx scripts/manage-users.ts list
  pnpm tsx scripts/manage-users.ts create-admin admin@test.com admin123456
  pnpm tsx scripts/manage-users.ts make-admin user@example.com
  pnpm tsx scripts/manage-users.ts create-test-users

🔒 测试权限控制:
  1. 运行: pnpm tsx scripts/manage-users.ts create-test-users
  2. 使用 admin@test.com (密码: admin123456) 登录测试管理员功能
  3. 使用 user@test.com (密码: user123456) 登录测试普通用户权限
        `);
        break;
    }
  } catch (error) {
    console.error('❌ 命令执行失败:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

// 运行主函数
if (require.main === module) {
  main();
} 