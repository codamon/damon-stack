'use client';

import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Group, 
  Button, 
  Badge,
  Box,
  SimpleGrid,
  Card,
  ThemeIcon,
  Avatar,
  Blockquote,
  List,
  Divider,
  Paper,
  Grid,
  rem,
} from '@mantine/core';
import {
  IconRocket,
  IconShield,
  IconUsers,
  IconChartBar,
  IconCode,
  IconCloud,
  IconDevices,
  IconBolt,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandLinkedin,
} from '@tabler/icons-react';

export default function HomePage() {
  return (
    <Box>
      {/* Hero 区域 */}
      <Box style={{ position: 'relative', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Container size="xl" py={120}>
          <Stack gap={60} align="center" ta="center">
            <Stack gap="xl" align="center">
              <Badge
                size="lg"
                variant="light"
                color="white"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                🚀 Next.js 15 + Mantine 8 + tRPC
              </Badge>
              
              <Title 
                size="4rem" 
                fw={800}
                style={{
                  lineHeight: 1.1,
                  textAlign: 'center',
                  color: 'white'
                }}
              >
                构建现代化
                <br />
                全栈应用平台
              </Title>
              
              <Text 
                size="xl" 
                c="white" 
                maw={700}
                fw={500}
                style={{ opacity: 0.9 }}
              >
                damon-stack 提供企业级的现代化开发框架，
                帮助团队快速构建高质量、可扩展的Web应用程序
              </Text>
            </Stack>

            <Group gap="lg">
              <Button
                size="xl"
                radius="md"
                color="white"
                variant="filled"
                leftSection={<IconRocket size={24} />}
                component="a"
                href="/products"
                style={{ color: '#667eea' }}
              >
                了解产品
              </Button>
              
              <Button
                size="xl"
                radius="md"
                variant="outline"
                color="white"
                component="a"
                href="/contact"
              >
                联系我们
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* 产品特性区域 */}
      <Container size="xl" py={100}>
        <Stack gap="xl" align="center">
          <Stack gap="md" align="center" ta="center">
            <Title order={2} size="2.5rem" fw={700}>
              为什么选择 damon-stack？
            </Title>
            <Text size="lg" c="dimmed" maw={600}>
              我们提供完整的技术解决方案，帮助企业快速实现数字化转型
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mt="xl">
            <Card withBorder padding="xl" h={300}>
              <ThemeIcon size={60} color="blue" mb="md">
                <IconCode size={32} />
              </ThemeIcon>
              <Title order={4} mb="sm">现代化技术栈</Title>
              <Text size="sm" c="dimmed">
                基于最新的 Next.js 15、React 19、TypeScript 5.0 等前沿技术，
                确保您的应用始终保持技术领先。
              </Text>
            </Card>

            <Card withBorder padding="xl" h={300}>
              <ThemeIcon size={60} color="green" mb="md">
                <IconShield size={32} />
              </ThemeIcon>
              <Title order={4} mb="sm">企业级安全</Title>
              <Text size="sm" c="dimmed">
                内置多层安全防护机制，包括身份认证、权限管理、数据加密，
                确保您的业务数据安全可靠。
              </Text>
            </Card>

            <Card withBorder padding="xl" h={300}>
              <ThemeIcon size={60} color="orange" mb="md">
                <IconCloud size={32} />
              </ThemeIcon>
              <Title order={4} mb="sm">云原生部署</Title>
              <Text size="sm" c="dimmed">
                支持 Docker 容器化部署，与主流云平台完美集成，
                实现弹性扩展和高可用性。
              </Text>
            </Card>

            <Card withBorder padding="xl" h={300}>
              <ThemeIcon size={60} color="violet" mb="md">
                <IconBolt size={32} />
              </ThemeIcon>
              <Title order={4} mb="sm">极致性能</Title>
              <Text size="sm" c="dimmed">
                采用服务器端渲染、代码分割、缓存优化等技术，
                确保应用快速响应和优秀的用户体验。
              </Text>
            </Card>
          </SimpleGrid>
        </Stack>
      </Container>

      {/* 技术优势区域 */}
      <Box bg="gray.0" py={100}>
        <Container size="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg">
                <Title order={2} size="2rem" fw={700}>
                  完整的开发生态系统
                </Title>
                <Text size="lg" c="dimmed">
                  从前端到后端，从开发到部署，damon-stack 为您提供一站式解决方案
                </Text>
                <List
                  spacing="sm"
                  size="md"
                  icon={
                    <ThemeIcon color="blue" size={20} radius="xl">
                      <IconChartBar size={12} />
                    </ThemeIcon>
                  }
                >
                  <List.Item>
                    <strong>全栈开发框架</strong>：Next.js + tRPC + Prisma
                  </List.Item>
                  <List.Item>
                    <strong>现代化UI系统</strong>：Mantine 8 + 响应式设计
                  </List.Item>
                  <List.Item>
                    <strong>类型安全保障</strong>：100% TypeScript 覆盖
                  </List.Item>
                  <List.Item>
                    <strong>开箱即用功能</strong>：认证、权限、CMS、分析
                  </List.Item>
                </List>
                <Button
                  size="lg"
                  leftSection={<IconDevices size={20} />}
                  component="a"
                  href="/theme-demo"
                >
                  查看主题演示
                </Button>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Box p="xl" style={{ backgroundColor: 'white', borderRadius: rem(8), border: '1px solid #e0e7ff' }}>
                <Title order={3} mb="md">技术栈清单</Title>
                <SimpleGrid cols={2} spacing="md">
                  <Badge variant="light" size="lg">Next.js 15</Badge>
                  <Badge variant="light" size="lg">React 19</Badge>
                  <Badge variant="light" size="lg">TypeScript</Badge>
                  <Badge variant="light" size="lg">Mantine 8</Badge>
                  <Badge variant="light" size="lg">tRPC</Badge>
                  <Badge variant="light" size="lg">Prisma</Badge>
                  <Badge variant="light" size="lg">PostgreSQL</Badge>
                  <Badge variant="light" size="lg">Docker</Badge>
                </SimpleGrid>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* 客户证言区域 */}
      <Container size="xl" py={100}>
        <Stack gap="xl" align="center">
          <Stack gap="md" align="center" ta="center">
            <Title order={2} size="2.5rem" fw={700}>
              客户信赖，业界认可
            </Title>
            <Text size="lg" c="dimmed">
              众多企业选择 damon-stack 作为他们的技术合作伙伴
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" mt="xl">
            <Paper withBorder p="xl">
              <Stack gap="md">
                <Group>
                  <Avatar size="lg" color="blue">张</Avatar>
                  <div>
                    <Text fw={600}>张技术总监</Text>
                    <Text size="sm" c="dimmed">某知名科技公司</Text>
                  </div>
                </Group>
                <Blockquote>
                  damon-stack 让我们的开发效率提升了 300%，
                  从原型到生产环境的部署时间缩短至几天，
                  团队协作更加顺畅。
                </Blockquote>
              </Stack>
            </Paper>

            <Paper withBorder p="xl">
              <Stack gap="md">
                <Group>
                  <Avatar size="lg" color="green">李</Avatar>
                  <div>
                    <Text fw={600}>李产品经理</Text>
                    <Text size="sm" c="dimmed">互联网创业公司</Text>
                  </div>
                </Group>
                <Blockquote>
                  完善的组件库和主题系统让我们快速实现了
                  品牌一致的用户体验，客户满意度显著提升，
                  产品迭代速度更快。
                </Blockquote>
              </Stack>
            </Paper>

            <Paper withBorder p="xl">
              <Stack gap="md">
                <Group>
                  <Avatar size="lg" color="orange">王</Avatar>
                  <div>
                    <Text fw={600}>王架构师</Text>
                    <Text size="sm" c="dimmed">传统企业数字化部门</Text>
                  </div>
                </Group>
                <Blockquote>
                  企业级的安全性和可扩展性让我们放心地
                  将关键业务系统迁移到新平台，
                  性能和稳定性都得到了保障。
                </Blockquote>
              </Stack>
            </Paper>
          </SimpleGrid>
        </Stack>
      </Container>

      {/* 最新博客区域 */}
      <Box bg="gray.0" py={100}>
        <Container size="xl">
          <Stack gap="xl">
            <Group justify="space-between" align="center">
              <div>
                <Title order={2} size="2rem" fw={700}>
                  技术洞察与最佳实践
                </Title>
                <Text size="lg" c="dimmed" mt="sm">
                  分享最新的技术趋势和开发经验
                </Text>
              </div>
              <Button
                variant="outline"
                component="a"
                href="/blog-demo"
                rightSection={<IconRocket size={16} />}
              >
                查看所有文章
              </Button>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
              <Card withBorder>
                <Badge mb="sm">技术分享</Badge>
                <Title order={4} mb="sm">
                  Next.js 15 新特性深度解析
                </Title>
                <Text size="sm" c="dimmed" mb="md">
                  探索 Next.js 15 带来的性能提升和开发体验改进，
                  包括新的缓存机制和服务器组件优化...
                </Text>
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">2024年1月15日</Text>
                  <Button variant="subtle" size="xs">阅读更多</Button>
                </Group>
              </Card>

              <Card withBorder>
                <Badge mb="sm" color="green">最佳实践</Badge>
                <Title order={4} mb="sm">
                  企业级应用架构设计指南
                </Title>
                <Text size="sm" c="dimmed" mb="md">
                  从单体应用到微服务架构的演进路径，
                  分享大型企业应用的架构设计经验和踩坑记录...
                </Text>
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">2024年1月10日</Text>
                  <Button variant="subtle" size="xs">阅读更多</Button>
                </Group>
              </Card>

              <Card withBorder>
                <Badge mb="sm" color="orange">性能优化</Badge>
                <Title order={4} mb="sm">
                  全栈应用性能优化实战
                </Title>
                <Text size="sm" c="dimmed" mb="md">
                  从前端到后端的全方位性能优化策略，
                  实际案例分析如何将应用响应时间提升10倍...
                </Text>
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">2024年1月5日</Text>
                  <Button variant="subtle" size="xs">阅读更多</Button>
                </Group>
              </Card>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* 联系方式区域 */}
      <Container size="xl" py={100}>
        <Stack gap="xl" align="center">
          <Stack gap="md" align="center" ta="center">
            <Title order={2} size="2.5rem" fw={700}>
              开始您的数字化转型之旅
            </Title>
            <Text size="lg" c="dimmed" maw={600}>
              联系我们的技术专家，获取专业的咨询服务和定制化解决方案
            </Text>
          </Stack>

          <Grid w="100%" maw={800}>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Paper withBorder p="xl" h={200} style={{ textAlign: 'center' }}>
                <ThemeIcon size={60} color="blue" mx="auto" mb="md">
                  <IconMail size={32} />
                </ThemeIcon>
                <Title order={5} mb="sm">邮箱联系</Title>
                <Text size="sm" c="dimmed">contact@damon-stack.com</Text>
                <Text size="sm" c="dimmed">support@damon-stack.com</Text>
              </Paper>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Paper withBorder p="xl" h={200} style={{ textAlign: 'center' }}>
                <ThemeIcon size={60} color="green" mx="auto" mb="md">
                  <IconPhone size={32} />
                </ThemeIcon>
                <Title order={5} mb="sm">电话咨询</Title>
                <Text size="sm" c="dimmed">400-123-4567</Text>
                <Text size="sm" c="dimmed">工作日 9:00-18:00</Text>
              </Paper>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Paper withBorder p="xl" h={200} style={{ textAlign: 'center' }}>
                <ThemeIcon size={60} color="orange" mx="auto" mb="md">
                  <IconMapPin size={32} />
                </ThemeIcon>
                <Title order={5} mb="sm">公司地址</Title>
                <Text size="sm" c="dimmed">北京市朝阳区</Text>
                <Text size="sm" c="dimmed">科技园区A座8层</Text>
              </Paper>
            </Grid.Col>
          </Grid>

          <Divider w="100%" my="xl" />

          <Group gap="lg">
            <Button
              size="xl"
              leftSection={<IconUsers size={24} />}
              component="a"
              href="/contact"
            >
              联系销售团队
            </Button>
            <Button
              size="xl"
              variant="outline"
              component="a"
              href="/about"
            >
              了解更多信息
            </Button>
          </Group>

          <Group gap="md" mt="lg">
            <ThemeIcon variant="light" size="lg">
              <IconBrandGithub size={20} />
            </ThemeIcon>
            <ThemeIcon variant="light" size="lg">
              <IconBrandTwitter size={20} />
            </ThemeIcon>
            <ThemeIcon variant="light" size="lg">
              <IconBrandLinkedin size={20} />
            </ThemeIcon>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
} 