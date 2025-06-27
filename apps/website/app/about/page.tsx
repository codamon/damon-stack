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
  Avatar,
  Timeline,
  Paper,
  Box,
  Badge,
  List,
  rem,
} from '@mantine/core';
import {
  IconRocket,
  IconUsers,
  IconTrophy,
  IconTarget,
  IconHeart,
  IconBulb,
  IconShield,
  IconGrowth,
  IconStar,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
} from '@tabler/icons-react';

export default function AboutPage() {
  return (
    <Box>
      {/* Hero 区域 */}
      <Box style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Container size="xl" py={120}>
          <Stack gap="xl" align="center" ta="center">
            <Title size="3.5rem" fw={800}>
              关于 damon-stack
            </Title>
            <Text size="xl" maw={700} style={{ opacity: 0.9 }}>
              我们致力于为企业提供最先进的全栈开发解决方案，
              助力企业在数字化时代获得竞争优势
            </Text>
            <Button
              size="lg"
              color="white"
              variant="outline"
              leftSection={<IconMail size={20} />}
              component="a"
              href="/contact"
            >
              联系我们
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* 公司介绍 */}
      <Container size="xl" py={100}>
        <Stack gap="xl">
          <Title order={2} size="2.5rem" fw={700} ta="center">
            我们的使命
          </Title>
          
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <Stack gap="lg">
              <Title order={3} size="2rem">
                推动企业数字化转型
              </Title>
              <Text size="lg" c="dimmed">
                damon-stack 成立于2023年，由一群充满激情的技术专家创建。
                我们深知现代企业在数字化转型过程中面临的挑战，
                因此致力于提供简单、高效、可靠的全栈开发平台。
              </Text>
              <Text size="lg" c="dimmed">
                我们的平台基于最新的技术栈，包括 Next.js 15、React 19、
                TypeScript、Mantine 8、tRPC 和 Prisma，
                为企业提供从前端到后端的完整解决方案。
              </Text>
              <Button
                size="lg"
                leftSection={<IconRocket size={20} />}
                component="a"
                href="/products"
              >
                了解我们的产品
              </Button>
            </Stack>
            
            <Box p="xl" style={{ backgroundColor: '#f8fafc', borderRadius: rem(12) }}>
              <Stack gap="lg">
                <SimpleGrid cols={2} spacing="lg">
                  <Paper withBorder p="lg" ta="center">
                    <Title order={2} c="blue">500+</Title>
                    <Text size="sm" c="dimmed">服务企业</Text>
                  </Paper>
                  <Paper withBorder p="lg" ta="center">
                    <Title order={2} c="green">99.9%</Title>
                    <Text size="sm" c="dimmed">系统可用性</Text>
                  </Paper>
                  <Paper withBorder p="lg" ta="center">
                    <Title order={2} c="orange">24/7</Title>
                    <Text size="sm" c="dimmed">技术支持</Text>
                  </Paper>
                  <Paper withBorder p="lg" ta="center">
                    <Title order={2} c="violet">50+</Title>
                    <Text size="sm" c="dimmed">技术专家</Text>
                  </Paper>
                </SimpleGrid>
              </Stack>
            </Box>
          </SimpleGrid>
        </Stack>
      </Container>

      {/* 企业价值观 */}
      <Box bg="gray.0" py={100}>
        <Container size="xl">
          <Stack gap="xl" align="center">
            <Title order={2} size="2.5rem" fw={700} ta="center">
              我们的核心价值观
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={600}>
              这些价值观指导着我们的日常工作，也是我们与客户和合作伙伴建立信任的基础
            </Text>
            
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mt="xl">
              <Card withBorder p="xl" h={280}>
                <ThemeIcon size={60} color="blue" mb="md">
                  <IconBulb size={32} />
                </ThemeIcon>
                <Title order={4} mb="sm">创新驱动</Title>
                <Text size="sm" c="dimmed">
                  持续探索新技术，推动行业创新，
                  为客户提供最前沿的解决方案，
                  始终保持技术领先地位。
                </Text>
              </Card>

              <Card withBorder p="xl" h={280}>
                <ThemeIcon size={60} color="green" mb="md">
                  <IconShield size={32} />
                </ThemeIcon>
                <Title order={4} mb="sm">可靠品质</Title>
                <Text size="sm" c="dimmed">
                  严格的质量控制流程，
                  确保每一个产品都达到企业级标准，
                  为客户提供稳定可靠的服务。
                </Text>
              </Card>

              <Card withBorder p="xl" h={280}>
                <ThemeIcon size={60} color="orange" mb="md">
                  <IconUsers size={32} />
                </ThemeIcon>
                <Title order={4} mb="sm">客户至上</Title>
                <Text size="sm" c="dimmed">
                  深入理解客户需求，
                  提供个性化的解决方案，
                  建立长期稳定的合作关系。
                </Text>
              </Card>

              <Card withBorder p="xl" h={280}>
                <ThemeIcon size={60} color="violet" mb="md">
                  <IconHeart size={32} />
                </ThemeIcon>
                <Title order={4} mb="sm">团队协作</Title>
                <Text size="sm" c="dimmed">
                  鼓励开放沟通，分享知识经验，
                  在团队合作中实现个人成长
                  和企业目标的双赢。
                </Text>
              </Card>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* 发展历程 */}
      <Container size="xl" py={100}>
        <Stack gap="xl" align="center">
          <Title order={2} size="2.5rem" fw={700} ta="center">
            发展历程
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={600}>
            从创业初期到今天的成就，每一步都见证了我们的成长和进步
          </Text>
          
          <Timeline active={3} bulletSize={24} lineWidth={2} mt="xl">
            <Timeline.Item
              bullet={<IconRocket size={12} />}
              title="2023年1月 - 公司成立"
            >
              <Text c="dimmed" size="sm">
                由资深技术专家团队创立，明确了为企业提供
                现代化全栈开发解决方案的愿景。
              </Text>
              <Text size="xs" mt={4} c="dimmed">
                团队规模：5人 | 技术栈确定：Next.js + tRPC
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconUsers size={12} />}
              title="2023年6月 - 第一批客户"
            >
              <Text c="dimmed" size="sm">
                成功服务前10家企业客户，平台功能得到验证，
                获得客户高度认可和好评。
              </Text>
              <Text size="xs" mt={4} c="dimmed">
                客户数量：10+ | 团队扩展：15人
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconTrophy size={12} />}
              title="2023年12月 - 技术突破"
            >
              <Text c="dimmed" size="sm">
                完成核心技术架构升级，发布 v2.0 版本，
                性能提升300%，支持更大规模的企业应用。
              </Text>
              <Text size="xs" mt={4} c="dimmed">
                客户数量：100+ | 团队规模：30人
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconGrowth size={12} />}
              title="2024年6月 - 快速成长"
            >
              <Text c="dimmed" size="sm">
                客户数量突破500家，获得A轮融资，
                建立多个技术研发中心，产品线全面扩展。
              </Text>
              <Text size="xs" mt={4} c="dimmed">
                客户数量：500+ | 团队规模：50人 | 融资：A轮
              </Text>
            </Timeline.Item>
          </Timeline>
        </Stack>
      </Container>

      {/* 团队成员展示 */}
      <Box bg="gray.0" py={100}>
        <Container size="xl">
          <Stack gap="xl" align="center">
            <Title order={2} size="2.5rem" fw={700} ta="center">
              核心团队
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={600}>
              我们拥有一支经验丰富、充满激情的技术团队
            </Text>
            
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" mt="xl">
              <Card withBorder p="xl">
                <Stack gap="md" align="center" ta="center">
                  <Avatar size={100} color="blue">张</Avatar>
                  <div>
                    <Title order={4}>张三</Title>
                    <Text size="sm" c="dimmed">创始人 & CEO</Text>
                  </div>
                  <Text size="sm" ta="center" c="dimmed">
                    15年全栈开发经验，曾就职于阿里巴巴、腾讯等知名企业，
                    专注于企业级应用架构设计。
                  </Text>
                  <Group gap="sm">
                    <ThemeIcon variant="light" size="sm">
                      <IconMail size={16} />
                    </ThemeIcon>
                    <ThemeIcon variant="light" size="sm">
                      <IconBrandLinkedin size={16} />
                    </ThemeIcon>
                    <ThemeIcon variant="light" size="sm">
                      <IconBrandGithub size={16} />
                    </ThemeIcon>
                  </Group>
                </Stack>
              </Card>

              <Card withBorder p="xl">
                <Stack gap="md" align="center" ta="center">
                  <Avatar size={100} color="green">李</Avatar>
                  <div>
                    <Title order={4}>李四</Title>
                    <Text size="sm" c="dimmed">技术总监 & CTO</Text>
                  </div>
                  <Text size="sm" ta="center" c="dimmed">
                    12年后端开发经验，微服务架构专家，
                    曾主导多个大型企业级系统的技术升级。
                  </Text>
                  <Group gap="sm">
                    <ThemeIcon variant="light" size="sm">
                      <IconMail size={16} />
                    </ThemeIcon>
                    <ThemeIcon variant="light" size="sm">
                      <IconBrandLinkedin size={16} />
                    </ThemeIcon>
                    <ThemeIcon variant="light" size="sm">
                      <IconBrandGithub size={16} />
                    </ThemeIcon>
                  </Group>
                </Stack>
              </Card>

              <Card withBorder p="xl">
                <Stack gap="md" align="center" ta="center">
                  <Avatar size={100} color="orange">王</Avatar>
                  <div>
                    <Title order={4}>王五</Title>
                    <Text size="sm" c="dimmed">产品总监</Text>
                  </div>
                  <Text size="sm" ta="center" c="dimmed">
                    10年产品管理经验，擅长用户体验设计，
                    成功推出多个获奖产品，深受用户喜爱。
                  </Text>
                  <Group gap="sm">
                    <ThemeIcon variant="light" size="sm">
                      <IconMail size={16} />
                    </ThemeIcon>
                    <ThemeIcon variant="light" size="sm">
                      <IconBrandLinkedin size={16} />
                    </ThemeIcon>
                    <ThemeIcon variant="light" size="sm">
                      <IconBrandGithub size={16} />
                    </ThemeIcon>
                  </Group>
                </Stack>
              </Card>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* 加入我们 */}
      <Container size="xl" py={100}>
        <Stack gap="xl" align="center" ta="center">
          <Title order={2} size="2.5rem" fw={700}>
            加入我们的团队
          </Title>
          <Text size="lg" c="dimmed" maw={600}>
            我们正在寻找有才华、有激情的技术专家加入我们的团队，
            一起创造更美好的数字化未来
          </Text>
          
          <Box p="xl" style={{ backgroundColor: '#f8fafc', borderRadius: rem(12) }} maw={800} w="100%">
            <Stack gap="md">
              <Title order={4} ta="center">我们提供</Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <List size="sm" spacing="xs">
                  <List.Item>🏠 灵活的远程工作政策</List.Item>
                  <List.Item>💰 具有竞争力的薪酬待遇</List.Item>
                  <List.Item>📚 完善的技术培训体系</List.Item>
                  <List.Item>🎯 明确的职业发展路径</List.Item>
                </List>
                <List size="sm" spacing="xs">
                  <List.Item>🏥 完善的五险一金保障</List.Item>
                  <List.Item>🎉 丰富的团队建设活动</List.Item>
                  <List.Item>💻 最新的开发设备配置</List.Item>
                  <List.Item>🌟 开放包容的企业文化</List.Item>
                </List>
              </SimpleGrid>
            </Stack>
          </Box>

          <Group gap="lg">
            <Button
              size="lg"
              leftSection={<IconUsers size={20} />}
              component="a"
              href="/contact"
            >
              查看职位
            </Button>
            <Button
              size="lg"
              variant="outline"
              component="a"
              href="/contact"
            >
              投递简历
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
} 