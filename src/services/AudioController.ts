type AudioLifecycleEvent = 'play' | 'end' | 'pause' | 'canplay' | 'abort';

export const INITIAL_VOLUME = 0.25;

class AudioController {
  private ready = false;
  public context!: AudioContext;
  public audio!: HTMLAudioElement;
  public source!: MediaElementAudioSourceNode;

  public processor!: AudioWorkletNode;
  public analyser!: AnalyserNode;
  private callbackMap: Map<AudioLifecycleEvent, ((ev: Event) => void)[]> =
    new Map();

  private setup() {
    this.context = new AudioContext();
    this.audio = new Audio();
    this.source = this.context.createMediaElementSource(this.audio);
    this.audio.volume = 0.25;
    this.source.connect(this.context.destination);
    this.ready = true; 
    // this.context.audioWorklet.addModule('hiss-generator.js').then(() => {
    //   this.processor = new AudioWorkletNode(this.context, 'visual-render');
    //   this.analyser = new AnalyserNode(this.context);
    //   this.processor.connect(this.context.destination);
    //   //analyser connect to processor
    //   this.analyser.connect(this.processor);
    //   //source connect
    //   this.source.connect(this.analyser);
    // });
    this.setupCallbacks();
  }

  private setupCallbacks = () => {
    this.audio.oncanplay = (event: Event) => {
      this.callbackMap.get('play')?.forEach((fn) => fn(event));
    };
    this.audio.onabort = (event: Event) => {
      this.callbackMap.get('abort')?.forEach((fn) => fn(event));
    };
    this.audio.onended = (event: Event) => {
      this.callbackMap.get('end')?.forEach((fn) => fn(event));
    };
  };

  on = (lifecycleEvent: AudioLifecycleEvent, callback: (ev: Event) => void) => {
    const callbackList = this.callbackMap.get(lifecycleEvent);
    if (callbackList !== undefined) {
      callbackList.push(callback);
    } else {
      this.callbackMap.set(lifecycleEvent, [callback]);
    }
  };

  off = (
    lifecycleEvent: AudioLifecycleEvent,
    callback: (ev: Event) => void,
  ) => {
    const index = (this.callbackMap.get(lifecycleEvent) ?? []).indexOf(
      callback,
    );
    if (index > -1) {
      (this.callbackMap.get(lifecycleEvent) ?? []).splice(index, 1);
    }
  };

  play = (url: string) => {
    if (!this.ready) {
      this.setup();
    }
    this.audio.src = url;
    this.audio.load();
    this.audio.play();
  };

  pause = () => {
    this.audio.pause();
  };

  resume = () => {
    this.audio.play();
  };

  stop = () => {
    this.audio.pause();
  };

  get currentTime() {
    return this.audio.currentTime;
  }

  set currentTime(value: number) {
    this.audio.currentTime = value;
  }

  get volume() {
    return this.audio.volume;
  }

  set volume(value: number) {
    this.audio.volume = value;
  }
}

const createAudioController = () => {
  const controller = new AudioController();
  const getAudioController = () => {
    return controller;
  };
  return getAudioController;
};

export const getAudioController = createAudioController();
export type { AudioController };
