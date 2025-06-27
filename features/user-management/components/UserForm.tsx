/**
 * 用户表单组件
 * 支持创建和编辑用户功能
 */

'use client';

import { useEffect } from 'react';
import {
  Stack,
  TextInput,
  Select,
  Button,
  Group,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import type { User, UserRole, UserStatus } from '../api/types';

interface UserFormProps {
  user?: User | null;
  onSuccess: () => void;
  onCancel: () => void;
  // 通过props注入API调用函数
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
}

interface FormValues {
  name: string;
  email: string;
  role: string;
  status: string;
}

export function UserForm({ 
  user, 
  onSuccess, 
  onCancel, 
  createUser, 
  updateUser 
}: UserFormProps) {
  const isEditing = !!user;

  // 表单配置
  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      email: '',
      role: 'USER',
      status: 'ACTIVE',
    },
    validate: {
      name: (value) => {
        if (!value || value.trim().length === 0) {
          return '用户名不能为空';
        }
        if (value.length > 100) {
          return '用户名不能超过100个字符';
        }
        return null;
      },
      email: (value) => {
        if (!value || value.trim().length === 0) {
          return '邮箱不能为空';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return '请输入有效的邮箱地址';
        }
        return null;
      },
      role: (value) => {
        if (!['USER', 'ADMIN'].includes(value)) {
          return '请选择有效的角色';
        }
        return null;
      },
      status: (value) => {
        if (!['ACTIVE', 'BANNED'].includes(value)) {
          return '请选择有效的状态';
        }
        return null;
      },
    },
  });

  // 填充编辑数据
  useEffect(() => {
    if (user) {
      form.setValues({
        name: user.name || '',
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      form.reset();
    }
  }, [user]);

  // 表单提交处理
  const handleSubmit = async (values: FormValues) => {
    try {
      if (isEditing && user) {
        // 编辑模式
        const result = await updateUser({
          id: user.id,
          name: values.name,
          email: values.email,
          role: values.role as UserRole,
          status: values.status as UserStatus,
        });
        
        notifications.show({
          title: '更新成功',
          message: `用户 ${result.user.name} 已成功更新`,
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      } else {
        // 创建模式
        const result = await createUser({
          name: values.name,
          email: values.email,
          role: values.role as UserRole,
          status: values.status as UserStatus,
        });
        
        notifications.show({
          title: '创建成功',
          message: `用户 ${result.user.name} 已成功创建`,
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      }
      
      onSuccess();
    } catch (error) {
      notifications.show({
        title: isEditing ? '更新失败' : '创建失败',
        message: error instanceof Error ? error.message : '操作失败',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        {/* 用户名输入 */}
        <TextInput
          label="用户名"
          placeholder="请输入用户名"
          required
          {...form.getInputProps('name')}
        />

        {/* 邮箱输入 */}
        <TextInput
          label="邮箱"
          placeholder="请输入邮箱地址"
          type="email"
          required
          {...form.getInputProps('email')}
        />

        {/* 角色选择 */}
        <Select
          label="角色"
          placeholder="请选择角色"
          required
          data={[
            { value: 'USER', label: '普通用户' },
            { value: 'ADMIN', label: '管理员' },
          ]}
          {...form.getInputProps('role')}
        />

        {/* 状态选择 */}
        <Select
          label="状态"
          placeholder="请选择状态"
          required
          data={[
            { value: 'ACTIVE', label: '正常' },
            { value: 'BANNED', label: '禁用' },
          ]}
          {...form.getInputProps('status')}
        />

        {/* 编辑模式提示 */}
        {isEditing && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="blue"
            variant="light"
          >
            正在编辑用户：<strong>{user?.name || user?.email}</strong>
          </Alert>
        )}

        {/* 操作按钮 */}
        <Group justify="end" mt="md">
          <Button
            variant="default"
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            type="submit"
          >
            {isEditing ? '更新' : '创建'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 