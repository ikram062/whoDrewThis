import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';

const formatZodError = (error: ZodError) => {
    const formattedErrors: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!formattedErrors[path]) {
            formattedErrors[path] = [];
        }
        formattedErrors[path].push(issue.message);
    });

    return formattedErrors;
};

export const validateRequest = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const schemaShape = (schema as any)._def?.shape;

            if (schemaShape && (schemaShape.body || schemaShape.params || schemaShape.query)) {
                const dataToValidate: any = {};
                if (schemaShape.body) dataToValidate.body = req.body;
                if (schemaShape.params) dataToValidate.params = req.params;
                if (schemaShape.query) dataToValidate.query = req.query;

                schema.parse(dataToValidate);
            } else {
                schema.parse(req.query);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = formatZodError(error);
                logger.warn('Validation failed', { path: req.path, errors });
                return ApiResponse.validationError(res, errors, 'Validation failed');
            }

            logger.error('Validation error:', error);
            return ApiResponse.serverError(res, 'Validation error');
        }
    };
};