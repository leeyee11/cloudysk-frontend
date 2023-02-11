import { request } from '@umijs/max';
import { API } from './typings';
import type { PathLike } from 'fs-extra';

/** GET /api/v1/folder */
export async function getFolder(
  params: {
    path: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_FolderStats>('/api/v1/folder', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** GET /api/v1/collection */
export async function getCollection(
  params: {
    name: string;
    category?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_FolderStats>('/api/v1/collection', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** PUT /api/v1/plain */
export async function putPlainFile(
  params: {
    path: string;
  },
  body?: string,
  options?: { [key: string]: any },
) {
  return request<API.Result_string_>('/api/v1/plain', {
    method: 'PUT',
    params: {
      ...params,
    },
    headers: {
      'Content-Type': 'text/plain',
    },
    data: body,
    ...(options || {}),
  });
}

/** PUT /api/v1/folder */
export async function putEmptyFolder(
  params: {
    path: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_string_>('/api/v1/folder', {
    method: 'PUT',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** PUT /api/v1/files */
export async function putFiles(
  params: {
    path: string;
  },
  body?: Buffer,
  options?: { [key: string]: any },
) {
  return request<API.Result_string_>('/api/v1/files', {
    method: 'PUT',
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** GET /api/v1/file */
export async function getFile(
  params: {
    path: string;
  },
  options?: { [key: string]: any },
) {
  return request<Blob>(`/api/v1/file`, {
    method: 'GET',
    params: {
      ...params,
    },
    responseType: 'blob',
    ...(options || {}),
  });
}

/** POST /api/v1/file */
export async function modifyFile(
  params: {
    path: string;
  },
  body?: API.UserInfoVO,
  options?: { [key: string]: any },
) {
  return request<API.Result_string_>(`/api/v1/file`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

/** DELETE /api/v1/path */
export async function deletePath(
  params: {
    path: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_string_>(`/api/v1/path`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** POST /api/v1/copy */
export async function copy(
  params: {
    source: PathLike;
    target: PathLike;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_string_>(`/api/v1/copy`, {
    method: 'POST',
    params: { ...params },
    ...(options || {}),
  });
}

/** POST /api/v1/move */
export async function move(
  params: {
    source: PathLike;
    target: PathLike;
    rename: boolean | undefined;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_string_>(`/api/v1/move`, {
    method: 'POST',
    params: { ...params },
    ...(options || {}),
  });
}
