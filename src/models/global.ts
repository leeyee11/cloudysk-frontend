// 全局共享数据示例
import { BASE_PATH, DEFAULT_FILELIST } from '@/constants';
import { useState, useEffect } from 'react';
import { useModel, history } from '@umijs/max';
import { getFolder, getCollection } from '@/services/FileController';
import path from 'path-browserify';
import type { FileStats } from 'typings';

const p = path;

type LocationCursor = {
  path: string;
};

type Collection = 'star' | 'audio' | 'video';

type CollectionCursor = {
  collection: Collection;
};

type Cursor = LocationCursor | CollectionCursor;

const useFileList = () => {
  const { setOverview } = useModel('overview');
  const [cursor, setCursor] = useState<Cursor>({ path: BASE_PATH });
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileStats[]>(DEFAULT_FILELIST);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const loadFileListByPath = (path: string) => {
    setFileList([]);
    setLoading(true);
    getFolder({ path })
      .then((result) => {
        if (result.success && result.data) {
          const { children } = result.data;
          setFileList(children);
          setOverview({ ...result.data, path });
        }
      })
      .finally(() => {
        if (history.location.pathname !== '/file') {
          history.push('/file');
        }
        setLoading(false);
      });
  };

  const loadFileListByCollection = (collection: string) => {
    setFileList([]);
    setLoading(true);
    getCollection({ name: collection })
      .then((result) => {
        if (result.success && result.data) {
          const { children } = result.data;
          setFileList(children);
          setOverview(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if ((cursor as LocationCursor).path) {
      loadFileListByPath((cursor as LocationCursor).path);
    }
    if ((cursor as CollectionCursor).collection) {
      loadFileListByCollection((cursor as CollectionCursor).collection);
    }
  }, [cursor, lastUpdate]);

  return {
    fileList,
    path: (cursor as LocationCursor).path,
    loading,
    setLoading,
    refresh: () => setLastUpdate(Date.now()),
    cd: (param: string) => {
      setCursor(
        (cursor: Cursor) =>
          ({
            path: p.isAbsolute(param)
              ? param
              : p.resolve((cursor as LocationCursor).path, param),
          } as Cursor),
      );
    },
    view: (collection: Collection) => {
      setCursor({ collection } as Cursor);
    },
  };
};

export default useFileList;
