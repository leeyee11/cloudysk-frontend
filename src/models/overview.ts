import { useState } from 'react';
import type { FileStats } from 'typings';

type FileOverviewState =
  | (FileStats & {
      children?: FileStats[];
      path: string;
    })
  | null;

const useOverview = () => {
  const [overview, setOverview] = useState<FileOverviewState>(null);

  return {
    overview,
    setOverview,
  };
};

export default useOverview;
