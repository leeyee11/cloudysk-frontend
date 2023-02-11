import { useEffect, useState } from 'react';
import { queryMarkers } from '@/services/BookmarkController';
import type { FileStats } from 'typings';

type FileOverviewState =
  | (FileStats & {
      children?: FileStats[];
      path: string;
      starId?: string;
    })
  | null;

const useOverview = () => {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [overview, setOverview] = useState<FileOverviewState>(null);

  useEffect(() => {
    if (overview?.path) {
      queryMarkers({ path: overview?.path }).then((result) => {
        const starId = result.data?.find(
          (marker: any) => marker.collection === 'star',
        )?.id;
        setOverview({ ...overview, starId });
      });
    }
  }, [overview?.path, lastUpdate]);

  return {
    overview,
    setOverview,
    refresh: () => setLastUpdate(Date.now()),
  };
};

export default useOverview;
