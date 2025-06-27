'use client';

import { useSearchParams } from 'next/navigation';
import { 
  Container, 
  Paper, 
  Title, 
  Text, 
  Button, 
  Stack,
  Alert,
  Group
} from '@mantine/core';
import { IconAlertCircle, IconHome, IconLogin } from '@tabler/icons-react';
import Link from 'next/link';

/**
 * 认证错误页面
 */
export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // 错误消息映射
  const errorMessages: Record<string, { title: string; message: string; suggestion: string }> = {
    Configuration: {
      title: '配置错误',
      message: '认证服务配置有误，请联系系统管理员。',
      suggestion: '请检查服务器配置或联系技术支持。'
    },
    AccessDenied: {
      title: '访问被拒绝',
      message: '您没有权限访问此资源。',
      suggestion: '请联系管理员获取相应权限，或使用其他账户登录。'
    },
    Verification: {
      title: '验证失败',
      message: '邮箱验证链接无效或已过期。',
      suggestion: '请重新请求验证邮件或联系支持团队。'
    },
    CredentialsSignin: {
      title: '登录失败',
      message: '用户名或密码错误。',
      suggestion: '请检查您的登录凭据或重置密码。'
    },
    OAuthSignin: {
      title: 'OAuth 登录失败',
      message: '第三方登录服务连接失败。',
      suggestion: '请稍后重试或使用其他登录方式。'
    },
    OAuthCallback: {
      title: 'OAuth 回调错误',
      message: '第三方登录回调处理失败。',
      suggestion: '请重新尝试登录或使用邮箱密码登录。'
    },
    OAuthCreateAccount: {
      title: '账户创建失败',
      message: '无法使用第三方账户创建新用户。',
      suggestion: '请尝试直接注册或联系支持团队。'
    },
    EmailCreateAccount: {
      title: '邮箱账户创建失败',
      message: '无法创建邮箱账户。',
      suggestion: '请检查邮箱地址或尝试其他邮箱。'
    },
    Callback: {
      title: '回调错误',
      message: '认证回调处理失败。',
      suggestion: '请清除浏览器缓存后重试。'
    },
    OAuthAccountNotLinked: {
      title: '账户未关联',
      message: '该邮箱已与其他登录方式关联。',
      suggestion: '请使用原有的登录方式，或在设置中关联新的登录方式。'
    },
    EmailSignin: {
      title: '邮箱登录失败',
      message: '邮箱登录过程中发生错误。',
      suggestion: '请检查您的邮箱地址或尝试密码登录。'
    },
    SessionRequired: {
      title: '需要登录',
      message: '访问此页面需要先登录。',
      suggestion: '请先登录您的账户。'
    },
    default: {
      title: '认证错误',
      message: '认证过程中发生未知错误。',
      suggestion: '请稍后重试或联系技术支持。'
    }
  };

  const errorInfo = errorMessages[error || 'default'] || errorMessages.default;

  return (
    <Container size={500} my={40}>
      <Paper withBorder shadow="md" p={40} radius="md">
        <Stack align="center" gap="lg">
          <IconAlertCircle size="4rem" color="red" />
          
          <Title order={1} ta="center" c="red">
            {errorInfo.title}
          </Title>
          
          <Text size="lg" ta="center" c="dimmed">
            {errorInfo.message}
          </Text>
          
          <Alert color="blue" variant="light" w="100%">
            <Text size="sm">
              <strong>建议：</strong> {errorInfo.suggestion}
            </Text>
          </Alert>

          <Group gap="md" mt="xl">
            <Button
              component={Link}
              href="/auth/signin"
              leftSection={<IconLogin size="1rem" />}
              variant="filled"
            >
              重新登录
            </Button>
            
            <Button
              component={Link}
              href="/"
              leftSection={<IconHome size="1rem" />}
              variant="outline"
            >
              返回首页
            </Button>
          </Group>

          {error && (
            <Text size="xs" c="dimmed" ta="center" mt="xl">
              错误代码: {error}
            </Text>
          )}
        </Stack>
      </Paper>
    </Container>
  );
} 