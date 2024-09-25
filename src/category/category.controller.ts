import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Logger } from 'winston';

import { CategoryService } from './category.service';
import { Category } from './category.types';

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {}

    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { name, priceConfiguration, attributes } =
                req.body as Category;

            const category = await this.categoryService.create({
                name,
                priceConfiguration,
                attributes,
            });

            this.logger.info('Successfully created category', {
                id: category._id,
            });

            res.status(StatusCodes.CREATED).json({ id: category._id });
        } catch (error) {
            this.logger.error(error);
            next(error);
        }
    }

    async getAll(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const categories = await this.categoryService.getAll();

            this.logger.info('Successfully retrieved all categories');

            res.status(StatusCodes.OK).json(categories);
        } catch (error) {
            this.logger.error(error);
            next(error);
        }
    }
}
