'use client';

import { useState } from 'react';
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
  Paper,
  Box,
  TextInput,
  Textarea,
  Select,
  Grid,
  rem,
  Notification,
  Alert,
  Divider,
} from '@mantine/core';
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconClock,
  IconSend,
  IconCheck,
  IconAlertCircle,
  IconBuilding,
  IconUser,
  IconMessage,
  IconBrandWechat,
  IconBrandQq,
  IconHeadphones,
  IconMessageCircle,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandGithub,
} from '@tabler/icons-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟API调用
    try {
      // TODO: 接入后台API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      {/* Hero 区域 */}
      <Box style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Container size="xl" py={120}>
          <Stack gap="xl" align="center" ta="center">
            <Title size="3.5rem" fw={800}>
              联系我们
            </Title>
            <Text size="xl" maw={700} style={{ opacity: 0.9 }}>
              我们期待与您合作，为您的企业数字化转型提供专业的技术支持和服务
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* 联系方式概览 */}
      <Container size="xl" py={80}>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
          <Card withBorder p="xl" ta="center">
            <ThemeIcon size={60} color="blue" mx="auto" mb="md">
              <IconMail size={32} />
            </ThemeIcon>
            <Title order={5} mb="sm">邮箱联系</Title>
            <Text size="sm" c="dimmed" mb="xs">sales@damon-stack.com</Text>
            <Text size="sm" c="dimmed">support@damon-stack.com</Text>
          </Card>
          
          <Card withBorder p="xl" ta="center">
            <ThemeIcon size={60} color="green" mx="auto" mb="md">
              <IconPhone size={32} />
            </ThemeIcon>
            <Title order={5} mb="sm">电话咨询</Title>
            <Text size="sm" c="dimmed" mb="xs">400-123-4567</Text>
            <Text size="sm" c="dimmed">010-8888-9999</Text>
          </Card>
          
          <Card withBorder p="xl" ta="center">
            <ThemeIcon size={60} color="orange" mx="auto" mb="md">
              <IconMapPin size={32} />
            </ThemeIcon>
            <Title order={5} mb="sm">公司地址</Title>
            <Text size="sm" c="dimmed" mb="xs">北京市朝阳区</Text>
            <Text size="sm" c="dimmed">科技园区A座8层</Text>
          </Card>
          
          <Card withBorder p="xl" ta="center">
            <ThemeIcon size={60} color="violet" mx="auto" mb="md">
              <IconClock size={32} />
            </ThemeIcon>
            <Title order={5} mb="sm">服务时间</Title>
            <Text size="sm" c="dimmed" mb="xs">工作日 9:00-18:00</Text>
            <Text size="sm" c="dimmed">周末 10:00-16:00</Text>
          </Card>
        </SimpleGrid>
      </Container>

      {/* 主要内容区域 */}
      <Container size="xl" py={80}>
        <Grid>
          {/* 联系表单 */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Paper withBorder p="xl">
              <Stack gap="lg">
                <div>
                  <Title order={2} mb="sm">发送消息</Title>
                  <Text c="dimmed">
                    请填写以下信息，我们的技术专家会在24小时内与您取得联系
                  </Text>
                </div>

                {submitStatus === 'success' && (
                  <Alert icon={<IconCheck size="1rem" />} title="发送成功!" color="green">
                    感谢您的留言！我们的技术专家会在24小时内与您取得联系。
                  </Alert>
                )}

                {submitStatus === 'error' && (
                  <Alert icon={<IconAlertCircle size="1rem" />} title="发送失败" color="red">
                    抱歉，消息发送失败，请稍后重试或直接联系我们的客服。
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack gap="md">
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                      <TextInput
                        label="姓名"
                        placeholder="请输入您的姓名"
                        required
                        leftSection={<IconUser size="1rem" />}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                      <TextInput
                        label="邮箱"
                        placeholder="请输入您的邮箱"
                        type="email"
                        required
                        leftSection={<IconMail size="1rem" />}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                      <TextInput
                        label="公司名称"
                        placeholder="请输入您的公司名称"
                        leftSection={<IconBuilding size="1rem" />}
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                      />
                      <TextInput
                        label="联系电话"
                        placeholder="请输入您的联系电话"
                        leftSection={<IconPhone size="1rem" />}
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </SimpleGrid>

                    <Select
                      label="咨询主题"
                      placeholder="请选择咨询主题"
                      required
                      data={[
                        { value: 'product', label: '产品咨询' },
                        { value: 'pricing', label: '价格方案' },
                        { value: 'technical', label: '技术支持' },
                        { value: 'partnership', label: '合作洽谈' },
                        { value: 'demo', label: '产品演示' },
                        { value: 'other', label: '其他问题' },
                      ]}
                      value={formData.subject}
                      onChange={(value) => handleInputChange('subject', value || '')}
                    />

                    <Textarea
                      label="详细描述"
                      placeholder="请详细描述您的需求或问题..."
                      required
                      rows={6}
                      leftSection={<IconMessage size="1rem" />}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                    />

                    <Group justify="flex-end">
                      <Button
                        type="submit"
                        size="lg"
                        loading={isSubmitting}
                        leftSection={<IconSend size="1rem" />}
                      >
                        发送消息
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* 侧边栏信息 */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              {/* 在线客服 */}
              <Paper withBorder p="xl">
                <Stack gap="lg">
                  <Title order={4}>在线客服</Title>
                  <Text size="sm" c="dimmed">
                    需要即时帮助？我们的在线客服随时为您服务
                  </Text>
                  
                  <Stack gap="md">
                    <Button
                      fullWidth
                      variant="light"
                      leftSection={<IconMessageCircle size="1rem" />}
                      color="blue"
                    >
                      在线聊天
                    </Button>
                    <Button
                      fullWidth
                      variant="light"
                      leftSection={<IconBrandWechat size="1rem" />}
                      color="green"
                    >
                      微信客服
                    </Button>
                    <Button
                      fullWidth
                      variant="light"
                      leftSection={<IconBrandQq size="1rem" />}
                      color="teal"
                    >
                      QQ客服
                    </Button>
                  </Stack>
                </Stack>
              </Paper>

              {/* 技术支持 */}
              <Paper withBorder p="xl">
                <Stack gap="lg">
                  <Group>
                    <ThemeIcon size="lg" color="orange">
                      <IconHeadphones size="1.2rem" />
                    </ThemeIcon>
                    <div>
                      <Title order={5}>技术支持</Title>
                      <Text size="sm" c="dimmed">7×24小时专业支持</Text>
                    </div>
                  </Group>
                  
                  <Stack gap="xs">
                    <Text size="sm">
                      <strong>技术热线：</strong> 400-123-4567 转 2
                    </Text>
                    <Text size="sm">
                      <strong>邮箱支持：</strong> support@damon-stack.com
                    </Text>
                    <Text size="sm">
                      <strong>在线文档：</strong> docs.damon-stack.com
                    </Text>
                  </Stack>
                </Stack>
              </Paper>

              {/* 销售团队 */}
              <Paper withBorder p="xl">
                <Stack gap="lg">
                  <Group>
                    <ThemeIcon size="lg" color="violet">
                      <IconUser size="1.2rem" />
                    </ThemeIcon>
                    <div>
                      <Title order={5}>销售团队</Title>
                      <Text size="sm" c="dimmed">专业的售前咨询</Text>
                    </div>
                  </Group>
                  
                  <Stack gap="xs">
                    <Text size="sm">
                      <strong>销售热线：</strong> 400-123-4567 转 1
                    </Text>
                    <Text size="sm">
                      <strong>销售邮箱：</strong> sales@damon-stack.com
                    </Text>
                    <Text size="sm">
                      <strong>企业客户：</strong> enterprise@damon-stack.com
                    </Text>
                  </Stack>
                </Stack>
              </Paper>

              {/* 社交媒体 */}
              <Paper withBorder p="xl">
                <Stack gap="lg">
                  <Title order={5}>关注我们</Title>
                  <Text size="sm" c="dimmed">
                    获取最新的技术资讯和产品动态
                  </Text>
                  
                  <Group gap="md">
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
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>

      {/* 地图区域 */}
      <Box bg="gray.0" py={80}>
        <Container size="xl">
          <Stack gap="xl" align="center">
            <Title order={2} ta="center">
              找到我们
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={600}>
              欢迎来访我们的办公室，体验最新的技术产品和解决方案
            </Text>
            
            <Paper withBorder w="100%" h={400} style={{ position: 'relative', backgroundColor: '#f8fafc' }}>
              {/* 地图占位符 */}
              <Stack align="center" justify="center" h="100%" gap="md">
                <ThemeIcon size={80} color="blue" variant="light">
                  <IconMapPin size={40} />
                </ThemeIcon>
                <Stack gap="xs" align="center">
                  <Title order={4}>北京总部</Title>
                  <Text size="sm" c="dimmed">北京市朝阳区科技园区A座8层</Text>
                  <Text size="sm" c="dimmed">邮编：100000</Text>
                </Stack>
                <Button variant="outline" size="sm">
                  在地图中查看
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* 办公时间和交通信息 */}
      <Container size="xl" py={80}>
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
          <Paper withBorder p="xl">
            <Stack gap="lg">
              <Group>
                <ThemeIcon size="lg" color="blue">
                  <IconClock size="1.2rem" />
                </ThemeIcon>
                <Title order={4}>办公时间</Title>
              </Group>
              
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text>周一至周五</Text>
                  <Text fw={600}>9:00 - 18:00</Text>
                </Group>
                <Group justify="space-between">
                  <Text>周六</Text>
                  <Text fw={600}>10:00 - 16:00</Text>
                </Group>
                <Group justify="space-between">
                  <Text>周日</Text>
                  <Text c="dimmed">休息</Text>
                </Group>
                <Divider my="sm" />
                <Group justify="space-between">
                  <Text>法定节假日</Text>
                  <Text c="dimmed">根据国家规定调整</Text>
                </Group>
              </Stack>
            </Stack>
          </Paper>

          <Paper withBorder p="xl">
            <Stack gap="lg">
              <Group>
                <ThemeIcon size="lg" color="green">
                  <IconMapPin size="1.2rem" />
                </ThemeIcon>
                <Title order={4}>交通信息</Title>
              </Group>
              
              <Stack gap="sm">
                <div>
                  <Text fw={600} mb="xs">地铁</Text>
                  <Text size="sm" c="dimmed">10号线 科技园站 B出口步行5分钟</Text>
                </div>
                <div>
                  <Text fw={600} mb="xs">公交</Text>
                  <Text size="sm" c="dimmed">328路、630路 科技园区站下车</Text>
                </div>
                <div>
                  <Text fw={600} mb="xs">自驾</Text>
                  <Text size="sm" c="dimmed">大厦地下停车场，访客免费停车3小时</Text>
                </div>
                <div>
                  <Text fw={600} mb="xs">打车</Text>
                  <Text size="sm" c="dimmed">导航至"科技园区A座"即可</Text>
                </div>
              </Stack>
            </Stack>
          </Paper>
        </SimpleGrid>
      </Container>

      {/* 常见问题 */}
      <Box bg="gray.0" py={80}>
        <Container size="xl">
          <Stack gap="xl" align="center">
            <Title order={2} ta="center">
              常见问题
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={600}>
              快速找到您需要的答案
            </Text>
            
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl" w="100%">
              <Paper withBorder p="xl">
                <Stack gap="md">
                  <Title order={5}>如何开始使用 damon-stack？</Title>
                  <Text size="sm" c="dimmed">
                    您可以先申请免费试用，我们的技术团队会为您提供完整的产品演示
                    和技术培训，帮助您快速上手。
                  </Text>
                </Stack>
              </Paper>

              <Paper withBorder p="xl">
                <Stack gap="md">
                  <Title order={5}>支持私有化部署吗？</Title>
                  <Text size="sm" c="dimmed">
                    是的，我们提供完整的私有化部署方案，包括本地部署、云服务器部署
                    等多种选择，确保您的数据安全。
                  </Text>
                </Stack>
              </Paper>

              <Paper withBorder p="xl">
                <Stack gap="md">
                  <Title order={5}>技术支持如何收费？</Title>
                  <Text size="sm" c="dimmed">
                    基础技术支持包含在产品价格中，我们还提供7×24小时
                    的高级技术支持服务，具体可咨询销售团队。
                  </Text>
                </Stack>
              </Paper>

              <Paper withBorder p="xl">
                <Stack gap="md">
                  <Title order={5}>可以定制开发吗？</Title>
                  <Text size="sm" c="dimmed">
                    当然可以，我们有专业的定制开发团队，可以根据您的具体需求
                    提供个性化的解决方案。
                  </Text>
                </Stack>
              </Paper>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
} 