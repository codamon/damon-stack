/**
 * 用户管理页面
 * 🔒 权限控制：仅管理员可访问所有操作
 */

'use client';

import { useState } from 'react';
import {
  Title,
  Button,
  Table,
  Group,
  Text,
  Badge,
  ActionIcon,
  Paper,
  Stack,
  Box,
  Alert,
  Skeleton,
  Modal,
  TextInput,
  Select,
  Loader,
  Center,
  LoadingOverlay
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconUser,
  IconSearch,
  IconAlertTriangle,
  IconLock
} from '@tabler/icons-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { api } from '@/trpc/react';
import { modals } from '@mantine/modals';

/**
 * 权限检查组件
 * 如果用户没有管理员权限，显示访问被拒绝的消息
 */
function PermissionGate({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading, user } = useCurrentUser();

  if (isLoading) {
    return (
      <Center>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text>正在验证权限...</Text>
        </Stack>
      </Center>
    );
  }

  if (!isAdmin) {
    return (
      <Alert
        icon={<IconLock size={16} />}
        title="访问被拒绝"
        color="red"
        variant="filled"
        mt="xl"
      >
        <Stack gap="sm">
          <Text>您没有足够的权限访问用户管理功能。</Text>
          <Text size="sm" c="dimmed">
            当前角色: {user?.role || '未知'}
          </Text>
          <Text size="sm" c="dimmed">
            需要角色: 管理员 (admin)
          </Text>
        </Stack>
      </Alert>
    );
  }

  return <>{children}</>;
}

/**
 * 用户管理主要内容
 */
