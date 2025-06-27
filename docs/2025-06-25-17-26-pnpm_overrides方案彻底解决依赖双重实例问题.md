# pnpm overrides 方案彻底解决依赖双重实例问题

**时间**: 2025-06-25 17:26  
**项目**: damon-stack Monorepo  
**问题**: React Context 无法跨包共享，MantineProvider 无法访问  
**解决方案**: pnpm overrides 强制依赖统一  

## 问题背景

在实施 TSUP 构建流程后，尽管构建成功，运行时仍出现错误：
```
Error: @mantine/core: MantineProvider was not found in component tree
```

**根本原因分析**：
- 在复杂的 Monorepo + pnpm 环境中存在依赖版本不一致
- admin-dashboard: react ^19.0.0, @types/react ^19
- packages/ui: react ^19.1.0, @types/react ^18.0.0
- 导致两个独立的 React Context，无法跨边界访问

## 解决方案实施

### 第一步：版本分析

**检查 admin-dashboard/package.json**:
```json
{
  "dependencies": {
    "@mantine/core": "^8.1.1",
    "@mantine/hooks": "^8.1.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19"
  }
}
```

**检查 packages/ui/package.json**:
```json
{
  "devDependencies": {
    "@mantine/core": "^8.1.1",
    "@mantine/hooks": "^8.1.1", 
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  }
}
```

### 第二步：配置 pnpm overrides

在根目录 `package.json` 中配置：

```json
{
  "pnpm": {
    "overrides": {
      "@mantine/core": "8.1.1",
      "@mantine/hooks": "8.1.1", 
      "react": "19.0.0",
      "react-dom": "19.0.0",
      "@types/react": "19.1.6",
      "@types/react-dom": "19.1.6"
    }
  }
}
```

**关键技术要点**：
- 使用精确版本号（无 ^ 前缀）
- 统一 React 到 19.0.0 版本
- 统一 TypeScript 类型定义到最新稳定版本

### 第三步：重新安装依赖

```bash
# 清理现有依赖
rm -rf node_modules pnpm-lock.yaml

# 重新安装依赖
pnpm install

# 重新构建 UI 包
pnpm --filter @damon-stack/ui build

# 启动应用
pnpm dev
```

## 验证结果

### ✅ 依赖统一验证

**单一实例确认**:
```bash
$ find node_modules -path "*/@mantine/core" -type d
node_modules/.pnpm/@mantine+core@8.1.1_@mantine+hooks@8.1.1_react@19.0.0__@types+react@19.1.6_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/@mantine/core
```

**统一依赖路径**:
- 所有包都使用相同的依赖实例
- 依赖路径显示完全统一的版本约束

### ✅ Context 错误消除

**页面检查结果**:
- ❌ 不再有 "MantineProvider was not found" 错误
- ✅ Mantine 组件正常渲染
- ✅ CSS 类正常生成: `.mantine-Center-root`, `.mantine-Stack-root`
- ✅ `data-mantine-color-scheme="light"` 正常设置

### ✅ 应用正常运行

**运行状态**:
- HTTP 200 响应正常
- 构建产物完整：ESM + CJS + TypeScript 定义
- 无 peer dependency 警告

## 技术原理解释

### 为什么重新安装至关重要

1. **依赖图重计算**：
   - 删除现有依赖强制 pnpm 重新计算整个依赖图
   - 确保 overrides 规则完全生效

2. **物理文件结构重建**：
   - 清理旧的多实例依赖结构
   - 建立符合 overrides 的新链接结构

3. **锁定文件更新**：
   - 生成新的 `pnpm-lock.yaml`
   - 确保依赖版本锁定在指定精确版本

4. **符号链接重建**：
   - pnpm 重新创建所有符号链接
   - 确保所有包都指向同一个物理实例

### pnpm overrides 工作机制

1. **版本覆盖**：强制整个依赖树使用指定版本
2. **去重机制**：确保相同版本的包只有一个物理实例
3. **符号链接**：多个引用指向同一物理文件
4. **Context 共享**：所有包共享同一个 React Context 实例

## 最终状态

**技术架构**：
- ✅ TSUP 构建流程完美运行
- ✅ 双格式产物生成 (ESM + CJS + TypeScript)
- ✅ Turborepo 任务依赖正确配置
- ✅ **依赖双重实例问题彻底解决**
- ✅ **React Context 跨包访问成功**

**核心目标实现**：
- ✅ 创建基于 Mantine 的共享 UI 包
- ✅ 成功消费主应用的 MantineProvider Context
- ✅ 可复用、主题化的组件架构

## 关键技术洞察

1. **外部依赖配置不足**：TSUP external 配置正确但无法解决 Context 问题
2. **版本一致性关键**：细微的版本差异会导致多实例问题
3. **pnpm overrides 强大**：是解决 Monorepo 依赖冲突的最佳工具
4. **重新安装必要**：配置更改后必须完整重新安装才能生效

## 总结

通过 pnpm overrides 方案，成功解决了 React Context 跨包访问问题，实现了：

- **统一依赖管理**：所有包使用相同的核心依赖版本
- **Context 共享**：UI 包组件可以访问主应用的 MantineProvider
- **架构完整性**：保持了基于 Mantine 的设计系统架构
- **开发体验**：构建和开发流程流畅无阻

这是 Monorepo 中解决依赖冲突和 Context 共享问题的标准解决方案。 