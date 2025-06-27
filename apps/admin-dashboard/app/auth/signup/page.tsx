'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../trpc/react';
import { 
  Paper, 
  Title, 
  TextInput, 
  PasswordInput, 
  Button, 
  Container, 
  Group, 
  Anchor, 
  Stack,
  Alert,
  Divider,
  Text,
  Progress,
  Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconBrandGoogle, IconBrandGithub, IconCheck } from '@tabler/icons-react';

/**
 * 密码强度检查函数
 */
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  
  if (score < 30) return { score, label: '弱', color: 'red' };
  if (score < 60) return { score, label: '中等', color: 'yellow' };
  if (score < 90) return { score, label: '强', color: 'teal' };
  return { score, label: '很强', color: 'green' };
}

/**
 * 注册页面组件
 */
export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  // tRPC 注册 mutation
  const registerMutation = api.auth.register.useMutation({
    onSuccess: async (data) => {
      console.log('注册成功:', data);
      setSuccess(true);
      
      // 等待一下让用户看到成功消息
      setTimeout(async () => {
        const signInResult = await signIn('credentials', {
          email: form.values.email,
          password: form.values.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push('/dashboard');
        } else {
          router.push('/auth/signin?message=registered');
        }
      }, 1500);
    },
    onError: (error) => {
      console.error('注册错误:', error);
      setError(error.message || '注册失败，请重试');
    },
  });

  // 表单配置
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value) => {
        if (!value) return '请输入姓名';
        if (value.length < 2) return '姓名至少需要2个字符';
        return null;
      },
      email: (value) => {
        if (!value) return '请输入邮箱地址';
        if (!/^\S+@\S+\.\S+$/.test(value)) return '请输入有效的邮箱地址';
        return null;
      },
      password: (value) => {
        if (!value) return '请输入密码';
        if (value.length < 8) return '密码至少需要8位字符';
        const strength = getPasswordStrength(value);
        if (strength.score < 60) return '密码强度不够，请使用更复杂的密码';
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) return '请确认密码';
        if (value !== values.password) return '两次输入的密码不一致';
        return null;
      },
    },
  });

  // 获取密码强度
  const passwordStrength = form.values.password ? getPasswordStrength(form.values.password) : null;

  /**
   * 处理注册
   */
  const handleSignUp = async (values: typeof form.values) => {
    setError('');
    registerMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  };

  /**
   * 处理 OAuth 注册
   */
  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    try {
      setError('');
      
      await signIn(provider, {
        callbackUrl: '/dashboard',
      });
    } catch (err) {
      console.error(`${provider} 注册错误:`, err);
      setError(`${provider} 注册失败，请重试`);
    }
  };

  if (success) {
    return (
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Stack align="center">
            <IconCheck size="3rem" color="green" />
            <Title order={2} ta="center">注册成功！</Title>
            <Text c="dimmed" ta="center">
              正在为您自动登录...
            </Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900} mb="md">
        创建账户
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        加入 Damon Stack 社区
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        {error && (
          <Alert 
            icon={<IconAlertCircle size="1rem" />} 
            color="red" 
            mb="md"
            variant="light"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSignUp)}>
          <Stack>
            <TextInput
              label="姓名"
              placeholder="请输入您的姓名"
              required
              {...form.getInputProps('name')}
            />

            <TextInput
              label="邮箱地址"
              placeholder="your@email.com"
              required
              {...form.getInputProps('email')}
            />

            <Box>
              <PasswordInput
                label="密码"
                placeholder="请创建一个安全的密码"
                required
                {...form.getInputProps('password')}
              />
              
              {passwordStrength && form.values.password && (
                <Box mt="xs">
                  <Group justify="space-between" mb={5}>
                    <Text size="xs">密码强度: {passwordStrength.label}</Text>
                    <Text size="xs">{passwordStrength.score}%</Text>
                  </Group>
                  <Progress
                    value={passwordStrength.score}
                    color={passwordStrength.color}
                    size="sm"
                  />
                </Box>
              )}
            </Box>

            <PasswordInput
              label="确认密码"
              placeholder="请再次输入密码"
              required
              {...form.getInputProps('confirmPassword')}
            />

            <Button 
              type="submit" 
              fullWidth 
              loading={registerMutation.isPending}
              disabled={!form.isValid()}
            >
              创建账户
            </Button>
          </Stack>
        </form>

        <Divider label="或者使用" labelPosition="center" my="lg" />

        <Group grow mb="md" mt="md">
          <Button
            variant="default"
            leftSection={<IconBrandGoogle size="1rem" />}
            onClick={() => handleOAuthSignUp('google')}
            loading={registerMutation.isPending}
          >
            Google
          </Button>
          <Button
            variant="default"
            leftSection={<IconBrandGithub size="1rem" />}
            onClick={() => handleOAuthSignUp('github')}
            loading={registerMutation.isPending}
          >
            GitHub
          </Button>
        </Group>

        <Text c="dimmed" size="sm" ta="center" mt="md">
          已有账户？{' '}
          <Anchor size="sm" href="/auth/signin">
            立即登录
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
} 