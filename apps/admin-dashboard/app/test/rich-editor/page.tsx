'use client';

import React, { useState } from 'react';
import { Container, Title, Paper, Text, Stack, Group, Button, Code, Divider } from '@mantine/core';
import { RichTextEditor } from '@damon-stack/ui';

export default function RichEditorTestPage() {
  const [content, setContent] = useState('<p>欢迎使用富文本编辑器！</p><p>您可以尝试以下功能：</p><ul><li><strong>加粗文本</strong></li><li><em>斜体文本</em></li><li><u>下划线文本</u></li></ul>');
  const [readOnlyContent, setReadOnlyContent] = useState('<h2>只读模式演示</h2><p>这是一个只读的富文本编辑器，您无法编辑内容。</p>');

  const handleContentChange = (html: string) => {
    setContent(html);
  };

  const clearContent = () => {
    setContent('');
  };

  const setDemoContent = () => {
    setContent(`
      <h1>富文本编辑器功能演示</h1>
      <h2>基础格式化</h2>
      <p>这是一段包含 <strong>加粗</strong>、<em>斜体</em>、<u>下划线</u> 和 <mark>高亮</mark> 的文本。</p>
      
      <h3>列表功能</h3>
      <ul>
        <li>无序列表项目 1</li>
        <li>无序列表项目 2
          <ul>
            <li>嵌套列表项目</li>
          </ul>
        </li>
      </ul>
      
      <ol>
        <li>有序列表项目 1</li>
        <li>有序列表项目 2</li>
      </ol>
      
      <h3>引用块</h3>
      <blockquote>
        <p>这是一个引用块，用于突出显示重要内容或引用他人的话。</p>
      </blockquote>
      
      <h3>代码和链接</h3>
      <p>内联代码：<code>console.log('Hello World')</code></p>
      <p>链接示例：<a href="https://mantine.dev">Mantine UI 库</a></p>
      
      <h3>文本对齐</h3>
      <p style="text-align: center">居中对齐的文本</p>
      <p style="text-align: right">右对齐的文本</p>
      
      <hr>
      
      <h3>特殊格式</h3>
      <p>上标：E=MC<sup>2</sup></p>
      <p>下标：H<sub>2</sub>O</p>
    `);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>富文本编辑器测试页面</Title>
          <Text size="lg" c="dimmed" mt="sm">
            测试 @mantine/tiptap 集成的富文本编辑器组件功能
          </Text>
        </div>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <div>
              <Title order={2} size="h3" mb="md">标准富文本编辑器</Title>
              <Text size="sm" c="dimmed" mb="md">
                包含完整工具栏功能的富文本编辑器
              </Text>
            </div>

            <Group>
              <Button variant="light" onClick={setDemoContent}>
                加载演示内容
              </Button>
              <Button variant="light" color="orange" onClick={clearContent}>
                清空内容
              </Button>
            </Group>

            <RichTextEditor
              value={content}
              onChange={handleContentChange}
              placeholder="请开始编写您的内容..."
              minHeight={200}
              withCharacterCount
            />
          </Stack>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <div>
              <Title order={2} size="h3" mb="md">只读模式编辑器</Title>
              <Text size="sm" c="dimmed" mb="md">
                演示只读模式下的富文本编辑器
              </Text>
            </div>

            <RichTextEditor
              value={readOnlyContent}
              readOnly
              minHeight={150}
            />
          </Stack>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <div>
              <Title order={2} size="h3" mb="md">自定义工具栏编辑器</Title>
              <Text size="sm" c="dimmed" mb="md">
                只显示基础格式化工具的精简版编辑器
              </Text>
            </div>

            <RichTextEditor
              value=""
              onChange={() => {}}
              placeholder="精简版编辑器..."
              minHeight={150}
              toolbarControls={{
                bold: true,
                italic: true,
                underline: true,
                bulletList: true,
                orderedList: true,
                // 禁用其他功能
                h1: false,
                h2: false,
                h3: false,
                highlight: false,
                code: false,
                codeBlock: false,
                blockquote: false,
                link: false,
                image: false,
                alignLeft: false,
                alignCenter: false,
                alignRight: false,
                alignJustify: false,
              }}
            />
          </Stack>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <div>
              <Title order={2} size="h3" mb="md">实时 HTML 预览</Title>
              <Text size="sm" c="dimmed" mb="md">
                显示编辑器生成的 HTML 代码
              </Text>
            </div>

            <Divider label="HTML 输出" labelPosition="center" />
            
            <Code block style={{ maxHeight: 300, overflow: 'auto' }}>
              {content || '<p>暂无内容</p>'}
            </Code>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
} 