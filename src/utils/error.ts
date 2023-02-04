import { notification } from 'antd';

export const notifyError = (fn: (...args: any[]) => any) => {
  return (...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      notification.error({ message: (error as Error).message });
    }
  };
};
