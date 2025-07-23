'use client';

import { ReactNode } from 'react';
import { 
  AppShell, 
  Group, 
  Title, 
  NavLink,
  Text,
  Burger,
  ScrollArea,
  Box,
  Divider,
  Menu,
  UnstyledButton,
  Avatar,
  Skeleton,
  Badge,
  ActionIcon
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  IconUsers, 
  IconDashboard,
  IconSettings,
  IconChartBar,
  IconChevronDown,
  IconLogout,
  IconUser,
  IconFiles,
  IconCategory,
  IconUserCircle
} from '@tabler/icons-react';
import { logoutAction } from '../app/actions/auth';
import { useCurrentUser } from '../hooks/use-current-user';

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    label: '仪表盘',
    href: '/dashboard',
    icon: IconDashboard,
    requireRole: null, // 所有登录用户可访问
  },
  {
    label: '用户管理',
    href: '/users',
    icon: IconUsers,
    requireRole: 'admin', // 🔒 仅管理员可访问
  },
  {
    label: '前端用户',
    href: '/customers',
    icon: IconUserCircle,
    requireRole: 'admin', // 🔒 仅管理员可访问
  },
  {
    label: '文章管理',
    href: '/cms/posts',
    icon: IconFiles,
    requireRole: 'admin', // 🔒 仅管理员可访问
  },
  {
    label: '分类管理',
    href: '/cms/categories',
    icon: IconCategory,
    requireRole: 'admin', // 🔒 仅管理员可访问
  },
  {
    label: '数据统计',
    href: '/analytics',
    icon: IconChartBar,
    requireRole: 'admin', // 🔒 仅管理员可访问
  },
  {
    label: '系统设置',
    href: '/settings',
    icon: IconSettings,
    requireRole: 'admin', // 🔒 仅管理员可访问
  },
  {
    label: 'SEO管理',
    href: '/settings/seo',
    icon: IconChartBar,
    requireRole: 'admin', // 🔒 仅管理员可访问
  },
];

/**
 * 用户信息组件
 */
function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Group gap="sm">
        <Skeleton height={32} circle />
        <Box>
          <Skeleton height={16} width={100} mb={4} />
          <Skeleton height={12} width={60} />
        </Box>
      </Group>
    );
  }

  if (status === 'unauthenticated' || !session?.user) {
    return (
      <UnstyledButton component={Link} href="/login">
        <Group gap="sm">
          <Avatar size="sm" />
          <Text size="sm">登录</Text>
        </Group>
      </UnstyledButton>
    );
  }

  const handleLogout = async () => {
    try {
      // 使用客户端 signOut，更快的响应
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      });
    } catch (error) {
      console.error('退出登录失败:', error);
      // 回退到 Server Action
      try {
        await logoutAction();
      } catch (serverError) {
        console.error('Server Action 退出也失败:', serverError);
      }
    }
  };

  const user = session.user;
  const userRole = user.role || 'user';
  const roleColor = userRole === 'admin' ? 'red' : userRole === 'user' ? 'blue' : 'gray';

  return (
    <Menu shadow="md" width={220} position="bottom-end">
      <Menu.Target>
        <UnstyledButton
          p="sm"
          style={(theme) => ({
            borderRadius: theme.radius.sm,
            '&:hover': {
              backgroundColor: theme.colors.gray[0],
            },
          })}
        >
          <Group gap="sm">
            <Avatar 
              src={user.image} 
              size="sm"
              alt={user.name || user.email}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </Avatar>
            <Box style={{ flex: 1 }}>
              <Text size="sm" fw={500} lineClamp={1}>
                {user.name || user.email}
              </Text>
              <Group gap={4}>
                <Badge size="xs" color={roleColor} variant="light">
                  {userRole === 'admin' ? '管理员' : '用户'}
                </Badge>
              </Group>
            </Box>
            <IconChevronDown size={14} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>账户信息</Menu.Label>
        
        <Menu.Item 
          leftSection={<IconUser size={14} />}
          component={Link}
          href="/profile"
        >
          个人资料
        </Menu.Item>
        
        <Menu.Item 
          leftSection={<IconSettings size={14} />}
          component={Link}
          href="/settings"
        >
          账户设置
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<IconLogout size={14} />}
          onClick={handleLogout}
        >
          退出登录
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export function Layout({ children }: LayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { user, isAdmin, hasRole, isAuthenticated } = useCurrentUser();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
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
            <Title order={3} c="blue.6">
              Damon-Stack Admin
            </Title>
          </Group>
          
          <Group gap="md">
            {session?.user && (
              <Group gap="xs" visibleFrom="sm">
                <Text size="sm" c="dimmed">
                  欢迎回来，
                </Text>
                <Text size="sm" fw={500}>
                  {session.user.name || session.user.email}
                </Text>
              </Group>
            )}
            <UserMenu />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Text fw={500} size="sm" mb="xs" c="dimmed">
            导航菜单
          </Text>
        </AppShell.Section>

        <Divider mb="md" />

        <AppShell.Section grow component={ScrollArea}>
          <Box>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href === '/dashboard' && pathname === '/') ||
                (item.href.startsWith('/cms') && pathname.startsWith(item.href));
              
              // 🔒 权限检查：如果菜单项需要特定角色，检查用户是否具有该角色
              const hasRequiredPermission = item.requireRole 
                ? hasRole(item.requireRole) 
                : isAuthenticated;
              
              // 如果用户没有所需权限，不渲染该菜单项
              if (!hasRequiredPermission) {
                return null;
              }
              
              return (
                <NavLink
                  key={item.href}
                  component={Link}
                  href={item.href}
                  label={item.label}
                  leftSection={<Icon size={18} stroke={1.5} />}
                  active={isActive}
                  variant="filled"
                  mb="xs"
                  style={{
                    borderRadius: '8px',
                  }}
                  // 为管理员专用菜单添加特殊样式
                  color={item.requireRole === 'admin' ? 'red' : undefined}
                />
              );
            })}
          </Box>
        </AppShell.Section>

        <AppShell.Section>
          <Divider mt="md" mb="md" />
          
          {/* 用户信息卡片 */}
          {session?.user && (
            <Box mb="md">
              <Group gap="sm" p="sm" 
                style={(theme) => ({
                  backgroundColor: theme.colors.blue[0],
                  borderRadius: theme.radius.sm,
                })}
              >
                <Avatar 
                  src={session.user.image} 
                  size="sm"
                  alt={session.user.name || session.user.email}
                >
                  {session.user.name ? 
                    session.user.name.charAt(0).toUpperCase() : 
                    session.user.email?.charAt(0).toUpperCase()
                  }
                </Avatar>
                <Box style={{ flex: 1 }}>
                  <Text size="xs" fw={500} lineClamp={1}>
                    {session.user.name || session.user.email}
                  </Text>
                  <Badge size="xs" color="blue" variant="light">
                    在线
                  </Badge>
                </Box>
                <ActionIcon 
                  size="sm" 
                  variant="subtle" 
                  color="red"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  title="退出登录"
                >
                  <IconLogout size={12} />
                </ActionIcon>
              </Group>
            </Box>
          )}
          
          <Text size="xs" c="dimmed" ta="center">
            © 2025 Damon-Stack
          </Text>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box>
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
} 