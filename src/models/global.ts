// 全局共享数据示例
import { BASE_PATH, DEFAULT_FILELIST } from '@/constants';
import { useState, useEffect } from 'react';
import { useModel } from '@umijs/max';
import { getFolder } from '@/services/FileController';
import path from 'path-browserify';
import type { FileStats } from 'typings';

const p = path;

const useFileList = () => {
  const { setOverview } = useModel('overview');
  const [path, setPath] = useState<string>(BASE_PATH);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileStats[]>(DEFAULT_FILELIST);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    setFileList([]);
    setLoading(true);
    getFolder({ path: path })
      .then((result) => {
        if (result.success && result.data) {
          const { children } = result.data;
          setFileList(children);
          setOverview({ ...result.data, path });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [path, lastUpdate]);

  return {
    fileList,
    path,
    loading,
    setLoading,
    refresh: () => setLastUpdate(Date.now()),
    cd: (param: string) => {
      setPath((path) => (p.isAbsolute(param) ? param : p.resolve(path, param)));
    },
  };
};

export default useFileList;
