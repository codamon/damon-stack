'use client';

import { useState } from 'react';
import {
  Group,
  Title,
  Button,
  Paper,
  Text,
  TextInput,
  Select,
  Table,
  Stack,
  Badge,
  ActionIcon,
  Pagination,
  LoadingOverlay,
  Avatar,
  Menu,
} from '@mantine/core';
import { IconSearch, IconFilter, IconDots, IconEdit, IconBan, IconCheck } from '@tabler/icons-react';
import { api } from '../../trpc/react';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  // 获取前端用户列表
  const { 
    data: customersData, 
    isLoading, 
    refetch 
  } = api.customer.list.useQuery({
    page: currentPage,
    limit,
    search: searchQuery || undefined,
    status: statusFilter ? statusFilter as any : undefined,
  });

  // 更新用户状态
  const updateStatusMutation = api.customer.updateStatus.useMutation({
    onSuccess: () => {
      refetch(); // 重新获取数据
    },
    onError: (error) => {
      console.error('状态更新失败:', error);
    },
  });

  const handleStatusChange = (customerId: string, status: 'ACTIVE' | 'INACTIVE' | 'BANNED') => {
    updateStatusMutation.mutate({ customerId, status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'yellow';
      case 'BANNED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '正常';
      case 'INACTIVE':
        return '未激活';
      case 'BANNED':
        return '已禁用';
      default:
        return status;
    }
  };

  return (
    <Stack gap="xl">
      {/* 页面头部 */}
      <Group justify="space-between" align="center">
        <Title order={1}>前端用户管理</Title>
        <Text c="dimmed">
          共 {customersData?.total || 0} 个用户
        </Text>
      </Group>

      {/* 筛选器 */}
      <Paper withBorder p="md">
        <Group gap="md">
          <TextInput
            placeholder="搜索用户姓名或邮箱..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
          
          <Select
            placeholder="状态筛选"
            leftSection={<IconFilter size={16} />}
            data={[
              { value: '', label: '全部状态' },
              { value: 'ACTIVE', label: '正常' },
              { value: 'INACTIVE', label: '未激活' },
              { value: 'BANNED', label: '已禁用' },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || '')}
            clearable
          />
        </Group>
      </Paper>

      {/* 用户列表 */}
      <Paper withBorder style={{ position: 'relative' }}>
        <LoadingOverlay visible={isLoading} />
        
        {customersData && customersData.customers.length > 0 ? (
          <>
            <Table striped withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>用户</Table.Th>
                  <Table.Th>邮箱</Table.Th>
                  <Table.Th>状态</Table.Th>
                  <Table.Th>登录次数</Table.Th>
                  <Table.Th>最后登录</Table.Th>
                  <Table.Th>注册时间</Table.Th>
                  <Table.Th width={100}>操作</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {customersData.customers.map((customer) => (
                  <Table.Tr key={customer.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar 
                          src={customer.avatar} 
                          size={32} 
                          radius="xl"
                        />
                        <Text fw={500}>{customer.name || '未设置'}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {customer.email}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={getStatusColor(customer.status)} 
                        variant="light"
                      >
                        {getStatusLabel(customer.status)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {customer.loginCount}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {customer.lastLoginAt 
                          ? new Date(customer.lastLoginAt).toLocaleDateString()
                          : '从未登录'
                        }
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>用户操作</Menu.Label>
                          
                          {customer.status === 'ACTIVE' && (
                            <>
                              <Menu.Item
                                leftSection={<IconBan size={14} />}
                                color="yellow"
                                onClick={() => handleStatusChange(customer.id, 'INACTIVE')}
                              >
                                停用账户
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconBan size={14} />}
                                color="red"
                                onClick={() => handleStatusChange(customer.id, 'BANNED')}
                              >
                                禁用账户
                              </Menu.Item>
                            </>
                          )}
                          
                          {customer.status === 'INACTIVE' && (
                            <>
                              <Menu.Item
                                leftSection={<IconCheck size={14} />}
                                color="green"
                                onClick={() => handleStatusChange(customer.id, 'ACTIVE')}
                              >
                                激活账户
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconBan size={14} />}
                                color="red"
                                onClick={() => handleStatusChange(customer.id, 'BANNED')}
                              >
                                禁用账户
                              </Menu.Item>
                            </>
                          )}
                          
                          {customer.status === 'BANNED' && (
                            <Menu.Item
                              leftSection={<IconCheck size={14} />}
                              color="green"
                              onClick={() => handleStatusChange(customer.id, 'ACTIVE')}
                            >
                              恢复账户
                            </Menu.Item>
                          )}
                          
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => {
                              // TODO: 打开用户详情/编辑页面
                              console.log('查看用户详情:', customer.id);
                            }}
                          >
                            查看详情
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {/* 分页 */}
            {customersData.totalPages > 1 && (
              <Group justify="center" p="md">
                <Pagination
                  value={currentPage}
                  onChange={setCurrentPage}
                  total={customersData.totalPages}
                />
              </Group>
            )}
          </>
        ) : (
          <Stack align="center" gap="md" p="xl">
            <Text c="dimmed">暂无用户数据</Text>
          </Stack>
        )}
      </Paper>

      {/* 统计信息 */}
      <Paper withBorder p="md">
        <Group gap="xl">
          <div>
            <Text size="xs" c="dimmed">总用户数</Text>
            <Text fw={700} size="lg">{customersData?.total || 0}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">活跃用户</Text>
            <Text fw={700} size="lg" c="green">
              {customersData?.customers.filter(c => c.status === 'ACTIVE').length || 0}
            </Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">禁用用户</Text>
            <Text fw={700} size="lg" c="red">
              {customersData?.customers.filter(c => c.status === 'BANNED').length || 0}
            </Text>
          </div>
        </Group>
      </Paper>
    </Stack>
  );
} 