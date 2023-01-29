import { Button, Card, Modal, notification } from 'antd';
import {
  DownloadOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { humanizeSize } from '@/utils/format';
import { download } from '@/utils/download';
import dayjs from 'dayjs';
import styles from './index.less';

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

const FileOverview = ({ className }: { className: string }) => {
  const { overview } = useModel('overview');
  const { previewState, setPreviewState, edit, save, hasEdited } =
    useModel('preview');

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

  const FileDownloadButton = ({ path }: { path: string }) => {
    return (
      <Button
        type="text"
        onClick={() => download(path)}
        icon={<DownloadOutlined />}
      />
    );
  };

  const FileEditButton = ({ path }: { path: string }) => {
    return (
      <Button type="text" onClick={() => edit(path)} icon={<EditOutlined />} />
    );
  };

  const FileSaveButton = ({ path }: { path: string }) => {
    return (
      <Button
        type="text"
        onClick={() => saveHandler(path)}
        icon={<SaveOutlined />}
      />
    );
  };

  const FileCloseButton = () => {
    return (
      <Button type="text" onClick={closeHandler} icon={<CloseOutlined />} />
    );
  };

  return (
    <Card
      title={<div title={overview?.name}>{overview?.name}</div>}
      className={className}
      extra={
        overview?.path &&
        overview.isFile && [
          previewState?.isEditing && (
            <FileCloseButton key="close" path={overview?.path} />
          ),
          previewState?.isEditing && (
            <FileSaveButton key="save" path={overview?.path} />
          ),
          !previewState?.isEditing && (
            <FileEditButton key="edit" path={overview?.path} />
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
