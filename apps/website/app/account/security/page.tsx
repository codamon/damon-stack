'use client';

import { useState } from 'react';
import {
  Paper,
  Title,
  Button,
  Text,
  Alert,
  Stack,
  Container,
  Group,
  Table,
  Pagination,
  Badge,
  PasswordInput,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconShield, IconHistory, IconDevices } from '@tabler/icons-react';
import { api } from '../../../trpc/react';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 模拟当前用户ID - 实际应用中应该从认证上下文获取
const CURRENT_USER_ID = 'mock-user-id';

const getActionLabel = (action: string) => {
  const labels: Record<string, string> = {
    register: '注册账户',
    login: '登录',
    logout: '登出',
    update_profile: '更新资料',
    password_reset_request: '请求密码重置',
    password_reset_confirm: '确认密码重置',
  };
  return labels[action] || action;
};

const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    register: 'green',
    login: 'blue',
    logout: 'gray',
    update_profile: 'yellow',
    password_reset_request: 'orange',
    password_reset_confirm: 'red',
  };
  return colors[action] || 'gray';
};

export default function SecurityPage() {
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [activePage, setActivePage] = useState(1);
  const limit = 10;

  // 获取用户活动记录
  const { data: activities, isLoading: activitiesLoading, refetch } = api.customer.getActivities.useQuery(
    {
      customerId: CURRENT_USER_ID,
      limit,
      offset: (activePage - 1) * limit,
    },
    { enabled: !!CURRENT_USER_ID }
  );

  const passwordForm = useForm<ChangePasswordForm>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: (value) => (value.length < 1 ? '请输入当前密码' : null),
      newPassword: (value) => (value.length < 8 ? '新密码至少需要8位字符' : null),
      confirmPassword: (value, values) =>
        value !== values.newPassword ? '密码确认不匹配' : null,
    },
  });

  // TODO: 实现修改密码功能
  const handleChangePassword = (values: ChangePasswordForm) => {
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    // 模拟API调用
    setTimeout(() => {
      console.log('修改密码:', values);
      setPasswordSuccess('密码修改成功！');
      setPasswordLoading(false);
      passwordForm.reset();
      
      // 清除成功消息
      setTimeout(() => setPasswordSuccess(null), 3000);
    }, 1000);
  };

  const totalPages = activities ? Math.ceil(activities.total / limit) : 1;

  return (
    <Container size="md" my={40}>
      <Stack gap="xl">
        {/* 页面标题 */}
        <Title order={1}>安全设置</Title>

        {/* 密码修改 */}
        <Paper withBorder p="xl">
          <Group mb="md">
            <IconLock size={20} />
            <Title order={3}>修改密码</Title>
          </Group>
          
          {passwordError && (
            <Alert color="red" mb="md">
              {passwordError}
            </Alert>
          )}

          {passwordSuccess && (
            <Alert color="green" mb="md">
              {passwordSuccess}
            </Alert>
          )}

          <form onSubmit={passwordForm.onSubmit(handleChangePassword)}>
            <Stack gap="md">
              <PasswordInput
                required
                label="当前密码"
                placeholder="请输入当前密码"
                leftSection={<IconLock size={16} />}
                {...passwordForm.getInputProps('currentPassword')}
              />

              <PasswordInput
                required
                label="新密码"
                placeholder="至少8位字符"
                leftSection={<IconLock size={16} />}
                {...passwordForm.getInputProps('newPassword')}
              />

              <PasswordInput
                required
                label="确认新密码"
                placeholder="再次输入新密码"
                leftSection={<IconLock size={16} />}
                {...passwordForm.getInputProps('confirmPassword')}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  type="submit"
                  loading={passwordLoading}
                  disabled={passwordLoading}
                  leftSection={<IconShield size={16} />}
                >
                  修改密码
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>

        {/* 登录设备 */}
        <Paper withBorder p="xl">
          <Group mb="md">
            <IconDevices size={20} />
            <Title order={3}>登录设备</Title>
          </Group>
          
          <Text c="dimmed" mb="md">
            管理您的登录设备和会话
          </Text>

          <Alert color="blue">
            <Text size="sm">
              当前功能正在开发中，即将支持查看和管理所有登录设备。
            </Text>
          </Alert>
        </Paper>

        {/* 活动记录 */}
        <Paper withBorder p="xl">
          <Group mb="md">
            <IconHistory size={20} />
            <Title order={3}>活动记录</Title>
          </Group>
          
          <Text c="dimmed" mb="md">
            查看您的账户活动历史记录
          </Text>

          {activitiesLoading ? (
            <Text>加载中...</Text>
          ) : activities && activities.activities.length > 0 ? (
            <>
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>活动</Table.Th>
                    <Table.Th>页面</Table.Th>
                    <Table.Th>IP地址</Table.Th>
                    <Table.Th>时间</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {activities.activities.map((activity) => (
                    <Table.Tr key={activity.id}>
                      <Table.Td>
                        <Badge color={getActionColor(activity.action)} variant="light">
                          {getActionLabel(activity.action)}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {activity.page || '-'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" family="monospace">
                          {activity.ipAddress || '-'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(activity.createdAt).toLocaleString()}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {totalPages > 1 && (
                <Group justify="center" mt="md">
                  <Pagination
                    value={activePage}
                    onChange={setActivePage}
                    total={totalPages}
                    size="sm"
                  />
                </Group>
              )}

              <Text size="xs" c="dimmed" ta="center" mt="md">
                共 {activities.total} 条记录
              </Text>
            </>
          ) : (
            <Alert>
              暂无活动记录
            </Alert>
          )}
        </Paper>

        {/* 两步验证 */}
        <Paper withBorder p="xl">
          <Group mb="md">
            <IconShield size={20} />
            <Title order={3}>两步验证</Title>
          </Group>
          
          <Text c="dimmed" mb="md">
            为您的账户添加额外的安全保护
          </Text>

          <Alert color="blue">
            <Text size="sm">
              两步验证功能正在开发中，即将支持短信验证码和TOTP验证器。
            </Text>
          </Alert>
        </Paper>
      </Stack>
    </Container>
  );
} 