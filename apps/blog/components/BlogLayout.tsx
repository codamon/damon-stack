'use client';

import { 
  AppShell, 
  Burger, 
  Group, 
  UnstyledButton,
  Text,
  Container,
  Anchor,
  Stack,
  TextInput,
  Button,
  Box,
  Badge,
  Divider
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconPencil, 
  IconSearch, 
  IconTag, 
  IconFolders,
  IconTerminal,
  IconCode,
  IconBrandGithub,
  IconBolt,
  IconCpu,
  IconBinary
} from '@tabler/icons-react';
import Link from 'next/link';

interface BlogLayoutProps {
  children: React.ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 70 }}
      footer={{ height: 80 }}
      navbar={{
        width: 350,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        header: {
          backgroundColor: 'rgba(26, 26, 46, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--neon-cyan)',
          boxShadow: '0 0 20px rgba(22, 244, 208, 0.3)',
        },
        navbar: {
          backgroundColor: 'rgba(26, 26, 46, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--neon-cyan)',
          boxShadow: 'inset -5px 0 15px rgba(22, 244, 208, 0.1)',
        },
        footer: {
          backgroundColor: 'rgba(26, 26, 46, 0.9)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--neon-cyan)',
          boxShadow: '0 0 20px rgba(22, 244, 208, 0.3)',
        },
        main: {
          backgroundColor: 'transparent',
        }
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              color="var(--neon-cyan)"
              className="hover-glow"
            />
            <Group gap="xs" className="pulse-animation">
              <Box
                style={{
                  background: 'linear-gradient(45deg, var(--neon-cyan), var(--neon-blue))',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconTerminal size={24} color="black" />
              </Box>
              <UnstyledButton component={Link} href="/" className="hover-glow">
                <Text 
                  size="xl" 
                  fw={700}
                  className="tech-title"
                  style={{ 
                    fontFamily: 'JetBrains Mono',
                    letterSpacing: '2px'
                  }}
                >
                  &lt;/DAMON_BLOG&gt;
                </Text>
              </UnstyledButton>
            </Group>
          </Group>
          
          <Group visibleFrom="sm" gap="lg">
            <UnstyledButton component={Link} href="/" className="hover-glow">
              <Group gap="xs">
                <IconCpu size={16} className="neon-text" />
                <Text size="sm" className="neon-text" fw={500}>首页</Text>
              </Group>
            </UnstyledButton>
            <UnstyledButton component={Link} href="/category/frontend" className="hover-glow">
              <Group gap="xs">
                <IconCode size={16} className="neon-text" />
                <Text size="sm" className="neon-text" fw={500}>前端</Text>
              </Group>
            </UnstyledButton>
            <UnstyledButton component={Link} href="/category/backend" className="hover-glow">
              <Group gap="xs">
                <IconBolt size={16} className="neon-text" />
                <Text size="sm" className="neon-text" fw={500}>后端</Text>
              </Group>
            </UnstyledButton>
            <UnstyledButton component={Link} href="/search" className="hover-glow">
              <Group gap="xs">
                <IconSearch size={16} className="neon-text" />
                <Text size="sm" className="neon-text" fw={500}>搜索</Text>
              </Group>
            </UnstyledButton>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xl">
          {/* 系统状态指示器 */}
          <Box className="code-border" p="md">
            <Group gap="xs" mb="md">
              <IconBinary size={16} className="neon-text" />
              <Text fw={600} className="neon-text" size="sm">
                SYSTEM STATUS
              </Text>
            </Group>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="xs" c="var(--text-muted)">服务器</Text>
                <Badge variant="filled" color="green" size="xs">ONLINE</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="xs" c="var(--text-muted)">数据库</Text>
                <Badge variant="filled" color="green" size="xs">ACTIVE</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="xs" c="var(--text-muted)">API</Text>
                <Badge variant="filled" color="cyan" size="xs">READY</Badge>
              </Group>
            </Stack>
          </Box>

          {/* 快速导航 */}
          <Box>
            <Group gap="xs" mb="md">
              <IconCpu size={16} className="neon-text" />
              <Text fw={600} className="neon-text" size="sm">
                NAVIGATION
              </Text>
            </Group>
            <Stack gap="xs">
              <UnstyledButton 
                component={Link} 
                href="/" 
                w="100%" 
                p="xs"
                className="hover-glow neon-border"
                style={{ 
                  borderRadius: '6px',
                  background: 'rgba(22, 244, 208, 0.05)'
                }}
              >
                <Group gap="xs">
                  <IconTerminal size={14} />
                  <Text size="sm" fw={500}>./home</Text>
                </Group>
              </UnstyledButton>
              <UnstyledButton 
                component={Link} 
                href="/search" 
                w="100%" 
                p="xs"
                className="hover-glow neon-border"
                style={{ 
                  borderRadius: '6px',
                  background: 'rgba(22, 244, 208, 0.05)'
                }}
              >
                <Group gap="xs">
                  <IconSearch size={14} />
                  <Text size="sm" fw={500}>./search</Text>
                </Group>
              </UnstyledButton>
            </Stack>
          </Box>

          {/* 技术分类 */}
          <Box>
            <Group gap="xs" mb="md">
              <IconFolders size={16} className="neon-text" />
              <Text fw={600} className="neon-text" size="sm">
                CATEGORIES
              </Text>
            </Group>
            <Stack gap="xs">
              {[
                { name: 'Frontend', icon: IconCode, path: '/category/frontend', color: 'var(--neon-cyan)' },
                { name: 'Backend', icon: IconBolt, path: '/category/backend', color: 'var(--neon-blue)' },
                { name: 'DevOps', icon: IconCpu, path: '/category/devops', color: 'var(--neon-purple)' },
                { name: 'AI/ML', icon: IconBinary, path: '/category/ai-ml', color: 'var(--neon-pink)' }
              ].map((category) => (
                <UnstyledButton 
                  key={category.name}
                  component={Link} 
                  href={category.path}
                  w="100%" 
                  p="xs"
                  className="hover-glow"
                  style={{ 
                    borderRadius: '6px',
                    border: `1px solid ${category.color}`,
                    background: `rgba(22, 244, 208, 0.05)`
                  }}
                >
                  <Group gap="xs">
                    <category.icon size={14} style={{ color: category.color }} />
                    <Text size="sm" fw={500} style={{ color: category.color }}>
                      {category.name}
                    </Text>
                  </Group>
                </UnstyledButton>
              ))}
            </Stack>
          </Box>

          {/* 技术标签 */}
          <Box>
            <Group gap="xs" mb="md">
              <IconTag size={16} className="neon-text" />
              <Text fw={600} className="neon-text" size="sm">
                HOT TAGS
              </Text>
            </Group>
            <Group gap="xs">
              {['Next.js', 'React', 'TypeScript', 'tRPC', 'Prisma', 'Docker'].map((tag) => (
                <Badge 
                  key={tag}
                  variant="outline" 
                  size="xs"
                  className="hover-glow"
                  style={{ 
                    borderColor: 'var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                    cursor: 'pointer'
                  }}
                >
                  #{tag}
                </Badge>
              ))}
            </Group>
          </Box>

          <Divider color="var(--neon-cyan)" />

          {/* 搜索终端 */}
          <Box>
            <Group gap="xs" mb="md">
              <IconSearch size={16} className="neon-text" />
              <Text fw={600} className="neon-text" size="sm">
                SEARCH_TERMINAL
              </Text>
            </Group>
            <TextInput
              placeholder="$ search articles..."
              leftSection={<Text size="xs" c="var(--neon-cyan)">&gt;</Text>}
              className="code-border"
              styles={{
                input: {
                  backgroundColor: 'rgba(26, 26, 46, 0.8)',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px'
                }
              }}
            />
          </Box>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box className="scanline-effect">
          {children}
        </Box>
      </AppShell.Main>

      <AppShell.Footer>
        <Container size="lg" h="100%">
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Group gap="lg">
                <Text size="xs" c="var(--text-muted)" ff="JetBrains Mono">
                  © 2025 DAMON_STACK.exe
                </Text>
                <Group gap="md">
                  <Anchor 
                    href="https://github.com" 
                    size="xs" 
                    className="neon-text hover-glow"
                    ff="JetBrains Mono"
                  >
                    ./github
                  </Anchor>
                  <Anchor 
                    href="/about" 
                    size="xs" 
                    className="neon-text hover-glow"
                    ff="JetBrains Mono"
                  >
                    ./about
                  </Anchor>
                  <Anchor 
                    href="/contact" 
                    size="xs" 
                    className="neon-text hover-glow"
                    ff="JetBrains Mono"
                  >
                    ./contact
                  </Anchor>
                </Group>
              </Group>
              <Group gap="xs">
                <IconBrandGithub size={16} className="neon-text" />
                <Text size="xs" className="neon-text" ff="JetBrains Mono">
                  BUILD_v2.0.1
                </Text>
              </Group>
            </Group>
            <Group justify="center">
              <Text size="xs" c="var(--text-muted)" ff="JetBrains Mono" className="typewriter">
                Powered by Next.js 15 + React 19 + tRPC + Mantine 8
              </Text>
            </Group>
          </Stack>
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
} 