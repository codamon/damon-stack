'use client';

import { 
  AppShell, 
  Burger, 
  Group, 
  UnstyledButton,
  Text,
  Container,
  Footer as MantineFooter,
  Anchor
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconStack3 } from '@tabler/icons-react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group gap="xs">
              <IconStack3 size={24} color="blue" />
              <UnstyledButton component={Link} href="/">
                <Text size="lg" fw={600}>
                  Damon Stack
                </Text>
              </UnstyledButton>
            </Group>
          </Group>
          
          <Group visibleFrom="sm">
            <UnstyledButton component={Link} href="/">
              <Text size="sm">首页</Text>
            </UnstyledButton>
            <UnstyledButton component={Link} href="/docs">
              <Text size="sm">文档</Text>
            </UnstyledButton>
            <UnstyledButton component={Link} href="/examples">
              <Text size="sm">示例</Text>
            </UnstyledButton>
            <UnstyledButton component={Link} href="/admin">
              <Text size="sm">管理后台</Text>
            </UnstyledButton>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text fw={500} mb="md">
          导航菜单
        </Text>
        <UnstyledButton component={Link} href="/" w="100%" p="xs">
          <Text size="sm">首页</Text>
        </UnstyledButton>
        <UnstyledButton component={Link} href="/docs" w="100%" p="xs">
          <Text size="sm">文档</Text>
        </UnstyledButton>
        <UnstyledButton component={Link} href="/examples" w="100%" p="xs">
          <Text size="sm">示例</Text>
        </UnstyledButton>
        <UnstyledButton component={Link} href="/admin" w="100%" p="xs">
          <Text size="sm">管理后台</Text>
        </UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>

      <AppShell.Footer>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between" align="center">
            <Text size="sm" c="dimmed">
              © 2025 Damon Stack. 基于现代化技术栈构建。
            </Text>
            <Group gap="lg">
              <Anchor href="https://github.com" size="sm" c="dimmed">
                GitHub
              </Anchor>
              <Anchor href="/docs" size="sm" c="dimmed">
                文档
              </Anchor>
            </Group>
          </Group>
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
} 