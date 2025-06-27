import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'index.ts',
    'api/index': 'api/index.ts',
    'components/index': 'components/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@mantine/core',
    '@mantine/hooks',
    '@mantine/form',
    '@mantine/notifications',
    '@tabler/icons-react',
    '@trpc/client',
    '@trpc/react-query',
    '@trpc/server',
    '@tanstack/react-query',
    'zod',
    'next',
    // 排除主应用依赖，避免循环依赖
    '@damon-stack/admin-dashboard',
  ],
  esbuildOptions: (options) => {
    options.jsx = 'automatic';
  },
}); 