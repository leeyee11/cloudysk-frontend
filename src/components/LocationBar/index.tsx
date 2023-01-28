import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button } from 'antd';
import { useModel } from '@umijs/max';
import path from 'path-browserify';
import React from 'react';
import styles from './index.less';

const p = path;

const LocationBar = () => {
  const { path, cd } = useModel('global');
  return (
    <Breadcrumb>
      {path
        .split(p.sep)
        .filter((s) => !!s)
        .reduce(
          (acc: string[][], curr: string) => [
            ...acc,
            [acc[acc.length - 1][0] + p.sep + curr, curr],
          ],
          [['/', 'root']],
        )
        .map(([fullPath, folder]: string[]) => (
          <Breadcrumb.Item key={fullPath}>
            <Button
              type="text"
              className={styles.navDir}
              onClick={() => cd(fullPath)}
            >
              {fullPath === '/' ? <HomeOutlined /> : folder}
            </Button>
          </Breadcrumb.Item>
        ))}
    </Breadcrumb>
  );
};

export default LocationBar;
