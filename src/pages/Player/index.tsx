import { useEffect } from 'react';
import { useModel } from '@umijs/max';
import PlayerListView from '@/components/PlayerListView';
import styles from './index.less';

const Player = () => {
  const { view } = useModel('global');
  useEffect(() => {
    view('audio');
  }, []);

  return (
    <div className={styles.container}>
      <PlayerListView className={styles.playlist} />
      <div className={styles.visualAudio}></div>
    </div>
  );
};

export default Player;
