'use client';

import React, { useState } from 'react';
import { Stack, Title, Paper, Text, Alert, Code, Button } from '@mantine/core';
import { RichTextEditor } from '@damon-stack/ui';

// 确保样式被导入
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';

export default function RichEditorTestPage() {
  const [content, setContent] = useState('<p>初始内容，请尝试编辑...</p>');
  const [showRaw, setShowRaw] = useState(false);

  return (
    <Stack gap="xl" p="xl">
      <Title order={1}>富文本编辑器测试页面</Title>
      
      <Alert color="blue" title="调试信息">
        <Text size="sm">这是一个最小化的测试页面，用于验证RichTextEditor组件是否正常工作。</Text>
        <Text size="sm" mt="xs">如果编辑器显示正常，说明组件功能正常；如果不正常，说明存在环境或依赖问题。</Text>
      </Alert>

      <Paper p="xl" withBorder>
        <Stack gap="md">
          <Text fw={500} size="lg">基础富文本编辑器</Text>
          
          <div style={{ 
            border: '2px solid #dee2e6', 
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <RichTextEditor
              value={content}
              onChange={(html) => {
                console.log('Content changed:', html);
                setContent(html);
              }}
              placeholder="请在这里输入内容..."
              minHeight={400}
            />
          </div>
        </Stack>
      </Paper>

      <Paper p="xl" withBorder>
        <Stack gap="md">
          <Text fw={500} size="lg">简化版编辑器（无工具栏）</Text>
          
          <div style={{ 
            border: '2px solid #dee2e6', 
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <RichTextEditor
              value="<p>这是一个没有工具栏的编辑器</p>"
              onChange={() => {}}
              placeholder="无工具栏版本..."
              minHeight={200}
              withToolbar={false}
            />
          </div>
        </Stack>
      </Paper>

      <Paper p="xl" withBorder>
        <Stack gap="md">
          <Text fw={500} size="lg">编辑器内容预览</Text>
          
          <Button onClick={() => setShowRaw(!showRaw)} variant="light" size="sm">
            {showRaw ? '显示渲染内容' : '显示原始HTML'}
          </Button>
          
          {showRaw ? (
            <Code block style={{ maxHeight: 200, overflowY: 'auto' }}>
              {content}
            </Code>
          ) : (
            <div 
              style={{ 
                border: '1px solid #dee2e6', 
                borderRadius: '4px', 
                padding: '16px',
                minHeight: '100px'
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </Stack>
      </Paper>

      <Paper p="xl" withBorder>
        <Stack gap="md">
          <Text fw={500} size="lg">状态信息</Text>
          
          <Code block>
            {JSON.stringify({
              contentLength: content.length,
              hasContent: content.length > 0,
              isHtml: content.includes('<'),
              timestamp: new Date().toISOString()
            }, null, 2)}
          </Code>
        </Stack>
      </Paper>
    </Stack>
  );
} 