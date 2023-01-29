import { Button, Card } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
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

const FilePreview = ({ className }: { className: string }) => {
  const { preview } = useModel('preview');

  const FileDownloadButton = ({ path }: { path: string }) => {
    return (
      <Button type="text" onClick={() => download(path)}>
        <DownloadOutlined />
      </Button>
    );
  };

  return (
    <Card
      title={<div title={preview?.name}>{preview?.name}</div>}
      className={className}
      extra={
        preview?.path &&
        preview.isFile && <FileDownloadButton path={preview?.path} />
      }
    >
      <DescriptionItem
        title="Size"
        content={humanizeSize(preview?.size ?? 0)}
      />
      <DescriptionItem
        title="Created"
        content={dayjs(preview?.birthtime).format('YYYY-MM-DD ddd HH:mm')}
      />
      <DescriptionItem
        title="Modified"
        content={dayjs(preview?.mtime).format('YYYY-MM-DD ddd HH:mm  ')}
      />
      <DescriptionItem title="Mode" content={preview?.mode} />
      <DescriptionItem title="Location" content={preview?.path} />
      {preview?.isDirectory && (
        <DescriptionItem title="Children" content={preview.children?.length} />
      )}
    </Card>
  );
};

export default FilePreview;
