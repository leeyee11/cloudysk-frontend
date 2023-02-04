import { Button, Card, Modal, notification } from 'antd';
import {
  DownloadOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { humanizeSize } from '@/utils/format';
import { download } from '@/utils/download';
import { lookup } from 'mime-types';
import path from 'path-browserify';
import dayjs from 'dayjs';
import styles from './index.less';
import { PlayerStatus } from '@/models/audio-player';

const p = path;

const DescriptionItem = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => (
  <div className={styles.descriptionItemWrapper}>
    <p className={styles.descriptionItemLabel}>{title}:</p>
    {content}
  </div>
);

export const FileSaveButton = ({
  path,
  type = 'text',
}: {
  path: string;
  type?: any;
}) => {
  const { setPreviewState, save } = useModel('preview');

  const saveHandler = async (path: string) => {
    const result = await save(path);
    if (result.success && !result.errorMessage) {
      notification.success({
        message: 'The content has been saved',
      });
    } else {
      notification.error({
        message: `Failed to save content, error: ${result.errorMessage}`,
      });
    }
    setPreviewState(null);
  };

  return (
    <Button
      type={type}
      onClick={() => saveHandler(path)}
      icon={<SaveOutlined />}
    />
  );
};

export const FileCloseButton = ({ type = 'text' }) => {
  const { setPreviewState, hasEdited } = useModel('preview');

  const closeHandler = () => {
    const needConfirm = hasEdited();
    if (needConfirm) {
      Modal.confirm({
        title: 'Close file without saving?',
        content:
          'Are you sure to close file without saving? The unsaved changes will be lost.',
        onOk: () => setPreviewState(null),
      });
    } else {
      setPreviewState(null);
    }
  };

  return (
    <Button
      type={type as any}
      onClick={closeHandler}
      icon={<CloseOutlined />}
    />
  );
};

const FileDownloadButton = ({ path }: { path: string }) => {
  return (
    <Button
      type="text"
      onClick={() => download(path)}
      icon={<DownloadOutlined />}
    />
  );
};

const FilePreviewButton = ({ path }: { path: string }) => {
  const {
    state: audioPlayerState,
    pause: pauseAudio,
    play: playAudio,
  } = useModel('audio-player');
  const { edit } = useModel('preview');
  const fileName = p.basename(path);
  const mimeType = lookup(fileName) || 'text/plain';

  if (mimeType.startsWith('text/') || mimeType.startsWith('application/')) {
    return (
      <Button type="text" onClick={() => edit(path)} icon={<EditOutlined />} />
    );
  } else if (mimeType.startsWith('audio/')) {
    if (
      audioPlayerState.path === path &&
      audioPlayerState.status === PlayerStatus.Playing
    ) {
      return (
        <Button
          type="text"
          onClick={() => pauseAudio()}
          icon={<PauseCircleOutlined />}
        />
      );
    }
    return (
      <Button
        type="text"
        onClick={() =>
          playAudio(path).catch((err) => {
            console.log(err);
            notification.error({ message: 'Connection aborted' });
          })
        }
        icon={<PlayCircleOutlined />}
      />
    );
  } else {
    return null;
  }
};

const FileOverview = ({ className }: { className: string }) => {
  const { overview } = useModel('overview');
  const { previewState } = useModel('preview');

  return (
    <Card
      title={<div title={overview?.name}>{overview?.name}</div>}
      className={className}
      extra={
        overview?.path &&
        overview.isFile && [
          previewState?.isEditing && <FileCloseButton key="close" />,
          previewState?.isEditing && (
            <FileSaveButton key="save" path={overview?.path} />
          ),
          !previewState?.isEditing && (
            <FilePreviewButton key="preview" path={overview?.path} />
          ),
          !previewState?.isEditing && (
            <FileDownloadButton key="download" path={overview?.path} />
          ),
        ]
      }
    >
      <DescriptionItem
        title="Size"
        content={humanizeSize(overview?.size ?? 0)}
      />
      <DescriptionItem
        title="Created"
        content={dayjs(overview?.birthtime).format('YYYY-MM-DD ddd HH:mm')}
      />
      <DescriptionItem
        title="Modified"
        content={dayjs(overview?.mtime).format('YYYY-MM-DD ddd HH:mm  ')}
      />
      <DescriptionItem title="Mode" content={overview?.mode} />
      <DescriptionItem title="Location" content={overview?.path} />
      {overview?.isDirectory && (
        <DescriptionItem title="Children" content={overview.children?.length} />
      )}
    </Card>
  );
};

export default FileOverview;
