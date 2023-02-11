import type { LyricLine } from '@/utils/lyric';
import { AudioController } from './AudioController';

export interface VisualOptions {
  type: 'bar' | 'circle';
  color: string;
  shadowColor: string;
  shadowSize: number;
  lineWidth: number;
  spaceBetween: number;
  speed: number;
  textSize: number;
  textBetween: number;
  textColor: string;
  textShadow: number;
}

class VisualController {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private options: VisualOptions;

  constructor(canvas: HTMLCanvasElement, options: VisualOptions) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.options = options;
  }

  visulizeAudio(
    audioController: AudioController,
    getLyrics: () => LyricLine[] | undefined,
  ) {
    if (audioController.ready) {
      //a buffer to get data
      const data = new Uint8Array(audioController.analyser.frequencyBinCount);
      //store data to buffer
      audioController.analyser.getByteTimeDomainData(data);
      //clear canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      switch (this.options.type) {
        case 'bar':
          this.visulizeBar(data, audioController);
          break;
        case 'circle':
          this.visulizeCircle(data, audioController);
          break;
      }
      this.displayLyric(audioController, getLyrics);
    }

    requestAnimationFrame(() => {
      this.visulizeAudio(audioController, getLyrics);
    });
  }

  visulizeBar(data: Uint8Array, audioController: AudioController) {
    // let step=(parseInt(this.data.length/360)*4)
    let barTotalWidth = this.options.spaceBetween + this.options.lineWidth;
    let barNum = ~~(this.canvas.width / barTotalWidth);
    let step = ~~(data.length / barNum);
    let offset = (this.canvas.width - barNum * barTotalWidth) / 2;
    let barHeight = this.canvas.height / 4;

    this.context.fillStyle = this.options.color;
    for (let i = 0; i < barNum; i++) {
      this.context.fillRect(
        offset + i * barTotalWidth,
        this.canvas.height / 2,
        this.options.lineWidth,
        (-barHeight * (data[i * step] - 128)) / 128 / audioController.volume,
      );
    }
  }

  visulizeCircle(data: Uint8Array, audioController: AudioController) {
    let radius = 10;
    let perAngle = (Math.PI * 2) / 360;
    if (this.canvas.height > this.canvas.width) {
      radius = this.canvas.width / 4;
    } else {
      radius = this.canvas.height / 4;
    }
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
    this.context.shadowColor = this.options.shadowColor;
    this.context.shadowBlur = this.options.shadowSize;
    for (let i = 0; i < data.length; i += ~~(data.length / 360) * 2) {
      let lineLength =
        (radius * ((data[i] - 128) / 128)) / audioController.volume +
        this.options.lineWidth / 2;

      this.context.strokeStyle = this.options.color;
      this.context.lineWidth = this.options.lineWidth;
      this.context.beginPath();
      this.context.moveTo(this.canvas.width / 2, this.canvas.height / 2);
      this.context.lineTo(
        this.canvas.width / 2 +
          Math.sin(
            perAngle * (i - this.options.speed * audioController.currentTime),
          ) *
            (radius + lineLength),
        this.canvas.height / 2 +
          Math.cos(
            perAngle * (i - this.options.speed * audioController.currentTime),
          ) *
            (radius + lineLength),
      );
      this.context.closePath();
      this.context.stroke();
    }
    this.context.shadowBlur = 0;
    this.context.lineWidth = 0;

    this.context.globalCompositeOperation = 'destination-out';
    this.context.arc(
      this.canvas.width / 2,
      this.canvas.height / 2,
      radius,
      0,
      Math.PI * 2,
      true,
    );
    this.context.fill();
    this.context.globalCompositeOperation = 'source-over';
  }
  displayLyric(
    audioController: AudioController,
    getLyrics: () => LyricLine[] | undefined,
  ) {
    const lyrics = getLyrics();
    if (!lyrics) return;
    if (lyrics.length <= 0) return;

    this.context.textAlign = 'center';
    this.context.fillStyle = this.options.textColor;
    this.context.shadowBlur = this.options.textShadow;
    this.context.shadowColor = 'rgb(0,0,0)';

    //display lrc
    let currentTime = audioController.currentTime;
    this.context.font = this.options.textSize + 'px Arial';

    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].timestamp >= currentTime) {
        [-3, -2, -1, 0, 1].forEach((delta) => {
          if (i + delta >= 0 && i + delta < lyrics.length - 1) {
            this.context.fillStyle =
              delta === -1 ? this.options.color : this.options.textColor;
            this.context.fillText(
              lyrics[i + delta].text,
              this.canvas.width / 2,
              this.canvas.height / 2 -
                this.options.textSize / 2 +
                (delta + 1) *
                  (this.options.textSize + this.options.textBetween),
            );
          }
        });
        break;
      }
    }
  }
}

export default VisualController;
