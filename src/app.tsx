import { FloatAudioPlayer } from './components/AudioPlayer';

export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'default' };
}

export const layout = () => {
  return {
    layout: 'mix',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    footerRender: () => <FloatAudioPlayer />,
  };
};
