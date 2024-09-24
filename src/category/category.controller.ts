import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';

import logger from '../config/logger';

export class CategoryController {
    constructor(public logger: Logger) {}

    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            res.json({ message: 'category created' });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
}
