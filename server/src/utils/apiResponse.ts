import { Response } from "express";

interface PaginationData {
  // ikram later
}

export class ApiResponse {
  static success(
    res: Response,
    data: any = null,
    message: string = "Success"
  ): void {
    res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static created(
    res: Response,
    data: any = null,
    message: string = "Created successfully"
  ): void {
    res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static successWithPagination(
    res: Response,
    data: any[],
    pagination: PaginationData,
    message: string = "Success"
  ): void {
    res.status(200).json({
      success: true,
      message,
      data,
      pagination,
    });
  }

  static badRequest(
    res: Response,
    message: string = "Bad request",
    errors: any = null
  ): void {
    res.status(400).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  }

  static unauthorized(res: Response, message: string = "Unauthorized"): void {
    res.status(401).json({
      success: false,
      message,
    });
  }

  static forbidden(res: Response, message: string = "Forbidden"): void {
    res.status(403).json({
      success: false,
      message,
    });
  }

  static notFound(res: Response, message: string = "Not found"): void {
    res.status(404).json({
      success: false,
      message,
    });
  }

  static conflict(res: Response, message: string = "Conflict"): void {
    res.status(409).json({
      success: false,
      message,
    });
  }

  static validationError(
    res: Response,
    errors: any,
    message: string = "Validation failed"
  ): void {
    res.status(422).json({
      success: false,
      message,
      errors,
    });
  }

  static serverError(
    res: Response,
    message: string = "Internal server error"
  ): void {
    res.status(500).json({
      success: false,
      message,
    });
  }

  static tooManyRequests(
    res: Response,
    message: string = "Too many requests"
  ): void {
    res.status(429).json({
      success: false,
      message,
    });
  }
}
