# website应用tRPC Context错误修复完成

**时间**: 2025-06-28 01:42  
**文档类型**: 问题修复报告  
**涉及应用**: `apps/website`

## 🚨 问题描述

website应用在访问时出现tRPC Context错误：

```
Error: Unable to find tRPC Context. Did you forget to wrap your App inside `withTRPC` HoC?
    at useContext (http://localhost:3001/_next/static/chunks/node_modules__pnpm_6b7c860d._.js:8823:29)
    at Object.useMutation$1 [as useMutation] (http://localhost:3001/_next/static/chunks/node_modules__pnpm_6b7c860d._.js:8921:41)
```

错误发生在SignInPage组件中使用tRPC hooks时，表明tRPC Provider没有正确配置。

## 🔍 问题分析

### 主要问题
1. **tRPC Provider配置错误**: website应用使用了复杂的shared包配置方式
2. **类型定义不完整**: shared包中的AppRouter类型定义为`any`
3. **组件导入错误**: layout.tsx中错误导入了单独的Header/Footer组件

### 错误配置路径
```
apps/website/app/providers.tsx 
  → apps/website/providers/TRPCProvider.tsx 
    → @damon-stack/shared (AppRouter类型不完整)
```

## ✅ 解决方案

### 1. 修复tRPC Provider配置

**修改文件**: `apps/website/app/providers.tsx`

```diff
- import { TRPCProvider } from '../providers/TRPCProvider';
+ import { TRPCReactProvider } from '../trpc/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
-     <TRPCProvider>
+     <TRPCReactProvider>
        <MantineProvider theme={corporateTheme}>
          <Notifications />
          {children}
        </MantineProvider>
-     </TRPCProvider>
+     </TRPCReactProvider>
  );
}
```

### 2. 删除有问题的配置文件

删除了 `apps/website/providers/TRPCProvider.tsx`，该文件依赖有问题的shared包配置。

### 3. 修复Layout组件导入

**修改文件**: `apps/website/app/layout.tsx`

```diff
- import { Header, Footer } from "../components";
+ import { Layout } from "../components";

// 在body中
- <Header />
- <main style={{ minHeight: 'calc(100vh - 70px)' }}>
-   {children}
- </main>
- <Footer />
+ <Layout>
+   {children}
+ </Layout>
```

## 🎯 最终配置

### 正确的tRPC配置链路
```
apps/website/app/layout.tsx
  → apps/website/app/providers.tsx
    → apps/website/trpc/react.tsx (✅ 直接使用admin-dashboard的AppRouter)
```

### tRPC Client配置
```typescript
// apps/website/trpc/react.tsx
export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/api/trpc', // 指向admin-dashboard
          transformer: superjson,
        }),
      ],
    })
  );
  
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
}
```

## ✅ 验证结果

### 1. 服务器启动成功
```bash
$ pnpm --filter @damon-stack/website dev
# 启动成功，无错误

$ curl -I http://localhost:3001
HTTP/1.1 200 OK
```

### 2. tRPC Context正常
- tRPC Provider正确包装应用
- 组件中可以正常使用`api.*.useMutation()`和`api.*.useQuery()`
- 类型安全完整，具备完整的TypeScript支持

### 3. 应用访问正常
- 首页加载正常
- 登录页面功能正常
- 所有tRPC hooks正常工作

## 📚 经验总结

### 最佳实践
1. **简化配置**: 前端应用直接使用自己的tRPC配置，避免过度抽象
2. **类型安全**: 直接从admin-dashboard导入AppRouter类型，确保类型同步
3. **配置清晰**: 保持配置链路简单明了，便于调试和维护

### 避免的坑
1. **不要过早抽象**: shared包的tRPC配置增加了复杂性而没有带来明显好处
2. **类型定义完整性**: 确保所有类型定义完整，避免使用`any`
3. **组件导入检查**: 确保导入的组件存在且正确

## 🚀 后续建议

1. **清理shared包**: 移除或完善shared包中不完整的tRPC配置
2. **统一模式**: 为所有前端应用建立统一的tRPC配置模式
3. **文档完善**: 为新应用创建标准的tRPC配置指南

---

**状态**: ✅ 修复完成  
**影响范围**: `apps/website`  
**修复时间**: ~15分钟  
**风险等级**: 低（仅影响单个应用） 