'use client';

import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  SimpleGrid,
  Card,
  ThemeIcon,
  Badge,
  Paper,
  Box,
  Table,
  List,
  rem,
  Tabs,
  Divider,
  Avatar,
  Timeline,
} from '@mantine/core';
import {
  IconRocket,
  IconShield,
  IconCloud,
  IconCode,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconBolt,
  IconCheck,
  IconX,
  IconStar,
  IconBuilding,
  IconDevices,
  IconDatabase,
  IconApi,
  IconTrendingUp,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';

export default function ProductsPage() {
  return (
    <Box>
      {/* Hero 区域 */}
      <Box style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Container size="xl" py={120}>
          <Stack gap="xl" align="center" ta="center">
            <Title size="3.5rem" fw={800}>
              企业级全栈开发平台
            </Title>
            <Text size="xl" maw={700} style={{ opacity: 0.9 }}>
              基于现代化技术栈的完整解决方案，助力企业快速构建高质量、可扩展的Web应用
            </Text>
            <Group gap="lg">
              <Button
                size="lg"
                color="white"
                variant="filled"
                leftSection={<IconRocket size={20} />}
                style={{ color: '#667eea' }}
              >
                免费试用
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                component="a"
                href="/contact"
              >
                联系销售
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* 产品分类展示 */}
      <Container size="xl" py={100}>
        <Stack gap="xl" align="center">
          <Title order={2} size="2.5rem" fw={700} ta="center">
            完整的产品生态系统
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={600}>
            从前端到后端，从开发到部署，提供全方位的技术解决方案
          </Text>
          
          <Tabs defaultValue="frontend" w="100%" mt="xl">
            <Tabs.List grow>
              <Tabs.Tab value="frontend" leftSection={<IconDevices size="0.8rem" />}>
                前端解决方案
              </Tabs.Tab>
              <Tabs.Tab value="backend" leftSection={<IconDatabase size="0.8rem" />}>
                后端架构
              </Tabs.Tab>
              <Tabs.Tab value="deployment" leftSection={<IconCloud size="0.8rem" />}>
                部署运维
              </Tabs.Tab>
              <Tabs.Tab value="tools" leftSection={<IconSettings size="0.8rem" />}>
                开发工具
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="frontend" pt="xl">
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="blue" mb="md">
                    <IconCode size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">React 19 + Next.js 15</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    基于最新的React和Next.js技术栈，提供服务器端渲染、
                    静态生成、API路由等完整的前端解决方案。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>🚀 极速的页面加载</List.Item>
                    <List.Item>📱 完美的移动端适配</List.Item>
                    <List.Item>🔍 SEO友好的架构</List.Item>
                  </List>
                </Card>

                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="green" mb="md">
                    <IconSettings size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">Mantine 8 UI系统</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    现代化的React UI库，提供100+高质量组件，
                    支持深度定制和主题系统。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>🎨 美观的设计系统</List.Item>
                    <List.Item>📦 丰富的组件库</List.Item>
                    <List.Item>🌈 灵活的主题定制</List.Item>
                  </List>
                </Card>

                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="orange" mb="md">
                    <IconShield size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">TypeScript 5.0</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    100%类型安全保障，提供完整的类型定义和智能提示，
                    大幅提升开发效率和代码质量。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>🛡️ 类型安全保障</List.Item>
                    <List.Item>💡 智能代码提示</List.Item>
                    <List.Item>🔧 强大的重构支持</List.Item>
                  </List>
                </Card>
              </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value="backend" pt="xl">
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="violet" mb="md">
                    <IconApi size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">tRPC 全栈类型安全</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    端到端的类型安全API，无需手写接口文档，
                    自动生成客户端类型，提升开发效率。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>🔗 端到端类型安全</List.Item>
                    <List.Item>📚 自动生成文档</List.Item>
                    <List.Item>⚡ 实时错误提示</List.Item>
                  </List>
                </Card>

                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="teal" mb="md">
                    <IconDatabase size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">Prisma ORM</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    现代化的数据库ORM，支持多种数据库，
                    提供类型安全的数据库操作和迁移管理。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>🗃️ 多数据库支持</List.Item>
                    <List.Item>🔄 自动迁移管理</List.Item>
                    <List.Item>🔍 可视化数据库浏览</List.Item>
                  </List>
                </Card>

                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="red" mb="md">
                    <IconShield size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">NextAuth.js 认证</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    企业级身份认证解决方案，支持多种认证方式，
                    内置安全防护机制。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>🔐 多种认证方式</List.Item>
                    <List.Item>🛡️ 安全防护机制</List.Item>
                    <List.Item>👥 权限管理系统</List.Item>
                  </List>
                </Card>
              </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value="deployment" pt="xl">
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="cyan" mb="md">
                    <IconCloud size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">Docker 容器化</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    完整的容器化解决方案，支持一键部署，
                    确保开发、测试、生产环境的一致性。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>📦 标准化容器</List.Item>
                    <List.Item>🔄 一键部署</List.Item>
                    <List.Item>⚖️ 弹性扩缩容</List.Item>
                  </List>
                </Card>

                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="indigo" mb="md">
                    <IconChartBar size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">监控告警</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    完善的监控告警系统，实时监控应用性能，
                    及时发现和解决潜在问题。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>📊 性能监控</List.Item>
                    <List.Item>🚨 智能告警</List.Item>
                    <List.Item>📈 可视化报表</List.Item>
                  </List>
                </Card>

                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="pink" mb="md">
                    <IconBolt size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">CI/CD 流水线</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    自动化的持续集成和部署流水线，
                    支持代码质量检查、自动化测试和部署。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>🔄 自动化部署</List.Item>
                    <List.Item>🧪 自动化测试</List.Item>
                    <List.Item>📋 代码质量检查</List.Item>
                  </List>
                </Card>
              </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value="tools" pt="xl">
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="lime" mb="md">
                    <IconCode size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">开发环境配置</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    完整的开发环境配置，包括代码格式化、
                    ESLint规则、Git hooks等开发工具链。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>🔧 开箱即用配置</List.Item>
                    <List.Item>📏 代码规范检查</List.Item>
                    <List.Item>🎯 Git hooks集成</List.Item>
                  </List>
                </Card>

                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="grape" mb="md">
                    <IconUsers size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">团队协作工具</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    内置团队协作功能，包括代码审查、
                    项目管理、文档系统等协作工具。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>👥 代码审查流程</List.Item>
                    <List.Item>📋 项目管理</List.Item>
                    <List.Item>📖 文档系统</List.Item>
                  </List>
                </Card>

                <Card withBorder p="xl">
                  <ThemeIcon size={60} color="yellow" mb="md">
                    <IconTrendingUp size={32} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">性能分析工具</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    深度的性能分析工具，帮助发现性能瓶颈，
                    优化应用性能，提升用户体验。
                  </Text>
                  <List size="xs" spacing="xs">
                    <List.Item>⚡ 性能瓶颈分析</List.Item>
                    <List.Item>📊 详细报告</List.Item>
                    <List.Item>💡 优化建议</List.Item>
                  </List>
                </Card>
              </SimpleGrid>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>

      {/* 产品特性对比 */}
      <Box bg="gray.0" py={100}>
        <Container size="xl">
          <Stack gap="xl" align="center">
            <Title order={2} size="2.5rem" fw={700} ta="center">
              功能特性对比
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={600}>
              全面了解我们的产品优势，选择最适合您的解决方案
            </Text>
            
            <Paper withBorder w="100%" style={{ overflow: 'auto' }}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>功能特性</Table.Th>
                    <Table.Th ta="center">传统方案</Table.Th>
                    <Table.Th ta="center">竞争对手</Table.Th>
                    <Table.Th ta="center" style={{ backgroundColor: '#e3f2fd' }}>
                      damon-stack
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td fw={600}>开发效率</Table.Td>
                    <Table.Td ta="center"><IconX size={20} color="red" /></Table.Td>
                    <Table.Td ta="center">中等</Table.Td>
                    <Table.Td ta="center" style={{ backgroundColor: '#e8f5e8' }}>
                      <IconCheck size={20} color="green" />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={600}>类型安全</Table.Td>
                    <Table.Td ta="center"><IconX size={20} color="red" /></Table.Td>
                    <Table.Td ta="center">部分支持</Table.Td>
                    <Table.Td ta="center" style={{ backgroundColor: '#e8f5e8' }}>
                      <IconCheck size={20} color="green" />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={600}>企业级安全</Table.Td>
                    <Table.Td ta="center">需自行实现</Table.Td>
                    <Table.Td ta="center">基础功能</Table.Td>
                    <Table.Td ta="center" style={{ backgroundColor: '#e8f5e8' }}>
                      <IconCheck size={20} color="green" />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={600}>部署难度</Table.Td>
                    <Table.Td ta="center">复杂</Table.Td>
                    <Table.Td ta="center">中等</Table.Td>
                    <Table.Td ta="center" style={{ backgroundColor: '#e8f5e8' }}>
                      简单
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={600}>技术支持</Table.Td>
                    <Table.Td ta="center"><IconX size={20} color="red" /></Table.Td>
                    <Table.Td ta="center">有限</Table.Td>
                    <Table.Td ta="center" style={{ backgroundColor: '#e8f5e8' }}>
                      7×24小时
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={600}>学习成本</Table.Td>
                    <Table.Td ta="center">高</Table.Td>
                    <Table.Td ta="center">中等</Table.Td>
                    <Table.Td ta="center" style={{ backgroundColor: '#e8f5e8' }}>
                      低
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* 价格方案 */}
      <Container size="xl" py={100}>
        <Stack gap="xl" align="center">
          <Title order={2} size="2.5rem" fw={700} ta="center">
            选择适合您的方案
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={600}>
            灵活的定价方案，满足不同规模企业的需求
          </Text>
          
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" mt="xl">
            {/* 基础版 */}
            <Card withBorder p="xl" h={600}>
              <Stack gap="md">
                <div>
                  <Title order={4}>基础版</Title>
                  <Text size="sm" c="dimmed">适合个人开发者和小团队</Text>
                </div>
                <Group align="baseline">
                  <Title order={2}>免费</Title>
                  <Text size="sm" c="dimmed">/永久</Text>
                </Group>
                <List spacing="xs" size="sm">
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    基础UI组件库
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    基础认证功能
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    开源社区支持
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    基础文档
                  </List.Item>
                  <List.Item icon={<IconX size={16} color="red" />}>
                    企业级安全
                  </List.Item>
                  <List.Item icon={<IconX size={16} color="red" />}>
                    技术支持
                  </List.Item>
                  <List.Item icon={<IconX size={16} color="red" />}>
                    自定义主题
                  </List.Item>
                </List>
                <Button fullWidth variant="outline" mt="auto">
                  开始使用
                </Button>
              </Stack>
            </Card>

            {/* 专业版 */}
            <Card withBorder p="xl" h={600} style={{ border: '2px solid #1976d2' }}>
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Title order={4}>专业版</Title>
                    <Text size="sm" c="dimmed">适合中小企业</Text>
                  </div>
                  <Badge variant="filled">推荐</Badge>
                </Group>
                <Group align="baseline">
                  <Title order={2}>¥299</Title>
                  <Text size="sm" c="dimmed">/月</Text>
                </Group>
                <List spacing="xs" size="sm">
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    完整UI组件库
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    企业级认证
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    工作日技术支持
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    自定义主题
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    性能监控
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    API文档
                  </List.Item>
                  <List.Item icon={<IconX size={16} color="red" />}>
                    24/7支持
                  </List.Item>
                </List>
                <Button fullWidth mt="auto">
                  立即购买
                </Button>
              </Stack>
            </Card>

            {/* 企业版 */}
            <Card withBorder p="xl" h={600}>
              <Stack gap="md">
                <div>
                  <Title order={4}>企业版</Title>
                  <Text size="sm" c="dimmed">适合大型企业</Text>
                </div>
                <Group align="baseline">
                  <Title order={2}>定制</Title>
                  <Text size="sm" c="dimmed">/联系我们</Text>
                </Group>
                <List spacing="xs" size="sm">
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    所有专业版功能
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    24/7技术支持
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    私有化部署
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    定制开发
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    专属客户经理
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    SLA保障
                  </List.Item>
                  <List.Item icon={<IconCheck size={16} color="green" />}>
                    培训服务
                  </List.Item>
                </List>
                <Button fullWidth variant="outline" mt="auto">
                  联系销售
                </Button>
              </Stack>
            </Card>
          </SimpleGrid>
        </Stack>
      </Container>

      {/* 成功案例展示 */}
      <Box bg="gray.0" py={100}>
        <Container size="xl">
          <Stack gap="xl" align="center">
            <Title order={2} size="2.5rem" fw={700} ta="center">
              成功案例
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={600}>
              看看其他企业如何通过 damon-stack 实现数字化转型
            </Text>
            
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl" mt="xl">
              <Card withBorder p="xl">
                <Stack gap="md">
                  <Group>
                    <Avatar size="lg" color="blue">
                      <IconBuilding size={32} />
                    </Avatar>
                    <div>
                      <Title order={4}>科技创新公司</Title>
                      <Text size="sm" c="dimmed">金融科技 · 500+ 员工</Text>
                    </div>
                  </Group>
                  <Text size="sm" c="dimmed">
                    "使用 damon-stack 后，我们的开发效率提升了 300%，
                    从需求到上线的时间从 2 个月缩短到 2 周。
                    团队现在可以专注于业务逻辑，而不是基础架构。"
                  </Text>
                  <Timeline active={2} bulletSize={16} lineWidth={1}>
                    <Timeline.Item title="项目启动" bullet={<IconRocket size={8} />}>
                      <Text size="xs" c="dimmed">30天完成技术选型和团队培训</Text>
                    </Timeline.Item>
                    <Timeline.Item title="系统上线" bullet={<IconCheck size={8} />}>
                      <Text size="xs" c="dimmed">60天完成核心系统重构</Text>
                    </Timeline.Item>
                    <Timeline.Item title="效果显现" bullet={<IconTrendingUp size={8} />}>
                      <Text size="xs" c="dimmed">开发效率提升300%，运维成本降低50%</Text>
                    </Timeline.Item>
                  </Timeline>
                </Stack>
              </Card>

              <Card withBorder p="xl">
                <Stack gap="md">
                  <Group>
                    <Avatar size="lg" color="green">
                      <IconUsers size={32} />
                    </Avatar>
                    <div>
                      <Title order={4}>传统制造企业</Title>
                      <Text size="sm" c="dimmed">制造业 · 1000+ 员工</Text>
                    </div>
                  </Group>
                  <Text size="sm" c="dimmed">
                    "作为传统制造企业，我们需要快速数字化转型。
                    damon-stack 提供的完整解决方案让我们在 3 个月内
                    就建立了现代化的管理系统。"
                  </Text>
                  <Timeline active={3} bulletSize={16} lineWidth={1}>
                    <Timeline.Item title="数字化规划" bullet={<IconChartBar size={8} />}>
                      <Text size="xs" c="dimmed">制定详细的数字化转型路线图</Text>
                    </Timeline.Item>
                    <Timeline.Item title="系统开发" bullet={<IconCode size={8} />}>
                      <Text size="xs" c="dimmed">90天完成ERP、CRM、OA系统</Text>
                    </Timeline.Item>
                    <Timeline.Item title="全面上线" bullet={<IconStar size={8} />}>
                      <Text size="xs" c="dimmed">管理效率提升200%，成本降低30%</Text>
                    </Timeline.Item>
                  </Timeline>
                </Stack>
              </Card>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* CTA 区域 */}
      <Container size="xl" py={100}>
        <Stack gap="xl" align="center" ta="center">
          <Title order={2} size="2.5rem" fw={700}>
            准备开始您的数字化之旅？
          </Title>
          <Text size="lg" c="dimmed" maw={600}>
            现在就联系我们的技术专家，获取个性化的解决方案
          </Text>
          
          <Group gap="lg">
            <Button
              size="xl"
              leftSection={<IconRocket size={24} />}
            >
              免费试用
            </Button>
            <Button
              size="xl"
              variant="outline"
              leftSection={<IconPhone size={24} />}
              component="a"
              href="/contact"
            >
              预约演示
            </Button>
          </Group>

          <Paper withBorder p="xl" maw={600} w="100%">
            <Group gap="md" justify="center">
              <ThemeIcon variant="light" size="lg">
                <IconMail size={24} />
              </ThemeIcon>
              <div>
                <Text fw={600}>专业技术咨询</Text>
                <Text size="sm" c="dimmed">sales@damon-stack.com</Text>
              </div>
            </Group>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
} 