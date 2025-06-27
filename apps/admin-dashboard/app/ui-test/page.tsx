'use client';

/**
 * UI 测试页面
 * 验证 Mantine UI 和共享组件 (@damon-stack/ui) 的集成
 */

import React from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Group, 
  Stack, 
  Badge,
  Alert
} from '@mantine/core';

// 从共享 UI 包导入组件
import { Card, ExampleButton } from '@damon-stack/ui';

export default function UITestPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* 页面标题 */}
        <div style={{ textAlign: 'center' }}>
          <Title order={1} mb="md">
            🎨 Mantine UI + 共享组件测试
          </Title>
          <Text size="lg" c="dimmed">
            验证 Mantine UI 框架和 @damon-stack/ui 共享组件库
          </Text>
        </div>

        {/* 状态指示 */}
        <Alert color="green" title="集成状态">
          ✅ Mantine UI 已成功集成到 Next.js App Router
          <br />
          ✅ 共享 UI 包已连接到 admin-dashboard 应用
        </Alert>

        {/* Mantine 核心组件测试 */}
        <Card title="Mantine 核心组件测试">
          <Stack gap="md">
            <Text>这是使用 Mantine 组件构建的测试页面。</Text>
            
            <Group>
              <Button variant="filled">填充按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="light">浅色按钮</Button>
            </Group>

            <Group>
              <Badge color="blue">蓝色标签</Badge>
              <Badge color="green">绿色标签</Badge>
              <Badge color="red">红色标签</Badge>
            </Group>
          </Stack>
        </Card>

        {/* 自定义共享组件测试 */}
        <Card title="自定义共享组件测试">
          <Stack gap="md">
            <Text>以下是从 @damon-stack/ui 包导入的自定义组件：</Text>
            
            <div>
              <Text size="sm" c="dimmed" mb="xs">自定义按钮组件：</Text>
              <Group>
                <ExampleButton />
                <ExampleButton label="自定义文本" />
                <ExampleButton color="green">绿色按钮</ExampleButton>
              </Group>
            </div>
          </Stack>
        </Card>

        {/* 嵌套卡片测试 */}
        <Card title="卡片组件功能测试">
          <Stack gap="md">
            <Card title="嵌套卡片" withDivider={false} shadow="xs">
              <Text size="sm">
                这是一个嵌套在另一个卡片内的卡片，展示了组件的可重用性。
              </Text>
            </Card>

            <Card shadow="md" p="sm">
              <Text size="sm">
                这是一个没有标题的卡片，使用了不同的阴影和内边距设置。
              </Text>
            </Card>
          </Stack>
        </Card>

        {/* 技术栈信息 */}
        <Card title="🛠️ 技术栈">
          <Stack gap="sm">
            <Group justify="space-between">
              <Text>前端框架:</Text>
              <Badge color="black">Next.js 15</Badge>
            </Group>
            <Group justify="space-between">
              <Text>UI 框架:</Text>
              <Badge color="blue">Mantine 8</Badge>
            </Group>
            <Group justify="space-between">
              <Text>样式处理:</Text>
              <Badge color="orange">PostCSS</Badge>
            </Group>
            <Group justify="space-between">
              <Text>包管理:</Text>
              <Badge color="yellow">pnpm workspace</Badge>
            </Group>
            <Group justify="space-between">
              <Text>类型安全:</Text>
              <Badge color="blue">TypeScript</Badge>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
} 