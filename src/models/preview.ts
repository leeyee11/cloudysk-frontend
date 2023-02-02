import { useRef, useState } from 'react';
import { getFile, putPlainFile } from '@/services/FileController';

interface PreviewState {
  data: string | Buffer;
  path: string;
  isEditing: boolean;
  createdTimestamp: number;
}

const usePreview = () => {
  const [previewState, setPreviewState] = useState<PreviewState | null>(null);
  const editorRef = useRef();
  const containerRef = useRef();

  const edit = async (path: string) => {
    const blob = await getFile({ path });
    const text = await blob.text();
    setPreviewState({
      data: text,
      isEditing: true,
      createdTimestamp: Date.now(),
      path,
    });
  };

  const save = async (path: string) => {
    const editor = editorRef.current as any;
    const model = editor.getModel();
    const value = model.getValue();
    const result = putPlainFile({ path }, value);
    return result;
  };

  const hasEdited = () => {
    if (previewState?.isEditing === false) {
      return false;
    }
    const editor = editorRef.current as any;
    const model = editor.getModel();
    const value = model.getValue();
    return value !== previewState?.data;
  };

  return {
    previewState,
    setPreviewState,
    edit,
    save,
    hasEdited,
    editorRef,
    containerRef,
  };
};

export default usePreview;
