'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// 确保样式被导入
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
  placeholder?: string;
}

export function SimpleRichTextEditor({ 
  value, 
  onChange, 
  minHeight = 400,
  placeholder = '开始编写内容...'
}: SimpleRichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // 同步外部value变化
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!mounted || !editor) {
    return (
      <Box 
        style={{ 
          minHeight, 
          border: '1px solid var(--mantine-color-gray-3)',
          borderRadius: '4px',
          padding: '16px',
          backgroundColor: 'var(--mantine-color-gray-0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--mantine-color-gray-6)'
        }}
      >
        加载编辑器中...
      </Box>
    );
  }

  return (
    <Box 
      style={{ 
        border: '1px solid var(--mantine-color-gray-3)', 
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        
        <RichTextEditor.Content style={{ minHeight: `${minHeight}px` }} />
      </RichTextEditor>
    </Box>
  );
} 