import { useState, useRef, useEffect } from 'react';
import { getFile } from '@/services/FileController';
import {
  getAudioController,
  type AudioController,
} from '@/services/AudioController';

interface PlayerState {
  status: 'idle' | 'loading' | 'playing' | 'paused';
  path?: string;
  ext?: Record<string, unknown>;
}

const usePlayer = () => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    status: 'idle',
  });
  const blobUrlRef = useRef<string>();
  const audioControllerRef = useRef<AudioController>(getAudioController());

  const setToIdleState = () => setPlayerState({ status: 'idle' });
  const setToPlayingState = () =>
    setPlayerState((state) => ({ ...state, status: 'playing' }));
  const setToPausedState = () =>
    setPlayerState((state) => ({ ...state, status: 'paused' }));
  const setToLoadingState = (path: string) =>
    setPlayerState({ path, status: 'loading' });

  const stop = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    setToIdleState();
  };

  useEffect(() => {
    const controller = audioControllerRef.current;
    controller.on('play', setToPlayingState);
    controller.on('end', stop);
    return () => {
      controller.off('play', setToPlayingState);
      controller.off('end', stop);
    };
  });

  const play = async (path: string) => {
    const controller = audioControllerRef.current;
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    const blob = await getFile({ path });
    blobUrlRef.current = URL.createObjectURL(blob);
    setToLoadingState(path);
    try {
      controller.play(blobUrlRef.current);
    } catch (error) {
      stop();
      throw error;
    }
  };

  const pause = () => {
    const controller = audioControllerRef.current;
    controller.pause();
    setToPausedState();
  };

  return {
    playerState,
    play,
    pause,
    stop,
  };
};

export default usePlayer;
