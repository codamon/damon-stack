'use client';

import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Box,
  List,
  Anchor,
  Divider,
  Alert,
  ThemeIcon,
} from '@mantine/core';
import {
  IconShield,
  IconLock,
  IconInfoCircle,
  IconMail,
} from '@tabler/icons-react';

export default function PrivacyPage() {
  return (
    <Box>
      {/* Hero 区域 */}
      <Box style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Container size="xl" py={120}>
          <Stack gap="xl" align="center" ta="center">
            <Title size="3.5rem" fw={800}>
              隐私政策
            </Title>
            <Text size="xl" maw={700} style={{ opacity: 0.9 }}>
              我们承诺保护您的隐私，本政策详细说明了我们如何收集、使用和保护您的个人信息
            </Text>
            <Text size="sm" style={{ opacity: 0.8 }}>
              最后更新时间：2024年1月1日
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* 主要内容 */}
      <Container size="lg" py={80}>
        <Stack gap="xl">
          {/* 重要提示 */}
          <Alert icon={<IconInfoCircle size="1rem" />} title="重要提示" color="blue">
            请仔细阅读本隐私政策。使用我们的服务即表示您同意本政策的条款。
            如果您不同意本政策，请不要使用我们的产品和服务。
          </Alert>

          {/* 信息收集 */}
          <Paper withBorder p="xl">
            <Stack gap="lg">
              <Title order={2} mb="md">
                1. 信息收集
              </Title>
              
              <div>
                <Title order={4} mb="sm">1.1 我们收集的信息类型</Title>
                <Text c="dimmed" mb="md">
                  为了向您提供更好的服务，我们可能会收集以下类型的信息：
                </Text>
                <List spacing="sm">
                  <List.Item>
                    <strong>账户信息：</strong>包括姓名、邮箱地址、电话号码、公司信息等
                  </List.Item>
                  <List.Item>
                    <strong>使用数据：</strong>包括登录时间、功能使用情况、访问页面等
                  </List.Item>
                  <List.Item>
                    <strong>技术信息：</strong>包括IP地址、设备信息、浏览器类型、操作系统等
                  </List.Item>
                  <List.Item>
                    <strong>业务数据：</strong>您在使用我们服务过程中产生的数据和内容
                  </List.Item>
                </List>
              </div>

              <div>
                <Title order={4} mb="sm">1.2 信息收集方式</Title>
                <List spacing="sm">
                  <List.Item>您主动提供给我们的信息（如注册、联系表单等）</List.Item>
                  <List.Item>通过技术手段自动收集的信息（如Cookies、日志文件等）</List.Item>
                  <List.Item>从第三方合法获得的信息（如业务合作伙伴）</List.Item>
                </List>
              </div>
            </Stack>
          </Paper>

          {/* 信息使用 */}
          <Paper withBorder p="xl">
            <Stack gap="lg">
              <Title order={2} mb="md">
                2. 信息使用
              </Title>
              
              <div>
                <Title order={4} mb="sm">2.1 使用目的</Title>
                <Text c="dimmed" mb="md">
                  我们收集您的信息主要用于以下目的：
                </Text>
                <List spacing="sm">
                  <List.Item>提供、维护和改进我们的产品和服务</List.Item>
                  <List.Item>处理您的交易和提供技术支持</List.Item>
                  <List.Item>与您沟通产品更新、技术通知和营销信息</List.Item>
                  <List.Item>防范欺诈和确保服务安全</List.Item>
                  <List.Item>遵守法律法规要求</List.Item>
                  <List.Item>进行数据分析以改善用户体验</List.Item>
                </List>
              </div>

              <div>
                <Title order={4} mb="sm">2.2 营销通信</Title>
                <Text c="dimmed">
                  在获得您的同意后，我们可能会向您发送有关我们产品、服务、活动的营销信息。
                  您可以随时选择退订这些通信。
                </Text>
              </div>
            </Stack>
          </Paper>

          {/* 信息共享 */}
          <Paper withBorder p="xl">
            <Stack gap="lg">
              <Title order={2} mb="md">
                3. 信息共享与披露
              </Title>
              
              <div>
                <Title order={4} mb="sm">3.1 共享原则</Title>
                <Text c="dimmed" mb="md">
                  我们不会出售、出租或以其他方式商业化您的个人信息。
                  我们仅在以下情况下共享您的信息：
                </Text>
                <List spacing="sm">
                  <List.Item>
                    <strong>经您同意：</strong>在获得您明确同意的情况下
                  </List.Item>
                  <List.Item>
                    <strong>服务提供商：</strong>与帮助我们提供服务的第三方服务商
                  </List.Item>
                  <List.Item>
                    <strong>法律要求：</strong>根据法律法规要求或政府部门要求
                  </List.Item>
                  <List.Item>
                    <strong>业务转让：</strong>在企业合并、收购或资产转让情况下
                  </List.Item>
                  <List.Item>
                    <strong>安全保护：</strong>为保护我们或他人的权利、财产或安全
                  </List.Item>
                </List>
              </div>

              <div>
                <Title order={4} mb="sm">3.2 第三方服务</Title>
                <Text c="dimmed">
                  我们的服务可能包含第三方服务的链接或集成。这些第三方有其自己的隐私政策，
                  我们建议您仔细阅读他们的隐私条款。
                </Text>
              </div>
            </Stack>
          </Paper>

          {/* 数据安全 */}
          <Paper withBorder p="xl">
            <Stack gap="lg">
              <Title order={2} mb="md">
                <ThemeIcon size="lg" color="green" variant="light" mr="sm">
                  <IconShield size="1.2rem" />
                </ThemeIcon>
                4. 数据安全
              </Title>
              
              <div>
                <Title order={4} mb="sm">4.1 安全措施</Title>
                <Text c="dimmed" mb="md">
                  我们采用行业标准的安全措施来保护您的个人信息：
                </Text>
                <List spacing="sm">
                  <List.Item>数据传输加密（SSL/TLS）</List.Item>
                  <List.Item>数据存储加密</List.Item>
                  <List.Item>访问控制和身份验证</List.Item>
                  <List.Item>定期安全审计和漏洞扫描</List.Item>
                  <List.Item>员工安全培训和保密协议</List.Item>
                  <List.Item>数据备份和灾难恢复计划</List.Item>
                </List>
              </div>

              <div>
                <Title order={4} mb="sm">4.2 数据保留</Title>
                <Text c="dimmed">
                  我们仅在必要的时间内保留您的个人信息，具体保留期限取决于信息类型和业务需要。
                  当信息不再需要时，我们会安全地删除或匿名化处理。
                </Text>
              </div>
            </Stack>
          </Paper>

          {/* 您的权利 */}
          <Paper withBorder p="xl">
            <Stack gap="lg">
              <Title order={2} mb="md">
                <ThemeIcon size="lg" color="blue" variant="light" mr="sm">
                  <IconLock size="1.2rem" />
                </ThemeIcon>
                5. 您的权利
              </Title>
              
              <div>
                <Title order={4} mb="sm">5.1 数据权利</Title>
                <Text c="dimmed" mb="md">
                  根据适用的法律法规，您享有以下权利：
                </Text>
                <List spacing="sm">
                  <List.Item>
                    <strong>访问权：</strong>了解我们收集的关于您的个人信息
                  </List.Item>
                  <List.Item>
                    <strong>更正权：</strong>要求更正不准确或不完整的个人信息
                  </List.Item>
                  <List.Item>
                    <strong>删除权：</strong>在特定情况下要求删除您的个人信息
                  </List.Item>
                  <List.Item>
                    <strong>限制处理权：</strong>在特定情况下限制我们处理您的信息
                  </List.Item>
                  <List.Item>
                    <strong>数据可携权：</strong>以结构化、常用格式获取您的数据
                  </List.Item>
                  <List.Item>
                    <strong>反对权：</strong>反对我们处理您的个人信息
                  </List.Item>
                </List>
              </div>

              <div>
                <Title order={4} mb="sm">5.2 行使权利</Title>
                <Text c="dimmed">
                  如需行使上述权利，请通过以下方式联系我们：
                  <Anchor href="mailto:privacy@damon-stack.com">privacy@damon-stack.com</Anchor>
                  。我们会在法律规定的时间内回复您的请求。
                </Text>
              </div>
            </Stack>
          </Paper>

          {/* Cookies政策 */}
          <Paper withBorder p="xl">
            <Stack gap="lg">
              <Title order={2} mb="md">
                6. Cookies 和类似技术
              </Title>
              
              <div>
                <Title order={4} mb="sm">6.1 Cookies使用</Title>
                <Text c="dimmed" mb="md">
                  我们使用 Cookies 和类似技术来改善您的用户体验：
                </Text>
                <List spacing="sm">
                  <List.Item>
                    <strong>必要Cookies：</strong>确保网站正常运行的基本功能
                  </List.Item>
                  <List.Item>
                    <strong>性能Cookies：</strong>收集网站使用情况信息，帮助我们改进性能
                  </List.Item>
                  <List.Item>
                    <strong>功能Cookies：</strong>记住您的偏好设置，提供个性化体验
                  </List.Item>
                  <List.Item>
                    <strong>分析Cookies：</strong>了解用户行为，优化我们的服务
                  </List.Item>
                </List>
              </div>

              <div>
                <Title order={4} mb="sm">6.2 Cookies管理</Title>
                <Text c="dimmed">
                  您可以通过浏览器设置管理或禁用Cookies。但请注意，
                  禁用某些Cookies可能会影响网站功能的正常使用。
                </Text>
              </div>
            </Stack>
          </Paper>

          {/* 国际传输 */}
          <Paper withBorder p="xl">
            <Stack gap="lg">
              <Title order={2} mb="md">
                7. 国际数据传输
              </Title>
              
              <Text c="dimmed" mb="md">
                您的个人信息可能会被传输到您所在国家/地区以外的服务器进行处理和存储。
                当发生跨境数据传输时，我们会确保：
              </Text>
              <List spacing="sm">
                <List.Item>接收方提供充分的数据保护水平</List.Item>
                <List.Item>签署适当的数据传输协议</List.Item>
                <List.Item>遵守适用的数据保护法律</List.Item>
                <List.Item>采取适当的安全保障措施</List.Item>
              </List>
            </Stack>
          </Paper>

          {/* 政策变更 */}
          <Paper withBorder p="xl">
            <Stack gap="lg">
              <Title order={2} mb="md">
                8. 隐私政策变更
              </Title>
              
              <Text c="dimmed" mb="md">
                我们可能会不时更新本隐私政策以反映我们服务的变化或法律要求的更新。
                当我们对政策进行重大变更时，我们会：
              </Text>
              <List spacing="sm">
                <List.Item>在网站上发布更新的政策</List.Item>
                <List.Item>通过邮件通知注册用户</List.Item>
                <List.Item>在服务中显示明显的通知</List.Item>
                <List.Item>对于重大变更，征求您的同意</List.Item>
              </List>
              <Text c="dimmed" mt="md">
                建议您定期查看本政策以了解最新的隐私保护措施。
              </Text>
            </Stack>
          </Paper>

          {/* 联系我们 */}
          <Paper withBorder p="xl">
            <Stack gap="lg">
              <Title order={2} mb="md">
                <ThemeIcon size="lg" color="orange" variant="light" mr="sm">
                  <IconMail size="1.2rem" />
                </ThemeIcon>
                9. 联系我们
              </Title>
              
              <Text c="dimmed" mb="md">
                如果您对本隐私政策有任何疑问、意见或投诉，请通过以下方式联系我们：
              </Text>
              
              <Stack gap="sm">
                <Text>
                  <strong>邮箱：</strong> 
                  <Anchor href="mailto:privacy@damon-stack.com">privacy@damon-stack.com</Anchor>
                </Text>
                <Text>
                  <strong>电话：</strong> 400-123-4567
                </Text>
                <Text>
                  <strong>地址：</strong> 北京市朝阳区科技园区A座8层
                </Text>
                <Text>
                  <strong>邮编：</strong> 100000
                </Text>
              </Stack>
              
              <Divider my="md" />
              
              <Text size="sm" c="dimmed">
                我们承诺在收到您的咨询后30个工作日内给予回复。
                对于涉及个人信息的紧急问题，我们会优先处理。
              </Text>
            </Stack>
          </Paper>

          {/* 生效日期 */}
          <Paper withBorder p="xl" style={{ backgroundColor: '#f8fafc' }}>
            <Stack gap="md" align="center" ta="center">
              <Title order={4}>生效日期</Title>
              <Text c="dimmed">
                本隐私政策自 2024年1月1日 起生效。
              </Text>
              <Text size="sm" c="dimmed">
                版本号：v1.0 | 最后修订：2024年1月1日
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
} 