# Mantine Provider 根布局配置完成

## 第三步：在根布局中设置 MantineProvider ✅

### 任务描述
在 Next.js App Router 的根布局中配置 MantineProvider，使整个应用都能使用 Mantine 的主题和样式系统。

### 配置文件修改
修改了 `apps/admin-dashboard/app/layout.tsx` 文件，完整集成 Mantine 提供者。

### 修改内容

#### 1. 导入必要模块
```typescript
import "@mantine/core/styles.css";
import { MantineProvider, ColorSchemeScript, createTheme } from "@mantine/core";
```

#### 2. 创建默认主题
```typescript
// 创建默认的 Mantine 主题
const theme = createTheme({
  // 可以在这里添加自定义主题配置
});
```

#### 3. 添加 ColorSchemeScript
在 `<head>` 标签中添加了 `<ColorSchemeScript />`，支持暗黑模式的无闪烁切换。

#### 4. 配置提供者层级
```typescript
<MantineProvider theme={theme}>
  <TRPCReactProvider>
    {children}
  </TRPCReactProvider>
</MantineProvider>
```

### 完整的配置代码

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import { TRPCReactProvider } from "../trpc/react";
import { MantineProvider, ColorSchemeScript, createTheme } from "@mantine/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 创建默认的 Mantine 主题
const theme = createTheme({
  // 可以在这里添加自定义主题配置
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "tRPC + Next.js 13+ App Router 管理后台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider theme={theme}>
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
```

### 配置亮点

#### 兼容性设计
- ✅ 保持了原有的 Next.js 字体配置 (Geist Sans/Mono)
- ✅ 保持了 tRPC 的提供者配置
- ✅ 兼容了 Tailwind CSS 样式

#### Mantine 功能
- ✅ 导入了 Mantine 核心样式
- ✅ 配置了 ColorSchemeScript 支持主题切换
- ✅ 创建了可扩展的默认主题
- ✅ 正确设置了提供者层级

#### 最佳实践
- ✅ 遵循 Next.js App Router 最佳实践
- ✅ 采用了 Mantine 推荐的配置方式
- ✅ 提供了主题扩展的基础结构

### 下一步
等待用户确认后，将继续第四步：测试 Mantine 组件并创建示例页面。

---
*文档创建时间: 2025-06-25 16:10*
*项目: damon-stack*
*作者: AI Assistant* 