function UserManagementContent() {
  const { isAdmin } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpened, setCreateModalOpened] = useState(false);

  // tRPC 查询
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers
  } = api.user.list.useQuery({
    limit: 50,
    search: searchQuery || undefined,
  });

  const {
    data: statsData,
    isLoading: isLoadingStats
  } = api.user.getStats.useQuery();

  // tRPC 变更
  const deleteUserMutation = api.user.delete.useMutation({
    onSuccess: () => {
      refetchUsers();
    },
  });

  const handleDeleteUser = async (userId: string) => {
    if (!isAdmin) {
      alert('您没有权限执行此操作');
      return;
    }

    if (confirm('确定要删除此用户吗？此操作不可撤销。')) {
      try {
        await deleteUserMutation.mutateAsync({ id: userId });
        alert('用户删除成功');
      } catch (error) {
        console.error('删除用户失败:', error);
        alert('删除用户失败，请重试');
      }
    }
  };

  const handleEditUser = (userId: string) => {
    if (!isAdmin) {
      alert('您没有权限执行此操作');
      return;
    }
    
    // 这里可以打开编辑模态框或跳转到编辑页面
    console.log('编辑用户:', userId);
    alert('编辑功能开发中...');
  };

  const handleCreateUser = () => {
    if (!isAdmin) {
      alert('您没有权限执行此操作');
      return;
    }
    
    setCreateModalOpened(true);
  };

  if (usersError) {
    return (
      <Alert
        icon={<IconAlertTriangle size={16} />}
        title="加载失败"
        color="red"
        mt="xl"
      >
        无法加载用户数据: {usersError.message}
      </Alert>
    );
  }

  return (
    <Stack gap="xl">
        {/* 页面标题 - Dashboard简洁风格 */}
        <Group justify="space-between" align="center">
          <Title order={1}>用户管理</Title>
          {/* 🔒 创建用户按钮 - 仅管理员可见 */}
          {isAdmin && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleCreateUser}
              variant="filled"
            >
              创建用户
            </Button>
          )}
        </Group>

        {/* 统计信息 */}
        <Paper p="md" withBorder>
          <Group gap="xl">
            <Box>
              <Text size="sm" c="dimmed">总用户数</Text>
              {isLoadingStats ? (
                <Skeleton height={28} width={40} />
              ) : (
                <Text size="xl" fw="bold" component="span">
                  {statsData?.total || 0}
                </Text>
              )}
            </Box>
            <Box>
              <Text size="sm" c="dimmed">活跃用户</Text>
              {isLoadingStats ? (
                <Skeleton height={28} width={40} />
              ) : (
                <Text size="xl" fw="bold" c="green" component="span">
                  {statsData?.active || 0}
                </Text>
              )}
            </Box>
            <Box>
              <Text size="sm" c="dimmed">管理员</Text>
              {isLoadingStats ? (
                <Skeleton height={28} width={40} />
              ) : (
                <Text size="xl" fw="bold" c="red" component="span">
                  {statsData?.admin || 0}
                </Text>
              )}
            </Box>
          </Group>
        </Paper>

        {/* 搜索和筛选 */}
        <Paper p="md" withBorder>
          <Group>
            <TextInput
              placeholder="搜索用户..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              style={{ flex: 1 }}
            />
          </Group>
        </Paper>

        {/* 用户列表 */}
        <Paper withBorder p="xl" style={{ position: 'relative' }}>
          <LoadingOverlay 
            visible={isLoadingUsers} 
            zIndex={1000} 
            overlayProps={{ radius: "sm", blur: 2 }} 
          />
          
          {isLoadingUsers ? (
              <Stack gap="sm">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} height={60} />
                ))}
              </Stack>
                     ) : !usersData?.items?.length ? (
             <Center>
               <Stack align="center" gap="md">
                 <IconUser size={48} color="var(--mantine-color-gray-6)" />
                 <Text c="dimmed">没有找到用户</Text>
                 <Button 
                   variant="light" 
                   leftSection={<IconPlus size={16} />}
                   onClick={handleCreateUser}
                 >
                   创建第一个用户
                 </Button>
               </Stack>
             </Center>
           ) : (
            <Table.ScrollContainer minWidth={800}>
              <Table 
                striped 
                highlightOnHover
                withTableBorder
                withColumnBorders
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>用户信息</Table.Th>
                    <Table.Th>角色</Table.Th>
                    <Table.Th>状态</Table.Th>
                    <Table.Th>创建时间</Table.Th>
                    {/* 🔒 操作列 - 仅管理员可见 */}
                    {isAdmin && <Table.Th>操作</Table.Th>}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {usersData.items.map((user) => (
                    <Table.Tr key={user.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <IconUser size={20} />
                          <Box>
                            <Text fw={500} size="sm">
                              {user.name || user.email}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {user.email}
                            </Text>
                          </Box>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={user.role === 'admin' ? 'red' : 'blue'}
                          variant="light"
                        >
                          {user.role === 'admin' ? '管理员' : '用户'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={user.status === 'ACTIVE' ? 'green' : 'gray'}
                          variant="light"
                        >
                          {user.status === 'ACTIVE' ? '活跃' : '禁用'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                        </Text>
                      </Table.Td>
                      {/* 🔒 操作按钮 - 仅管理员可见 */}
                      {isAdmin && (
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => handleEditUser(user.id)}
                              title="编辑用户"
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => handleDeleteUser(user.id)}
                              title="删除用户"
                              loading={deleteUserMutation.isPending}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      )}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
        </Paper>
      {/* 创建用户模态框 */}
      <Modal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        title="创建新用户"
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="用户名"
            placeholder="请输入用户名"
            required
          />
          <TextInput
            label="邮箱"
            placeholder="请输入邮箱地址"
            type="email"
            required
          />
          <Select
            label="角色"
            placeholder="选择用户角色"
            data={[
              { value: 'user', label: '普通用户' },
              { value: 'admin', label: '管理员' },
            ]}
            required
          />
          <Select
            label="状态"
            placeholder="选择用户状态"
            data={[
              { value: 'ACTIVE', label: '活跃' },
              { value: 'BANNED', label: '禁用' },
            ]}
            defaultValue="ACTIVE"
            required
          />
          <Group justify="flex-end" mt="md">
            <Button
              variant="outline"
              onClick={() => setCreateModalOpened(false)}
            >
              取消
            </Button>
            <Button onClick={() => alert('创建功能开发中...')}>
              创建用户
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

/**
 * 用户管理页面主组件
 */
export default function UsersPage() {
  return (
    <PermissionGate>
      <UserManagementContent />
    </PermissionGate>
  );
} 