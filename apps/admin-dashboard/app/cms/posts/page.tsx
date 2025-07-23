'use client';

import React, { useState, useMemo } from 'react';
import { 
  Group, 
  Button, 
  TextInput, 
  Select, 
  Stack, 
  Badge, 
  ActionIcon, 
  Menu, 
  Text,
  Paper,
  Pagination,
  Loader,
  Center,
  Checkbox,
  Tooltip,
  Alert,
  Table,
  ScrollArea,
  Box,
  Flex,
  Title
} from '@mantine/core';
import { 
  IconPlus, 
  IconSearch, 
  IconEdit, 
  IconTrash, 
  IconEye,
  IconDots,
  IconRefresh,
  IconStar,
  IconStarFilled,
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
  IconNews
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useRouter } from 'next/navigation';
import { LoadingOverlay } from '@damon-stack/ui';
import { api } from '@/trpc/react';
import { useCategoryOptions } from '@/hooks/useCategoryOptions';
import type { PostWithRelations, PostStatus } from '@damon-stack/feature-cms';

// 状态映射
const statusMap: Record<PostStatus, { label: string; color: string }> = {
  DRAFT: { label: '草稿', color: 'gray' },
  PUBLISHED: { label: '已发布', color: 'green' },
  ARCHIVED: { label: '已归档', color: 'orange' },
  SCHEDULED: { label: '定时发布', color: 'blue' },
};

