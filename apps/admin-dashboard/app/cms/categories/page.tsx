"use client";

import { useState } from 'react';
import { 
  Button, 
  Group, 
  Stack,
  Paper,
  LoadingOverlay,
  Text,
  Table,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Center,
  Box,
  Title
} from '@mantine/core';
import { IconChevronDown, IconPlus, IconEdit, IconTrash, IconFolder } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import '@damon-stack/ui';
import { api } from '@/trpc/react';
import { CategoryTreeTable } from '@damon-stack/ui';
import type { Category } from '@damon-stack/feature-cms';

// 简化的类型定义
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  parent?: Category;
  children?: Category[];
}

export default function CategoriesPage() {
  const [formOpened, setFormOpened] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  // tRPC hooks
  const { 
    data: categories = [], 
    isLoading, 
    refetch 
  } = api.category.tree.useQuery();

  const { 
    data: allCategories = [] 
  } = api.category.list.useQuery();

  const createMutation = api.category.create.useMutation();
  const updateMutation = api.category.update.useMutation();
  const deleteMutation = api.category.delete.useMutation();

  // 表单配置
  const form = useForm({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      parentId: '',
      order: 0,
    },
  });

  // 移除面包屑导航配置 - 改为Dashboard简洁风格

  // 处理新建分类
  const handleCreate = () => {
    setEditingCategory(undefined);
    form.reset();
    setFormOpened(true);
  };

  // 处理编辑分类
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setValues({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId || '',
      order: category.order,
    });
    setFormOpened(true);
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          ...values,
        });
        notifications.show({
          title: '更新成功',
          message: '分类已成功更新',
          color: 'green',
        });
      } else {
        await createMutation.mutateAsync(values);
        notifications.show({
          title: '创建成功',
          message: '分类已成功创建',
          color: 'green',
        });
      }
      
      form.reset();
      setFormOpened(false);
      refetch();
    } catch (error: any) {
      notifications.show({
        title: '操作失败',
        message: error.message || '操作失败，请重试',
        color: 'red',
      });
    }
  };

  // 处理删除
  const handleDelete = async (categoryId: string, categoryName: string) => {
    try {
      await deleteMutation.mutateAsync({ id: categoryId });
      notifications.show({
        title: '删除成功',
        message: `分类 "${categoryName}" 已成功删除`,
        color: 'green',
      });
      refetch();
    } catch (error: any) {
      notifications.show({
        title: '删除失败',
        message: error.message || '删除失败，请重试',
        color: 'red',
      });
    }
  };

  // 使用CategoryTreeTable组件处理递归渲染

  // 渲染空状态
  const renderEmptyState = () => (
    <Center>
      <Stack align="center" gap="md">
        <IconFolder size={48} color="var(--mantine-color-gray-6)" />
        <Text c="dimmed">暂无分类数据</Text>
        <Button 
          variant="light" 
          leftSection={<IconPlus size={16} />}
          onClick={handleCreate}
        >
          创建第一个分类
        </Button>
      </Stack>
    </Center>
  );

  return (
    <Stack gap="xl">
        {/* 页面标题 - Dashboard简洁风格 */}
        <Group justify="space-between" align="center">
          <Title order={1}>分类管理</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleCreate}
            variant="filled"
          >
            新建分类
          </Button>
        </Group>

        {/* 分类表格 */}
        <Paper p="xl" withBorder style={{ position: 'relative' }}>
          <LoadingOverlay 
            visible={isLoading} 
            zIndex={1000} 
            overlayProps={{ radius: "sm", blur: 2 }} 
          />
          
          {categories.length === 0 && !isLoading ? (
            renderEmptyState()
          ) : (
            <CategoryTreeTable 
              categories={categories as any}
              onEdit={handleEdit as any}
              onDelete={handleDelete}
            />
          )}
        </Paper>

        {/* 分类表单弹窗 */}
        <Modal
          opened={formOpened}
          onClose={() => setFormOpened(false)}
          title={editingCategory ? '编辑分类' : '新建分类'}
          size="md"
          centered
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="分类名称"
                placeholder="请输入分类名称"
                required
                {...form.getInputProps('name')}
              />

              <TextInput
                label="分类标识"
                placeholder="请输入分类标识（用于URL）"
                description="用于生成URL的唯一标识符，只能包含字母、数字和连字符"
                required
                {...form.getInputProps('slug')}
              />

              <Textarea
                label="分类描述"
                placeholder="请输入分类描述（可选）"
                minRows={3}
                {...form.getInputProps('description')}
              />

              <Select
                label="父分类"
                placeholder="请选择父分类（可选）"
                data={allCategories.map((cat: any) => ({ 
                  value: cat.id, 
                  label: cat.name 
                }))}
                clearable
                searchable
                {...form.getInputProps('parentId')}
              />

              <NumberInput
                label="排序"
                placeholder="请输入排序值"
                description="数值越小排序越靠前"
                min={0}
                {...form.getInputProps('order')}
              />

              <Group justify="flex-end" mt="xl">
                <Button 
                  variant="default" 
                  onClick={() => setFormOpened(false)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  取消
                </Button>
                <Button 
                  type="submit" 
                  loading={createMutation.isPending || updateMutation.isPending}
                >
                  {editingCategory ? '更新' : '创建'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Stack>
  );
} 