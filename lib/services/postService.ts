import { apiClient } from '../api';
import type {
  Post,
  PostCreateRequest,
  PostUpdateRequest,
  PostListResponse,
  PostSearchRequest,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  message?: string;
}

export const postService = {
  getPosts: async (page = 0, size = 20, sort = 'createdAt,desc'): Promise<PostListResponse> => {
    const response = await apiClient.get<ApiResponse<PostListResponse>>(
      `/posts?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data.data;
  },

  getPost: async (postId: number): Promise<Post> => {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${postId}`);
    return response.data.data;
  },

  searchPosts: async (params: PostSearchRequest, page = 0, size = 20): Promise<PostListResponse> => {
    const response = await apiClient.get<ApiResponse<PostListResponse>>('/posts/search', {
      params: { ...params, page, size },
    });
    return response.data.data;
  },

  getPopularPosts: async (limit = 10): Promise<Post[]> => {
    const response = await apiClient.get<ApiResponse<Post[]>>(`/posts/popular?limit=${limit}`);
    return response.data.data;
  },

  getTrendingPosts: async (days = 7): Promise<Post[]> => {
    const response = await apiClient.get<ApiResponse<Post[]>>(`/posts/trending?days=${days}`);
    return response.data.data;
  },

  createPost: async (data: PostCreateRequest, currentUserId: number): Promise<Post> => {
    const response = await apiClient.post<ApiResponse<Post>>(`/posts?currentUserId=${currentUserId}`, data);
    return response.data.data;
  },

  updatePost: async (postId: number, data: PostUpdateRequest, currentUserId: number): Promise<Post> => {
    const response = await apiClient.put<ApiResponse<Post>>(`/posts/${postId}?currentUserId=${currentUserId}`, data);
    return response.data.data;
  },

  deletePost: async (postId: number, currentUserId: number): Promise<void> => {
    await apiClient.delete(`/posts/${postId}?currentUserId=${currentUserId}`);
  },

  publishPost: async (postId: number, currentUserId: number): Promise<Post> => {
    const response = await apiClient.post<ApiResponse<Post>>(`/posts/${postId}/publish?currentUserId=${currentUserId}`);
    return response.data.data;
  },

  toggleLike: async (postId: number): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await apiClient.post<ApiResponse<{ liked: boolean; likeCount: number }>>(`/posts/${postId}/like`);
    return response.data.data;
  },

  getLikeStatus: async (postId: number, currentUserId?: number): Promise<{ liked: boolean }> => {
    const params = currentUserId ? { currentUserId } : {};
    const response = await apiClient.get<ApiResponse<{ liked: boolean }>>(`/posts/${postId}/like/status`, { params });
    return response.data.data;
  },

  toggleScrap: async (postId: number, folderId?: number): Promise<{ scraped: boolean }> => {
    const response = await apiClient.post<ApiResponse<{ scraped: boolean }>>(`/posts/${postId}/scrap`, { folderId });
    return response.data.data;
  },

  getScrapStatus: async (postId: number, currentUserId?: number): Promise<{ scraped: boolean }> => {
    const params = currentUserId ? { currentUserId } : {};
    const response = await apiClient.get<ApiResponse<{ scraped: boolean }>>(`/posts/${postId}/scrap/status`, { params });
    return response.data.data;
  },
};
