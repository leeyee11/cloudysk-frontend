import { useState } from 'react';
import type { FileStats } from 'typings';

type FilePreviewState =
  | (FileStats & {
      children?: FileStats[];
      path: string;
    })
  | null;

const usePreview = () => {
  const [preview, setPreview] = useState<FilePreviewState>(null);

  return {
    preview,
    setPreview,
  };
};

export default usePreview;
