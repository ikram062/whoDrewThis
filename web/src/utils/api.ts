import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { API_URL } from "../utils/constants";
import type { ApiResponse, RefreshTokenResponse } from "./types";

class ApiService {
  private api: AxiosInstance;
  private authToken: string | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        const isAuthEndpoint = this.isAuthEndpoint(originalRequest.url);

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.handleTokenRefresh();

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }

        return this.handleApiError(error);
      }
    );
  }

  private isAuthEndpoint(url: string): boolean {
    if (!url) return false;

    const authEndpoints = ["/auth/login", "/auth/register", "/auth/refresh-token", "/auth/logout"];

    return authEndpoints.some((endpoint) => url.includes(endpoint));
  }

  private async handleTokenRefresh(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    this.refreshPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${API_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 30000,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        this.setAuthToken(accessToken);

        return accessToken;
      } catch (error) {
        this.clearCompleteAuthData();
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private handleAuthFailure(): void {
    this.clearCompleteAuthData();

    window.dispatchEvent(
      new CustomEvent("auth:failure", {
        detail: { reason: "token_refresh_failed" },
      })
    );

    if (typeof window !== "undefined") {
      const redirectUrl = `/signin`;
      window.location.href = redirectUrl;
    }
  }

  private clearCompleteAuthData(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    this.authToken = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  private handleApiError(error: any): Promise<never> {
    if (error.code === "ERR_NETWORK") {
      throw new Error("Network connection failed");
    }
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timed out");
    }
    if (error.response) {
      const message = this.extractErrorMessage(error.response);
      throw new Error(message || `Request failed with status ${error.response.status}`);
    }

    throw new Error(error.message || "An unexpected error occurred");
  }

  private extractErrorMessage(response: any): string {
    const data = response.data;

    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (data?.errors?.[0]) return data.errors[0];
    if (data?.detail) return data.detail;

    return "";
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  public clearAllAuthData(): void {
    this.clearCompleteAuthData();
  }

  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    const { data } = response;

    if (typeof data !== "object" || data === null) {
      return {
        success: true,
        message: "Success",
        data: data as any,
      };
    }

    if (data.success === undefined) {
      return {
        success: true,
        message: "Success",
        data: data as any,
      };
    }

    return data;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.get<ApiResponse<T>>(url, config);
    return this.handleResponse(response);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.post<ApiResponse<T>>(url, data, config);
    return this.handleResponse(response);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.put<ApiResponse<T>>(url, data, config);
    return this.handleResponse(response);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.patch<ApiResponse<T>>(url, data, config);
    return this.handleResponse(response);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.delete<ApiResponse<T>>(url, config);
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
export default apiService;
