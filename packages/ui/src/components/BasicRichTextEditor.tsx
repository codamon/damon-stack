'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Group, Button, ActionIcon, FileInput } from '@mantine/core';
import { 
  IconBold, 
  IconItalic, 
  IconUnderline, 
  IconStrikethrough,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconBlockquote,
  IconLink,
  IconUnlink,
  IconPhoto
} from '@tabler/icons-react';

interface BasicRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
  placeholder?: string;
}

export function BasicRichTextEditor({ 
  value, 
  onChange, 
  minHeight = 400,
  placeholder = '开始编写内容...'
}: BasicRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEmpty, setIsEmpty] = useState(!value || value === '<p></p>' || value === '');

  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      setIsEmpty(!value || value === '<p></p>' || value === '');
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleChange();
  };

  const handleChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setIsEmpty(!html || html === '<br>' || html === '');
    }
  };

  const formatBlock = (tag: string) => {
    execCommand('formatBlock', tag);
  };

  const insertLink = () => {
    const url = prompt('请输入链接地址:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleImageUpload = (file: File | null) => {
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 检查文件大小 (限制为5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片文件大小不能超过5MB');
      return;
    }

    // 创建FileReader来读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      insertImage(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const insertImage = (imageUrl: string) => {
    // 获取当前选区
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      editorRef.current?.focus();
    }

    // 创建图片HTML
    const imgHtml = `<img src="${imageUrl}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="插入的图片" />`;
    
    // 插入图片
    execCommand('insertHTML', imgHtml);
  };

  const handleInsertImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box style={{ position: 'relative' }}>
      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
      />

      {/* 工具栏 */}
      <Box 
        style={{ 
          border: '1px solid var(--mantine-color-gray-3)', 
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0',
          backgroundColor: 'var(--mantine-color-gray-0)',
          padding: '8px'
        }}
      >
        <Group gap="xs">
          <Group gap={4}>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={() => execCommand('bold')}
              title="加粗"
            >
              <IconBold size={16} />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={() => execCommand('italic')}
              title="斜体"
            >
              <IconItalic size={16} />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={() => execCommand('underline')}
              title="下划线"
            >
              <IconUnderline size={16} />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={() => execCommand('strikethrough')}
              title="删除线"
            >
              <IconStrikethrough size={16} />
            </ActionIcon>
          </Group>

          <Box style={{ width: 1, height: 20, backgroundColor: 'var(--mantine-color-gray-3)' }} />

          <Group gap={4}>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={() => formatBlock('H1')}
              title="标题1"
            >
              <IconH1 size={16} />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={() => formatBlock('H2')}
              title="标题2"
            >
              <IconH2 size={16} />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={() => formatBlock('H3')}
              title="标题3"
            >
              <IconH3 size={16} />
            </ActionIcon>
          </Group>

          <Box style={{ width: 1, height: 20, backgroundColor: 'var(--mantine-color-gray-3)' }} />

          <Group gap={4}>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={() => execCommand('insertUnorderedList')}
              title="无序列表"
            >
              <IconList size={16} />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={() => execCommand('insertOrderedList')}
              title="有序列表"
            >
              <IconListNumbers size={16} />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={() => formatBlock('BLOCKQUOTE')}
              title="引用"
            >
              <IconBlockquote size={16} />
            </ActionIcon>
          </Group>

          <Box style={{ width: 1, height: 20, backgroundColor: 'var(--mantine-color-gray-3)' }} />

          <Group gap={4}>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={insertLink}
              title="插入链接"
            >
              <IconLink size={16} />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={() => execCommand('unlink')}
              title="移除链接"
            >
              <IconUnlink size={16} />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={handleInsertImageClick}
              title="插入图片"
            >
              <IconPhoto size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      {/* 编辑区域 */}
      <Box 
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleChange}
        onBlur={handleChange}
        style={{ 
          minHeight: `${minHeight}px`,
          padding: '16px',
          border: '1px solid var(--mantine-color-gray-3)', 
          borderRadius: '0 0 4px 4px',
          backgroundColor: '#fff',
          outline: 'none',
          fontSize: '14px',
          lineHeight: '1.6',
          position: 'relative',
          cursor: 'text'  // 修复光标样式问题
        }}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
      
      {/* 占位符 */}
      {isEmpty && (
        <Box
          style={{
            position: 'absolute',
            top: '58px',  // 调整位置适配工具栏
            left: '16px',
            color: 'var(--mantine-color-gray-5)',
            pointerEvents: 'none'
          }}
        >
          {placeholder}
        </Box>
      )}
    </Box>
  );
}

export default BasicRichTextEditor;

export type { BasicRichTextEditorProps }; 