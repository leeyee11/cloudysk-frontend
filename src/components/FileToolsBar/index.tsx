import { useState } from 'react';
import {
  UploadOutlined,
  ArrowUpOutlined,
  FolderAddOutlined,
  FileAddOutlined,
  InboxOutlined,
  PaperClipOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Space, Upload, Typography, message } from 'antd';
import Prompt from '@/components/Prompt';
import styles from './index.less';
import classnames from 'classnames';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload';
import { CreateTypes } from '@/models/inquiry';
import { LayoutTypes } from '@/models/layout';

const { Paragraph, Title, Text } = Typography;
const { Dragger } = Upload;

const FileToolsBar = () => {
  const [draggerOpen, setDraggerOpen] = useState<boolean>(false);
  const { path, cd, refresh } = useModel('global');
  const { openInquiry, state: inquiryState } = useModel('inquiry');
  const { layout, switchLayout } = useModel('layout');
  const { previewState } = useModel('preview');

  const handleUpload = (info: UploadChangeParam<UploadFile<any>>) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`Uploaded file: ${info.file.name}.`);
      refresh();
    } else if (status === 'error') {
      message.error(`Failed to upload file: ${info.file.name}`);
      refresh();
    }
  };

  return (
    <div className={styles.fileToolsBar}>
      <Prompt state={inquiryState} />
      {path &&
        (previewState?.isEditing ? (
          <Space className={styles.fileToolsNav}>
            <Title level={5}>{previewState.path}</Title>
          </Space>
        ) : (
          <Space className={styles.fileToolsNav}>
            <Button
              disabled={path === '/'}
              icon={<ArrowUpOutlined />}
              type="primary"
              title="Go to parent folder"
              onClick={() => cd('..')}
            ></Button>
            <Button
              icon={<FolderAddOutlined />}
              title="Create new folder"
              onClick={() =>
                openInquiry(CreateTypes.NewFolder, path).then(refresh)
              }
            ></Button>
            <Button
              icon={<FileAddOutlined />}
              title="Create new file"
              onClick={() =>
                openInquiry(CreateTypes.NewFile, path).then(refresh)
              }
            ></Button>
            <Button
              icon={draggerOpen ? <PaperClipOutlined /> : <UploadOutlined />}
              title="Upload files"
              onClick={() => setDraggerOpen((open) => !open)}
            ></Button>
            <Button
              icon={
                layout === LayoutTypes.Grid ? (
                  <UnorderedListOutlined />
                ) : (
                  <AppstoreOutlined />
                )
              }
              title="Switch layout"
              onClick={switchLayout}
            ></Button>
            <Button
              icon={<ReloadOutlined />}
              title="Refresh"
              onClick={refresh}
            ></Button>
          </Space>
        ))}
      <div
        className={classnames(
          styles.fileDraggerContainer,
          draggerOpen && styles.draggerOpen,
        )}
      >
        <Dragger
          method="PUT"
          directory={false}
          multiple={true}
          action={`/api/v1/files?path=${path}`}
          onChange={handleUpload}
          onDrop={(e) => console.log('Drop files: ', e.dataTransfer.files)}
          showUploadList={true}
          progress={{
            strokeColor: {
              '0%': '#108ee9',
              '100%': '#87d068',
            },
            strokeWidth: 3,
            showInfo: true,
            format: (percent) =>
              percent && `${parseFloat(percent.toFixed(2))}%`,
          }}
        >
          <Typography>
            <Title>
              <InboxOutlined />
            </Title>
            <Paragraph>
              <Text strong>Click or drag file to this area to upload</Text>
            </Paragraph>
          </Typography>
        </Dragger>
      </div>
    </div>
  );
};

export default FileToolsBar;
