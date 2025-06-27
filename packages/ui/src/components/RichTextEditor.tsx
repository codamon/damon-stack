import React from 'react';
import { RichTextEditor as MantineRichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Box, Stack } from '@mantine/core';

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
  /** 工具栏控制选项 */
  toolbarControls?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    clearFormatting?: boolean;
    highlight?: boolean;
    code?: boolean;
    codeBlock?: boolean;
    blockquote?: boolean;
    hr?: boolean;
    bulletList?: boolean;
    orderedList?: boolean;
    subscript?: boolean;
    superscript?: boolean;
    link?: boolean;
    unlink?: boolean;
    image?: boolean;
    alignLeft?: boolean;
    alignCenter?: boolean;
    alignRight?: boolean;
    alignJustify?: boolean;
    h1?: boolean;
    h2?: boolean;
    h3?: boolean;
    h4?: boolean;
    h5?: boolean;
    h6?: boolean;
  };
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
  toolbarControls = {},
}: RichTextEditorProps) {
  // 默认工具栏控制选项
  const defaultToolbarControls = {
    bold: true,
    italic: true,
    underline: true,
    strikethrough: true,
    clearFormatting: true,
    highlight: true,
    code: true,
    codeBlock: true,
    blockquote: true,
    hr: true,
    bulletList: true,
    orderedList: true,
    subscript: true,
    superscript: true,
    link: true,
    unlink: true,
    image: true,
    alignLeft: true,
    alignCenter: true,
    alignRight: true,
    alignJustify: true,
    h1: true,
    h2: true,
    h3: true,
    h4: false,
    h5: false,
    h6: false,
    ...toolbarControls,
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !readOnly && !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // 当外部 value 变化时更新编辑器内容
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  // 图片插入处理函数
  const handleImageUpload = React.useCallback(() => {
    const url = window.prompt('请输入图片URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <Box className={className}>
      <MantineRichTextEditor
        editor={editor}
        style={{
          minHeight,
          maxHeight,
        }}
        styles={{
          content: {
            minHeight,
            maxHeight,
            overflow: maxHeight ? 'auto' : 'visible',
          },
        }}
      >
        {withToolbar && (
          <MantineRichTextEditor.Toolbar sticky stickyOffset={60}>
            {/* 标题控制 */}
            {(defaultToolbarControls.h1 || defaultToolbarControls.h2 || defaultToolbarControls.h3 || 
              defaultToolbarControls.h4 || defaultToolbarControls.h5 || defaultToolbarControls.h6) && (
              <MantineRichTextEditor.ControlsGroup>
                {defaultToolbarControls.h1 && <MantineRichTextEditor.H1 />}
                {defaultToolbarControls.h2 && <MantineRichTextEditor.H2 />}
                {defaultToolbarControls.h3 && <MantineRichTextEditor.H3 />}
                {defaultToolbarControls.h4 && <MantineRichTextEditor.H4 />}
                {defaultToolbarControls.h5 && <MantineRichTextEditor.H5 />}
                {defaultToolbarControls.h6 && <MantineRichTextEditor.H6 />}
              </MantineRichTextEditor.ControlsGroup>
            )}

            {/* 基础格式化控制 */}
            {(defaultToolbarControls.bold || defaultToolbarControls.italic || defaultToolbarControls.underline || 
              defaultToolbarControls.strikethrough || defaultToolbarControls.clearFormatting) && (
              <MantineRichTextEditor.ControlsGroup>
                {defaultToolbarControls.bold && <MantineRichTextEditor.Bold />}
                {defaultToolbarControls.italic && <MantineRichTextEditor.Italic />}
                {defaultToolbarControls.underline && <MantineRichTextEditor.Underline />}
                {defaultToolbarControls.strikethrough && <MantineRichTextEditor.Strikethrough />}
                {defaultToolbarControls.clearFormatting && <MantineRichTextEditor.ClearFormatting />}
              </MantineRichTextEditor.ControlsGroup>
            )}

            {/* 高级格式化控制 */}
            {(defaultToolbarControls.highlight || defaultToolbarControls.code || defaultToolbarControls.subscript || 
              defaultToolbarControls.superscript) && (
              <MantineRichTextEditor.ControlsGroup>
                {defaultToolbarControls.highlight && <MantineRichTextEditor.Highlight />}
                {defaultToolbarControls.code && <MantineRichTextEditor.Code />}
                {defaultToolbarControls.subscript && <MantineRichTextEditor.Subscript />}
                {defaultToolbarControls.superscript && <MantineRichTextEditor.Superscript />}
              </MantineRichTextEditor.ControlsGroup>
            )}

            {/* 列表和块级元素控制 */}
            {(defaultToolbarControls.bulletList || defaultToolbarControls.orderedList || 
              defaultToolbarControls.blockquote || defaultToolbarControls.codeBlock || defaultToolbarControls.hr) && (
              <MantineRichTextEditor.ControlsGroup>
                {defaultToolbarControls.bulletList && <MantineRichTextEditor.BulletList />}
                {defaultToolbarControls.orderedList && <MantineRichTextEditor.OrderedList />}
                {defaultToolbarControls.blockquote && <MantineRichTextEditor.Blockquote />}
                {defaultToolbarControls.codeBlock && <MantineRichTextEditor.CodeBlock />}
                {defaultToolbarControls.hr && <MantineRichTextEditor.Hr />}
              </MantineRichTextEditor.ControlsGroup>
            )}

            {/* 链接和图片控制 */}
            {(defaultToolbarControls.link || defaultToolbarControls.unlink || defaultToolbarControls.image) && (
              <MantineRichTextEditor.ControlsGroup>
                {defaultToolbarControls.link && <MantineRichTextEditor.Link />}
                {defaultToolbarControls.unlink && <MantineRichTextEditor.Unlink />}
                {defaultToolbarControls.image && (
                  <MantineRichTextEditor.Control
                    onClick={handleImageUpload}
                    aria-label="插入图片"
                    title="插入图片"
                  >
                    📷
                  </MantineRichTextEditor.Control>
                )}
              </MantineRichTextEditor.ControlsGroup>
            )}

            {/* 文本对齐控制 */}
            {(defaultToolbarControls.alignLeft || defaultToolbarControls.alignCenter || 
              defaultToolbarControls.alignRight || defaultToolbarControls.alignJustify) && (
              <MantineRichTextEditor.ControlsGroup>
                {defaultToolbarControls.alignLeft && <MantineRichTextEditor.AlignLeft />}
                {defaultToolbarControls.alignCenter && <MantineRichTextEditor.AlignCenter />}
                {defaultToolbarControls.alignRight && <MantineRichTextEditor.AlignRight />}
                {defaultToolbarControls.alignJustify && <MantineRichTextEditor.AlignJustify />}
              </MantineRichTextEditor.ControlsGroup>
            )}
          </MantineRichTextEditor.Toolbar>
        )}

        <MantineRichTextEditor.Content 
          style={{ minHeight }}
        />

        {/* 字符计数显示 */}
        {withCharacterCount && (
          <Stack gap="xs" mt="xs">
            <Box style={{ fontSize: '0.875rem', color: 'var(--mantine-color-dimmed)', textAlign: 'right' }}>
              {editor.storage.characterCount?.characters() || 0}
              {maxCharacters && ` / ${maxCharacters}`} 字符
            </Box>
          </Stack>
        )}
      </MantineRichTextEditor>
    </Box>
  );
}

export default RichTextEditor; 