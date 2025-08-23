import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Invalid email format'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters long')
            .max(100, 'Password must be less than 100 characters'),
        username: z
            .string()
            .min(1, 'Full name is required')
            .max(100, 'Full name must be less than 100 characters')
            .trim(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Invalid email format'),
        password: z
            .string()
            .min(1, 'Password is required'),
    }),
});

export const refreshTokenSchema = z.object({
    body: z.object({
        token: z
            .string()
            .min(1, 'Refresh token is required'),
    }),
});

export type RegisterBody = z.infer<typeof registerSchema>['body'];
export type LoginBody = z.infer<typeof loginSchema>['body'];
export type RefreshTokenBody = z.infer<typeof refreshTokenSchema>['body'];