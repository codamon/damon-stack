# @damon-stack/feature-user-management

用户管理功能模块 - 独立、高内聚的可插拔模块

## 🎯 模块设计理念

- **高内聚低耦合**: 所有用户管理相关的代码集中在一个模块中
- **可插拔架构**: 可以独立开发、测试、部署和维护
- **类型安全**: 完整的 TypeScript 支持，端到端类型安全
- **可复用性**: 可以在不同的应用中复用

## 📁 目录结构

```
features/user-management/
├── package.json          # 模块配置和依赖
├── tsconfig.json          # TypeScript 配置
├── tsup.config.ts         # 构建配置
├── index.ts               # 主入口文件
├── api/                   # API 模块
│   ├── index.ts           # API 导出入口
│   ├── routes.ts          # tRPC 路由定义
│   └── types.ts           # API 类型定义
├── components/            # 组件模块
│   ├── index.ts           # 组件导出入口
│   ├── UserList.tsx       # 用户列表组件
│   ├── UserForm.tsx       # 用户表单组件
│   └── UserManagementLayout.tsx # 布局组件
└── README.md              # 模块说明文档
```

## 🔧 模块导出

### API 模块
```typescript
import { userRouter, type User, type UserCreateInput } from '@damon-stack/feature-user-management/api';
```

### 组件模块
```typescript
import { UserList, UserForm } from '@damon-stack/feature-user-management/components';
```

### 完整模块
```typescript
import { 
  userRouter, 
  UserList, 
  UserForm,
  USER_MANAGEMENT_MODULE 
} from '@damon-stack/feature-user-management';
```

## 🚀 在主应用中使用

### 1. 安装依赖
```bash
pnpm add @damon-stack/feature-user-management
```

### 2. 集成 API 路由
```typescript
// apps/admin-dashboard/server/api/root.ts
import { userRouter } from '@damon-stack/feature-user-management/api';

export const appRouter = createTRPCRouter({
  user: userRouter,
  // ... 其他路由
});
```

### 3. 使用组件
```typescript
// apps/admin-dashboard/app/users/page.tsx
import { UserList } from '@damon-stack/feature-user-management/components';

export default function UsersPage() {
  return <UserList />;
}
```

## 🔧 开发命令

```bash
# 构建模块
pnpm build

# 开发模式（监听文件变化）
pnpm dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
```

## 📋 依赖要求

### 必需的 Peer Dependencies
- React 19+
- Mantine 8.1.1+
- tRPC 11.4.2+
- Next.js 15.3.4+

### 可选的依赖
- Tabler Icons React（用于图标）
- React Query（用于数据管理）

## 🎯 功能特性

- ✅ 用户列表展示
- ✅ 用户创建和编辑
- ✅ 用户删除（带确认）
- ✅ 用户搜索和筛选
- ✅ 分页支持
- ✅ 实时数据更新
- ✅ 响应式设计
- ✅ 完整的表单验证
- ✅ 错误处理和用户反馈

## 🔒 权限模型

模块支持以下权限：
- `user:read` - 查看用户列表
- `user:create` - 创建新用户
- `user:update` - 编辑用户信息
- `user:delete` - 删除用户

## 🚧 迁移状态

- [ ] 步骤1: 创建模块结构 ✅
- [ ] 步骤2: 迁移 API 代码
- [ ] 步骤3: 迁移组件代码
- [ ] 步骤4: 更新主应用依赖
- [ ] 步骤5: 测试和验证

## 📄 许可证

MIT License - 请查看 LICENSE 文件了解更多信息。 