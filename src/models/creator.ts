import path from 'path';
import { useModel } from '@umijs/max';
import { notification } from 'antd';
import { putEmptyFolder, putPlainFile, move } from '@/services/FileController';

const p = path;

export const enum CreateTypes {
  NewFile = 'File',
  NewFolder = 'Folder',
  Rename = 'Rename',
}

export const useCreator = () => {
  const { refresh } = useModel('global');
  const { requestAnswer, state } = useModel('prompt');

  const createPlainFile = (path: string, name: string) => {
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

  const createEmptyFolder = (path: string, name: string) => {
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

  const renameFileOrFolder = (path: string, name: string) => {
    const source = path;
    const parent = p.dirname(path);
    const target = p.resolve(parent, name);
    return move({ source, target, rename: true }).then((result) => {
      if (!result.success && result.errorMessage) {
        notification.error({
          message: `Failed to rename: ${name}`,
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
        title: type === CreateTypes.Rename ? `Rename` : `Create New ${type}`,
      });
      if (type === CreateTypes.NewFile) {
        createPlainFile(currPath, answer).then(refresh);
      } else if (type === CreateTypes.NewFolder) {
        createEmptyFolder(currPath, answer).then(refresh);
      } else if (type === CreateTypes.Rename) {
        renameFileOrFolder(currPath, answer).then(refresh);
      }
    } catch (e) {}
  };

  return { openCreator, state };
};

export default useCreator;
