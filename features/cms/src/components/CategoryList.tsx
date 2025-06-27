"use client";

import { useState } from 'react';
import { 
  Table, 
  Button, 
  ActionIcon, 
  Group, 
  Text, 
  Badge, 
  Stack,
  Paper,
  Flex,
  Menu,
  rem,
  Checkbox,
  Modal
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconDotsVertical,
  IconEye,
  IconUsers,
  IconChevronRight,
  IconChevronDown
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { Category } from '../types';

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onRefresh: () => void;
  trpc: any; // 这里应该使用正确的 tRPC 类型
}

export function CategoryList({ 
  categories, 
  loading, 
  onEdit, 
  onDelete,
  onRefresh,
  trpc 
}: CategoryListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<Set<string>>(new Set());

  // 切换分类展开状态
  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // 处理选择
  const handleSelectCategory = (categoryId: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedCategories.size === categories.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(categories.map(cat => cat.id)));
    }
  };

  // 删除单个分类
  const handleDelete = async (categoryId: string, categoryName: string) => {
    setDeleting(prev => new Set([...prev, categoryId]));
    
    try {
      await trpc.category.delete.mutate({ id: categoryId });
      notifications.show({
        title: '删除成功',
        message: `分类 "${categoryName}" 已成功删除`,
        color: 'green',
      });
      onRefresh();
    } catch (error: any) {
      notifications.show({
        title: '删除失败',
        message: error.message || '删除失败，请重试',
        color: 'red',
      });
    } finally {
      setDeleting(prev => {
        const newDeleting = new Set(prev);
        newDeleting.delete(categoryId);
        return newDeleting;
      });
    }
  };

  // 批量删除分类
  const handleBatchDelete = async () => {
    if (selectedCategories.size === 0) return;

    const selectedIds = Array.from(selectedCategories);
    
    try {
      await trpc.category.batchDelete.mutate({ ids: selectedIds });
      notifications.show({
        title: '删除成功',
        message: `已成功删除 ${selectedIds.length} 个分类`,
        color: 'green',
      });
      setSelectedCategories(new Set());
      onRefresh();
    } catch (error: any) {
      notifications.show({
        title: '删除失败',
        message: error.message || '删除失败，请重试',
        color: 'red',
      });
    }
  };

  // 确认删除
  const confirmDelete = (categoryId: string, categoryName: string) => {
    modals.openConfirmModal({
      title: '确认删除',
      children: (
        <Text size="sm">
          确定要删除分类 "<strong>{categoryName}</strong>" 吗？
          <br />
          此操作不可撤销！
        </Text>
      ),
      labels: { confirm: '删除', cancel: '取消' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleDelete(categoryId, categoryName),
    });
  };

  // 确认批量删除
  const confirmBatchDelete = () => {
    modals.openConfirmModal({
      title: '确认批量删除',
      children: (
        <Text size="sm">
          确定要删除选中的 {selectedCategories.size} 个分类吗？
          <br />
          此操作不可撤销！
        </Text>
      ),
      labels: { confirm: '删除', cancel: '取消' },
      confirmProps: { color: 'red' },
      onConfirm: handleBatchDelete,
    });
  };

  // 递归渲染分类树
  const renderCategoryRow = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategories.has(category.id);
    const isDeleting = deleting.has(category.id);

    const rows = [
      <Table.Tr key={category.id} bg={isSelected ? 'var(--mantine-color-blue-light)' : undefined}>
        <Table.Td>
          <Checkbox
            checked={isSelected}
            onChange={() => handleSelectCategory(category.id)}
            disabled={isDeleting}
          />
        </Table.Td>
        <Table.Td>
          <Group gap="xs" style={{ paddingLeft: level * 20 }}>
            {hasChildren ? (
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => toggleExpanded(category.id)}
              >
                {isExpanded ? (
                  <IconChevronDown size={16} />
                ) : (
                  <IconChevronRight size={16} />
                )}
              </ActionIcon>
            ) : (
              <div style={{ width: 28 }} />
            )}
            <Text fw={hasChildren ? 600 : 400}>{category.name}</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text size="sm" c="dimmed">
            {category.slug}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" c="dimmed" lineClamp={2}>
            {category.description || '-'}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{category.order}</Text>
        </Table.Td>
        <Table.Td>
          {hasChildren && (
            <Badge size="sm" variant="light">
              {category.children!.length} 个子分类
            </Badge>
          )}
        </Table.Td>
        <Table.Td>
          <Text size="sm" c="dimmed">
            {new Date(category.createdAt).toLocaleDateString()}
          </Text>
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => onEdit(category)}
              disabled={isDeleting}
            >
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => confirmDelete(category.id, category.name)}
              loading={isDeleting}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ];

    // 如果展开且有子分类，递归渲染子分类
    if (isExpanded && hasChildren) {
      category.children!.forEach(child => {
        rows.push(...renderCategoryRow(child, level + 1));
      });
    }

    return rows;
  };

  const allSelected = categories.length > 0 && selectedCategories.size === categories.length;
  const indeterminate = selectedCategories.size > 0 && selectedCategories.size < categories.length;

  return (
    <Stack gap="md">
      {/* 操作栏 */}
      <Flex justify="space-between" align="center">
        <Group>
          {selectedCategories.size > 0 && (
            <>
              <Text size="sm" c="dimmed">
                已选择 {selectedCategories.size} 项
              </Text>
              <Button
                size="sm"
                variant="light"
                color="red"
                onClick={confirmBatchDelete}
                leftSection={<IconTrash size={16} />}
              >
                批量删除
              </Button>
            </>
          )}
        </Group>
        <Button
          onClick={onRefresh}
          loading={loading}
          leftSection={<IconPlus size={16} />}
        >
          刷新数据
        </Button>
      </Flex>

      {/* 分类表格 */}
      <Paper shadow="sm" p="md">
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={indeterminate}
                  onChange={handleSelectAll}
                />
              </Table.Th>
              <Table.Th>分类名称</Table.Th>
              <Table.Th>标识</Table.Th>
              <Table.Th>描述</Table.Th>
              <Table.Th w={80}>排序</Table.Th>
              <Table.Th w={120}>子分类</Table.Th>
              <Table.Th w={100}>创建时间</Table.Th>
              <Table.Th w={120}>操作</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {categories.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center" c="dimmed" py="xl">
                    暂无分类数据
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              categories.map(category => renderCategoryRow(category))
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
} 