export default function PostsListPage() {
  const router = useRouter();
  
  // 筛选和分页状态
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    search: '',
    status: undefined as PostStatus | undefined,
    categoryId: undefined as string | undefined,
    featured: undefined as boolean | undefined,
    sortBy: 'createdAt' as 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'viewCount',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  // 选中的行
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // 移除面包屑导航配置 - 改为Dashboard简洁风格

  // API 查询
  const { 
    data: postsData, 
    isLoading, 
    error, 
    refetch 
  } = api.post.list.useQuery(filters);

  const { data: categoriesData } = api.category.list.useQuery();

  // 删除文章
  const deleteMutation = api.post.delete.useMutation({
    onSuccess: () => {
      notifications.show({
        title: '成功',
        message: '文章已删除',
        color: 'green',
      });
      refetch();
    },
    onError: (error) => {
      notifications.show({
        title: '错误',
        message: error.message,
        color: 'red',
      });
    },
  });

  // 批量删除
  const batchDeleteMutation = api.post.batchDelete.useMutation({
    onSuccess: (data) => {
      notifications.show({
        title: '成功',
        message: `已删除 ${data.count} 篇文章`,
        color: 'green',
      });
      setSelectedRows([]);
      refetch();
    },
    onError: (error) => {
      notifications.show({
        title: '错误',
        message: error.message,
        color: 'red',
      });
    },
  });

  // 更新状态
  const updateStatusMutation = api.post.updateStatus.useMutation({
    onSuccess: () => {
      notifications.show({
        title: '成功',
        message: '文章状态已更新',
        color: 'green',
      });
      refetch();
    },
    onError: (error) => {
      notifications.show({
        title: '错误',
        message: error.message,
        color: 'red',
      });
    },
  });

  // 分类筛选选项
  const categoryFilterOptions = [
    { value: '', label: '全部分类' },
    ...(categoriesData || []).map((cat: any) => ({
      value: cat.id,
      label: cat.name,
    }))
  ];

  // 处理排序
  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field as any,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

  // 获取排序图标
  const getSortIcon = (field: string) => {
    if (filters.sortBy !== field) return <IconArrowsSort size={14} />;
    return filters.sortOrder === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />;
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(postsData?.data.map(post => post.id) || []);
    } else {
      setSelectedRows([]);
    }
  };

  // 处理单选
  const handleSelectRow = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, postId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== postId));
    }
  };

  // 批量删除确认
  const handleBatchDelete = () => {
    if (selectedRows.length === 0) return;
    
    modals.openConfirmModal({
      title: '批量删除文章',
      children: (
        <Text size="sm">
          确定要删除选中的 {selectedRows.length} 篇文章吗？此操作不可撤销。
        </Text>
      ),
      labels: { confirm: '删除', cancel: '取消' },
      confirmProps: { color: 'red' },
      onConfirm: () => batchDeleteMutation.mutate({ ids: selectedRows }),
    });
  };

  // 删除单篇文章
  const handleDeletePost = (post: PostWithRelations) => {
    modals.openConfirmModal({
      title: '删除文章',
      children: (
        <Text size="sm">
          确定要删除文章 "{post.title}" 吗？此操作不可撤销。
        </Text>
      ),
      labels: { confirm: '删除', cancel: '取消' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate({ id: post.id }),
    });
  };

  // 渲染空状态
  const renderEmptyState = () => (
    <Center>
      <Stack align="center" gap="md">
        <IconNews size={48} color="var(--mantine-color-gray-6)" />
        <Text c="dimmed">没有找到文章</Text>
        <Button 
          variant="light" 
          leftSection={<IconPlus size={16} />}
          onClick={() => router.push('/cms/posts/new')}
        >
          创建第一篇文章
        </Button>
      </Stack>
    </Center>
  );

  if (error) {
    return (
      <Alert color="red" title="加载失败" mt="xl">
        {error.message}
      </Alert>
    );
  }

  const posts = postsData?.data || [];
  const allSelected = posts.length > 0 && selectedRows.length === posts.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < posts.length;

  return (
    <Stack gap="xl">
        {/* 页面标题 - Dashboard简洁风格 */}
        <Group justify="space-between" align="center">
          <Title order={1}>文章管理</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => router.push('/cms/posts/new')}
            variant="filled"
          >
            新建文章
          </Button>
        </Group>

        {/* 筛选器 */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Flex gap="md" wrap="wrap">
              <TextInput
                placeholder="搜索文章标题或内容..."
                leftSection={<IconSearch size={16} />}
                value={filters.search}
                onChange={(event) => 
                  setFilters(prev => ({ ...prev, search: event.currentTarget.value, page: 1 }))
                }
                style={{ flex: 1, minWidth: 200 }}
              />
              <Select
                placeholder="筛选状态"
                data={[
                  { value: '', label: '全部状态' },
                  ...Object.entries(statusMap).map(([value, info]) => ({
                    value,
                    label: info.label,
                  }))
                ]}
                value={filters.status || ''}
                onChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    status: (value as PostStatus) || undefined, 
                    page: 1 
                  }))
                }
                clearable
                w={150}
              />
              <Select
                placeholder="筛选分类"
                data={categoryFilterOptions}
                value={filters.categoryId || ''}
                onChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    categoryId: value || undefined, 
                    page: 1 
                  }))
                }
                clearable
                w={150}
              />
              <Button
                variant="light"
                leftSection={<IconRefresh size={16} />}
                onClick={() => refetch()}
              >
                刷新
              </Button>
            </Flex>

            {/* 批量操作 */}
            {selectedRows.length > 0 && (
              <Group>
                <Text size="sm" c="dimmed">
                  已选择 {selectedRows.length} 项
                </Text>
                <Button
                  size="sm"
                  color="red"
                  variant="light"
                  onClick={handleBatchDelete}
                  loading={batchDeleteMutation.isPending}
                  leftSection={<IconTrash size={14} />}
                >
                  批量删除
                </Button>
              </Group>
            )}
          </Stack>
        </Paper>

        {/* 文章表格 */}
        <Paper p="xl" withBorder style={{ position: 'relative' }}>
          <LoadingOverlay 
            visible={isLoading} 
            zIndex={1000} 
            overlayProps={{ radius: "sm", blur: 2 }} 
          />
          
          {posts.length === 0 && !isLoading ? (
            renderEmptyState()
          ) : (
            <ScrollArea>
              <Table 
                highlightOnHover 
                verticalSpacing="sm"
                withTableBorder
                withColumnBorders
                striped
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w={50}>
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={(event) => handleSelectAll(event.currentTarget.checked)}
                      />
                    </Table.Th>
                    <Table.Th>
                      <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('title')}>
                        <Text fw={500}>标题</Text>
                        {getSortIcon('title')}
                      </Group>
                    </Table.Th>
                    <Table.Th w={100}>
                      <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                        <Text fw={500}>状态</Text>
                        {getSortIcon('status')}
                      </Group>
                    </Table.Th>
                    <Table.Th w={120}>
                      <Text fw={500}>作者</Text>
                    </Table.Th>
                    <Table.Th w={120}>
                      <Text fw={500}>分类</Text>
                    </Table.Th>
                    <Table.Th w={100}>
                      <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('viewCount')}>
                        <Text fw={500}>浏览量</Text>
                        {getSortIcon('viewCount')}
                      </Group>
                    </Table.Th>
                    <Table.Th w={120}>
                      <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                        <Text fw={500}>创建时间</Text>
                        {getSortIcon('createdAt')}
                      </Group>
                    </Table.Th>
                    <Table.Th w={120}>
                      <Text fw={500}>操作</Text>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {posts.map((post) => (
                    <Table.Tr key={post.id}>
                      <Table.Td>
                        <Checkbox
                          checked={selectedRows.includes(post.id)}
                          onChange={(event) => 
                            handleSelectRow(post.id, event.currentTarget.checked)
                          }
                        />
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          {post.featured && (
                            <IconStarFilled size={16} style={{ color: 'gold' }} />
                          )}
                          <Box style={{ flex: 1 }}>
                            <Text size="sm" fw={500} lineClamp={2}>
                              {post.title}
                            </Text>
                            {post.excerpt && (
                              <Text size="xs" c="dimmed" lineClamp={1}>
                                {post.excerpt}
                              </Text>
                            )}
                          </Box>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={statusMap[post.status].color} variant="light" size="sm">
                          {statusMap[post.status].label}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {post.author.name || post.author.email}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {post.category?.name || '无分类'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {post.viewCount.toLocaleString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Tooltip label="预览">
                            <ActionIcon 
                              variant="light" 
                              size="sm"
                              onClick={() => {
                                // TODO: 实现预览功能
                                console.log('预览文章:', post.id);
                              }}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          
                          <Tooltip label="编辑">
                            <ActionIcon 
                              variant="light" 
                              size="sm"
                              onClick={() => router.push(`/cms/posts/${post.id}/edit`)}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>

                          <Tooltip label="删除">
                            <ActionIcon 
                              variant="light" 
                              size="sm"
                              color="red"
                              onClick={() => handleDeletePost(post)}
                              loading={deleteMutation.isPending && deleteMutation.variables?.id === post.id}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>

                          <Menu position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="light" size="sm">
                                <IconDots size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              {Object.entries(statusMap).map(([status, info]) => (
                                <Menu.Item
                                  key={status}
                                  disabled={post.status === status}
                                  onClick={() => {
                                    updateStatusMutation.mutate({
                                      id: post.id,
                                      status: status as PostStatus,
                                    });
                                  }}
                                >
                                  设为{info.label}
                                </Menu.Item>
                              ))}
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          )}
        </Paper>

        {/* 分页 */}
        {postsData && postsData.totalPages > 1 && (
          <Group justify="center">
            <Pagination
              total={postsData.totalPages}
              value={filters.page}
              onChange={(page) => setFilters(prev => ({ ...prev, page }))}
              siblings={1}
              boundaries={1}
            />
          </Group>
        )}

        {/* 数据统计 */}
        {postsData && (
          <Text size="sm" c="dimmed" ta="center">
            共 {postsData.total} 篇文章，当前显示第 {filters.page} 页，共 {postsData.totalPages} 页
          </Text>
        )}
      </Stack>
  );
} 