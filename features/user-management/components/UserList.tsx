/**
 * 用户列表组件
 * 展示用户列表并提供增删改查功能
 */

'use client';

import { useState } from 'react';
import {
  Button,
  Table,
  ActionIcon,
  Badge,
  Text,
  Group,
  Stack,
  Card,
  Modal,
  Alert,
  Skeleton,
  Flex,
  Title,
  Container,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlertCircle,
} from '@tabler/icons-react';
import type { User, UserRole, UserStatus } from '../api/types';
import { UserForm } from './UserForm';

interface UserListProps {
  // 数据获取函数
  users?: User[];
  isLoading?: boolean;
  onRefresh: () => void;
  
  // API操作函数
  createUser: (data: {
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  }) => Promise<{ user: User; message: string }>;
  
  updateUser: (data: {
    id: string;
    name?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
  }) => Promise<{ user: User; message: string }>;
  
  deleteUser: (data: { id: string }) => Promise<{ message: string }>;
}

export function UserList({
  users = [],
  isLoading = false,
  onRefresh,
  createUser,
  updateUser,
  deleteUser,
}: UserListProps) {
  // 状态管理
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Modal 控制
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  // 处理创建用户
  const handleCreateUser = () => {
    setSelectedUser(null);
    openForm();
  };

  // 处理编辑用户
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    openForm();
  };

  // 处理删除用户
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    openDelete();
  };

  // 确认删除
  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteUser({ id: userToDelete.id });
      notifications.show({
        title: '删除成功',
        message: '用户已成功删除',
        color: 'green',
      });
      onRefresh();
      closeDelete();
      setUserToDelete(null);
    } catch (error) {
      notifications.show({
        title: '删除失败',
        message: error instanceof Error ? error.message : '删除失败',
        color: 'red',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // 表单成功回调
  const handleFormSuccess = () => {
    onRefresh();
    closeForm();
    setSelectedUser(null);
  };

  // 获取角色徽章颜色
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'red';
      case 'USER':
        return 'blue';
      default:
        return 'gray';
    }
  };

  // 获取状态徽章颜色
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'BANNED':
        return 'red';
      default:
        return 'gray';
    }
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* 页面标题和操作 */}
        <Flex justify="space-between" align="center">
          <div>
            <Title order={2}>用户管理</Title>
            <Text c="dimmed" size="sm">
              管理系统用户账户和权限
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleCreateUser}
          >
            创建用户
          </Button>
        </Flex>

        {/* 用户列表 */}
        <Card withBorder shadow="sm">
          {isLoading ? (
            <Stack gap="xs">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} height={60} />
              ))}
            </Stack>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>姓名</Table.Th>
                  <Table.Th>邮箱</Table.Th>
                  <Table.Th>角色</Table.Th>
                  <Table.Th>状态</Table.Th>
                  <Table.Th>创建时间</Table.Th>
                  <Table.Th>操作</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {users.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>
                      <Text size="sm" ff="monospace">
                        {user.id.slice(0, 8)}...
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>
                        {user.name || '未设置'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{user.email}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getRoleBadgeColor(user.role)}
                        variant="filled"
                        size="sm"
                      >
                        {user.role}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusBadgeColor(user.status)}
                        variant="filled"
                        size="sm"
                      >
                        {user.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {formatDate(user.createdAt)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleEditUser(user)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}

          {users.length === 0 && !isLoading && (
            <Text ta="center" c="dimmed" py="xl">
              暂无用户数据
            </Text>
          )}
        </Card>
      </Stack>

      {/* 用户表单 Modal */}
      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={selectedUser ? '编辑用户' : '创建用户'}
        size="md"
      >
        <UserForm
          user={selectedUser}
          onSuccess={handleFormSuccess}
          onCancel={closeForm}
          createUser={createUser}
          updateUser={updateUser}
        />
      </Modal>

      {/* 删除确认 Modal */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="确认删除"
        size="sm"
      >
        <Stack gap="md">
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="light"
          >
            <Text size="sm">
              您确定要删除用户 <strong>{userToDelete?.name || userToDelete?.email}</strong> 吗？
              <br />
              此操作无法撤销。
            </Text>
          </Alert>

          <Group justify="end">
            <Button variant="default" onClick={closeDelete}>
              取消
            </Button>
            <Button
              color="red"
              loading={isDeleting}
              onClick={confirmDelete}
            >
              确认删除
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 