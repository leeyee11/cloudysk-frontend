import { FloatAudioPlayer } from './components/AudioPlayer';
import { CloudLogo } from './icons/cloud';
import { blue } from '@ant-design/colors';

export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'default' };
}

export const layout = () => {
  return {
    layout: 'mix',
    logo: <CloudLogo color={blue.primary as string} />,
    menu: {
      locale: false,
    },
    footerRender: () => <FloatAudioPlayer />,
  };
};
