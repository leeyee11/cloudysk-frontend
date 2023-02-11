import { CreateTypes } from '@/models/creator';
import { deletePath } from '@/services/FileController';
import { useModel } from '@umijs/max';
import { Button, Dropdown, Modal } from 'antd';
import path from 'path-browserify';
import styles from './index.less';

const p = path;

export enum ContextMenuItems {
  Copy = 'Copy',
  Cut = 'Cut',
  Delete = 'Delete',
  NewFile = 'New File',
  NewFolder = 'New Folder',
  Paste = 'Paste',
  Rename = 'Rename',
}

interface ContextMenuProps {
  children: React.ReactNode | React.ReactNode[];
  name: string | null;
  path?: string;
  items: ContextMenuItems[];
}

const ContextMenu = ({ children, path, name, items }: ContextMenuProps) => {
  const { refresh, setLoading } = useModel('global');
  const { openCreator } = useModel('creator');
  const { copy, cut, exist, paste } = useModel('clipboard');

  const handleMenuItemClick = (
    path: string,
    name: string | null,
    label: ContextMenuItems,
  ) => {
    if (label === ContextMenuItems.Copy && name !== null) {
      copy(p.resolve(path, name));
    } else if (label === ContextMenuItems.Cut && name !== null) {
      cut(p.resolve(path, name));
    } else if (label === ContextMenuItems.Delete) {
      const target = name ? p.resolve(path, name) : path;
      Modal.confirm({
        title: 'Are you sure to delete it?',
        onOk: () => {
          setLoading(true);
          deletePath({ path: target }).then(refresh);
        },
        onCancel: () => void 0,
        okType: 'danger',
      });
    } else if (label === ContextMenuItems.NewFile) {
      openCreator(CreateTypes.NewFile, path);
    } else if (label === ContextMenuItems.NewFolder) {
      openCreator(CreateTypes.NewFolder, path);
    } else if (label === ContextMenuItems.Paste) {
      if (name === null) {
        setLoading(true);
        paste(path).finally(refresh);
      }
    } else if (label === ContextMenuItems.Rename) {
      if (!!name) {
        openCreator(CreateTypes.Rename, p.resolve(path, name));
      }
    } else {
      console.error(`Unexpected action: ${label} target: ${name}`);
    }
  };

  const menuItems = path
    ? items.map((label, index) => ({
        key: index,
        label: (
          <Button
            type="text"
            onClick={() => handleMenuItemClick(path, name, label)}
            disabled={label === ContextMenuItems.Paste && !exist()}
          >
            {label}
          </Button>
        ),
      }))
    : [];
  return (
    <Dropdown
      trigger={['contextMenu']}
      menu={{ items: menuItems }}
      className={styles.dropdown}
    >
      {children}
    </Dropdown>
  );
};

export default ContextMenu;
