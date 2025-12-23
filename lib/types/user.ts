export interface User {
  id: number;
  email: string;
  username: string;
  nickname: string;
  role: UserRole;
  status: UserStatus;
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  bio?: string;
  avatarUrl?: string;
  website?: string;
  location?: string;
}

export enum UserRole {
  GUEST = 'GUEST',
  MEMBER = 'MEMBER',
  REGULAR = 'REGULAR',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  nickname: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
