import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import LocationBar from '@/components/LocationBar';
import FildGridView from '@/components/FileGridView';
import FileToolsBar from '@/components/FileToolsBar';
import FilePreview from '@/components/FilePreview';
import styles from './index.less';

const FilePage: React.FC = () => {
  const { path } = useModel('global');

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
        <FildGridView path={path} />
        <FilePreview />
      </div>
    </PageContainer>
  );
};

export default FilePage;
