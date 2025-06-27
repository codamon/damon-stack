import React from 'react';
import { Paper, PaperProps, Box } from '@mantine/core';

interface CardProps extends PaperProps {
  /**
   * 卡片标题
   */
  title?: React.ReactNode;
  /**
   * 卡片内容
   */
  children: React.ReactNode;
  /**
   * 是否显示分割线
   */
  withDivider?: boolean;
  /**
   * 标题区域的额外样式
   */
  titleProps?: React.ComponentPropsWithoutRef<'div'>;
}

/**
 * 自定义 Card 组件
 * 基于 Mantine Paper 组件封装，提供统一的卡片样式
 * 支持主题化和 Context 访问
 */
const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  withDivider = true,
  titleProps,
  ...paperProps 
}) => {
  return (
    <Paper
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      {...paperProps}
    >
      {title && (
        <>
          <Box
            component="div"
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: withDivider ? '1rem' : '0.5rem',
              color: 'var(--mantine-color-text)',
            }}
            {...titleProps}
          >
            {title}
          </Box>
          {withDivider && (
            <Box
              component="hr"
              style={{
                border: 'none',
                borderTop: '1px solid var(--mantine-color-gray-3)',
                margin: '0 0 1rem 0',
              }}
            />
          )}
        </>
      )}
      {children}
    </Paper>
  );
};

export default Card; 