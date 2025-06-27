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
  ThemeIcon,
  List,
  Divider,
  Code,
  Blockquote,
  Alert,
  Notification,
  Avatar,
  rem,
} from '@mantine/core';
import {
  IconRocket,
  IconShield,
  IconUsers,
  IconChartBar,
  IconStar,
  IconCheck,
  IconInfoCircle,
  IconBulb,
} from '@tabler/icons-react';

export default function ThemeDemoPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* 页面标题 */}
        <div style={{ textAlign: 'center' }}>
          <Title order={1} mb="md">
            企业主题演示
          </Title>
          <Text size="lg" c="dimmed" mb="xl">
            专业、权威、可信的企业级主题设计展示
          </Text>
        </div>

        {/* 标题系统 */}
        <Paper withBorder p="xl">
          <Title order={2} mb="md">标题系统</Title>
          <Stack gap="sm">
            <Title order={1}>H1 主标题 - 权威专业</Title>
            <Title order={2}>H2 二级标题 - 层次清晰</Title>
            <Title order={3}>H3 三级标题 - 结构分明</Title>
            <Title order={4}>H4 四级标题 - 内容组织</Title>
            <Title order={5}>H5 五级标题 - 细节层次</Title>
            <Title order={6}>H6 六级标题 - 最小单位</Title>
          </Stack>
        </Paper>

        {/* 按钮系统 */}
        <Paper withBorder p="xl">
          <Title order={2} mb="md">按钮系统</Title>
          <Group gap="md" mb="md">
            <Button variant="filled" leftSection={<IconRocket size={16} />}>
              主要操作
            </Button>
            <Button variant="outline" leftSection={<IconShield size={16} />}>
              次要操作
            </Button>
            <Button variant="light" leftSection={<IconUsers size={16} />}>
              轻量操作
            </Button>
            <Button variant="subtle" leftSection={<IconChartBar size={16} />}>
              文本操作
            </Button>
          </Group>
          <Group gap="md">
            <Button size="xs">极小按钮</Button>
            <Button size="sm">小按钮</Button>
            <Button size="md">默认按钮</Button>
            <Button size="lg">大按钮</Button>
            <Button size="xl">超大按钮</Button>
          </Group>
        </Paper>

        {/* 卡片系统 */}
        <Paper withBorder p="xl">
          <Title order={2} mb="md">卡片系统</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            <Card>
              <Card.Section>
                <ThemeIcon size="lg" color="blue" mb="md">
                  <IconRocket size={24} />
                </ThemeIcon>
              </Card.Section>
              <Title order={4}>创新技术</Title>
              <Text size="sm" c="dimmed" mt="sm">
                采用最新的技术栈，为企业提供现代化的解决方案，提升业务效率和竞争力。
              </Text>
              <Button variant="light" fullWidth mt="md">
                了解更多
              </Button>
            </Card>

            <Card>
              <Card.Section>
                <ThemeIcon size="lg" color="green" mb="md">
                  <IconShield size={24} />
                </ThemeIcon>
              </Card.Section>
              <Title order={4}>安全可靠</Title>
              <Text size="sm" c="dimmed" mt="sm">
                企业级安全标准，多层防护机制，确保数据安全和业务连续性。
              </Text>
              <Button variant="light" fullWidth mt="md">
                了解更多
              </Button>
            </Card>

            <Card>
              <Card.Section>
                <ThemeIcon size="lg" color="orange" mb="md">
                  <IconUsers size={24} />
                </ThemeIcon>
              </Card.Section>
              <Title order={4}>专业服务</Title>
              <Text size="sm" c="dimmed" mt="sm">
                专业的技术团队，提供全方位的咨询和技术支持服务。
              </Text>
              <Button variant="light" fullWidth mt="md">
                了解更多
              </Button>
            </Card>
          </SimpleGrid>
        </Paper>

        {/* 徽章和状态 */}
        <Paper withBorder p="xl">
          <Title order={2} mb="md">徽章和状态</Title>
          <Group gap="md" mb="md">
            <Badge color="blue" variant="filled">企业版</Badge>
            <Badge color="green" variant="light">已验证</Badge>
            <Badge color="orange" variant="outline">专业版</Badge>
            <Badge color="red" variant="dot">限时优惠</Badge>
            <Badge color="violet" variant="gradient">特色服务</Badge>
          </Group>
          <Group gap="md">
            <Badge size="xs">XS 徽章</Badge>
            <Badge size="sm">小徽章</Badge>
            <Badge size="md">默认徽章</Badge>
            <Badge size="lg">大徽章</Badge>
            <Badge size="xl">超大徽章</Badge>
          </Group>
        </Paper>

        {/* 文本和排版 */}
        <Paper withBorder p="xl">
          <Title order={2} mb="md">文本和排版</Title>
          <Stack gap="md">
            <Text size="xl" fw={700}>
              企业级解决方案，专业可信的品质保证
            </Text>
            <Text size="lg">
              我们致力于为企业客户提供最优质的技术服务和解决方案，帮助企业实现数字化转型。
            </Text>
            <Text size="md" c="dimmed">
              通过先进的技术架构和专业的服务团队，我们确保每一个项目都能达到企业级的标准和要求。
            </Text>
            <Text size="sm">
              联系我们了解更多详情：<Code>enterprise@damon-stack.com</Code>
            </Text>
          </Stack>
        </Paper>

        {/* 列表和引用 */}
        <Paper withBorder p="xl">
          <Title order={2} mb="md">列表和引用</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Title order={4} mb="sm">核心优势</Title>
              <List
                spacing="sm"
                size="sm"
                center
                icon={
                  <ThemeIcon color="blue" size={20} radius="xl">
                                                  <IconCheck size={12} />
                  </ThemeIcon>
                }
              >
                <List.Item>企业级架构设计</List.Item>
                <List.Item>99.9% 可用性保证</List.Item>
                <List.Item>24/7 技术支持</List.Item>
                <List.Item>数据安全与合规</List.Item>
                <List.Item>灵活的定制服务</List.Item>
              </List>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Title order={4} mb="sm">客户评价</Title>
              <Blockquote color="blue" cite="- 某知名企业CTO">
                damon-stack 为我们提供了优秀的技术解决方案，显著提升了我们的业务效率和系统稳定性。
                专业的团队和优质的服务让我们对未来的合作充满信心。
              </Blockquote>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* 通知和提醒 */}
        <Paper withBorder p="xl">
          <Title order={2} mb="md">通知和提醒</Title>
          <Stack gap="md">
            <Alert icon={<IconInfoCircle size={16} />} title="信息提示" color="blue">
              企业版功能即将上线，敬请期待更多专业功能和服务。
            </Alert>
            <Alert icon={<IconCheck size={16} />} title="成功消息" color="green">
              您的企业账户已成功验证，现在可以使用所有高级功能。
            </Alert>
            <Alert icon={<IconBulb size={16} />} title="重要提醒" color="orange">
              为了确保服务质量，我们将在本周末进行系统维护升级。
            </Alert>
          </Stack>
        </Paper>

        {/* 统计数据 */}
        <Paper withBorder p="xl">
          <Title order={2} mb="md">统计数据展示</Title>
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="lg">
            <div style={{ textAlign: 'center' }}>
              <Title order={1} c="blue">500+</Title>
              <Text size="sm" c="dimmed">企业客户</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Title order={1} c="green">99.9%</Title>
              <Text size="sm" c="dimmed">系统可用性</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Title order={1} c="orange">24/7</Title>
              <Text size="sm" c="dimmed">技术支持</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Title order={1} c="violet">5★</Title>
              <Text size="sm" c="dimmed">客户评分</Text>
            </div>
          </SimpleGrid>
        </Paper>

        {/* 主题特色 */}
        <Paper withBorder p="xl" style={{ backgroundColor: '#f8fafc' }}>
          <Title order={2} mb="md" ta="center">企业主题设计特色</Title>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Stack gap="md">
              <Group>
                <ThemeIcon color="blue" size="sm">
                  <IconShield size={16} />
                </ThemeIcon>
                <div>
                  <Text fw={600}>专业配色方案</Text>
                  <Text size="sm" c="dimmed">深蓝色主调，传达信任与专业</Text>
                </div>
              </Group>
              <Group>
                <ThemeIcon color="green" size="sm">
                  <IconCheck size={16} />
                </ThemeIcon>
                <div>
                  <Text fw={600}>清晰的层次结构</Text>
                  <Text size="sm" c="dimmed">信息组织有序，用户体验优良</Text>
                </div>
              </Group>
            </Stack>
            <Stack gap="md">
              <Group>
                <ThemeIcon color="orange" size="sm">
                  <IconStar size={16} />
                </ThemeIcon>
                <div>
                  <Text fw={600}>权威视觉设计</Text>
                  <Text size="sm" c="dimmed">建立品牌权威性和可信度</Text>
                </div>
              </Group>
              <Group>
                <ThemeIcon color="violet" size="sm">
                  <IconUsers size={16} />
                </ThemeIcon>
                <div>
                  <Text fw={600}>B2B 场景优化</Text>
                  <Text size="sm" c="dimmed">适合商务合作和企业展示</Text>
                </div>
              </Group>
            </Stack>
          </SimpleGrid>
        </Paper>

        <Divider my="xl" />

        {/* 返回链接 */}
        <Group justify="center">
          <Button component="a" href="/" variant="outline" size="lg">
            返回首页
          </Button>
          <Button component="a" href="/components-test" variant="light" size="lg">
            查看组件测试
          </Button>
        </Group>
      </Stack>
    </Container>
  );
} 