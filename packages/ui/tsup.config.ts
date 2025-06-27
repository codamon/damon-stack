import { defineConfig } from 'tsup';

export default defineConfig({
  // 入口文件
  entry: ['src/index.ts'],

  // 输出格式：ESM 和 CommonJS 兼容
  format: ['esm', 'cjs'],

  // 生成 TypeScript 类型定义文件
  dts: true,

  // 启用代码分割
  splitting: true,

  // 构建前清理 dist 目录
  clean: true,

  // 生成 source map 便于调试
  sourcemap: true,

  // 压缩代码
  minify: false, // 开发阶段保持可读性

  // 目标环境
  target: 'es2018',

  // 外部依赖配置 - 关键：将 peer dependencies 标记为 external
  // 这样它们不会被打包，而是从消费应用中获取，解决 Context 问题
  external: [
    'react',
    'react-dom',
    '@mantine/core',
    '@mantine/hooks',
  ],

  // 输出配置
  outDir: 'dist',

  // 保留 JSX 语法用于 React 17+ 自动运行时
  jsx: 'automatic',

  // 启用详细日志
  silent: false,

  // package.json 字段的自动更新
  // 确保 main、module、types 字段指向正确的文件
  metafile: true,

  // 跳过 node_modules 依赖检查
  skipNodeModulesBundle: true,

  // esbuild 额外选项
  esbuildOptions: (options) => {
    // 保留原始文件名结构
    options.packages = 'external';
    // 启用 tree shaking
    options.treeShaking = true;
  },
}); 