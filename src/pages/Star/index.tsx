import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import CodeEditor from '@/components/CodeEditor';
import FileListView from '@/components/FileListView';
import FileOverview from '@/components/FileOverview';
import FileToolsBar from '@/components/FileToolsBar';
import { useEffect, type LegacyRef } from 'react';
import styles from './index.less';

const Star = () => {
  const { previewState, containerRef } = useModel('preview');
  const { view } = useModel('global');
  useEffect(() => {
    view('star');
  }, []);

  return (
    <PageContainer
      header={{
        title: <FileToolsBar />,
      }}
    >
      <div
        className={styles.container}
        ref={containerRef as LegacyRef<HTMLDivElement>}
      >
        <div className={styles.folderView}>
          {previewState?.isEditing ? (
            <CodeEditor />
          ) : (
            <FileListView className={styles.folderOverview} />
          )}
          <FileOverview className={styles.fileOverview} />
        </div>
      </div>
    </PageContainer>
  );
};

export default Star;
