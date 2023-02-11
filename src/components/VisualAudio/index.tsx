import { useRef, LegacyRef, useEffect } from 'react';
import { useModel } from '@umijs/max';
import VisualController, {
  type VisualOptions,
} from '@/services/VisuaController';
import styles from './index.less';
import classNames from 'classnames';

interface VisualAudioProps {
  className: string;
}

const defaultVisualOptions = {
  type: 'circle',
  color: 'rgb(255,200,200)',
  shadowColor: 'rgb(255,220,220)',
  shadowSize: 0,
  lineWidth: 7,
  spaceBetween: 3,
  speed: 5,
  textSize: 16,
  textBetween: 8,
  textColor: 'rgb(255,255,255)',
  textShadow: 2,
};

const VisualAudio = ({ className }: VisualAudioProps) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const controller = useRef<VisualController>();
  const { ref: auidoControllerRef, getFullLyrics } = useModel('audio-player');

  useEffect(() => {
    controller.current = new VisualController(
      canvasRef.current as HTMLCanvasElement,
      defaultVisualOptions as VisualOptions,
    );
    controller.current.visulizeAudio(auidoControllerRef.current, getFullLyrics);
    const canvasParent = canvasRef.current!.parentElement;
    const observer = new ResizeObserver((entries) => {
      const lastEntry = entries.pop();
      if (!lastEntry) return;
      if (!canvasRef.current) return;
      canvasRef.current.width = lastEntry.contentRect.width;
      canvasRef.current.height = lastEntry.contentRect.height;
    });
    if (canvasParent) {
      observer.observe(canvasParent);
    }

    return () => {
      if (canvasParent) {
        observer.unobserve(canvasParent);
      }
    };
  }, []);

  return (
    <div className={classNames(className, styles.canvasConatainer)}>
      <canvas ref={canvasRef as LegacyRef<HTMLCanvasElement>}>
        {`You browser don't support canvas`}
      </canvas>
    </div>
  );
};

export default VisualAudio;
