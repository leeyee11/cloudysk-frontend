import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import LocationBar from '@/components/LocationBar';
import FileGridView from '@/components/FileGridView';
import FileListView from '@/components/FileListView';
import FileToolsBar from '@/components/FileToolsBar';
import FileOverview from '@/components/FileOverview';
import styles from './index.less';
import { LayoutTypes } from '@/models/layout';
import CodeEditor from '@/components/CodeEditor';

const FolderOverview = () => {
  const { path } = useModel('global');
  const { layout } = useModel('layout');

  return layout === LayoutTypes.Grid ? (
    <FileGridView className={styles.folderOverview} path={path} />
  ) : (
    <FileListView className={styles.folderOverview} path={path} />
  );
};

const FilePage: React.FC = () => {
  const { previewState, containerRef } = useModel('preview');

  return (
    <PageContainer
      header={{
        title: null,
        breadcrumbRender: () => <LocationBar />,
      }}
    >
      <div className={styles.container} ref={containerRef}>
        <FileToolsBar />
        <br />
        <div className={styles.folderView}>
          {previewState?.isEditing ? <CodeEditor /> : <FolderOverview />}
          <FileOverview className={styles.fileOverview} />
        </div>
      </div>
    </PageContainer>
  );
};

export default FilePage;
