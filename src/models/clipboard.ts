import { useState } from 'react';
import { copy, move } from '@/services/FileController';
import type { PathLike } from 'fs-extra';

const enum ClipBoardActions {
  Copy = 'Copy',
  Cut = 'Cut',
}

interface ClipBoardState {
  source: PathLike;
  action: ClipBoardActions;
}

const useClipboard = () => {
  const [state, setState] = useState<ClipBoardState | null>(null);

  return {
    clear: () => setState(null),
    copy: (filePath: PathLike) =>
      setState({ source: filePath, action: ClipBoardActions.Copy }),
    cut: (filePath: PathLike) =>
      setState({ source: filePath, action: ClipBoardActions.Cut }),
    paste: (target: PathLike) => {
      if (state !== null) {
        const { source } = state;
        if (state.action === ClipBoardActions.Copy) {
          return copy({ source, target });
        } else if (state.action === ClipBoardActions.Cut) {
          setState(null);
          return move({ source, target, rename: false });
        }
      }
      return Promise.resolve();
    },
    exist: () => state !== null,
  };
};

export default useClipboard;
