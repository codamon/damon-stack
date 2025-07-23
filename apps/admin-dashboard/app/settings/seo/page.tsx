'use client';

import { useState } from 'react';
import {
  Group,
  Title,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Button,
  Tabs,
  Card,
  Text,
  Badge,
  Progress,
  Alert,
  Grid,
  NumberInput,
  Switch,
  ActionIcon,
  Table,
  Modal,
  Select,
} from '@mantine/core';
import {
  IconSettings,
  IconSearch,
  IconGraph,
  IconRocket,
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

interface SEOSettings {
  siteName: string;
  siteDescription: string;
  defaultTitle: string;
  defaultKeywords: string;
  googleAnalyticsId: string;
  googleSearchConsoleId: string;
  baiduAnalyticsId: string;
  enableStructuredData: boolean;
  enableSitemap: boolean;
  enableRobots: boolean;
}

interface SEOAnalytics {
  totalPages: number;
  indexedPages: number;
  avgLoadTime: number;
  mobileScore: number;
  desktopScore: number;
  seoScore: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    pages: number;
  }>;
}

interface Keyword {
  id: string;
  keyword: string;
  position: number;
  searchVolume: number;
  difficulty: number;
  url: string;
  lastUpdated: Date;
}

export default function SEOPage() {
  const [activeTab, setActiveTab] = useState('settings');
  const [keywordModalOpened, { open: openKeywordModal, close: closeKeywordModal }] = useDisclosure();
  
  // Mock数据
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    siteName: 'Damon Stack',
    siteDescription: '基于 Next.js 15 + Mantine 8 + tRPC 的现代化全栈开发平台',
    defaultTitle: 'Damon Stack - 现代化全栈开发平台',
    defaultKeywords: 'Next.js, React, TypeScript, Mantine, tRPC',
    googleAnalyticsId: '',
    googleSearchConsoleId: '',
    baiduAnalyticsId: '',
    enableStructuredData: true,
    enableSitemap: true,
    enableRobots: true,
  });

  const analytics: SEOAnalytics = {
    totalPages: 156,
    indexedPages: 142,
    avgLoadTime: 1.2,
    mobileScore: 95,
    desktopScore: 98,
    seoScore: 87,
    issues: [
      {
        type: 'warning',
        title: '缺少meta描述',
        description: '14个页面缺少meta描述',
        pages: 14,
      },
      {
        type: 'error',
        title: '页面标题重复',
        description: '3个页面使用相同标题',
        pages: 3,
      },
      {
        type: 'info',
        title: '图片缺少alt属性',
        description: '8个页面的图片缺少alt属性',
        pages: 8,
      },
    ],
  };

  const keywords: Keyword[] = [
    {
      id: '1',
      keyword: 'Next.js开发',
      position: 12,
      searchVolume: 1200,
      difficulty: 45,
      url: '/blog/nextjs-guide',
      lastUpdated: new Date(),
    },
    {
      id: '2',
      keyword: 'React全栈',
      position: 8,
      searchVolume: 800,
      difficulty: 38,
      url: '/blog/react-fullstack',
      lastUpdated: new Date(),
    },
  ];

  const handleSaveSettings = () => {
    notifications.show({
      title: '设置已保存',
      message: 'SEO设置已成功更新',
      color: 'green',
      icon: <IconCheck size="1rem" />,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'green';
    if (score >= 70) return 'yellow';
    return 'red';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <IconAlertTriangle color="red" size="1rem" />;
      case 'warning':
        return <IconAlertTriangle color="orange" size="1rem" />;
      default:
        return <IconInfoCircle color="blue" size="1rem" />;
    }
  };

  return (
    <>
      <Group justify="space-between" align="center">
        <Title order={1}>SEO管理</Title>
        <Button variant="filled" leftSection={<IconRocket size="1rem" />}>
          SEO分析报告
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="settings" leftSection={<IconSettings size="1rem" />}>
            基础设置
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconGraph size="1rem" />}>
            分析监控
          </Tabs.Tab>
          <Tabs.Tab value="keywords" leftSection={<IconSearch size="1rem" />}>
            关键词管理
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="settings">
          <Stack gap="xl">
            <Paper withBorder p="xl">
              <Stack gap="md">
                <Title order={3}>网站基础信息</Title>
                
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="网站名称"
                      value={seoSettings.siteName}
                      onChange={(e) => setSeoSettings({...seoSettings, siteName: e.target.value})}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="默认标题"
                      value={seoSettings.defaultTitle}
                      onChange={(e) => setSeoSettings({...seoSettings, defaultTitle: e.target.value})}
                    />
                  </Grid.Col>
                </Grid>

                <Textarea
                  label="网站描述"
                  rows={3}
                  value={seoSettings.siteDescription}
                  onChange={(e) => setSeoSettings({...seoSettings, siteDescription: e.target.value})}
                />

                <TextInput
                  label="默认关键词"
                  placeholder="用逗号分隔多个关键词"
                  value={seoSettings.defaultKeywords}
                  onChange={(e) => setSeoSettings({...seoSettings, defaultKeywords: e.target.value})}
                />
              </Stack>
            </Paper>

            <Paper withBorder p="xl">
              <Stack gap="md">
                <Title order={3}>分析工具配置</Title>
                
                <Grid>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Google Analytics ID"
                      placeholder="G-XXXXXXXXXX"
                      value={seoSettings.googleAnalyticsId}
                      onChange={(e) => setSeoSettings({...seoSettings, googleAnalyticsId: e.target.value})}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Google Search Console"
                      placeholder="验证码"
                      value={seoSettings.googleSearchConsoleId}
                      onChange={(e) => setSeoSettings({...seoSettings, googleSearchConsoleId: e.target.value})}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="百度统计 ID"
                      placeholder="百度统计代码"
                      value={seoSettings.baiduAnalyticsId}
                      onChange={(e) => setSeoSettings({...seoSettings, baiduAnalyticsId: e.target.value})}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Paper>

            <Paper withBorder p="xl">
              <Stack gap="md">
                <Title order={3}>SEO功能开关</Title>
                
                <Stack gap="sm">
                  <Switch
                    label="启用结构化数据"
                    description="自动为页面添加JSON-LD结构化数据"
                    checked={seoSettings.enableStructuredData}
                    onChange={(e) => setSeoSettings({...seoSettings, enableStructuredData: e.currentTarget.checked})}
                  />
                  <Switch
                    label="启用sitemap.xml"
                    description="自动生成和更新网站地图"
                    checked={seoSettings.enableSitemap}
                    onChange={(e) => setSeoSettings({...seoSettings, enableSitemap: e.currentTarget.checked})}
                  />
                  <Switch
                    label="启用robots.txt"
                    description="自动生成robots.txt文件"
                    checked={seoSettings.enableRobots}
                    onChange={(e) => setSeoSettings({...seoSettings, enableRobots: e.currentTarget.checked})}
                  />
                </Stack>
              </Stack>
            </Paper>

            <Group justify="flex-end">
              <Button onClick={handleSaveSettings}>保存设置</Button>
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="analytics">
          <Stack gap="xl">
            <Grid>
              <Grid.Col span={3}>
                <Card withBorder>
                  <Stack align="center" gap="xs">
                    <Text size="lg" fw={600}>{analytics.totalPages}</Text>
                    <Text size="sm" c="dimmed">总页面数</Text>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card withBorder>
                  <Stack align="center" gap="xs">
                    <Text size="lg" fw={600}>{analytics.indexedPages}</Text>
                    <Text size="sm" c="dimmed">已收录页面</Text>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card withBorder>
                  <Stack align="center" gap="xs">
                    <Text size="lg" fw={600}>{analytics.avgLoadTime}s</Text>
                    <Text size="sm" c="dimmed">平均加载时间</Text>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card withBorder>
                  <Stack align="center" gap="xs">
                    <Text size="lg" fw={600} c={getScoreColor(analytics.seoScore)}>
                      {analytics.seoScore}
                    </Text>
                    <Text size="sm" c="dimmed">SEO评分</Text>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>

            <Paper withBorder p="xl">
              <Stack gap="md">
                <Title order={3}>性能评分</Title>
                
                <Grid>
                  <Grid.Col span={6}>
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text>移动端评分</Text>
                        <Badge color={getScoreColor(analytics.mobileScore)}>
                          {analytics.mobileScore}
                        </Badge>
                      </Group>
                      <Progress value={analytics.mobileScore} color={getScoreColor(analytics.mobileScore)} />
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text>桌面端评分</Text>
                        <Badge color={getScoreColor(analytics.desktopScore)}>
                          {analytics.desktopScore}
                        </Badge>
                      </Group>
                      <Progress value={analytics.desktopScore} color={getScoreColor(analytics.desktopScore)} />
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Paper>

            <Paper withBorder p="xl">
              <Stack gap="md">
                <Title order={3}>SEO问题</Title>
                
                {analytics.issues.map((issue, index) => (
                  <Alert key={index} icon={getIssueIcon(issue.type)} color={issue.type === 'error' ? 'red' : issue.type === 'warning' ? 'yellow' : 'blue'}>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>{issue.title}</Text>
                        <Text size="sm">{issue.description}</Text>
                      </div>
                      <Badge variant="light">{issue.pages} 页面</Badge>
                    </Group>
                  </Alert>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="keywords">
          <Stack gap="xl">
            <Group justify="space-between">
              <Title order={3}>关键词排名监控</Title>
              <Button leftSection={<IconPlus size="1rem" />} onClick={openKeywordModal}>
                添加关键词
              </Button>
            </Group>

            <Paper withBorder>
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>关键词</Table.Th>
                    <Table.Th>排名</Table.Th>
                    <Table.Th>搜索量</Table.Th>
                    <Table.Th>难度</Table.Th>
                    <Table.Th>目标页面</Table.Th>
                    <Table.Th>最后更新</Table.Th>
                    <Table.Th>操作</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {keywords.map((keyword) => (
                    <Table.Tr key={keyword.id}>
                      <Table.Td>{keyword.keyword}</Table.Td>
                      <Table.Td>
                        <Badge color={keyword.position <= 10 ? 'green' : keyword.position <= 30 ? 'yellow' : 'red'}>
                          #{keyword.position}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{keyword.searchVolume.toLocaleString()}</Table.Td>
                      <Table.Td>
                        <Progress value={keyword.difficulty} color={keyword.difficulty < 30 ? 'green' : keyword.difficulty < 60 ? 'yellow' : 'red'} />
                      </Table.Td>
                      <Table.Td>{keyword.url}</Table.Td>
                      <Table.Td>{keyword.lastUpdated.toLocaleDateString()}</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="light" size="sm">
                            <IconEye size="1rem" />
                          </ActionIcon>
                          <ActionIcon variant="light" size="sm" color="blue">
                            <IconEdit size="1rem" />
                          </ActionIcon>
                          <ActionIcon variant="light" size="sm" color="red">
                            <IconTrash size="1rem" />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* 添加关键词Modal */}
      <Modal opened={keywordModalOpened} onClose={closeKeywordModal} title="添加关键词">
        <Stack gap="md">
          <TextInput label="关键词" placeholder="输入要监控的关键词" />
          <TextInput label="目标页面" placeholder="/blog/example" />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeKeywordModal}>取消</Button>
            <Button onClick={() => {
              closeKeywordModal();
              notifications.show({
                title: '关键词已添加',
                message: '新关键词将在24小时内开始监控',
                color: 'green',
              });
            }}>
              添加
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
} 