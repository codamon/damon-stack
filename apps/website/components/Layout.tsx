'use client';

import { useEffect, useState } from 'react';
import { 
  AppShell, 
  Burger, 
  Group, 
  UnstyledButton,
  Text,
  Container,
  Footer as MantineFooter,
  Anchor,
  Button,
  ActionIcon,
  Flex,
  Box,
  Badge,
  Stack
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconStack3,
  IconHome,
  IconBook,
  IconCode,
  IconSettings,
  IconSparkles,
  IconRocket,
  IconHeart,
  IconBrandGithub,
  IconMail,
  IconMapPin,
  IconPhone,
  IconLogin,
  IconUserPlus,
  IconUser
} from '@tabler/icons-react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 鼠标跟随效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navItems = [
    { href: '/', label: '首页', icon: IconHome },
    { href: '/docs', label: '文档', icon: IconBook },
    { href: '/examples', label: '示例', icon: IconCode },
    { href: '/admin', label: '管理后台', icon: IconSettings },
  ];

  return (
    <>
      {/* 鼠标跟随光标 */}
      <div 
        className="cursor-glow"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />
      
      {/* 流体背景形状 */}
      <div className="fluid-shape" />
      <div className="fluid-shape" />
      <div className="fluid-shape" />
      
      <AppShell
        header={{ height: 80 }}
        footer={{ height: 120 }}
        navbar={{
          width: 320,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding={0}
        styles={{
          main: {
            background: 'transparent',
          }
        }}
      >
        <AppShell.Header
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Container size="xl" h="100%">
            <Group h="100%" justify="space-between">
              <Group gap="lg">
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                  color="white"
                />
                
                <Group gap="md" className="ripple-effect">
                  <ActionIcon
                    size="lg"
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: 'coral', to: 'cyan', deg: 45 }}
                    className="pulse-creative"
                  >
                    <IconStack3 size={24} />
                  </ActionIcon>
                  <UnstyledButton component={Link} href="/">
                    <Text 
                      size="xl" 
                      fw={800}
                      className="gradient-text"
                    >
                      Damon Stack
                    </Text>
                  </UnstyledButton>
                  <Badge
                    variant="gradient"
                    gradient={{ from: 'teal', to: 'blue', deg: 60 }}
                    size="sm"
                    radius="xl"
                    className="pulse-creative"
                  >
                    创意版
                  </Badge>
                </Group>
              </Group>
              
              <Group visibleFrom="sm" gap="xs">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    variant="subtle"
                    radius="xl"
                    size="md"
                    leftSection={<item.icon size={18} />}
                    className="creative-button icon-bounce"
                    style={{
                      color: 'white',
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                
                {/* 用户认证链接 */}
                <Button
                  component={Link}
                  href="/auth/signin"
                  variant="subtle"
                  radius="xl"
                  size="md"
                  leftSection={<IconLogin size={18} />}
                  className="creative-button icon-bounce"
                  style={{
                    color: 'white',
                    fontWeight: 500,
                  }}
                >
                  登录
                </Button>
                
                <Button
                  component={Link}
                  href="/auth/signup"
                  variant="light"
                  radius="xl"
                  size="md"
                  leftSection={<IconUserPlus size={18} />}
                  className="creative-button icon-bounce"
                  style={{
                    color: 'var(--mantine-color-blue-7)',
                    fontWeight: 500,
                  }}
                >
                  注册
                </Button>
                
                <Button
                  component="a"
                  href="/admin"
                  variant="gradient"
                  gradient={{ from: 'pink', to: 'orange', deg: 45 }}
                  radius="xl"
                  size="md"
                  leftSection={<IconRocket size={18} />}
                  className="creative-button pulse-creative"
                >
                  管理后台
                </Button>
              </Group>
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Navbar
          p="xl"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Stack gap="lg">
            <Group gap="md">
              <ActionIcon
                size="xl"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'violet', to: 'cyan', deg: 45 }}
                className="pulse-creative"
              >
                <IconSparkles size={24} />
              </ActionIcon>
              <Box>
                <Text fw={700} size="lg" c="white" className="gradient-text">
                  导航菜单
                </Text>
                <Text size="xs" c="gray.4">
                  现代创意设计
                </Text>
              </Box>
            </Group>
            
            <Stack gap="sm">
              {navItems.map((item, index) => (
                <UnstyledButton 
                  key={item.href}
                  component={Link} 
                  href={item.href}
                  className="glass-morphism creative-card icon-bounce"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    width: '100%',
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <Group gap="md">
                    <ActionIcon
                      size="sm"
                      radius="xl"
                      variant="light"
                      color="cyan"
                    >
                      <item.icon size={16} />
                    </ActionIcon>
                    <Text c="white" fw={500} size="sm">
                      {item.label}
                    </Text>
                  </Group>
                </UnstyledButton>
              ))}
              
              {/* 用户认证链接 - 移动端 */}
              <Box pt="md" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Text size="xs" c="gray.4" mb="sm" fw={600}>
                  用户中心
                </Text>
                <Stack gap="xs">
                  <UnstyledButton 
                    component={Link} 
                    href="/auth/signin"
                    className="glass-morphism creative-card icon-bounce"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      width: '100%',
                    }}
                  >
                    <Group gap="md">
                      <ActionIcon
                        size="sm"
                        radius="xl"
                        variant="light"
                        color="blue"
                      >
                        <IconLogin size={16} />
                      </ActionIcon>
                      <Text c="white" fw={500} size="sm">
                        登录
                      </Text>
                    </Group>
                  </UnstyledButton>
                  
                  <UnstyledButton 
                    component={Link} 
                    href="/auth/signup"
                    className="glass-morphism creative-card icon-bounce"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      width: '100%',
                    }}
                  >
                    <Group gap="md">
                      <ActionIcon
                        size="sm"
                        radius="xl"
                        variant="light"
                        color="green"
                      >
                        <IconUserPlus size={16} />
                      </ActionIcon>
                      <Text c="white" fw={500} size="sm">
                        注册账户
                      </Text>
                    </Group>
                  </UnstyledButton>
                  
                  <UnstyledButton 
                    component={Link} 
                    href="/account/profile"
                    className="glass-morphism creative-card icon-bounce"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      width: '100%',
                    }}
                  >
                    <Group gap="md">
                      <ActionIcon
                        size="sm"
                        radius="xl"
                        variant="light"
                        color="violet"
                      >
                        <IconUser size={16} />
                      </ActionIcon>
                      <Text c="white" fw={500} size="sm">
                        个人中心
                      </Text>
                    </Group>
                  </UnstyledButton>
                </Stack>
              </Box>
            </Stack>
            
            <Box mt="auto">
              <div className="glass-morphism" style={{ padding: '16px', borderRadius: '16px' }}>
                <Text size="xs" c="gray.4" mb="xs">
                  💡 创意提示
                </Text>
                <Text size="sm" c="white" fw={500}>
                  探索现代化设计与交互的完美融合
                </Text>
              </div>
            </Box>
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main
          style={{
            padding: '40px 0',
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          {children}
        </AppShell.Main>

        <AppShell.Footer
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Container size="xl" h="100%">
            <Stack gap="lg" h="100%" justify="center">
              <Group justify="space-between" align="flex-start">
                {/* Logo 和品牌信息 */}
                <Group gap="lg">
                  <ActionIcon
                    size="xl"
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: 'pink', to: 'cyan', deg: 45 }}
                    className="pulse-creative"
                  >
                    <IconStack3 size={28} />
                  </ActionIcon>
                  <Box>
                    <Text 
                      size="lg" 
                      fw={800} 
                      c="white"
                      className="gradient-text"
                    >
                      Damon Stack
                    </Text>
                    <Text size="sm" c="gray.4">
                      现代化全栈开发解决方案
                    </Text>
                  </Box>
                </Group>
                
                {/* 快速链接 */}
                <Group gap="xl">
                  <Stack gap="xs">
                    <Text size="sm" fw={600} c="white">
                      产品
                    </Text>
                    {navItems.map((item) => (
                      <Anchor
                        key={item.href}
                        href={item.href}
                        size="sm"
                        c="gray.4"
                        className="icon-bounce"
                      >
                        {item.label}
                      </Anchor>
                    ))}
                  </Stack>
                  
                  <Stack gap="xs">
                    <Text size="sm" fw={600} c="white">
                      资源
                    </Text>
                    <Anchor href="/docs" size="sm" c="gray.4" className="icon-bounce">
                      文档中心
                    </Anchor>
                    <Anchor href="/examples" size="sm" c="gray.4" className="icon-bounce">
                      代码示例
                    </Anchor>
                    <Anchor href="/blog" size="sm" c="gray.4" className="icon-bounce">
                      技术博客
                    </Anchor>
                  </Stack>
                  
                  <Stack gap="xs">
                    <Text size="sm" fw={600} c="white">
                      用户中心
                    </Text>
                    <Anchor href="/auth/signin" size="sm" c="gray.4" className="icon-bounce">
                      用户登录
                    </Anchor>
                    <Anchor href="/auth/signup" size="sm" c="gray.4" className="icon-bounce">
                      注册账户
                    </Anchor>
                    <Anchor href="/account/profile" size="sm" c="gray.4" className="icon-bounce">
                      个人资料
                    </Anchor>
                    <Anchor href="/account/security" size="sm" c="gray.4" className="icon-bounce">
                      安全设置
                    </Anchor>
                  </Stack>
                  
                  <Stack gap="xs">
                    <Text size="sm" fw={600} c="white">
                      联系我们
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        size="sm"
                        radius="xl"
                        variant="light"
                        color="blue"
                        className="icon-bounce"
                      >
                        <IconBrandGithub size={14} />
                      </ActionIcon>
                      <Text size="xs" c="gray.4">GitHub</Text>
                    </Group>
                    <Group gap="xs">
                      <ActionIcon
                        size="sm"
                        radius="xl"
                        variant="light"
                        color="teal"
                        className="icon-bounce"
                      >
                        <IconMail size={14} />
                      </ActionIcon>
                      <Text size="xs" c="gray.4">邮箱联系</Text>
                    </Group>
                  </Stack>
                </Group>
              </Group>
              
              {/* 版权和爱心 */}
              <Group justify="space-between" align="center" pt="md" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Text size="sm" c="gray.5">
                  © 2025 Damon Stack. 基于现代化技术栈构建，充满创意与激情。
                </Text>
                <Group gap="xs">
                  <Text size="sm" c="gray.5">
                    Made with
                  </Text>
                  <ActionIcon
                    size="sm"
                    radius="xl"
                    variant="light"
                    color="red"
                    className="pulse-creative"
                  >
                    <IconHeart size={14} />
                  </ActionIcon>
                  <Text size="sm" c="gray.5">
                    by Damon
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Container>
        </AppShell.Footer>
      </AppShell>
    </>
  );
} 