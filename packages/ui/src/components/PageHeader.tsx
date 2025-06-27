import React from 'react';
import {
  Group,
  Stack,
  Title,
  Text,
  Breadcrumbs,
  Anchor,
  Button,
  Divider,
  Box,
  type TitleOrder,
  type ButtonProps,
} from '@mantine/core';
import { IconHome } from '@tabler/icons-react';

export interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ size?: number | string }>;
}

export interface PageHeaderProps {
  /** 页面标题 */
  title: string;
  /** 页面描述（可选） */
  description?: string;
  /** 标题级别 */
  order?: TitleOrder;
  /** 面包屑导航项 */
  breadcrumbs?: BreadcrumbItem[];
  /** 页面级主要操作按钮 */
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: ButtonProps['variant'];
    color?: ButtonProps['color'];
    loading?: boolean;
    disabled?: boolean;
  };
  /** 额外的操作按钮组 */
  actions?: React.ReactNode;
  /** 自定义图标 */
  icon?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  order = 2,
  breadcrumbs = [],
  action,
  actions,
  icon,
}: PageHeaderProps) {
  // 渲染面包屑导航
  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0) return null;

    const breadcrumbItems = breadcrumbs.map((item, index) => {
      const isLast = index === breadcrumbs.length - 1;
      const ItemIcon = item.icon;

      return (
        <Anchor
          key={index}
          href={item.href}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: isLast 
              ? 'var(--mantine-color-text)' 
              : 'var(--mantine-color-blue-6)',
            textDecoration: isLast ? 'none' : undefined,
          }}
        >
          {ItemIcon && <ItemIcon size={16} />}
          {item.title}
        </Anchor>
      );
    });

    return (
      <Breadcrumbs separator="›" mb="md">
        {breadcrumbItems}
      </Breadcrumbs>
    );
  };

  return (
    <Box>
      {/* 面包屑导航 */}
      {renderBreadcrumbs()}

      {/* 页面标题和操作 */}
      <Group justify="space-between" align="flex-start" mb="sm">
        <Stack gap="xs">
          <Group align="center" gap="xs">
            {icon}
            <Title order={order}>{title}</Title>
          </Group>
          {description && (
            <Group gap="xs">
              {icon && (
                <Box style={{ width: 16, height: 16 }} /> // 占位符保持对齐
              )}
              <Text size="sm" c="dimmed">
                {description}
              </Text>
            </Group>
          )}
        </Stack>

        {/* 操作按钮 */}
        <Group gap="sm">
          {actions}
          {action && (
            <Button
              variant={action.variant || 'filled'}
              color={action.color}
              leftSection={action.icon}
              onClick={action.onClick}
              loading={action.loading}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          )}
        </Group>
      </Group>

      {/* 分隔线 */}
      <Divider />
    </Box>
  );
}

export default PageHeader; 