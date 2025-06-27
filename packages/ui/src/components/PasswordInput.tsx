import React from 'react';
import { PasswordInput as MantinePasswordInput, PasswordInputProps as MantinePasswordInputProps } from '@mantine/core';

/**
 * 自定义 PasswordInput 组件属性接口
 * 基于 Mantine PasswordInputProps，可根据需要扩展
 */
export interface PasswordInputProps extends MantinePasswordInputProps {
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
   * 是否显示密码可见性切换按钮
   * @default true
   */
  visible?: boolean;
  
  /**
   * 密码可见性切换图标组件
   */
  visibilityToggleIcon?: React.FC<{ reveal: boolean }>;
  
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
 * 自定义 PasswordInput 组件
 * 
 * 基于 Mantine PasswordInput 组件封装，提供统一的密码输入框样式和行为。
 * 集成了项目主题系统，支持密码可见性切换和表单验证。
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <PasswordInput 
 *   label="密码" 
 *   placeholder="请输入密码" 
 * />
 * 
 * // 必填字段
 * <PasswordInput 
 *   label="新密码"
 *   placeholder="请输入新密码"
 *   required 
 * />
 * 
 * // 带错误信息
 * <PasswordInput 
 *   label="确认密码" 
 *   value={confirmPassword}
 *   onChange={(e) => setConfirmPassword(e.target.value)}
 *   error={passwordError}
 * />
 * 
 * // 带描述信息
 * <PasswordInput 
 *   label="密码"
 *   description="密码必须包含大小写字母、数字和特殊字符"
 *   placeholder="请输入密码"
 * />
 * 
 * // 注册表单中的密码确认
 * <PasswordInput 
 *   label="确认密码"
 *   placeholder="请再次输入密码"
 *   error={password !== confirmPassword ? "两次输入的密码不一致" : null}
 * />
 * ```
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  description,
  error,
  required = false,
  disabled = false,
  size = 'md',
  visible = true,
  visibilityToggleIcon,
  className,
  ...props
}) => {
  return (
    <MantinePasswordInput
      label={label}
      placeholder={placeholder}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      size={size}
      visible={visible}
      visibilityToggleIcon={visibilityToggleIcon}
      className={className}
      {...props}
    />
  );
};

// 默认导出
export default PasswordInput; 