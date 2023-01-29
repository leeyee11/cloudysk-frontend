import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import LocationBar from '@/components/LocationBar';
import FileGridView from '@/components/FileGridView';
import FileListView from '@/components/FileListView';
import FileToolsBar from '@/components/FileToolsBar';
import FilePreview from '@/components/FilePreview';
import styles from './index.less';
import { LayoutTypes } from '@/models/layout';

const FilePage: React.FC = () => {
  const { path } = useModel('global');
  const { layout } = useModel('layout');

  return (
    <PageContainer
      header={{
        title: null,
        breadcrumbRender: () => <LocationBar />,
      }}
    >
      <div className={styles.container}>
        <FileToolsBar />
        <br />
        <div className={styles.folderView}>
          {layout === LayoutTypes.Grid ? (
            <FileGridView className={styles.fileOverview} path={path} />
          ) : (
            <FileListView className={styles.fileOverview} path={path} />
          )}
          <FilePreview className={styles.filePreview} />
        </div>
      </div>
    </PageContainer>
  );
};

export default FilePage;
