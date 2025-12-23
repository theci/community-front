import { apiClient } from '../api';
import type { Comment, CommentCreateRequest, CommentUpdateRequest } from '../types';

export const commentService = {
  getCommentsByPost: async (postId: number): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`/comments/posts/${postId}`);
    return response.data;
  },

  getRootComments: async (postId: number, page = 0, size = 20): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`/comments/posts/${postId}/root`, {
      params: { page, size },
    });
    return response.data;
  },

  getReplies: async (parentCommentId: number): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`/comments/${parentCommentId}/replies`);
    return response.data;
  },

  getComment: async (commentId: number): Promise<Comment> => {
    const response = await apiClient.get<Comment>(`/comments/${commentId}`);
    return response.data;
  },

  createComment: async (data: CommentCreateRequest): Promise<Comment> => {
    const response = await apiClient.post<Comment>('/comments', data);
    return response.data;
  },

  updateComment: async (commentId: number, data: CommentUpdateRequest): Promise<Comment> => {
    const response = await apiClient.put<Comment>(`/comments/${commentId}`, data);
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
  },
};
