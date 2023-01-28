import { Card, Empty } from 'antd';
import {
  FolderOutlined,
  FileTextOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import { FileStats } from 'typings';
import { useModel } from '@umijs/max';
import ContextMenu, { ContextMenuItems } from '../ContextMenu';

const humanizeSize = (size: number) => {
  const sizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
  let currSize = size;
  let i = 0;
  while (currSize > 1024) {
    currSize /= 1024;
    i++;
  }
  return Math.round(currSize * 10) / 10 + sizeUnits[i];
};

interface FildGridViewProps {
  path: string;
}

const FileGridView = ({ path }: FildGridViewProps) => {
  const { fileList, cd, loading } = useModel('global');

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
            <div className={styles.fileInfo}>{stats.mtime}</div>
          </div>
        </Card.Grid>
      </ContextMenu>
    );
  };

  const renderFileAvatar = (stats: FileStats) => {
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
          className={styles.fileCard}
          onContextMenu={(e) => e.stopPropagation()}
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
              {humanizeSize(stats.size)} - {stats.mtime}
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
        bodyStyle={{ padding: 12 }}
        onContextMenu={(e) => e.stopPropagation()}
      >
        {fileList.length > 0 ? (
          fileList.map((stats: FileStats) =>
            stats.isDirectory
              ? renderDirectoryAvatar(stats)
              : renderFileAvatar(stats),
          )
        ) : (
          <Empty description={loading ? <LoadingOutlined /> : 'No files'} />
        )}
      </Card>
    </ContextMenu>
  );
};

export default FileGridView;
