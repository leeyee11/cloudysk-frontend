import { useModel } from '@umijs/max';
import { PlayerStatus } from '@/models/audio-player';
import { useContext, useEffect, useMemo, useState } from 'react';
import { RouteContext } from '@ant-design/pro-components';
import {
  StepBackwardOutlined,
  StepForwardOutlined,
  CaretRightOutlined,
  CloseOutlined,
  NotificationOutlined,
  RetweetOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import { Button, Slider, Popover } from 'antd';
import { PlayerState } from '@/models/audio-player';
import path from 'path-browserify';
import Disc from './icons/disc';
import styles from './index.less';
import { notifyError } from '@/utils/error';

const p = path;

interface PlayerDisplayData {
  currentTime: number;
  duration: number;
  volume: number;
  lyric?: string;
}

const twoDigits = (value: number) =>
  value > 10 ? `${~~value}` : `0${~~value}`;
const timeLabelFormatter = (value: number | undefined) =>
  value ? `${twoDigits(value / 60)}:${twoDigits(value % 60)}` : '';
const calcRotateDeg = (displayData: PlayerDisplayData) =>
  ~~((displayData.currentTime / displayData.duration) * 360 * 6);

export const FloatAudioPlayer = () => {
  const { list, state, pause, prev, next, resume, stop, ref, getLyric } =
    useModel('audio-player');
  const [displayData, setDisplayData] = useState<PlayerDisplayData>({
    currentTime: 0,
    duration: 1,
    volume: 1,
  });
  const routeValue = useContext(RouteContext);
  const audioPlayerWidth = useMemo(
    () => `calc(100% - ${routeValue.siderWidth}px)`,
    [routeValue.siderWidth],
  );

  const renderFrame = (state: PlayerState) => {
    const controller = ref.current;
    if (state.status === PlayerStatus.Idle) {
      return;
    }
    requestAnimationFrame(() => {
      setDisplayData({
        currentTime: controller.currentTime,
        duration: controller.audio.duration,
        volume: controller.volume,
        lyric: getLyric(controller.currentTime),
      });
      if (state.status === PlayerStatus.Playing) {
        renderFrame(state);
      }
    });
  };

  useEffect(() => {
    renderFrame(state);
  }, [state]);

  return state.status !== PlayerStatus.Idle ? (
    <div
      className={styles.floatAudioPlayer}
      style={{ width: audioPlayerWidth }}
    >
      <div className={styles.controlButtonGroups}>
        <Button
          className={styles.controlButton}
          shape="circle"
          icon={<StepBackwardOutlined />}
          onClick={notifyError(prev)}
          disabled={list.length === 0}
        />
        {state.status === PlayerStatus.Playing ? (
          <Button
            shape="circle"
            size="large"
            className={styles.controlButton}
            onClick={pause}
            icon={<PauseOutlined style={{ fontSize: 20 }} />}
          />
        ) : (
          <Button
            shape="circle"
            size="large"
            className={styles.controlButton}
            onClick={resume}
            icon={<CaretRightOutlined style={{ fontSize: 20 }} />}
          />
        )}
        <Button
          className={styles.controlButton}
          shape="circle"
          icon={<StepForwardOutlined />}
          onClick={notifyError(next)}
          disabled={list.length === 0}
        />
      </div>
      <div className={styles.audioOverview}>
        <div className={styles.audioAvatarContainer}>
          <div
            className={styles.audioAvatar}
            style={{ transform: `rotate(${calcRotateDeg(displayData)}deg)` }}
            onClick={state.status === PlayerStatus.Playing ? pause : resume}
          >
            <Disc />
          </div>
        </div>
        <div className={styles.audioDetails}>
          <div className={styles.audioHeader}>
            <div className={styles.audioTitle}>
              {state.path && p.basename(state.path).split('.').shift()}
            </div>
            <div className={styles.audioLyric}>{displayData.lyric}</div>
          </div>
          <div className={styles.audioProgression}>
            <div className={styles.slider}>
              <Slider
                tooltip={{ formatter: timeLabelFormatter }}
                min={0}
                max={
                  isNaN(displayData.duration ?? NaN) ? 1 : displayData.duration
                }
                step={0.01}
                onChange={(value) => (ref.current.currentTime = value)}
                value={displayData.currentTime}
              />
            </div>
            <div className={styles.timing}>
              {`${timeLabelFormatter(
                displayData.currentTime,
              )} / ${timeLabelFormatter(displayData.duration)}`}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controlButtonGroups}>
        <Popover
          trigger="hover"
          content={
            <Slider
              style={{ width: 96 }}
              value={displayData.volume}
              min={0}
              max={1}
              step={0.01}
              tooltip={{ open: false }}
              onChange={(value) => (ref.current.volume = value)}
            />
          }
        >
          <Button
            className={styles.controlButton}
            type="text"
            shape="circle"
            icon={<NotificationOutlined style={{ color: '#555' }} />}
          />
        </Popover>
        <Button
          className={styles.controlButton}
          type="text"
          shape="circle"
          icon={<RetweetOutlined style={{ color: '#555' }} />}
        />
        <Button
          className={styles.controlButton}
          type="text"
          shape="circle"
          icon={<CloseOutlined style={{ color: '#555' }} onClick={stop} />}
        />
      </div>
    </div>
  ) : null;
};
