import React from 'react';
import { TextInput as MantineTextInput, TextInputProps as MantineTextInputProps } from '@mantine/core';

/**
 * 自定义 TextInput 组件属性接口
 * 基于 Mantine TextInputProps，可根据需要扩展
 */
export interface TextInputProps extends MantineTextInputProps {
  /**
   * 输入框标签
   */
  label?: React.ReactNode;
  
  /**
   * 占位符文本
   */
  placeholder?: string;
  
  /**
   * 输入框描述信息
   */
  description?: React.ReactNode;
  
  /**
   * 错误信息
   */
  error?: React.ReactNode;
  
  /**
   * 是否必填
   * @default false
   */
  required?: boolean;
  
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  
  /**
   * 输入框尺寸
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * 输入框类型
   * @default 'text'
   */
  type?: 'text' | 'email' | 'tel' | 'url' | 'search';
  
  /**
   * 输入框值
   */
  value?: string;
  
  /**
   * 默认值
   */
  defaultValue?: string;
  
  /**
   * 值变化时的回调函数
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  
  /**
   * 失去焦点时的回调函数
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  
  /**
   * 获得焦点时的回调函数
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  
  /**
   * 自定义样式类名
   */
  className?: string;
}

/**
 * 自定义 TextInput 组件
 * 
 * 基于 Mantine TextInput 组件封装，提供统一的文本输入框样式和行为。
 * 集成了项目主题系统，支持表单验证和错误显示。
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <TextInput 
 *   label="用户名" 
 *   placeholder="请输入用户名" 
 * />
 * 
 * // 必填字段
 * <TextInput 
 *   label="邮箱地址" 
 *   type="email"
 *   placeholder="user@example.com"
 *   required 
 * />
 * 
 * // 带错误信息
 * <TextInput 
 *   label="用户名" 
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 *   error={usernameError}
 * />
 * 
 * // 带描述信息
 * <TextInput 
 *   label="密码"
 *   description="密码长度至少8位"
 *   placeholder="请输入密码"
 * />
 * ```
 */
export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  description,
  error,
  required = false,
  disabled = false,
  size = 'md',
  type = 'text',
  className,
  ...props
}) => {
  return (
    <MantineTextInput
      label={label}
      placeholder={placeholder}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      size={size}
      type={type}
      className={className}
      {...props}
    />
  );
};

// 默认导出
export default TextInput; 