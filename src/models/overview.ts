import { useEffect, useState } from 'react';
import { queryMarkers } from '@/services/BookmarkController';
import type { FileStats } from 'typings';

type FileOverviewState =
  | (FileStats & {
      children?: FileStats[];
      path: string;
      starred?: boolean;
      playlist?: string[];
    })
  | null;

const useOverview = () => {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [overview, setOverview] = useState<FileOverviewState>(null);

  useEffect(() => {
    if (overview?.path) {
      queryMarkers({ path: overview?.path }).then((result) => {
        const starred = result.data?.some(
          (marker: any) => marker.collection === 'star',
        );
        const playlist = result.data
          ?.filter((marker: any) => marker.collection === 'audio')
          .map((marker: any) => marker.category);
        setOverview({ ...overview, starred, playlist });
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
