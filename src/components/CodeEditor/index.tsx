import MonacoEditor from 'react-monaco-editor';
import { useModel } from '@umijs/max';
import { useEffect, useRef } from 'react';
import { debounce } from 'lodash-es';

const GLOBAL_HEADER_HEIGHT = 56;
const PAGE_HEADER_HEIGHT = 111;
const PAGE_CONTAINER_PADDING = 16;
const PAGE_FOOTER_HEIGHT = 64;

const CodeEditor = () => {
  const editorMaxHeight = useRef(720);
  const { previewState, editorRef, containerRef } = useModel('preview');

  const updateEditorHeight = () => {
    const editor = editorRef.current;
    const editorElement = editor?.getDomNode();
    if (!editorElement) {
      return;
    }
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    editorMaxHeight.current =
      document.body.getBoundingClientRect().height -
      (GLOBAL_HEADER_HEIGHT +
        PAGE_HEADER_HEIGHT +
        PAGE_CONTAINER_PADDING +
        PAGE_FOOTER_HEIGHT);
    editorElement.style.width = `${containerWidth - 300 - 12}px`;
    editorElement.style.height = `${editorMaxHeight.current}px`;
    editor.layout();
  };

  const relayoutHandler = debounce(() => {
    requestAnimationFrame(() => {
      updateEditorHeight();
    });
  }, 16);

  useEffect(() => {
    relayoutHandler();
    window.addEventListener('resize', relayoutHandler);
    return () => {
      window.removeEventListener('resize', relayoutHandler);
    };
  }, []);

  return previewState ? (
    <MonacoEditor
      key={previewState.createdTimestamp}
      language="javascript"
      theme="vs-light"
      value={previewState.data}
      options={{ scrollBeyondLastLine: false }}
      editorDidMount={(editor) => {
        editorRef.current = editor;
        updateEditorHeight();
        editor.focus();
      }}
    />
  ) : null;
};

export default CodeEditor;
