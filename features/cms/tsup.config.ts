import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true, // 启用 DTS 类型定义生成
  splitting: false,
  sourcemap: true,
  clean: true,
  target: "es2020",
  external: [
    "react",
    "react-dom", 
    "@mantine/core",
    "@mantine/hooks",
    "@mantine/form",
    "@mantine/notifications",
    "@mantine/modals",
    "@tabler/icons-react",
    "@prisma/client",
    "@damon-stack/db",
    "zod",
    // tRPC 相关依赖
    "@trpc/server",
    "@trpc/client",
    "@trpc/react-query",
    // Next.js 相关
    "next/navigation",
    "next-auth/react"
  ],
}); 