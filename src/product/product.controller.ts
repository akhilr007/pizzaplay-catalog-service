import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Logger } from 'winston';

import { ProductService } from './product.service';

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
    ) {}

    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            this.logger.info(
                'ProductController :: Request to create a new Product',
            );

            // TODO : Image upload
            const {
                name,
                description,
                priceConfiguration,
                attributes,
                tenantId,
                categoryId,
                isPublished,
            } = req.body;

            const product = {
                name,
                description,
                priceConfiguration,
                attributes,
                tenantId,
                categoryId,
                isPublished,
                image: 'image.jpeg',
            };

            const newProduct = await this.productService.create(product);
            // TODO : Send response
            res.status(StatusCodes.OK).json(newProduct);
        } catch (error) {
            next(error);
        }
    }
}
