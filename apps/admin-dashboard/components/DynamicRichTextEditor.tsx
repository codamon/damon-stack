import dynamic from 'next/dynamic';
import { Box, Loader, Center } from '@mantine/core';

export const DynamicRichTextEditor = dynamic(
  () => import('./SimpleRichTextEditor').then(mod => ({ default: mod.SimpleRichTextEditor })),
  {
    ssr: false,
    loading: () => (
      <Box 
        style={{ 
          minHeight: 400, 
          border: '1px solid var(--mantine-color-gray-3)',
          borderRadius: '4px',
          padding: '16px',
          backgroundColor: 'var(--mantine-color-gray-0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--mantine-color-gray-6)'
        }}
      >
        <Center>
          <Loader size="sm" />
          <Box ml="md">加载编辑器中...</Box>
        </Center>
      </Box>
    ),
  }
); 