'use client';

import {
  Container,
  Title,
  Text,
  Button,
  Card,
  Group,
  Stack,
  Badge,
  Paper,
  Grid,
  SimpleGrid,
  List,
  Divider,
  Code,
  Blockquote,
  Alert,
  Avatar,
  rem,
  Box,
} from '@mantine/core';
import {
  IconQuote,
  IconBookmark,
  IconHeart,
  IconShare,
  IconCalendar,
  IconClock,
  IconUser,
  IconTag,
  IconEye,
} from '@tabler/icons-react';

export default function BlogThemeDemoPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* 页面标题 */}
        <div style={{ textAlign: 'center' }}>
          <Title order={1} mb="md">
            编辑主题演示
          </Title>
          <Text size="lg" c="dimmed" mb="xl">
            阅读友好、内容聚焦的博客主题设计展示
          </Text>
        </div>

        {/* 文章头部 */}
        <Paper p="xl" style={{ backgroundColor: '#fafaf9' }}>
          <Stack gap="md">
            <Group gap="xs">
              <Badge variant="light" color="amber">技术分享</Badge>
              <Badge variant="outline" size="sm">前端开发</Badge>
            </Group>
            <Title order={1} style={{ fontSize: rem(36), lineHeight: 1.25 }}>
              现代化前端开发实践：构建可维护的用户界面
            </Title>
            <Text size="lg" c="dimmed" style={{ lineHeight: 1.6 }}>
              探索现代前端开发的最佳实践，从组件设计到性能优化，
              帮助开发者构建高质量、可维护的用户界面应用程序。
            </Text>
            <Group gap="lg" mt="md">
              <Group gap="xs">
                <Avatar size="sm" color="blue">A</Avatar>
                <div>
                  <Text size="sm" fw={500}>张三</Text>
                  <Text size="xs" c="dimmed">前端架构师</Text>
                </div>
              </Group>
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm" c="dimmed">2024年1月15日</Text>
              </Group>
              <Group gap="xs">
                <IconClock size={16} />
                <Text size="sm" c="dimmed">8分钟阅读</Text>
              </Group>
            </Group>
          </Stack>
        </Paper>

        {/* 文章内容 */}
        <Paper p="xl">
          <Stack gap="lg">
            <Title order={2}>引言</Title>
            <Text style={{ lineHeight: 1.65, fontSize: rem(17) }}>
              在当今快速发展的技术环境中，前端开发已经从简单的页面制作演变为复杂的应用程序构建。
              开发者需要掌握更多的工具、框架和最佳实践，才能创建出用户体验优秀、性能卓越的现代化应用。
            </Text>

            <Divider my="md" />

            <Title order={2}>核心概念</Title>
            <Text style={{ lineHeight: 1.65, fontSize: rem(17) }}>
              现代前端开发围绕几个核心概念展开：
            </Text>
            
            <List spacing="sm" style={{ fontSize: rem(17), lineHeight: 1.6 }}>
              <List.Item>
                <strong>组件化架构</strong>：将用户界面拆分为可复用的独立组件
              </List.Item>
              <List.Item>
                <strong>状态管理</strong>：高效地管理应用程序的数据流和状态变化
              </List.Item>
              <List.Item>
                <strong>性能优化</strong>：确保应用程序在各种设备上都能快速响应
              </List.Item>
              <List.Item>
                <strong>用户体验</strong>：创建直观、易用的界面交互
              </List.Item>
            </List>

            <Blockquote
              color="amber"
              cite="— React 官方文档"
              mt="xl"
              style={{ fontSize: rem(16), lineHeight: 1.6 }}
            >
              "构建用户界面的最佳方式是将其分解为独立的、可复用的组件，
              每个组件只关注一个特定的功能。"
            </Blockquote>

            <Title order={3} mt="xl">代码示例</Title>
            <Text style={{ lineHeight: 1.65, fontSize: rem(17) }}>
              以下是一个简单的React组件示例：
            </Text>

            <Box
              p="md"
              style={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #e7e5e4',
                borderRadius: rem(8),
                fontFamily: 'monospace',
                fontSize: rem(14),
                lineHeight: 1.5,
                overflow: 'auto',
              }}
            >
              <pre>{`function UserCard({ user }) {
  return (
    <Card withBorder p="md">
      <Avatar src={user.avatar} alt={user.name} />
      <Title order={4}>{user.name}</Title>
      <Text c="dimmed">{user.role}</Text>
      <Button variant="light" mt="sm">
        查看详情
      </Button>
    </Card>
  );
}`}</pre>
            </Box>

            <Title order={3} mt="xl">最佳实践</Title>
            <Text style={{ lineHeight: 1.65, fontSize: rem(17) }}>
              在实际开发中，我们应该遵循以下最佳实践：
            </Text>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mt="md">
              <Card withBorder p="lg">
                <Title order={5} mb="sm">代码质量</Title>
                <List size="sm" spacing="xs">
                  <List.Item>使用TypeScript增强类型安全</List.Item>
                  <List.Item>编写清晰的组件文档</List.Item>
                  <List.Item>实施代码审查流程</List.Item>
                  <List.Item>保持代码格式一致性</List.Item>
                </List>
              </Card>
              <Card withBorder p="lg">
                <Title order={5} mb="sm">性能优化</Title>
                <List size="sm" spacing="xs">
                  <List.Item>实施懒加载和代码分割</List.Item>
                  <List.Item>优化图片和资源加载</List.Item>
                  <List.Item>使用缓存策略</List.Item>
                  <List.Item>监控性能指标</List.Item>
                </List>
              </Card>
            </SimpleGrid>

            <Alert color="blue" mt="xl" icon={<IconQuote size={16} />}>
              <Text size="sm">
                记住，好的代码不仅要功能正确，还要易于理解和维护。
                投资于代码质量会在长期项目中获得巨大回报。
              </Text>
            </Alert>
          </Stack>
        </Paper>

        {/* 文章标签和操作 */}
        <Paper withBorder p="lg">
          <Stack gap="md">
            <Title order={4}>文章标签</Title>
            <Group gap="sm">
              <Badge variant="light" leftSection={<IconTag size={12} />}>React</Badge>
              <Badge variant="light" leftSection={<IconTag size={12} />}>TypeScript</Badge>
              <Badge variant="light" leftSection={<IconTag size={12} />}>前端开发</Badge>
              <Badge variant="light" leftSection={<IconTag size={12} />}>最佳实践</Badge>
              <Badge variant="light" leftSection={<IconTag size={12} />}>性能优化</Badge>
            </Group>
            
            <Divider />
            
            <Group justify="space-between">
              <Group gap="lg">
                <Button variant="subtle" leftSection={<IconHeart size={16} />} size="sm">
                  点赞 (124)
                </Button>
                <Button variant="subtle" leftSection={<IconBookmark size={16} />} size="sm">
                  收藏
                </Button>
                <Button variant="subtle" leftSection={<IconShare size={16} />} size="sm">
                  分享
                </Button>
              </Group>
              <Group gap="xs">
                <IconEye size={16} />
                <Text size="sm" c="dimmed">2,456 次阅读</Text>
              </Group>
            </Group>
          </Stack>
        </Paper>

        {/* 相关文章 */}
        <Paper withBorder p="xl">
          <Title order={3} mb="lg">相关文章推荐</Title>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Card withBorder>
              <Badge size="xs" mb="sm">技术教程</Badge>
              <Title order={5} mb="xs">深入理解React Hooks</Title>
              <Text size="sm" c="dimmed" mb="sm" lineClamp={2}>
                从useState到useEffect，全面掌握React Hooks的使用方法和最佳实践...
              </Text>
              <Group justify="space-between" mt="md">
                <Text size="xs" c="dimmed">5分钟阅读</Text>
                <Button variant="subtle" size="xs">阅读更多</Button>
              </Group>
            </Card>
            
            <Card withBorder>
              <Badge size="xs" mb="sm">设计系统</Badge>
              <Title order={5} mb="xs">构建可扩展的组件库</Title>
              <Text size="sm" c="dimmed" mb="sm" lineClamp={2}>
                学习如何设计和实现一个可扩展、可维护的组件库，提升开发效率...
              </Text>
              <Group justify="space-between" mt="md">
                <Text size="xs" c="dimmed">7分钟阅读</Text>
                <Button variant="subtle" size="xs">阅读更多</Button>
              </Group>
            </Card>
          </SimpleGrid>
        </Paper>

        {/* 主题特色说明 */}
        <Paper withBorder p="xl" style={{ backgroundColor: '#fafaf9' }}>
          <Title order={3} mb="lg" ta="center">编辑主题设计特色</Title>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Stack gap="md">
              <Group align="flex-start">
                <Box style={{ minWidth: rem(40) }}>
                  <Badge variant="light" color="amber" size="sm">📖</Badge>
                </Box>
                <div>
                  <Text fw={600} mb="xs">阅读优化</Text>
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    使用衬线字体提升阅读体验，适当的行高和字间距，
                    确保长时间阅读不会疲劳。
                  </Text>
                </div>
              </Group>
              
              <Group align="flex-start">
                <Box style={{ minWidth: rem(40) }}>
                  <Badge variant="light" color="green" size="sm">🎯</Badge>
                </Box>
                <div>
                  <Text fw={600} mb="xs">内容聚焦</Text>
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    简洁的布局设计，减少干扰元素，
                    让读者专注于内容本身。
                  </Text>
                </div>
              </Group>
            </Stack>
            
            <Stack gap="md">
              <Group align="flex-start">
                <Box style={{ minWidth: rem(40) }}>
                  <Badge variant="light" color="blue" size="sm">🎨</Badge>
                </Box>
                <div>
                  <Text fw={600} mb="xs">温和配色</Text>
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    使用温暖的中性色调，护眼的背景色，
                    营造舒适的阅读环境。
                  </Text>
                </div>
              </Group>
              
              <Group align="flex-start">
                <Box style={{ minWidth: rem(40) }}>
                  <Badge variant="light" color="violet" size="sm">📱</Badge>
                </Box>
                <div>
                  <Text fw={600} mb="xs">响应式设计</Text>
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    适配各种设备屏幕，确保在手机、平板、
                    桌面端都有良好的阅读体验。
                  </Text>
                </div>
              </Group>
            </Stack>
          </SimpleGrid>
        </Paper>

        <Divider my="xl" />

        {/* 导航链接 */}
        <Group justify="center">
          <Button component="a" href="/" variant="outline" size="lg">
            返回首页
          </Button>
          <Button variant="light" size="lg">
            查看更多文章
          </Button>
        </Group>
      </Stack>
    </Container>
  );
} 