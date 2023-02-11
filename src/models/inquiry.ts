import path from 'path';
import { useState } from 'react';
import { notification } from 'antd';
import { putEmptyFolder, putPlainFile, move } from '@/services/FileController';
import { favorite } from '@/utils/mark';

const p = path;

export const enum CreateTypes {
  NewFile = 'File',
  NewFolder = 'Folder',
  Rename = 'Rename',
  Favorite = 'Favorite',
}

export const enum PromptTypes {
  Input = 'Input',
  Select = 'Select',
}

interface PromptConfig {
  title: string;
  defaultValue?: string;
  description?: string;
  type: PromptTypes;
}

export interface PromptState {
  title: string;
  description: string;
  defaultValue?: string;
  promptOpen: boolean;
  type: PromptTypes;
  onOk: (answer: string) => void;
  onCancel: (reason?: string) => void;
}

const initialState = {
  title: '',
  description: '',
  defaultValue: '',
  promptOpen: false,
  type: PromptTypes.Input,
  onOk: () => {},
  onCancel: () => {},
};

const usePrompt = () => {
  const [state, setState] = useState<PromptState>(initialState);

  const requestAnswer = (config: PromptConfig): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      setState((state) => ({
        ...state,
        ...config,
        promptOpen: true,
        onOk: (answer: string) => resolve(answer),
        onCancel: reject,
      }));
    }).finally(() => setState((state) => ({ ...state, ...initialState })));
  };

  const requestChoices = (config: PromptConfig): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      setState((state) => ({
        ...state,
        ...config,
        promptOpen: true,
        onOk: (choices: string) => resolve(choices),
        onCancel: reject,
      }));
    }).finally(() => setState((state) => ({ ...state, ...initialState })));
  };

  return {
    state,
    requestAnswer,
    requestChoices,
  };
};

export const useInquiry = () => {
  const { requestAnswer, requestChoices, state } = usePrompt();

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

  const favoriteFile = (path: string, answer: string) => {
    const categories = answer.length > 0 ? answer.split('\n') : [];
    return favorite(path, categories);
  };

  const openInquiry = async (
    type: CreateTypes,
    path: string,
    defaultValue?: string,
  ) => {
    const currPath = path;
    try {
      let answer;
      if (type === CreateTypes.Rename) {
        const basename = p.basename(path);
        answer = await requestAnswer({
          type: PromptTypes.Input,
          title: 'Rename',
          defaultValue: basename,
        });
      } else if (type === CreateTypes.Favorite) {
        answer = await requestChoices({
          type: PromptTypes.Select,
          title: 'Favorite',
          defaultValue,
        });
      } else {
        answer = await requestAnswer({
          type: PromptTypes.Input,
          title: `Create New ${type}`,
        });
      }
      if (type === CreateTypes.NewFile) {
        return createPlainFile(currPath, answer);
      } else if (type === CreateTypes.NewFolder) {
        return createEmptyFolder(currPath, answer);
      } else if (type === CreateTypes.Rename) {
        return renameFileOrFolder(currPath, answer);
      } else if (type === CreateTypes.Favorite) {
        return favoriteFile(currPath, answer);
      }
    } catch (e) {}
  };

  return {
    openInquiry,
    state,
  };
};

export default useInquiry;
