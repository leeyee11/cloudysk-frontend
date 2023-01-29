import { Card, Empty } from 'antd';
import {
  FolderOutlined,
  FileTextOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import dayjs from 'dayjs';
import path from 'path';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FileStats } from 'typings';
import { useModel } from '@umijs/max';
import { humanizeSize } from '@/utils/format';
import classNames from 'classnames';
import ContextMenu, { ContextMenuItems } from '../ContextMenu';

const p = path;

dayjs.extend(relativeTime);

interface FildGridViewProps {
  path: string;
  className: string;
}

const FileGridView = ({ path, className }: FildGridViewProps) => {
  const { fileList, cd, loading } = useModel('global');
  const { overview, setOverview } = useModel('overview');

  const renderDirectoryAvatar = (stats: FileStats) => {
    return (
      <ContextMenu
        key={stats.name}
        path={path}
        name={stats.name}
        items={[
          ContextMenuItems.Copy,
          ContextMenuItems.Cut,
          ContextMenuItems.Delete,
          ContextMenuItems.Rename,
        ]}
      >
        <Card.Grid
          hoverable
          onClick={() => cd(stats.name)}
          className={styles.fileCard}
          onContextMenu={(e) => e.stopPropagation()}
        >
          <FolderOutlined className={styles.fileIcon} />
          <div className={styles.fileLabel}>
            <div className={styles.fileName} title={stats.name}>
              {stats.name}
            </div>
            <div className={styles.fileInfo}>
              {dayjs(stats.mtime).fromNow()}
            </div>
          </div>
        </Card.Grid>
      </ContextMenu>
    );
  };

  const renderFileAvatar = (stats: FileStats) => {
    const filePath = p.resolve(path, stats.name);
    const isSelected = overview.path === filePath;
    return (
      <ContextMenu
        key={stats.name}
        path={path}
        name={stats.name}
        items={[
          ContextMenuItems.Copy,
          ContextMenuItems.Cut,
          ContextMenuItems.Delete,
          ContextMenuItems.Rename,
        ]}
      >
        <Card.Grid
          hoverable
          className={classNames(
            styles.fileCard,
            isSelected && styles.selectedFileCard,
          )}
          onContextMenu={(e) => e.stopPropagation()}
          onClick={() => setOverview({ ...stats, path: filePath })}
        >
          <FileTextOutlined
            className={styles.fileIcon}
            key={stats.name + 'icon'}
          />
          <div className={styles.fileLabel}>
            <div className={styles.fileName} title={stats.name}>
              {stats.name}
            </div>
            <div className={styles.fileInfo}>
              {humanizeSize(stats.size)} - {dayjs(stats.mtime).fromNow()}
            </div>
          </div>
        </Card.Grid>
      </ContextMenu>
    );
  };

  return (
    <ContextMenu
      path={path}
      name={null}
      items={[
        ContextMenuItems.NewFile,
        ContextMenuItems.NewFolder,
        ContextMenuItems.Paste,
      ]}
    >
      <Card
        loading={loading}
        className={className}
        bodyStyle={{ padding: 12, width: '100%' }}
        onContextMenu={(e) => e.stopPropagation()}
      >
        {fileList.length > 0 ? (
          fileList.map((stats: FileStats) =>
            stats.isDirectory
              ? renderDirectoryAvatar(stats)
              : renderFileAvatar(stats),
          )
        ) : (
          <Empty
            className={styles.emptyPlaceholder}
            description={loading ? <LoadingOutlined /> : 'No files'}
          />
        )}
      </Card>
    </ContextMenu>
  );
};

export default FileGridView;
