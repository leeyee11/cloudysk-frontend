import path from 'path';
import { useModel } from '@umijs/max';
import { notification } from 'antd';
import { putEmptyFolder, putPlainFile } from '@/services/FileController';

const p = path;

export const enum CreateTypes {
  File = 'File',
  Folder = 'Folder',
}

export const useCreator = () => {
  const { refresh } = useModel('global');
  const { requestAnswer, state } = useModel('prompt');

  const createPlainFile = async (path: string, name: string) => {
    return putPlainFile({ path: p.resolve(path, name) }).then((result) => {
      if (!result.success && result.errorMessage) {
        notification.error({
          message: `Failed to create file: ${name}`,
          description: result.errorMessage,
        });
      }
      return result;
    });
  };

  const createEmptyFolder = async (path: string, name: string) => {
    return putEmptyFolder({ path: p.resolve(path, name) }).then((result) => {
      if (!result.success && result.errorMessage) {
        notification.error({
          message: `Failed to create folder: ${name}`,
          description: result.errorMessage,
        });
      }
      return result;
    });
  };

  const openCreator = async (type: CreateTypes, path: string) => {
    const currPath = path;
    try {
      const answer = await requestAnswer({
        title: `Create New ${type}`,
      });
      if (type === CreateTypes.File) {
        createPlainFile(currPath, answer).then(refresh);
      } else if (type === CreateTypes.Folder) {
        createEmptyFolder(currPath, answer).then(refresh);
      }
    } catch (e) {}
  };

  return { openCreator, state };
};

export default useCreator;
