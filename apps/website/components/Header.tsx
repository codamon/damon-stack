'use client';

import { useState } from 'react';
import {
  Container,
  Group,
  Button,
  Text,
  Drawer,
  Stack,
  Burger,
  rem,
  ThemeIcon,
  Anchor,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconRocket,
  IconBuilding,
  IconPackages,
  IconMail,
  IconShield,
  IconPhone,
} from '@tabler/icons-react';

const navLinks = [
  { href: '/', label: '首页', icon: IconBuilding },
  { href: '/about', label: '关于我们', icon: IconBuilding },
  { href: '/products', label: '产品服务', icon: IconPackages },
  { href: '/contact', label: '联系我们', icon: IconMail },
];

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const pathname = usePathname();

  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <Box
        style={{
          height: 70,
          borderBottom: '1px solid #e0e7ff',
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%">
            {/* Logo */}
            <Group gap="sm">
              <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'blue', to: 'indigo' }}>
                <IconRocket size="1.2rem" />
              </ThemeIcon>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Text size="xl" fw={700} c="blue.8">
                  damon-stack
                </Text>
              </Link>
            </Group>

            {/* Desktop Navigation */}
            <Group gap="xl" visibleFrom="md">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                  <Text
                    fw={isActivePath(link.href) ? 600 : 500}
                    c={isActivePath(link.href) ? 'blue.7' : 'gray.7'}
                    p="xs"
                    className="nav-link-hover"
                    style={{
                      borderRadius: rem(6),
                      backgroundColor: isActivePath(link.href) ? '#e3f2fd' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    {link.label}
                  </Text>
                </Link>
              ))}
            </Group>

            {/* Desktop CTA Buttons */}
            <Group gap="sm" visibleFrom="md">
              <Button
                variant="light"
                leftSection={<IconPhone size="1rem" />}
                component={Link}
                href="/contact"
              >
                联系咨询
              </Button>
              <Button
                leftSection={<IconRocket size="1rem" />}
                component={Link}
                href="/products"
              >
                免费试用
              </Button>
            </Group>

            {/* Mobile Burger */}
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="md"
              size="sm"
            />
          </Group>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" variant="gradient" gradient={{ from: 'blue', to: 'indigo' }}>
              <IconRocket size="1rem" />
            </ThemeIcon>
            <Text fw={700} c="blue.8">damon-stack</Text>
          </Group>
        }
        padding="md"
        size="sm"
        position="right"
      >
        <Stack gap="md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ textDecoration: 'none' }}
                onClick={closeDrawer}
              >
                <Group
                  gap="sm"
                  p="md"
                  style={{
                    borderRadius: rem(8),
                    backgroundColor: isActivePath(link.href) ? '#e3f2fd' : 'transparent',
                    border: isActivePath(link.href) ? '1px solid #1976d2' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <ThemeIcon
                    size="sm"
                    variant={isActivePath(link.href) ? 'filled' : 'light'}
                    color="blue"
                  >
                    <Icon size="1rem" />
                  </ThemeIcon>
                  <Text
                    fw={isActivePath(link.href) ? 600 : 500}
                    c={isActivePath(link.href) ? 'blue.7' : 'gray.7'}
                  >
                    {link.label}
                  </Text>
                </Group>
              </Link>
            );
          })}

          <Box mt="lg">
            <Stack gap="sm">
              <Button
                fullWidth
                variant="light"
                leftSection={<IconPhone size="1rem" />}
                component={Link}
                href="/contact"
                onClick={closeDrawer}
              >
                联系咨询
              </Button>
              <Button
                fullWidth
                leftSection={<IconRocket size="1rem" />}
                component={Link}
                href="/products"
                onClick={closeDrawer}
              >
                免费试用
              </Button>
              
              {/* 快速链接 */}
              <Text size="sm" fw={600} c="gray.6" mt="md" mb="xs">
                快速链接
              </Text>
              <Group gap="xs">
                <Anchor
                  size="sm"
                  c="gray.6"
                  component={Link}
                  href="/privacy"
                  onClick={closeDrawer}
                >
                  隐私政策
                </Anchor>
                <Text size="sm" c="gray.4">•</Text>
                <Anchor
                  size="sm"
                  c="gray.6"
                  component={Link}
                  href="/theme-demo"
                  onClick={closeDrawer}
                >
                  主题演示
                </Anchor>
              </Group>
            </Stack>
          </Box>
        </Stack>
      </Drawer>


    </>
  );
} 