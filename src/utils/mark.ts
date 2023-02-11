import { create, remove, update } from '@/services/BookmarkController';
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

export const unstar = async (path: string) => {
  const result = await remove({
    path,
    collection: 'star',
    category: 'default',
  });
  if (result.success) {
    notification.success({ message: 'Unmark star done' });
  } else {
    notification.error({ message: result.errorMessage });
  }
};

export const favorite = async (path: string, categories: string[]) => {
  const result = await update({
    path,
    type: 'file',
    collection: 'audio',
    categories,
  });
  if (result.success) {
    notification.success({ message: 'Update done' });
  } else {
    notification.error({ message: result.errorMessage });
  }
};
