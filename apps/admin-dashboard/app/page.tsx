'use client';

/**
 * Admin Dashboard 首页
 * 使用 Mantine UI 和共享组件库重构的现代化界面
 */

import { useState, useEffect } from 'react';
import Image from "next/image";
import { 
  Center, 
  Stack, 
  Loader, 
  Text, 
  Title, 
  Button, 
  Group, 
  Badge,
  Anchor,
  Container
} from '@mantine/core';
// 从共享 UI 包导入组件
import { Card } from '@damon-stack/ui';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [welcomeData, setWelcomeData] = useState<{
    message: string;
    timestamp: string;
  } | null>(null);

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setWelcomeData({
        message: "欢迎使用 damon-stack 管理后台！",
        timestamp: new Date().toLocaleString()
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" color="blue" />
          <Text c="dimmed">正在加载管理后台...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl" style={{ minHeight: '100vh' }}>
      <Stack gap="xl" align="center">
        {/* 主标题区域 */}
        <Stack align="center" gap="md">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
            style={{ filter: 'var(--mantine-color-scheme) === "dark" ? invert(1) : invert(0)' }}
          />
          <Title order={1} ta="center">
            🚀 damon-stack 管理后台
          </Title>
          <Text size="lg" c="dimmed" ta="center">
            基于 Next.js 15 + Mantine UI + tRPC 构建的现代化管理系统
          </Text>
          
          <Group>
            <Badge color="blue" variant="light">Next.js 15</Badge>
            <Badge color="orange" variant="light">Mantine UI</Badge>
            <Badge color="green" variant="light">tRPC</Badge>
            <Badge color="purple" variant="light">TypeScript</Badge>
          </Group>
        </Stack>

        {/* 欢迎信息卡片 */}
        <Card title="✨ 系统状态" style={{ width: '100%', maxWidth: 600 }}>
          <Stack gap="sm">
            <Text>{welcomeData?.message}</Text>
            <Text size="sm" c="dimmed">
              加载时间: {welcomeData?.timestamp}
            </Text>
            <Badge color="green" variant="light" style={{ alignSelf: 'flex-start' }}>
              系统运行正常
            </Badge>
          </Stack>
        </Card>

        {/* 快速开始卡片 */}
        <Card title="🛠️ 快速开始" style={{ width: '100%', maxWidth: 600 }}>
          <Stack gap="md">
            <Text size="sm">
              1. 编辑{' '}
              <Text component="code" bg="gray.1" px="xs" style={{ borderRadius: 4 }}>
                app/page.tsx
              </Text>{' '}
              文件来自定义此页面
            </Text>
            <Text size="sm">
              2. 访问 <Anchor href="/ui-test" target="_blank">/ui-test</Anchor> 查看 UI 组件示例
            </Text>
            <Text size="sm">
              3. 保存更改并即时查看效果
            </Text>
          </Stack>
        </Card>

        {/* 操作按钮 */}
        <Card title="🔗 相关链接" style={{ width: '100%', maxWidth: 600 }}>
          <Group justify="center" gap="md">
            <Button
              component="a"
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              leftSection={
                <Image
                  src="/vercel.svg"
                  alt="Vercel"
                  width={16}
                  height={16}
                  style={{ filter: 'var(--mantine-color-scheme) === "dark" ? invert(1) : invert(0)' }}
                />
              }
            >
              部署应用
            </Button>
            
            <Button
              variant="outline"
              component="a"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              查看文档
            </Button>
          </Group>
        </Card>

        {/* 底部链接 */}
        <Group gap="lg" mt="xl">
          <Anchor
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            <Group gap="xs">
              <Image src="/file.svg" alt="Learn" width={16} height={16} />
              <Text>学习教程</Text>
            </Group>
          </Anchor>
          
          <Anchor
            href="https://vercel.com/templates?framework=next.js"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            <Group gap="xs">
              <Image src="/window.svg" alt="Examples" width={16} height={16} />
              <Text>示例模板</Text>
            </Group>
          </Anchor>
          
          <Anchor
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            <Group gap="xs">
              <Image src="/globe.svg" alt="Next.js" width={16} height={16} />
              <Text>Next.js 官网 →</Text>
            </Group>
          </Anchor>
        </Group>
      </Stack>
    </Container>
  );
}
