'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Text,
  Alert,
  Stack,
  Container,
  Anchor,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconLock, IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import { api } from '../../../trpc/react';

interface LoginForm {
  email: string;
  password: string;
}

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : '请输入有效的邮箱地址'),
      password: (value) => (value.length < 1 ? '请输入密码' : null),
    },
  });

  const loginMutation = api.customer.login.useMutation({
    onSuccess: (data) => {
      console.log('登录成功:', data);
      // TODO: 设置用户会话
      const callbackUrl = searchParams.get('callbackUrl') || '/';
      router.push(callbackUrl);
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  const handleSubmit = (values: LoginForm) => {
    setLoading(true);
    setError(null);
    loginMutation.mutate(values);
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    // TODO: 实现社交登录
    console.log(`使用 ${provider} 登录`);
  };

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={2} ta="center" mb="md">
          欢迎回来
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          登录您的账户以继续
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

            <PasswordInput
              required
              label="密码"
              placeholder="请输入密码"
              leftSection={<IconLock size={16} />}
              {...form.getInputProps('password')}
            />

            <Group justify="space-between" mt="xs">
              <Text size="sm">
                <Anchor component={Link} href="/auth/forgot-password">
                  忘记密码？
                </Anchor>
              </Text>
            </Group>

            <Button 
              type="submit" 
              fullWidth 
              mt="xl" 
              loading={loading}
              disabled={loading}
            >
              登录
            </Button>
          </Stack>
        </form>

        <Divider label="或者" labelPosition="center" my="lg" />

        <Stack gap="sm">
          <Button
            variant="default"
            leftSection={<IconBrandGoogle size={16} />}
            onClick={() => handleSocialLogin('google')}
            fullWidth
          >
            使用 Google 登录
          </Button>

          <Button
            variant="default"
            leftSection={<IconBrandGithub size={16} />}
            onClick={() => handleSocialLogin('github')}
            fullWidth
          >
            使用 GitHub 登录
          </Button>
        </Stack>

        <Text ta="center" mt="md" size="sm">
          还没有账户？{' '}
          <Anchor component={Link} href="/auth/signup">
            立即注册
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
} 