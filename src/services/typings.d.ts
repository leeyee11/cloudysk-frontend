/* eslint-disable */

import { FileStats } from 'typings';

declare namespace API {
  interface Bookmark {
    path: string;
    type: 'file' | 'directory';
    collection: 'star' | 'audio' | 'video';
    category: 'default' | string;
  }

  interface AudioMarks {
    path: string;
    type: 'file';
    collection: 'audio';
    categories: string[];
  }

  type BookmarkRecord = Bookmark & { id: string };

  interface PageInfo {
    /** 
1 */
    current?: number;
    pageSize?: number;
    total?: number;
    list?: Array<Record<string, any>>;
  }

  interface PageInfo_UserInfo_ {
    /** 
1 */
    current?: number;
    pageSize?: number;
    total?: number;
    list?: Array<UserInfo>;
  }

  interface Result {
    success?: boolean;
    errorMessage?: string;
    data?: Record<string, any>;
  }

  interface Result_PageInfo_UserInfo__ {
    success?: boolean;
    errorMessage?: string;
    data?: PageInfo_UserInfo_;
  }

  interface Result_UserInfo_ {
    success?: boolean;
    errorMessage?: string;
    data?: UserInfo;
  }

  interface Result_string_ {
    success?: boolean;
    errorMessage?: string;
    data?: string;
  }

  type UserGenderEnum = 'MALE' | 'FEMALE';

  interface UserInfo {
    id?: string;
    name?: string;
    /** nick */
    nickName?: string;
    /** email */
    email?: string;
    gender?: UserGenderEnum;
  }

  interface UserInfoVO {
    name?: string;
    /** nick */
    nickName?: string;
    /** email */
    email?: string;
  }

  interface Result_FolderStats {
    success?: boolean;
    errorMessage?: string;
    data?: FileStats & {
      children: import('typings').FileStats[];
    };
  }

  interface Result_Categories {
    success?: boolean;
    errorMessage?: string;
    data?: string[];
  }

  interface Result_FileInfo_ {
    success?: boolean;
    errorMessage?: string;
    data?: import('typings').FileStats[];
  }

  type definitions_0 = null;

  interface Result_Bookmark {
    success?: boolean;
    errorMessage?: string;
    data?: BookmarkRecord;
  }

  interface Result_Bookmarks {
    success?: boolean;
    errorMessage?: string;
    data?: BookmarkRecord[];
  }

  interface Result_Status {
    success?: boolean;
    errorMessage?: string;
  }
}
