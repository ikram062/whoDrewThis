import apiService from "../utils/api";
import type {
  AuthResponse,
  CurrentUserResponse,
  LoginData,
  RegisterData,
} from "../utils/types";

class AuthApi {
  async register(data: RegisterData): Promise<AuthResponse> {
    return await apiService.post("/auth/register", data);
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return await apiService.post("/auth/login", data);
  }

  async logout(): Promise<void> {
    await apiService.post("/auth/logout");
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return await apiService.post("/auth/refresh-token", { refreshToken });
  }

  async getCurrentUser(): Promise<CurrentUserResponse> {
    return await apiService.get("/auth/me");
  }
}

const authApi = new AuthApi();
export default authApi;
