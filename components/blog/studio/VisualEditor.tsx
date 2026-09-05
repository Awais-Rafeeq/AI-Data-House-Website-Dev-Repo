import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TableKit } from '@tiptap/extension-table';
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Code, Code2, Heading2, Heading3, Heading4,
  ImageIcon, Italic, Link2, Link2Off, List, ListOrdered, Loader2, Minus, Quote, Redo2,
  Strikethrough, Table as TableIcon, Underline as UnderlineIcon, Undo2,
} from 'lucide-react';
import { IMAGE_MAX_BYTES, resolveImageType, uploadCoverImage } from '../../../lib/blogStore';

/**
 * The studio's visual (WYSIWYG) authoring surface.
 *
 * It writes HTML, and HTML is the studio's single source of truth for the
 * article body — the same string the HTML-source tab edits. That is deliberate:
 * it means switching tabs is just two views of one value, rather than two
 * parallel documents that have to be reconciled.
 *
 * Tiptap's schema is not the source of truth, only an editor for it. Anything
 * this editor cannot represent is preserved by keeping the author in HTML mode
 * instead of round-tripping through here (see BlogSubmitPage) — the editor is
 * never allowed to silently rewrite markup it does not understand.
 */

interface VisualEditorProps {
  html: string;
  onChange: (html: string) => void;
  /** Surfaced to the page so an upload failure is reported in one place. */
  onError: (message: string) => void;
}

const btn = (active?: boolean) =>
  `inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-lg text-sm transition-colors ${
    active
      ? 'bg-emerald-600 text-white'
      : 'text-slate-500 hover:bg-white hover:text-slate-900'
  }`;

const Divider = () => <span className="w-px h-5 bg-slate-200 mx-1" aria-hidden="true" />;

const ToolbarButton: React.FC<{
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}> = ({ onClick, active, disabled, label, children }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()} // keep the selection while clicking
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    aria-pressed={active}
    title={label}
    className={`${btn(active)} disabled:opacity-30 disabled:hover:bg-transparent`}
  >
    {children}
  </button>
);

const Toolbar: React.FC<{ editor: Editor; onImage: () => void; uploading: boolean }> = ({
  editor, onImage, uploading,
}) => {
  // Re-render the toolbar on every selection/content change so the active
  // states stay truthful; Tiptap does not do this for us.
  const [, force] = useState(0);
  useEffect(() => {
    const rerender = () => force((n) => n + 1);
    editor.on('transaction', rerender);
    return () => { editor.off('transaction', rerender); };
  }, [editor]);

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const input = window.prompt('Link URL', previous || 'https://');
    if (input === null) return;
    const url = input.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    // Only ever create a link the article sanitiser would also keep.
    if (!/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url)) {
      window.alert('Links must start with https://, mailto:, tel:, / or #.');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 px-3 py-2 bg-slate-50/95 backdrop-blur border-b border-slate-200">
      <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo2 size={15} /></ToolbarButton>
      <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo2 size={15} /></ToolbarButton>
      <Divider />

      <ToolbarButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={15} /></ToolbarButton>
      <ToolbarButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={15} /></ToolbarButton>
      <ToolbarButton label="Heading 4" active={editor.isActive('heading', { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 size={15} /></ToolbarButton>
      <ToolbarButton label="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
        <span className="text-xs font-black">P</span>
      </ToolbarButton>
      <Divider />

      <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={15} /></ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={15} /></ToolbarButton>
      <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={15} /></ToolbarButton>
      <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={15} /></ToolbarButton>
      <ToolbarButton label="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}><Code size={15} /></ToolbarButton>
      <Divider />

      <ToolbarButton label="Add or edit link" active={editor.isActive('link')} onClick={setLink}><Link2 size={15} /></ToolbarButton>
      <ToolbarButton label="Remove link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}><Link2Off size={15} /></ToolbarButton>
      <Divider />

      <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={15} /></ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></ToolbarButton>
      <ToolbarButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={15} /></ToolbarButton>
      <ToolbarButton label="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 size={15} /></ToolbarButton>
      <Divider />

      <ToolbarButton label="Insert image" onClick={onImage} disabled={uploading}>
        {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImageIcon size={15} />}
      </ToolbarButton>
      <ToolbarButton label="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={15} /></ToolbarButton>
      <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={15} /></ToolbarButton>
      <Divider />

      <ToolbarButton label="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft size={15} /></ToolbarButton>
      <ToolbarButton label="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter size={15} /></ToolbarButton>
      <ToolbarButton label="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight size={15} /></ToolbarButton>

      {editor.isActive('table') && (
        <>
          <Divider />
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().addRowAfter().run()} className={btn()}>+ Row</button>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().addColumnAfter().run()} className={btn()}>+ Col</button>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().deleteTable().run()} className={`${btn()} hover:!text-rose-600`}>Delete table</button>
        </>
      )}
    </div>
  );
};

const VisualEditor: React.FC<VisualEditorProps> = ({ html, onChange, onError }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  // Guards the external-sync effect from firing on the editor's own output.
  const lastEmitted = useRef(html);

  const editor = useEditor({
    // Tiptap renders into a ref, so let React commit first — this is what keeps
    // React 18's StrictMode double-mount from warning about flushSync.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'nofollow ugc noopener noreferrer', target: '_blank' } },
      }),
      Image.configure({ HTMLAttributes: { loading: 'lazy', decoding: 'async' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TableKit.configure({ table: { resizable: true } }),
    ],
    content: html,
    editorProps: {
      attributes: {
        class: 'article-html focus:outline-none min-h-[24rem]',
        'aria-label': 'Article body',
      },
    },
    onUpdate: ({ editor: e }) => {
      const next = e.getHTML();
      lastEmitted.current = next;
      onChange(next);
    },
  });

  // Pull in changes made elsewhere (the HTML tab, a restored draft) without
  // clobbering what the author is typing here.
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (html === lastEmitted.current) return;
    lastEmitted.current = html;
    editor.commands.setContent(html, { emitUpdate: false });
  }, [editor, html]);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file || !editor) return;
    if (!resolveImageType(file)) { onError('Use a JPG, PNG, WebP or AVIF image.'); return; }
    if (file.size > IMAGE_MAX_BYTES) {
      onError(`That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 3 MB.`);
      return;
    }
    setUploading(true);
    // Same bucket and same rules as the cover image — one upload path, not two.
    const result = await uploadCoverImage(file);
    setUploading(false);
    if (result.ok && result.url) {
      editor.chain().focus().setImage({ src: result.url, alt: '' }).run();
    } else {
      onError(result.error || 'Image upload failed.');
    }
  }, [editor, onError]);

  if (!editor) {
    return (
      <div className="grid place-items-center h-96 text-slate-400" role="status">
        <Loader2 size={20} className="animate-spin" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <Toolbar editor={editor} uploading={uploading} onImage={() => fileRef.current?.click()} />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={(e) => { void handleFile(e.target.files?.[0]); e.target.value = ''; }}
      />
      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default VisualEditor;
