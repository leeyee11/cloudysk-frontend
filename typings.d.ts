import '@umijs/max/typings';

export interface FileStats {
  dev: number;
  ino: number;
  mode: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  size: number;
  blksize: number;
  blocks: number;
  atimeMs: number;
  mtimeMs: number;
  ctimeMs: number;
  birthtimeMs: number;
  atime: string;
  mtime: string;
  ctime: string;
  birthtime: string;
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  parent: string;
  collection?: string;
  category?: string;
}
