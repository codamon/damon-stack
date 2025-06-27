import React from 'react';
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';

/**
 * 自定义 Button 组件属性接口
 * 基于 Mantine ButtonProps，可根据需要扩展
 */
export interface ButtonProps extends MantineButtonProps {
  /**
   * 按钮变体类型
   * @default 'filled'
   */
  variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default' | 'gradient';
  
  /**
   * 按钮尺寸
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * 是否显示加载状态
   * @default false
   */
  loading?: boolean;
  
  /**
   * 是否禁用按钮
   * @default false
   */
  disabled?: boolean;
  
  /**
   * 按钮类型（用于表单）
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  
  /**
   * 自定义样式类名
   */
  className?: string;
  
  /**
   * 点击事件处理器
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  
  /**
   * 按钮内容
   */
  children: React.ReactNode;
}

/**
 * 自定义 Button 组件
 * 
 * 基于 Mantine Button 组件封装，提供统一的按钮样式和行为。
 * 集成了项目主题系统，支持多种变体和尺寸。
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Button>点击我</Button>
 * 
 * // 主要操作按钮
 * <Button variant="filled" color="violet">
 *   提交
 * </Button>
 * 
 * // 加载状态
 * <Button loading>
 *   处理中...
 * </Button>
 * 
 * // 表单提交
 * <Button type="submit" variant="filled">
 *   登录
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) => {
  return (
    <MantineButton
      variant={variant}
      size={size}
      type={type}
      loading={loading}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </MantineButton>
  );
};

// 默认导出
export default Button; 