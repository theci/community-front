import { apiClient } from '../api';
import type { ScrapFolder, ScrapFolderCreateRequest, ScrapFolderUpdateRequest, PostScrap } from '../types';

export const scrapService = {
  getMyFolders: async (): Promise<ScrapFolder[]> => {
    const response = await apiClient.get<ScrapFolder[]>('/scrap-folders/me');
    return response.data;
  },

  getFolder: async (folderId: number): Promise<ScrapFolder> => {
    const response = await apiClient.get<ScrapFolder>(`/scrap-folders/${folderId}`);
    return response.data;
  },

  createFolder: async (data: ScrapFolderCreateRequest): Promise<ScrapFolder> => {
    const response = await apiClient.post<ScrapFolder>('/scrap-folders', data);
    return response.data;
  },

  updateFolder: async (folderId: number, data: ScrapFolderUpdateRequest): Promise<ScrapFolder> => {
    const response = await apiClient.put<ScrapFolder>(`/scrap-folders/${folderId}`, data);
    return response.data;
  },

  deleteFolder: async (folderId: number): Promise<void> => {
    await apiClient.delete(`/scrap-folders/${folderId}`);
  },

  getScrapsInFolder: async (folderId: number): Promise<PostScrap[]> => {
    const response = await apiClient.get<PostScrap[]>(`/posts/scrap-folders/${folderId}/scraps`);
    return response.data;
  },

  getMyScraps: async (): Promise<PostScrap[]> => {
    const response = await apiClient.get<PostScrap[]>('/posts/scraps/me');
    return response.data;
  },

  moveScrap: async (postId: number, targetFolderId: number): Promise<void> => {
    await apiClient.put(`/posts/${postId}/scrap/move`, null, {
      params: { targetFolderId },
    });
  },

  setDefaultFolder: async (folderId: number): Promise<void> => {
    await apiClient.post(`/scrap-folders/${folderId}/set-default`);
  },
};
