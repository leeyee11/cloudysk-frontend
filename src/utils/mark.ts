import { create, remove } from '@/services/BookmarkController';
import { notification } from 'antd';

export const star = async (path: string, type: 'file' | 'directory') => {
  const result = await create({
    path,
    type,
    collection: 'star',
    category: 'default',
  });
  if (result.success) {
    notification.success({ message: 'Mark star done' });
  } else {
    notification.error({ message: result.errorMessage });
  }
};

export const unstar = async (id: string) => {
  const result = await remove({ id });
  if (result.success) {
    notification.success({ message: 'Unmark star done' });
  } else {
    notification.error({ message: result.errorMessage });
  }
};
