import { hash } from 'bcryptjs';
import { db } from '@damon-stack/db';

/**
 * 创建测试用户脚本
 * 生成用于开发和测试的示例用户账户
 */
async function createTestUsers() {
  try {
    console.log('🚀 开始创建测试用户...');

    // 检查是否已有用户
    const existingUsers = await db.user.count();
    console.log(`📊 当前数据库用户数量: ${existingUsers}`);

    // 普通用户凭据
    const testUserData = {
      email: 'user@test.com',
      password: 'test123456',
      name: '测试用户',
      role: 'user' as const
    };

    // 管理员用户凭据
    const adminUserData = {
      email: 'admin@test.com', 
      password: 'admin123456',
      name: '系统管理员',
      role: 'admin' as const
    };

    // 创建普通测试用户
    const existingUser = await db.user.findUnique({
      where: { email: testUserData.email }
    });

    if (!existingUser) {
      const hashedUserPassword = await hash(testUserData.password, 12);
      const newUser = await db.user.create({
        data: {
          email: testUserData.email,
          name: testUserData.name,
          hashedPassword: hashedUserPassword,
          role: testUserData.role,
          emailVerified: new Date(),
        }
      });
      console.log(`✅ 创建普通用户: ${newUser.email}`);
    } else {
      console.log(`ℹ️  普通用户已存在: ${existingUser.email}`);
    }

    // 创建管理员测试用户
    const existingAdmin = await db.user.findUnique({
      where: { email: adminUserData.email }
    });

    if (!existingAdmin) {
      const hashedAdminPassword = await hash(adminUserData.password, 12);
      const newAdmin = await db.user.create({
        data: {
          email: adminUserData.email,
          name: adminUserData.name,
          hashedPassword: hashedAdminPassword,
          role: adminUserData.role,
          emailVerified: new Date(),
        }
      });
      console.log(`✅ 创建管理员用户: ${newAdmin.email}`);
    } else {
      console.log(`ℹ️  管理员用户已存在: ${existingAdmin.email}`);
    }

    // 显示测试凭据
    console.log('\n🔑 测试账户信息:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 普通用户账户:');
    console.log(`   邮箱: ${testUserData.email}`);
    console.log(`   密码: ${testUserData.password}`);
    console.log(`   角色: 用户`);
    console.log('');
    console.log('👑 管理员账户:');
    console.log(`   邮箱: ${adminUserData.email}`);
    console.log(`   密码: ${adminUserData.password}`);
    console.log(`   角色: 管理员`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const finalUserCount = await db.user.count();
    console.log(`\n📈 完成！当前数据库用户数量: ${finalUserCount}`);
    
  } catch (error) {
    console.error('❌ 创建测试用户失败:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

// 执行脚本
createTestUsers(); 