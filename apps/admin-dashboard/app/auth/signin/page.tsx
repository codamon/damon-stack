'use client';

// 强制动态渲染
export const dynamic = 'force-dynamic';

import { signIn, getSession } from 'next-auth/react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Loader,
  Center
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';

/**
 * 登录页面组件内容
 */
function SignInPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // 获取重定向 URL
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const urlError = searchParams.get('error');

  // 表单配置
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => {
        if (!value) return '请输入邮箱地址';
        if (!/^\S+@\S+\.\S+$/.test(value)) return '请输入有效的邮箱地址';
        return null;
      },
      password: (value) => {
        if (!value) return '请输入密码';
        if (value.length < 6) return '密码至少需要6位字符';
        return null;
      },
    },
  });

  // 检查是否已登录
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push(callbackUrl);
      }
    };
    checkSession();
  }, [router, callbackUrl]);

  // 处理 URL 错误参数
  useEffect(() => {
    if (urlError) {
      const errorMessages: Record<string, string> = {
        CredentialsSignin: '邮箱或密码错误，请重试',
        OAuthSignin: 'OAuth 登录失败',
        OAuthCallback: 'OAuth 回调失败',
        OAuthCreateAccount: '创建 OAuth 账户失败',
        EmailCreateAccount: '创建邮箱账户失败',
        Callback: '回调失败',
        OAuthAccountNotLinked: '该邮箱已被其他登录方式使用',
        EmailSignin: '邮箱登录失败',
        SessionRequired: '需要登录才能访问',
        default: '登录失败，请重试'
      };
      setError(errorMessages[urlError] || errorMessages.default);
    }
  }, [urlError]);

  /**
   * 处理凭据登录
   */
  const handleCredentialsSignIn = async (values: typeof form.values) => {
    try {
      setIsLoading(true);
      setError('');

      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError('邮箱或密码错误，请重试');
      } else if (result?.ok) {
        // 登录成功，重定向
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error('登录错误:', err);
      setError('登录过程中发生错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理 OAuth 登录
   */
  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      setError('');
      
      await signIn(provider, {
        callbackUrl,
      });
    } catch (err) {
      console.error(`${provider} 登录错误:`, err);
      setError(`${provider} 登录失败，请重试`);
      setIsLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900} mb="md">
        欢迎回来！
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        登录到您的 Damon Stack 账户
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

        <form onSubmit={form.onSubmit(handleCredentialsSignIn)}>
          <Stack>
            <TextInput
              label="邮箱地址"
              placeholder="your@email.com"
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="密码"
              placeholder="请输入密码"
              required
              {...form.getInputProps('password')}
            />

            <Button 
              type="submit" 
              fullWidth 
              loading={isLoading}
              disabled={!form.isValid()}
            >
              登录
            </Button>
          </Stack>
        </form>

        <Divider label="或者使用" labelPosition="center" my="lg" />

        <Group grow mb="md" mt="md">
          <Button
            variant="default"
            leftSection={<IconBrandGoogle size="1rem" />}
            onClick={() => handleOAuthSignIn('google')}
            loading={isLoading}
          >
            Google
          </Button>
          <Button
            variant="default"
            leftSection={<IconBrandGithub size="1rem" />}
            onClick={() => handleOAuthSignIn('github')}
            loading={isLoading}
          >
            GitHub
          </Button>
        </Group>

        <Text c="dimmed" size="sm" ta="center" mt="md">
          还没有账户？{' '}
          <Anchor size="sm" href="/auth/signup">
            立即注册
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}

/**
 * 登录页面主组件
 */
export default function SignInPage() {
  return (
    <Suspense fallback={
      <Container size={420} my={40}>
        <Center>
          <Loader size="lg" />
        </Center>
      </Container>
    }>
      <SignInPageContent />
    </Suspense>
  );
} 