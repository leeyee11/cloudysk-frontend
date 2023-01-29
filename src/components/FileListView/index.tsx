import { Card, Empty, Row, Col } from 'antd';
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
import ContextMenu, { ContextMenuItems } from '../ContextMenu';

const p = path;

dayjs.extend(relativeTime);

interface FildListViewProps {
  path: string;
  className: string;
}

const FileListView = ({ path, className }: FildListViewProps) => {
  const { fileList, cd, loading } = useModel('global');
  const { setPreview } = useModel('preview');

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
          hoverable={false}
          onClick={() => cd(stats.name)}
          className={styles.fileCard}
          onContextMenu={(e) => e.stopPropagation()}
        >
          <Row gutter={12}>
            <Col sm={12} md={18}>
              <div className={styles.fileLabel}>
                <FolderOutlined className={styles.fileIcon} />
                <div className={styles.fileName} title={stats.name}>
                  {stats.name}
                </div>
              </div>
            </Col>
            <Col sm={6} md={3}>
              <div className={styles.fileSizeInfo}></div>
            </Col>
            <Col sm={6} md={3}>
              <div className={styles.fileDateInfo}>
                {dayjs(stats.mtime).fromNow()}
              </div>
            </Col>
          </Row>
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
          hoverable={false}
          className={styles.fileCard}
          onContextMenu={(e) => e.stopPropagation()}
          onClick={() =>
            setPreview({ ...stats, path: p.resolve(path, stats.name) })
          }
        >
          <Row gutter={12}>
            <Col sm={12} md={18}>
              <div className={styles.fileLabel}>
                <FileTextOutlined
                  className={styles.fileIcon}
                  key={stats.name + 'icon'}
                />
                <div className={styles.fileName} title={stats.name}>
                  {stats.name}
                </div>
              </div>
            </Col>
            <Col sm={6} md={3}>
              <div className={styles.fileSizeInfo}>
                {humanizeSize(stats.size)}
              </div>
            </Col>
            <Col sm={6} md={3}>
              <div className={styles.fileDateInfo}>
                {dayjs(stats.mtime).fromNow()}
              </div>
            </Col>
          </Row>
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

export default FileListView;
