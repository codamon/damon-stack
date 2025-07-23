'use client';

import React, { useEffect, useState } from 'react';
import { RichTextEditor as MantineRichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Box, Loader, Center } from '@mantine/core';

// 重要：确保样式被导入
import '@mantine/tiptap/styles.css';

export interface RichTextEditorProps {
  /** 初始 HTML 内容 */
  value?: string;
  /** 内容变化回调 */
  onChange?: (html: string) => void;
  /** 编辑器占位符 */
  placeholder?: string;
  /** 是否只读 */
  readOnly?: boolean;
  /** 是否显示工具栏 */
  withToolbar?: boolean;
  /** 最小高度 */
  minHeight?: number;
  /** 最大高度 */
  maxHeight?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 额外的样式类名 */
  className?: string;
  /** 是否显示字符计数 */
  withCharacterCount?: boolean;
  /** 最大字符数 */
  maxCharacters?: number;
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = '开始编写内容...',
  readOnly = false,
  withToolbar = true,
  minHeight = 200,
  maxHeight,
  disabled = false,
  className,
  withCharacterCount = false,
  maxCharacters,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const extensions: any[] = [
    StarterKit,
    Underline,
    Link,
    Superscript,
    Subscript,
    Highlight,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Image,
    Placeholder.configure({ placeholder }),
  ];

  if (withCharacterCount) {
    extensions.push(CharacterCount.configure({ limit: maxCharacters }));
  }

  const editor = useEditor({
    extensions,
    content: value,
    editable: !readOnly && !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // 同步外部value变化
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // 清理
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  // SSR保护
  if (!mounted || !editor) {
    return (
      <Box
        style={{
          minHeight,
          border: '1px solid var(--mantine-color-gray-3)',
          borderRadius: '4px',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Center>
          <Loader size="sm" />
        </Center>
      </Box>
    );
  }

  return (
    <Box className={className}>
      <MantineRichTextEditor editor={editor}>
        {withToolbar && (
          <MantineRichTextEditor.Toolbar sticky stickyOffset={60}>
            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.Bold />
              <MantineRichTextEditor.Italic />
              <MantineRichTextEditor.Underline />
              <MantineRichTextEditor.Strikethrough />
              <MantineRichTextEditor.ClearFormatting />
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.H1 />
              <MantineRichTextEditor.H2 />
              <MantineRichTextEditor.H3 />
              <MantineRichTextEditor.H4 />
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.Blockquote />
              <MantineRichTextEditor.Hr />
              <MantineRichTextEditor.BulletList />
              <MantineRichTextEditor.OrderedList />
              <MantineRichTextEditor.Subscript />
              <MantineRichTextEditor.Superscript />
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.Link />
              <MantineRichTextEditor.Unlink />
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.AlignLeft />
              <MantineRichTextEditor.AlignCenter />
              <MantineRichTextEditor.AlignJustify />
              <MantineRichTextEditor.AlignRight />
            </MantineRichTextEditor.ControlsGroup>
          </MantineRichTextEditor.Toolbar>
        )}

        <MantineRichTextEditor.Content style={{ minHeight }} />
      </MantineRichTextEditor>
    </Box>
  );
}

export default RichTextEditor; 