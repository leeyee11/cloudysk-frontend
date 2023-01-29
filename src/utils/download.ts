import { getFile } from '@/services/FileController';
import path from 'path';

const p = path;

export const download = async (path: string) => {
  const blob = await getFile({ path });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', p.basename(path));
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
};
