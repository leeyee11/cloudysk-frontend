import { useEffect, useState } from 'react';
import { queryMarkers } from '@/services/BookmarkController';
import type { FileStats } from 'typings';

type FileOverviewState =
  | (FileStats & {
      children?: FileStats[];
      path: string;
      starId?: number;
    })
  | null;

const useOverview = () => {
  const [overview, setOverview] = useState<FileOverviewState>(null);
  useEffect(() => {
    if (overview?.path) {
      queryMarkers({ path: overview?.path }).then((result) => {
        const starId = result.data?.find(
          (marker) => marker.collection === 'star',
        )?._id;
        setOverview({ ...overview, starId });
      });
    }
  }, [overview?.path]);

  return {
    overview,
    setOverview,
  };
};

export default useOverview;
