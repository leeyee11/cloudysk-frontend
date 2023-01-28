// 全局共享数据示例
import { BASE_PATH, DEFAULT_FILELIST } from '@/constants';
import { useState, useEffect } from 'react';
import { getFileList } from '@/services/FileController';
import path from 'path-browserify';
import type { FileStats } from 'typings';

const p = path;

const useFileList = () => {
  const [path, setPath] = useState<string>(BASE_PATH);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileStats[]>(DEFAULT_FILELIST);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    setFileList([]);
    setLoading(true);
    getFileList({ path: path })
      .then((result) => {
        if (result.success && result.data) {
          setFileList(result.data);
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
