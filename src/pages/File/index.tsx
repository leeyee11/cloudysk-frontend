import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import CodeEditor from '@/components/CodeEditor';
import LocationBar from '@/components/LocationBar';
import FileGridView from '@/components/FileGridView';
import FileListView from '@/components/FileListView';
import FileToolsBar from '@/components/FileToolsBar';
import FileOverview from '@/components/FileOverview';
import { LayoutTypes } from '@/models/layout';
import styles from './index.less';

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
        title: <FileToolsBar />,
        breadcrumbRender: () => <LocationBar />,
      }}
    >
      <div className={styles.container} ref={containerRef}>
        <div className={styles.folderView}>
          {previewState?.isEditing ? <CodeEditor /> : <FolderOverview />}
          <FileOverview className={styles.fileOverview} />
        </div>
      </div>
    </PageContainer>
  );
};

export default FilePage;
