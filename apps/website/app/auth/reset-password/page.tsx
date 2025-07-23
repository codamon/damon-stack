'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Paper,
  Title,
  PasswordInput,
  Button,
  Text,
  Alert,
  Stack,
  Container,
  Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconArrowLeft } from '@tabler/icons-react';
import { api } from '../../../trpc/react';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('重置链接无效或已过期');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const form = useForm<ResetPasswordForm>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (value) => (value.length < 8 ? '密码至少需要8位字符' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? '密码确认不匹配' : null,
    },
  });

  const resetMutation = api.customer.confirmPasswordReset.useMutation({
    onSuccess: (data) => {
      console.log('密码重置成功:', data);
      setSuccess(true);
      // 延迟跳转到登录页
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  const handleSubmit = (values: ResetPasswordForm) => {
    if (!token) {
      setError('重置链接无效');
      return;
    }

    setLoading(true);
    setError(null);
    resetMutation.mutate({
      token,
      password: values.password,
    });
  };

  // 如果没有token，显示错误
  if (!token && error) {
    return (
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Alert color="red" mb="md">
            <Title order={3} mb="sm">链接无效</Title>
            <Text mb="md">
              重置链接无效或已过期。请重新申请密码重置。
            </Text>
          </Alert>
          
          <Button
            variant="light"
            leftSection={<IconArrowLeft size={16} />}
            component={Link}
            href="/auth/forgot-password"
            fullWidth
          >
            重新申请
          </Button>
        </Paper>
      </Container>
    );
  }

  // 重置成功页面
  if (success) {
    return (
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Alert color="green" mb="md">
            <Title order={3} mb="sm">密码重置成功！</Title>
            <Text mb="md">
              您的密码已成功重置。即将跳转到登录页面...
            </Text>
            <Text size="sm" c="dimmed">
              请使用新密码登录。
            </Text>
          </Alert>
          
          <Button
            leftSection={<IconArrowLeft size={16} />}
            component={Link}
            href="/auth/signin"
            fullWidth
          >
            前往登录
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={2} ta="center" mb="md">
          设置新密码
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          请设置您的新密码
        </Text>

        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <PasswordInput
              required
              label="新密码"
              placeholder="至少8位字符"
              leftSection={<IconLock size={16} />}
              {...form.getInputProps('password')}
            />

            <PasswordInput
              required
              label="确认新密码"
              placeholder="再次输入新密码"
              leftSection={<IconLock size={16} />}
              {...form.getInputProps('confirmPassword')}
            />

            <Button 
              type="submit" 
              fullWidth 
              mt="xl" 
              loading={loading}
              disabled={loading}
            >
              重置密码
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="md" size="sm">
          <Anchor component={Link} href="/auth/signin" leftSection={<IconArrowLeft size={14} />}>
            返回登录
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
} 