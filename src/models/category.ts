import { getCategories } from '@/services/BookmarkController';
import { notification } from 'antd';
import { useEffect, useState } from 'react';

// audio custom categories
const useCategory = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  useEffect(() => {
    getCategories({ name: 'audio' }).then((result) => {
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        notification.error({ message: result.errorMessage });
      }
    });
  }, [lastUpdate]);

  return {
    categories,
    refresh: () => setLastUpdate(Date.now()),
  };
};

export default useCategory;
