import { NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { ZodEffects, ZodError, ZodObject } from 'zod';

export function validateData(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: ZodObject<any> | ZodEffects<ZodObject<any>>,
    target: 'body' | 'query' | 'params' = 'body',
) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const dataToValidate = req[target];
            const validatedData = schema.parse(dataToValidate);
            req[target] = validatedData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const validationErrors = error.errors.map((err) => ({
                    type: 'ValidationError',
                    msg: err.message,
                    path: err.path.join(', '),
                    location: target,
                }));
                const firstError = validationErrors[0];
                const httpError = createHttpError(
                    StatusCodes.BAD_REQUEST,
                    firstError.msg,
                    {
                        errors: validationErrors,
                    },
                );
                (httpError as HttpError).errors = validationErrors; // Optionally attach full errors
                next(httpError);
            } else {
                next(
                    createHttpError(
                        StatusCodes.INTERNAL_SERVER_ERROR,
                        'Internal Server Error',
                    ),
                );
            }
        }
    };
}
