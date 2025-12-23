import { apiClient } from '../api';
import type {
  Post,
  PostCreateRequest,
  PostUpdateRequest,
  PostListResponse,
  PostSearchRequest,
} from '../types';

export const postService = {
  getPosts: async (page = 0, size = 20, sort = 'createdAt,desc'): Promise<PostListResponse> => {
    const response = await apiClient.get<PostListResponse>(
      `/posts?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  },

  getPost: async (postId: number): Promise<Post> => {
    const response = await apiClient.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  searchPosts: async (params: PostSearchRequest, page = 0, size = 20): Promise<PostListResponse> => {
    const response = await apiClient.get<PostListResponse>('/posts/search', {
      params: { ...params, page, size },
    });
    return response.data;
  },

  getPopularPosts: async (limit = 10): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>(`/posts/popular?limit=${limit}`);
    return response.data;
  },

  getTrendingPosts: async (days = 7): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>(`/posts/trending?days=${days}`);
    return response.data;
  },

  createPost: async (data: PostCreateRequest): Promise<Post> => {
    const response = await apiClient.post<Post>('/posts', data);
    return response.data;
  },

  updatePost: async (postId: number, data: PostUpdateRequest): Promise<Post> => {
    const response = await apiClient.put<Post>(`/posts/${postId}`, data);
    return response.data;
  },

  deletePost: async (postId: number): Promise<void> => {
    await apiClient.delete(`/posts/${postId}`);
  },

  publishPost: async (postId: number): Promise<Post> => {
    const response = await apiClient.post<Post>(`/posts/${postId}/publish`);
    return response.data;
  },

  toggleLike: async (postId: number): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
  },

  getLikeStatus: async (postId: number): Promise<{ liked: boolean }> => {
    const response = await apiClient.get(`/posts/${postId}/like/status`);
    return response.data;
  },

  toggleScrap: async (postId: number, folderId?: number): Promise<{ scraped: boolean }> => {
    const response = await apiClient.post(`/posts/${postId}/scrap`, { folderId });
    return response.data;
  },

  getScrapStatus: async (postId: number): Promise<{ scraped: boolean }> => {
    const response = await apiClient.get(`/posts/${postId}/scrap/status`);
    return response.data;
  },
};
