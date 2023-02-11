import { useState, useRef, useEffect } from 'react';
import { getFile } from '@/services/FileController';
import {
  getAudioController,
  type AudioController,
} from '@/services/AudioController';
import path from 'path-browserify';
import LyricHelper from '@/utils/lyric';

const p = path;

export const enum PlayerStatus {
  Idle = 'Idle',
  Loading = 'Loading',
  Playing = 'Playing',
  Pause = 'Paused',
}

export interface PlayerState {
  status: PlayerStatus;
  path?: string;
  lyric?: string;
  ext?: Record<string, unknown>;
}

export interface PlayListState {
  list: string[];
  cursor: number;
}

const checkPlaylist = (list: string[]) => {
  if (list.length === 0) {
    throw new Error('Playlist is empty');
  }
};

const loadResources = (path: string) => {
  const lrcPath = path.replace(p.extname(path), '.lrc');
  return Promise.allSettled([
    getFile({ path }),
    getFile({ path: lrcPath }),
  ]).then(([audioResp, lyricResp]) => {
    if (audioResp.status === 'rejected') {
      throw audioResp.reason;
    }
    if (lyricResp.status === 'rejected') {
      return [audioResp.value];
    }
    return [audioResp.value, lyricResp.value];
  });
};

const usePlayer = () => {
  const [listState, setListState] = useState<PlayListState>({
    list: [],
    cursor: 0,
  });
  const [state, setPlayerState] = useState<PlayerState>({
    status: PlayerStatus.Idle,
  });
  const audioUrlRef = useRef<string>();
  const lyricHelperRef = useRef<LyricHelper>();
  const audioControllerRef = useRef<AudioController>(getAudioController());

  const setToIdleState = () => setPlayerState({ status: PlayerStatus.Idle });
  const setToPlayingState = () =>
    setPlayerState((state) => ({ ...state, status: PlayerStatus.Playing }));
  const setToPausedState = () =>
    setPlayerState((state) => ({ ...state, status: PlayerStatus.Pause }));
  const setToLoadingState = (path: string) =>
    setPlayerState({ path, status: PlayerStatus.Loading });

  const stop = () => {
    const controller = audioControllerRef.current;
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }
    controller.stop();
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
  }, []);

  const play = async (path: string) => {
    const controller = audioControllerRef.current;
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }
    const [audioBlob, lyricBlob] = await loadResources(path);
    lyricHelperRef.current = LyricHelper.build(
      lyricBlob ? await lyricBlob.text() : undefined,
    );
    audioUrlRef.current = URL.createObjectURL(audioBlob);
    setToLoadingState(path);
    try {
      controller.play(audioUrlRef.current);
    } catch (error) {
      stop();
      throw error;
    }
  };

  useEffect(() => {
    const { list, cursor } = listState;
    if (list[cursor]) {
      play(list[cursor]);
    }
  }, [listState]);

  const playList = async (pathes: string[], index: number) => {
    setListState({ list: pathes, cursor: index });
  };

  const resume = () => {
    const controller = audioControllerRef.current;
    controller.resume();
    setToPlayingState();
  };

  const pause = () => {
    const controller = audioControllerRef.current;
    controller.pause();
    setToPausedState();
  };

  const adjust = (delta: -1 | 1) => {
    const { list, cursor } = listState;
    checkPlaylist(list);
    const nextCursor = (cursor + delta + list.length) % list.length;
    setListState((state) => ({ ...state, cursor: nextCursor }));
  };

  const next = () => adjust(1);

  const prev = () => adjust(-1);

  const getLyric = (currentTime: number) =>
    lyricHelperRef.current?.getLine(currentTime);

  const getFullLyrics = () => lyricHelperRef.current?.getFullLyrics();

  return {
    listState,
    state,
    pause,
    stop,
    resume,
    next,
    prev,
    getLyric,
    getFullLyrics,
    playList,
    ref: audioControllerRef,
  };
};

export default usePlayer;
