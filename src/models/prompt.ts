import { useState } from 'react';

interface PromptOptions {
  title: string;
  description?: string;
}

export interface PromptState {
  title: string;
  description: string;
  promptOpen: boolean;
  onOk: (answer: string) => void;
  onCancel: (reason?: string) => void;
}

const initialState = {
  title: '',
  description: '',
  promptOpen: false,
  onOk: () => {},
  onCancel: () => {},
};

const usePrompt = () => {
  const [state, setState] = useState<PromptState>(initialState);

  const requestAnswer = (options: PromptOptions): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      setState((state) => ({
        ...state,
        ...options,
        promptOpen: true,
        onOk: (answer: string) => resolve(answer),
        onCancel: reject,
      }));
    }).finally(() => setState((state) => ({ ...state, ...initialState })));
  };

  return {
    state,
    requestAnswer,
  };
};

export default usePrompt;
