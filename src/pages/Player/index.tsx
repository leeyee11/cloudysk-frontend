import { useEffect } from 'react';
import { useModel } from '@umijs/max';
import PlayerListView from '@/components/PlayerListView';
import styles from './index.less';
import VisualAudio from '@/components/VisualAudio';

const Player = () => {
  const { view } = useModel('global');
  useEffect(() => {
    view('audio');
  }, []);

  return (
    <div className={styles.container}>
      <PlayerListView className={styles.playlist} />
      <VisualAudio className={styles.visualAudio} />
    </div>
  );
};

export default Player;
