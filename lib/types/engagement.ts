export interface PostLike {
  id: number;
  postId: number;
  userId: number;
  createdAt: string;
}

export interface PostScrap {
  id: number;
  postId: number;
  userId: number;
  folderId?: number;
  createdAt: string;
}

export interface ScrapFolder {
  id: number;
  name: string;
  description?: string;
  userId: number;
  scrapCount: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScrapFolderCreateRequest {
  name: string;
  description?: string;
  isDefault?: boolean;
}

export interface ScrapFolderUpdateRequest {
  name?: string;
  description?: string;
}
