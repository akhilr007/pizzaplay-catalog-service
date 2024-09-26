import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';

export class ProductController {
    constructor(private logger: Logger) {}

    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            this.logger.info(
                'ProductController :: Request to create a new Product',
            );
        } catch (error) {
            next(error);
        }
    }
}
