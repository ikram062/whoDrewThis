import type { ReactNode } from "react";

export interface PropsType {
  children: ReactNode;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  isVerified: Boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface LoginData {
  email: string;
  password: string;
}
