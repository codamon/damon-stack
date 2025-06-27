'use client';

// 强制动态渲染
export const dynamic = 'force-dynamic';

import { useState, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Container, 
  Paper, 
  Title, 
  Stack, 
  Alert,
  Group,
  Anchor,
  Divider,
  Text,
  LoadingOverlay,
  Loader,
  Center
} from '@mantine/core';
import { 
  Button, 
  TextInput, 
  PasswordInput 
} from '@damon-stack/ui';
import { IconAlertCircle, IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import { signIn, getSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

/**
 * 登录页面组件内容
 */
function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // 获取 URL 参数
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const urlError = searchParams.get('error');

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
        OAuthSignin: 'OAuth 登录失败，请重试',
        OAuthCallback: 'OAuth 回调失败，请重试',
        OAuthCreateAccount: '创建 OAuth 账户失败',
        EmailCreateAccount: '创建邮箱账户失败',
        Callback: '回调失败，请重试',
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
  const handleCredentialsSignIn = async (formData: FormData) => {
    startTransition(async () => {
      try {
        setIsLoading(true);
        setError('');

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // 前端验证
        if (!email || !password) {
          setError('请填写邮箱和密码');
          return;
        }

        if (email.length < 3 || !email.includes('@')) {
          setError('请输入有效的邮箱地址');
          return;
        }

        if (password.length < 6) {
          setError('密码至少需要6位字符');
          return;
        }

        // 调用 NextAuth 登录
        const result = await signIn('credentials', {
          email,
          password,
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
    });
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
    <Container size="xs" py={80}>
      <Paper shadow="md" p={30} mt={30} radius="md" withBorder pos="relative">
        <LoadingOverlay visible={isLoading || isPending} />
        
        <Title ta="center" mb={30}>
          欢迎回来
        </Title>

        {/* 错误信息显示 */}
        {error && (
          <Alert 
            icon={<IconAlertCircle size="1rem" />} 
            color="red" 
            mb="md"
            variant="light"
            onClose={() => setError('')}
            withCloseButton
          >
            {error}
          </Alert>
        )}

        {/* 凭据登录表单 */}
        <form action={handleCredentialsSignIn}>
          <Stack gap="md">
            <TextInput
              label="邮箱地址"
              placeholder="your@email.com"
              name="email"
              type="email"
              required
              size="md"
              disabled={isLoading || isPending}
            />

            <PasswordInput
              label="密码"
              placeholder="请输入密码"
              name="password"
              required
              size="md"
              disabled={isLoading || isPending}
            />

            <Button 
              type="submit"
              fullWidth
              size="md"
              mt="md"
              loading={isLoading || isPending}
            >
              登录
            </Button>
          </Stack>
        </form>

        {/* OAuth 登录选项 */}
        <Divider 
          label="或者使用以下方式登录" 
          labelPosition="center" 
          my="lg" 
        />

        <Stack gap="md">
          <Button
            variant="outline"
            fullWidth
            leftSection={<IconBrandGoogle size="1rem" />}
            size="md"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading || isPending}
          >
            使用 Google 登录
          </Button>

          <Button
            variant="outline"
            fullWidth
            leftSection={<IconBrandGithub size="1rem" />}
            size="md"
            color="dark"
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading || isPending}
          >
            使用 GitHub 登录
          </Button>
        </Stack>

        {/* 注册链接 */}
        <Group justify="center" mt="lg">
          <Text size="sm" c="dimmed">
            还没有账户？
            <Anchor component={Link} href="/auth/signup" size="sm" ml={5}>
              立即注册
            </Anchor>
          </Text>
        </Group>

        {/* 忘记密码链接 */}
        <Group justify="center" mt="sm">
          <Anchor component={Link} href="/auth/forgot-password" size="sm" c="dimmed">
            忘记密码？
          </Anchor>
        </Group>
      </Paper>
    </Container>
  );
}

/**
 * 登录页面主组件
 */
export default function LoginPage() {
  return (
    <Suspense fallback={
      <Container size="xs" py={80}>
        <Center>
          <Loader size="lg" />
        </Center>
      </Container>
    }>
      <LoginPageContent />
    </Suspense>
  );
} 