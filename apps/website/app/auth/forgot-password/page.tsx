'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Paper,
  Title,
  TextInput,
  Button,
  Text,
  Alert,
  Stack,
  Container,
  Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconArrowLeft } from '@tabler/icons-react';
import { api } from '../../../trpc/react';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : '请输入有效的邮箱地址'),
    },
  });

  const resetMutation = api.customer.requestPasswordReset.useMutation({
    onSuccess: (data) => {
      console.log('密码重置请求成功:', data);
      setSuccess(true);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  const handleSubmit = (values: ForgotPasswordForm) => {
    setLoading(true);
    setError(null);
    resetMutation.mutate(values);
  };

  if (success) {
    return (
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Alert color="green" mb="md">
            <Title order={3} mb="sm">邮件已发送</Title>
            <Text mb="md">
              如果该邮箱已注册，我们已向您的邮箱发送了密码重置链接。请检查您的邮箱（包括垃圾邮件文件夹）。
            </Text>
            <Text size="sm" c="dimmed">
              重置链接将在1小时后过期。
            </Text>
          </Alert>
          
          <Button
            variant="light"
            leftSection={<IconArrowLeft size={16} />}
            component={Link}
            href="/auth/signin"
            fullWidth
          >
            返回登录
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={2} ta="center" mb="md">
          重置密码
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          输入您的邮箱地址，我们将发送重置链接给您
        </Text>

        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              required
              label="邮箱"
              placeholder="your@email.com"
              leftSection={<IconMail size={16} />}
              {...form.getInputProps('email')}
            />

            <Button 
              type="submit" 
              fullWidth 
              mt="xl" 
              loading={loading}
              disabled={loading}
            >
              发送重置链接
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