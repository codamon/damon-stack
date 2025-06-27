"use client";

import { useState, useEffect } from 'react';
import { 
  Modal, 
  TextInput, 
  Textarea, 
  Button, 
  Group, 
  Select, 
  NumberInput,
  Stack,
  Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types';

interface CategoryFormProps {
  opened: boolean;
  onClose: () => void;
  category?: Category;
  categories: Category[];
  onSuccess: () => void;
  trpc: any; // 这里应该使用正确的 tRPC 类型
}

export function CategoryForm({ 
  opened, 
  onClose, 
  category, 
  categories, 
  onSuccess,
  trpc 
}: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(category);

  const form = useForm<CreateCategoryInput | UpdateCategoryInput>({
    initialValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      parentId: category?.parentId || '',
      order: category?.order || 0,
    },
    validate: {
      name: (value) => (!value ? '分类名称不能为空' : null),
      slug: (value) => (!value ? '分类标识不能为空' : null),
    },
  });

  // 当分类数据变化时更新表单
  useEffect(() => {
    if (category) {
      form.setValues({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        parentId: category.parentId || '',
        order: category.order,
      });
    } else {
      form.reset();
    }
  }, [category]);

  // 自动生成 slug（使用后端API）
  const handleNameChange = async (value: string) => {
    form.setFieldValue('name', value);
    
    // 如果是新建且 slug 为空，则调用后端API生成
    if (!isEdit && !form.values.slug && value.trim()) {
      try {
        const result = await trpc.category.generateSlug.query({ name: value });
        form.setFieldValue('slug', result.slug);
      } catch (error) {
        console.error('生成slug失败:', error);
      }
    }
  };

  const handleSubmit = async (values: CreateCategoryInput | UpdateCategoryInput) => {
    setLoading(true);
    
    try {
      if (isEdit && category) {
        await trpc.category.update.mutate({
          id: category.id,
          ...values,
        });
        notifications.show({
          title: '更新成功',
          message: '分类已成功更新',
          color: 'green',
        });
      } else {
        await trpc.category.create.mutate(values as CreateCategoryInput);
        notifications.show({
          title: '创建成功',
          message: '分类已成功创建',
          color: 'green',
        });
      }
      
      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      notifications.show({
        title: '操作失败',
        message: error.message || '操作失败，请重试',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // 使用后端API获取父分类选项
  const [parentOptions, setParentOptions] = useState<Array<{value: string, label: string}>>([]);

  useEffect(() => {
    const fetchParentOptions = async () => {
      try {
        const options = await trpc.category.getParentOptions.query({
          excludeId: isEdit ? category?.id : undefined
        });
        setParentOptions(options);
      } catch (error) {
        console.error('获取父分类选项失败:', error);
        // 降级处理：使用传入的categories
        setParentOptions(
          categories
            .filter(cat => !isEdit || cat.id !== category?.id)
            .map(cat => ({ value: cat.id, label: cat.name }))
        );
      }
    };

    if (opened) {
      fetchParentOptions();
    }
  }, [opened, isEdit, category?.id, trpc, categories]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? '编辑分类' : '新建分类'}
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
            onChange={(event) => handleNameChange(event.currentTarget.value)}
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
            data={parentOptions}
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

          <Group justify="flex-end" mt="md">
            <Button 
              variant="default" 
              onClick={onClose}
              disabled={loading}
            >
              取消
            </Button>
            <Button 
              type="submit" 
              loading={loading}
            >
              {isEdit ? '更新' : '创建'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 