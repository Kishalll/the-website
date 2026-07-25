/**
 * CodeMirror editor panel — wraps CodeMirror 6 with ZBC styling.
 */

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";

export function EditorPanel({
  value,
  onChange,
  theme,
  fontSize,
  languageExtensions,
  readOnly = false,
}) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    });

    const extensions = [
      lineNumbers(),
      highlightActiveLine(),
      bracketMatching(),
      closeBrackets(),
      indentOnInput(),
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
      highlightSelectionMatches(),
      EditorView.theme({
        "&": { fontSize: `${fontSize}px` },
        ".cm-scroll": { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
      }),
      updateListener,
      EditorState.readOnly.of(readOnly),
      ...(theme === "dark" ? [oneDark] : []),
      ...languageExtensions,
    ];

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, fontSize, languageExtensions, readOnly]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div className="compiler-editor" ref={editorRef} />
  );
}
