'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  TextInput,
  Button,
  Text,
  Alert,
  Stack,
  Container,
  Group,
  Avatar,
  FileInput,
  Select,
  Grid,
  Divider,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconUser, IconMail, IconPhone, IconCalendar, IconUpload } from '@tabler/icons-react';
import { api } from '../../../trpc/react';

interface ProfileForm {
  name: string;
  phone: string;
  birthday: Date | null;
  gender: string;
  language: string;
  timezone: string;
  theme: string;
}

// 模拟当前用户ID - 实际应用中应该从认证上下文获取
const CURRENT_USER_ID = 'mock-user-id';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);

  // 获取用户信息
  const { data: user, isLoading: userLoading, refetch } = api.customer.me.useQuery(
    { customerId: CURRENT_USER_ID },
    { enabled: !!CURRENT_USER_ID }
  );

  const form = useForm<ProfileForm>({
    initialValues: {
      name: '',
      phone: '',
      birthday: null,
      gender: '',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      theme: 'light',
    },
    validate: {
      name: (value) => (value.length < 2 ? '姓名至少需要2个字符' : null),
    },
  });

  // 当用户数据加载完成时更新表单
  useEffect(() => {
    if (user) {
      form.setValues({
        name: user.name || '',
        phone: user.phone || '',
        birthday: user.birthday ? new Date(user.birthday) : null,
        gender: user.gender || '',
        language: user.language || 'zh-CN',
        timezone: user.timezone || 'Asia/Shanghai',
        theme: user.theme || 'light',
      });
    }
  }, [user]);

  const updateMutation = api.customer.updateProfile.useMutation({
    onSuccess: (data) => {
      console.log('资料更新成功:', data);
      setSuccess('个人资料更新成功！');
      setLoading(false);
      refetch(); // 重新获取用户数据
      
      // 清除成功消息
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  const handleSubmit = (values: ProfileForm) => {
    if (!CURRENT_USER_ID) {
      setError('用户未登录');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // 处理日期转换
    const updateData = {
      ...values,
      birthday: values.birthday || undefined,
    };

    updateMutation.mutate({
      customerId: CURRENT_USER_ID,
      data: updateData,
    });
  };

  const handleAvatarUpload = (file: File | null) => {
    setAvatar(file);
    // TODO: 实现头像上传逻辑
    console.log('上传头像:', file);
  };

  if (userLoading) {
    return (
      <Container size="md" my={40}>
        <Paper withBorder p="xl">
          <Text>加载中...</Text>
        </Paper>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container size="md" my={40}>
        <Paper withBorder p="xl">
          <Alert color="red">
            用户信息加载失败，请重新登录
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" my={40}>
      <Stack gap="xl">
        {/* 页面标题 */}
        <Title order={1}>个人资料</Title>

        {/* 头像部分 */}
        <Paper withBorder p="xl">
          <Title order={3} mb="md">头像</Title>
          <Group align="center" gap="md">
            <Avatar
              src={user.avatar}
              size={80}
              radius="md"
            />
            <Stack gap="xs" flex={1}>
              <Text size="sm" c="dimmed">
                上传新头像。建议尺寸：400x400px，支持 JPG、PNG 格式
              </Text>
              <FileInput
                placeholder="选择文件"
                leftSection={<IconUpload size={16} />}
                accept="image/*"
                onChange={handleAvatarUpload}
                clearable
              />
            </Stack>
          </Group>
        </Paper>

        {/* 基本信息 */}
        <Paper withBorder p="xl">
          <Title order={3} mb="md">基本信息</Title>
          
          {error && (
            <Alert color="red" mb="md">
              {error}
            </Alert>
          )}

          {success && (
            <Alert color="green" mb="md">
              {success}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    required
                    label="姓名"
                    placeholder="请输入您的姓名"
                    leftSection={<IconUser size={16} />}
                    {...form.getInputProps('name')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="邮箱"
                    value={user.email}
                    leftSection={<IconMail size={16} />}
                    disabled
                    description="邮箱地址无法修改"
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="手机号"
                    placeholder="请输入手机号码"
                    leftSection={<IconPhone size={16} />}
                    {...form.getInputProps('phone')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <DateInput
                    label="生日"
                    placeholder="选择您的生日"
                    leftSection={<IconCalendar size={16} />}
                    maxDate={new Date()}
                    {...form.getInputProps('birthday')}
                  />
                </Grid.Col>
              </Grid>

              <Select
                label="性别"
                placeholder="请选择性别"
                data={[
                  { value: 'male', label: '男' },
                  { value: 'female', label: '女' },
                  { value: 'other', label: '其他' },
                ]}
                {...form.getInputProps('gender')}
              />

              <Divider label="偏好设置" labelPosition="left" />

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="语言"
                    data={[
                      { value: 'zh-CN', label: '简体中文' },
                      { value: 'zh-TW', label: '繁体中文' },
                      { value: 'en', label: 'English' },
                    ]}
                    {...form.getInputProps('language')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="时区"
                    data={[
                      { value: 'Asia/Shanghai', label: '北京时间 (UTC+8)' },
                      { value: 'America/New_York', label: '纽约时间 (UTC-5)' },
                      { value: 'Europe/London', label: '伦敦时间 (UTC+0)' },
                    ]}
                    {...form.getInputProps('timezone')}
                  />
                </Grid.Col>
              </Grid>

              <Select
                label="主题"
                data={[
                  { value: 'light', label: '浅色主题' },
                  { value: 'dark', label: '深色主题' },
                  { value: 'auto', label: '跟随系统' },
                ]}
                {...form.getInputProps('theme')}
              />

              <Group justify="flex-end" mt="xl">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  保存更改
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>

        {/* 账户信息 */}
        <Paper withBorder p="xl">
          <Title order={3} mb="md">账户信息</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" c="dimmed">注册时间</Text>
              <Text fw={500}>{new Date(user.createdAt).toLocaleDateString()}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" c="dimmed">最后登录</Text>
              <Text fw={500}>
                {user.lastLoginAt 
                  ? new Date(user.lastLoginAt).toLocaleString()
                  : '从未登录'
                }
              </Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" c="dimmed">登录次数</Text>
              <Text fw={500}>{user.loginCount} 次</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" c="dimmed">账户状态</Text>
              <Text fw={500} c={user.status === 'ACTIVE' ? 'green' : 'red'}>
                {user.status === 'ACTIVE' ? '正常' : '已禁用'}
              </Text>
            </Grid.Col>
          </Grid>
        </Paper>
      </Stack>
    </Container>
  );
} 