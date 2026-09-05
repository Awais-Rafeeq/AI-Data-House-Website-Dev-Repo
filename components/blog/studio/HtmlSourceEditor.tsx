import React, { useEffect, useRef } from 'react';
import { EditorState, type Extension } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { html as htmlLang } from '@codemirror/lang-html';

/**
 * The HTML source view: a real code editor, not a textarea.
 *
 * `basicSetup` is what buys most of the requirements in one import — line
 * numbers, syntax highlighting, bracket and tag matching, auto-indent, code
 * folding, undo history, multiple selections and the Ctrl/Cmd-F search panel.
 * Everything below it is theming and the bridge back to React state.
 *
 * CodeMirror owns its own DOM and its own document, so the value is pushed in
 * only when it differs from what the editor already has (below) — otherwise
 * every keystroke would round-trip through React and reset the cursor.
 */

interface HtmlSourceEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** Shown to screen readers as the editing surface's name. */
  ariaLabel?: string;
}

/** Light theme tuned to the studio's surfaces rather than CodeMirror's default. */
const studioTheme: Extension = EditorView.theme({
  '&': {
    fontSize: '13px',
    height: '100%',
    backgroundColor: '#ffffff',
    color: '#0f172a',
  },
  '.cm-scroller': {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    lineHeight: '1.65',
    overflow: 'auto',
  },
  '.cm-content': { padding: '18px 0' },
  '.cm-gutters': {
    backgroundColor: '#f8fafc',
    color: '#94a3b8',
    border: 'none',
    borderRight: '1px solid #e2e8f0',
  },
  '.cm-activeLineGutter': { backgroundColor: '#f1f5f9', color: '#475569' },
  '.cm-activeLine': { backgroundColor: '#f8fafc80' },
  '&.cm-focused': { outline: 'none' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#d1fae5',
  },
  '.cm-cursor': { borderLeftColor: '#1a7a3c', borderLeftWidth: '2px' },
  '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': {
    backgroundColor: '#dcfce7',
    outline: '1px solid #86efac',
  },
  '.cm-panels': { backgroundColor: '#f8fafc', color: '#0f172a', border: 'none' },
  '.cm-panels.cm-panels-bottom': { borderTop: '1px solid #e2e8f0' },
  '.cm-searchMatch': { backgroundColor: '#fef08a' },
  '.cm-searchMatch.cm-searchMatch-selected': { backgroundColor: '#fbbf24' },
  '.cm-tooltip': { border: '1px solid #e2e8f0', backgroundColor: '#ffffff' },
}, { dark: false });

const HtmlSourceEditor: React.FC<HtmlSourceEditorProps> = ({ value, onChange, ariaLabel }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  // Read inside the update listener, so the listener never goes stale without
  // having to tear the editor down and rebuild it when the callback changes.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const view = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          htmlLang({ matchClosingTags: true, autoCloseTags: true }),
          studioTheme,
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          EditorView.lineWrapping,
          keymap.of([{
            // Tab indents rather than leaving the editor, but only while the
            // author is actually editing — Escape first restores tab-to-next
            // for keyboard navigation.
            key: 'Escape',
            run: (v) => { v.contentDOM.blur(); return true; },
          }]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChangeRef.current(update.state.doc.toString());
          }),
          EditorView.contentAttributes.of({
            'aria-label': ariaLabel || 'HTML source',
            role: 'textbox',
          }),
        ],
      }),
    });
    viewRef.current = view;

    return () => { view.destroy(); viewRef.current = null; };
    // Built once. The document is kept in sync by the effect below instead, so
    // that typing does not rebuild the editor and lose the cursor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push in changes that came from somewhere else (the visual tab, a restored
  // draft). Comparing against the live document first is what stops this from
  // firing on the editor's own keystrokes.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current === value) return;
    view.dispatch({
      changes: { from: 0, to: current.length, insert: value },
      // Keep the caret in range rather than snapping to the end of a long doc.
      selection: { anchor: Math.min(view.state.selection.main.anchor, value.length) },
    });
  }, [value]);

  return <div ref={hostRef} className="h-full min-h-0 overflow-hidden text-left" />;
};

export default HtmlSourceEditor;
