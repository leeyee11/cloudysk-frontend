import { Button, Drawer } from 'antd';
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

const FilePreview = () => {
  const { preview, setPreview } = useModel('preview');

  const FileDownloadButton = ({ path }: { path: string }) => {
    return (
      <Button type="text" onClick={() => download(path)}>
        <DownloadOutlined />
      </Button>
    );
  };

  return (
    <Drawer
      open={!!preview}
      onClose={() => setPreview(null)}
      title={<div title={preview?.name}>{preview?.name}</div>}
      closeIcon={false}
      className={styles.previewDrawer}
      extra={preview?.path && <FileDownloadButton path={preview?.path} />}
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
    </Drawer>
  );
};

export default FilePreview;
