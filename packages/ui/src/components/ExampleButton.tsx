import React from 'react';
import { Button, ButtonProps } from '@mantine/core';

interface ExampleButtonProps extends ButtonProps {
  label?: string;
}

/**
 * 示例按钮组件
 * 这是一个基于 Mantine Button 的扩展组件，用于验证 UI 包配置
 */
const ExampleButton: React.FC<ExampleButtonProps> = ({ 
  label = 'Example Button', 
  children, 
  ...props 
}) => {
  return (
    <Button 
      variant="filled" 
      color="blue" 
      {...props}
    >
      {children || label}
    </Button>
  );
};

export default ExampleButton; 