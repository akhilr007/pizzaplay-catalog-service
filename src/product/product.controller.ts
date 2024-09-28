import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { Logger } from 'winston';

import { AuthRequest } from '../common/types';
import { FileStorage } from '../common/types/storage';
import { ProductService } from './product.service';
import { Filter } from './product.type';

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
        private logger: Logger,
    ) {}

    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        this.logger.info(
            'ProductController :: Request to create a new Product',
        );

        try {
            const { files, body } = req;

            const product = await this.productService.createProduct({
                body,
                imageFile: files?.image as UploadedFile,
            });

            this.logger.info(
                'Product created successfully with id' + product._id,
            );

            res.status(StatusCodes.OK).json({ id: product._id });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const productId = req.params.id;
        this.logger.info(
            'ProductController :: Request for updating product with id ' +
                productId,
        );

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            this.logger.error(
                'ProductController :: Invalid product id format: ' + productId,
            );
            next(createHttpError(StatusCodes.BAD_REQUEST, 'Invalid URL param'));
            return;
        }

        try {
            const tenantId = (req as AuthRequest).auth.tenant;
            const isAdmin = (req as AuthRequest).auth.role === 'admin';

            const { files, body } = req;
            const updatedProduct = await this.productService.updateProduct({
                productId,
                tenantId,
                isAdmin,
                body,
                imageFile: files?.image as UploadedFile,
            });

            this.logger.info(
                `Product updated successfully with id ${productId}`,
            );

            res.status(StatusCodes.OK).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    }

    async getProducts(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        this.logger.info(
            'ProductController :: Request to retrieve all products',
        );
        try {
            const { q, tenantId, categoryId, isPublished } = req.query;

            const filters: Filter = {};

            if (isPublished === 'true') {
                filters.isPublished = true;
            }

            if (tenantId) {
                filters.tenantId = tenantId as string;
            }

            if (
                categoryId &&
                mongoose.Types.ObjectId.isValid(categoryId as string)
            ) {
                filters.categoryId = new mongoose.Types.ObjectId(
                    categoryId as string,
                );
            }

            const products = await this.productService.getProducts(
                q as string,
                filters,
            );

            this.logger.info('Products retrieved successfully');
            res.status(StatusCodes.OK).json(products);
        } catch (error) {
            next(error);
        }
    }
}
