import { Request, Response } from "express";
import logger from "../config/logger";
import { ApiResponse } from "../utils/apiResponse";
import {
  getCurrentUser,
  login,
  refreshToken,
  register,
} from "../services/auth.service";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const authData = await register(username, email, password);
    ApiResponse.created(res, authData, "User registered successfully");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    logger.error("Registration error: ", errorMessage);

    if (errorMessage === "Email already in use") {
      ApiResponse.conflict(res, errorMessage);
    } else {
      ApiResponse.serverError(res, "Internal server error during registration");
    }
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const authData = await login(email, password);
    ApiResponse.success(res, authData, "Login successful");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Login failed";
    logger.error("Login failed: ", errorMessage);
    ApiResponse.unauthorized(res, errorMessage);
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const authData = await refreshToken(token);
    ApiResponse.success(res, authData, "Refresh token successfully");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Refresh token failed";
    logger.error("Refresh token failed: ", errorMessage);
    ApiResponse.unauthorized(res, errorMessage);
  }
};

export const getCurrentUserController = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    if (!user) {
      ApiResponse.unauthorized(res, "User not authenticated");
    }

    const currentUser = await getCurrentUser(user.id);
    ApiResponse.success(res, currentUser, "Get current user info successfully");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Get current user failed";
    logger.error("Get current user failed: ", errorMessage);
    ApiResponse.serverError(res, errorMessage);
  }
};
