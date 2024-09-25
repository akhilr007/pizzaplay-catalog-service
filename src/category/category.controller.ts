import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
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

    async getById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const categoryId = req.params.id;
        this.logger.info(
            'CategoryController :: Request for getting a category with id ' +
                categoryId,
        );

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            this.logger.error(
                'CategoryController :: Invalid category id format: ' +
                    categoryId,
            );
            next(createHttpError(StatusCodes.BAD_REQUEST, 'Invalid URL param'));
            return;
        }

        try {
            const category = await this.categoryService.getById(categoryId);
            if (!category) {
                this.logger.error(
                    'CategoryController :: Category not found with id:' +
                        categoryId,
                );
                next(
                    createHttpError(
                        StatusCodes.BAD_REQUEST,
                        'Invalid url param',
                    ),
                );
                return;
            }

            this.logger.info(
                'Successfully retrieved category with id ' + categoryId,
            );
            res.status(StatusCodes.OK).send(category);
        } catch (error) {
            this.logger.error(error);
            next(error);
        }
    }
}
