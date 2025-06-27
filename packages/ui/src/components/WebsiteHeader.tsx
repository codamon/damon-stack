'use client';

import React from 'react';
import {
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  useMantineTheme,
  ActionIcon,
  Text,
  UnstyledButton,
  Flex,
  Container,
  Menu,
  Avatar,
  Badge,
  Paper,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronDown,
  IconBrandTwitter,
  IconBrandGithub,
  IconBook,
  IconCode,
  IconUsers,
  IconSettings,
  IconLogout,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';

export interface NavigationItem {
  label: string;
  href: string;
  links?: { label: string; href: string; description?: string }[];
}

export interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface WebsiteHeaderProps {
  /** 网站Logo文本或图片URL */
  logo?: string | React.ReactNode;
  /** 导航菜单项 */
  navigation?: NavigationItem[];
  /** 右侧操作按钮 */
  actions?: React.ReactNode;
  /** 用户信息，如果提供则显示用户菜单 */
  user?: UserInfo;
  /** 是否显示主题切换按钮 */
  showThemeToggle?: boolean;
  /** 当前主题 */
  theme?: 'light' | 'dark';
  /** 主题切换回调 */
  onThemeToggle?: () => void;
  /** 登出回调 */
  onLogout?: () => void;
  /** 自定义高度 */
  height?: number;
  /** 是否固定在顶部 */
  fixed?: boolean;
  /** 容器最大宽度 */
  containerSize?: string | number;
}

const defaultNavigation: NavigationItem[] = [
  { label: '首页', href: '/' },
  { label: '产品', href: '/products' },
  { label: '解决方案', href: '/solutions' },
  {
    label: '资源',
    href: '/resources',
    links: [
      { label: '文档', href: '/docs', description: '查看技术文档' },
      { label: '博客', href: '/blog', description: '最新技术文章' },
      { label: '示例', href: '/examples', description: '代码示例' },
      { label: '社区', href: '/community', description: '加入开发者社区' },
    ],
  },
  { label: '关于我们', href: '/about' },
];

export function WebsiteHeader({
  logo,
  navigation = defaultNavigation,
  actions,
  user,
  showThemeToggle = true,
  theme = 'light',
  onThemeToggle,
  onLogout,
  height = 60,
  fixed = true,
  containerSize = 'xl',
}: WebsiteHeaderProps) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const mantineTheme = useMantineTheme();

  const renderLogo = () => {
    if (typeof logo === 'string') {
      return (
        <Text size="xl" fw={700} c="blue">
          {logo}
        </Text>
      );
    }
    return logo || (
      <Text size="xl" fw={700} c="blue">
        Damon Stack
      </Text>
    );
  };

  const renderNavigationLinks = () => {
    return navigation.map((item) => {
      if (item.links) {
        return (
          <Menu key={item.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
            <Menu.Target>
              <UnstyledButton
                style={{
                  padding: `${rem(8)} ${rem(12)}`,
                  borderRadius: mantineTheme.radius.sm,
                }}
              >
                <Group gap={4}>
                  <Text size="sm" fw={500}>
                    {item.label}
                  </Text>
                  <IconChevronDown size={16} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              {item.links.map((link) => (
                <Menu.Item
                  key={link.href}
                  component="a"
                  href={link.href}
                >
                  <Box>
                    <Text size="sm">{link.label}</Text>
                    {link.description && (
                      <Text size="xs" c="dimmed">{link.description}</Text>
                    )}
                  </Box>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        );
      }

      return (
        <UnstyledButton
          key={item.label}
          component="a"
          href={item.href}
          style={{
            padding: `${rem(8)} ${rem(12)}`,
            borderRadius: mantineTheme.radius.sm,
            textDecoration: 'none',
            color: mantineTheme.colors.dark[7],
          }}
        >
          <Text size="sm" fw={500}>
            {item.label}
          </Text>
        </UnstyledButton>
      );
    });
  };

  const renderUserMenu = () => {
    if (!user) return null;

    return (
      <Menu trigger="hover" withinPortal>
        <Menu.Target>
          <UnstyledButton
            style={{
              padding: rem(8),
              borderRadius: mantineTheme.radius.sm,
            }}
          >
            <Group gap={8}>
              <Avatar src={user.avatar} size={32} radius="xl">
                {user.name.slice(0, 2).toUpperCase()}
              </Avatar>
              <Box style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {user.name}
                </Text>
                {user.role && (
                  <Badge size="xs" variant="light">
                    {user.role}
                  </Badge>
                )}
              </Box>
              <IconChevronDown size={16} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconSettings size={16} />}>设置</Menu.Item>
          <Menu.Item leftSection={<IconUsers size={16} />}>个人资料</Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconLogout size={16} />}
            color="red"
            onClick={onLogout}
          >
            退出登录
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  const renderMobileNavigation = () => {
    return (
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={renderLogo()}
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          {navigation.map((item) => (
            <Box key={item.label}>
              <UnstyledButton
                component="a"
                href={item.href}
                w="100%"
                p="md"
                onClick={closeDrawer}
                style={{
                  backgroundColor: 'transparent',
                }}
              >
                <Text fw={500}>{item.label}</Text>
              </UnstyledButton>
              {item.links && (
                <Box pl="md">
                  {item.links.map((link) => (
                    <UnstyledButton
                      key={link.href}
                      component="a"
                      href={link.href}
                      w="100%"
                      p="sm"
                      pl="xl"
                      onClick={closeDrawer}
                      style={{
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Text size="sm" c="dimmed">
                        {link.label}
                      </Text>
                    </UnstyledButton>
                  ))}
                </Box>
              )}
            </Box>
          ))}
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            {showThemeToggle && (
              <Button
                variant="default"
                leftSection={theme === 'light' ? <IconMoon size={16} /> : <IconSun size={16} />}
                onClick={onThemeToggle}
              >
                {theme === 'light' ? '深色模式' : '浅色模式'}
              </Button>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    );
  };

  return (
    <>
      <Paper 
        h={height} 
        px="md" 
        style={{ 
          position: fixed ? 'fixed' : 'static',
          borderBottom: `1px solid ${mantineTheme.colors.gray[3]}`,
          backgroundColor: 'white',
          zIndex: 1000,
          width: '100%',
          top: 0,
        }}
      >
        <Container size={containerSize} h="100%">
          <Group justify="space-between" h="100%">
            {/* Logo */}
            <UnstyledButton component="a" href="/">
              {renderLogo()}
            </UnstyledButton>

            {/* Desktop Navigation */}
            <Group gap={8} visibleFrom="sm">
              {renderNavigationLinks()}
            </Group>

            {/* Right Section */}
            <Group gap={8}>
              {/* Theme Toggle */}
              {showThemeToggle && (
                <ActionIcon
                  variant="default"
                  onClick={onThemeToggle}
                  size={36}
                  visibleFrom="sm"
                  aria-label="切换主题"
                >
                  {theme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
                </ActionIcon>
              )}

              {/* User Menu or Actions */}
              {user ? renderUserMenu() : actions}

              {/* Mobile Menu Burger */}
              <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
            </Group>
          </Group>
        </Container>
      </Paper>

      {/* Mobile Navigation Drawer */}
      {renderMobileNavigation()}
    </>
  );
}

export default WebsiteHeader; 