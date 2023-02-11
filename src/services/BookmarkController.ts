import { request } from '@umijs/max';
import { API } from './typings';

/** GET /api/v1/bookmarks */
export async function query(
  params: {
    collection: string;
    category: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_Bookmarks>('/api/v1/bookmarks', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** GET /api/v1/pathmarkers */
export async function queryMarkers(
  params: {
    path: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_Bookmarks>('/api/v1/pathmarkers', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** DELETE /api/v1/bookmark */
export async function remove(
  body?: { _id: number },
  options?: { [key: string]: any },
) {
  return request<API.Result_Status>('/api/v1/bookmark', {
    method: 'DELETE',
    data: body,
    ...(options || {}),
  });
}

/** POST /api/v1/bookmark */
export async function update(
  body?: API.Bookmark,
  options?: { [key: string]: any },
) {
  return request<API.Result_Bookmark>('/api/v1/bookmark', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** PUT /api/v1/bookmark */
export async function create(
  body?: API.Bookmark,
  options?: { [key: string]: any },
) {
  return request<API.Result_Bookmark>('/api/v1/bookmark', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}
