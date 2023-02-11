import { Card, Empty, Collapse } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import styles from './index.less';
import dayjs from 'dayjs';
import path from 'path';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FileStats } from 'typings';
import { useModel } from '@umijs/max';
import classNames from 'classnames';
import { useEffect } from 'react';

const p = path;

const { Panel } = Collapse;

dayjs.extend(relativeTime);

interface FildListViewProps {
  path?: string;
  className: string;
}

const PlayerListView = ({ className }: FildListViewProps) => {
  const { fileList, loading } = useModel('global');
  const { overview, setOverview } = useModel('overview');
  const { categories, refresh: refreshCategories } = useModel('category');
  const { playList: playAudio } = useModel('audio-player');

  useEffect(() => {
    refreshCategories();
  }, []);

  const renderMusicAvatar = (
    stats: FileStats,
    list: FileStats[],
    index: number,
  ) => {
    const filePath = p.resolve(stats.parent, stats.name);
    const isSelected = overview?.path === filePath;
    const pathes = list.map((f) => p.resolve(f.parent, f.name));
    return (
      <Card.Grid
        hoverable={false}
        className={classNames(
          styles.fileCard,
          isSelected && styles.selectedFileCard,
        )}
        onContextMenu={(e) => e.stopPropagation()}
        onClick={() => {
          if (filePath !== overview?.path) {
            setOverview({ ...stats, path: filePath });
          }
          playAudio(pathes, index);
        }}
      >
        <div className={styles.fileLabel}>
          <FileTextOutlined
            className={styles.fileIcon}
            key={stats.name + 'icon'}
          />
          <div className={styles.fileName} title={stats.name}>
            {stats.name}
          </div>
        </div>
      </Card.Grid>
    );
  };

  return (
    <Card
      loading={loading}
      className={classNames(className, styles.listContainer)}
      bodyStyle={{ width: '100%', padding: 0 }}
      onContextMenu={(e) => e.stopPropagation()}
    >
      <Collapse ghost defaultActiveKey={['0']} style={{ padding: 0 }}>
        {categories.map((category, index) => {
          const list = fileList.filter((f) => f.category === category);
          return (
            <Panel header={category} key={`${index}`}>
              {list.length > 0 ? (
                list.map((stats: FileStats, index) =>
                  renderMusicAvatar(stats, list, index),
                )
              ) : (
                <Empty
                  className={styles.emptyPlaceholder}
                  description={false}
                />
              )}
            </Panel>
          );
        })}
      </Collapse>
    </Card>
  );
};

export default PlayerListView;
