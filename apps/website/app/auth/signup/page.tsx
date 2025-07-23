'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Alert,
  Stack,
  Container,
  Anchor,
  Divider,
  Checkbox,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconLock, IconUser, IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import { api } from '../../../trpc/react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  newsletter: boolean;
}

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterForm>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      newsletter: false,
    },
    validate: {
      name: (value) => (value.length < 2 ? '姓名至少需要2个字符' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : '请输入有效的邮箱地址'),
      password: (value) => (value.length < 8 ? '密码至少需要8位字符' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? '密码确认不匹配' : null,
    },
  });

  const registerMutation = api.customer.register.useMutation({
    onSuccess: (data) => {
      console.log('注册成功:', data);
      setSuccess(true);
      // 延迟跳转到登录页
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  const handleSubmit = (values: RegisterForm) => {
    setLoading(true);
    setError(null);
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    // TODO: 实现社交登录
    console.log(`使用 ${provider} 注册`);
  };

  if (success) {
    return (
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Alert color="green" mb="md">
            <Title order={3} mb="sm">注册成功！</Title>
            <Text>
              欢迎加入我们！您的账户已创建成功，即将跳转到登录页面...
            </Text>
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={2} ta="center" mb="md">
          创建账户
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          注册新账户开始使用我们的服务
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
              label="姓名"
              placeholder="请输入您的姓名"
              leftSection={<IconUser size={16} />}
              {...form.getInputProps('name')}
            />

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
              placeholder="至少8位字符"
              leftSection={<IconLock size={16} />}
              {...form.getInputProps('password')}
            />

            <PasswordInput
              required
              label="确认密码"
              placeholder="再次输入密码"
              leftSection={<IconLock size={16} />}
              {...form.getInputProps('confirmPassword')}
            />

            <Checkbox
              label="订阅我们的最新资讯和产品更新"
              {...form.getInputProps('newsletter', { type: 'checkbox' })}
            />

            <Button 
              type="submit" 
              fullWidth 
              mt="xl" 
              loading={loading}
              disabled={loading}
            >
              注册
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
            使用 Google 注册
          </Button>

          <Button
            variant="default"
            leftSection={<IconBrandGithub size={16} />}
            onClick={() => handleSocialLogin('github')}
            fullWidth
          >
            使用 GitHub 注册
          </Button>
        </Stack>

        <Text ta="center" mt="md" size="sm">
          已有账户？{' '}
          <Anchor component={Link} href="/auth/signin">
            立即登录
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
} 