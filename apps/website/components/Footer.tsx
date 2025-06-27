'use client';

import {
  Box,
  Container,
  Group,
  Text,
  Stack,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  rem,
} from '@mantine/core';
import Link from 'next/link';
import {
  IconRocket,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandGithub,
  IconBrandWechat,
} from '@tabler/icons-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e0e7ff' }}>
      <Container size="xl" py={60}>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
          {/* 公司信息 */}
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'blue', to: 'indigo' }}>
                <IconRocket size="1.2rem" />
              </ThemeIcon>
              <Text size="xl" fw={700} c="blue.8">
                damon-stack
              </Text>
            </Group>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
              构建现代化全栈应用平台，为企业提供完整的技术解决方案，
              助力数字化转型，打造高质量、可扩展的Web应用。
            </Text>
            <Group gap="sm">
              <ThemeIcon variant="light" size="lg">
                <IconBrandLinkedin size="1.2rem" />
              </ThemeIcon>
              <ThemeIcon variant="light" size="lg">
                <IconBrandTwitter size="1.2rem" />
              </ThemeIcon>
              <ThemeIcon variant="light" size="lg">
                <IconBrandGithub size="1.2rem" />
              </ThemeIcon>
              <ThemeIcon variant="light" size="lg">
                <IconBrandWechat size="1.2rem" />
              </ThemeIcon>
            </Group>
          </Stack>

          {/* 产品服务 */}
          <Stack gap="md">
            <Text fw={600} c="gray.8">产品服务</Text>
            <Stack gap="xs">
              <Anchor component={Link} href="/products" size="sm" c="dimmed">
                全栈开发平台
              </Anchor>
              <Anchor component={Link} href="/products" size="sm" c="dimmed">
                企业级解决方案
              </Anchor>
              <Anchor component={Link} href="/products" size="sm" c="dimmed">
                技术咨询服务
              </Anchor>
              <Anchor component={Link} href="/products" size="sm" c="dimmed">
                定制开发
              </Anchor>
              <Anchor component={Link} href="/theme-demo" size="sm" c="dimmed">
                主题演示
              </Anchor>
            </Stack>
          </Stack>

          {/* 公司信息 */}
          <Stack gap="md">
            <Text fw={600} c="gray.8">公司信息</Text>
            <Stack gap="xs">
              <Anchor component={Link} href="/about" size="sm" c="dimmed">
                关于我们
              </Anchor>
              <Anchor component={Link} href="/about#team" size="sm" c="dimmed">
                团队介绍
              </Anchor>
              <Anchor component={Link} href="/about#values" size="sm" c="dimmed">
                企业价值观
              </Anchor>
              <Anchor component={Link} href="/about#careers" size="sm" c="dimmed">
                加入我们
              </Anchor>
              <Anchor component={Link} href="/contact" size="sm" c="dimmed">
                新闻动态
              </Anchor>
            </Stack>
          </Stack>

          {/* 联系方式 */}
          <Stack gap="md">
            <Text fw={600} c="gray.8">联系我们</Text>
            <Stack gap="sm">
              <Group gap="sm">
                <ThemeIcon size="sm" variant="light" color="blue">
                  <IconMail size="0.9rem" />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  contact@damon-stack.com
                </Text>
              </Group>
              <Group gap="sm">
                <ThemeIcon size="sm" variant="light" color="green">
                  <IconPhone size="0.9rem" />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  400-123-4567
                </Text>
              </Group>
              <Group gap="sm">
                <ThemeIcon size="sm" variant="light" color="orange">
                  <IconMapPin size="0.9rem" />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  北京市朝阳区科技园区A座8层
                </Text>
              </Group>
            </Stack>
            <Anchor component={Link} href="/contact" size="sm" fw={500} c="blue">
              联系我们 →
            </Anchor>
          </Stack>
        </SimpleGrid>

        <Divider my="xl" />

        {/* 底部版权信息 */}
        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed">
            © {currentYear} damon-stack. 保留所有权利。
          </Text>
          <Group gap="lg">
            <Anchor component={Link} href="/privacy" size="xs" c="dimmed">
              隐私政策
            </Anchor>
            <Anchor href="#" size="xs" c="dimmed">
              服务条款
            </Anchor>
            <Anchor href="#" size="xs" c="dimmed">
              Cookie政策
            </Anchor>
            <Text size="xs" c="dimmed">
              京ICP备12345678号
            </Text>
          </Group>
        </Group>
      </Container>
    </Box>
  );
} 