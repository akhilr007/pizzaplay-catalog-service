import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';

import { FileStorage } from '../common/types/storage';
import { ProductService } from './product.service';

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
        try {
            this.logger.info(
                'ProductController :: Request to create a new Product',
            );

            const { files } = req;
            if (!files || !files.image) {
                this.logger.error('Product Image is required');
                next(
                    createHttpError(
                        StatusCodes.BAD_REQUEST,
                        'Image is required',
                    ),
                );
                return;
            }

            const imageFile = files.image as UploadedFile;
            const imageName = uuidv4();
            const imageUrl = await this.storage.upload({
                fileName: imageName,
                fileData: imageFile.data,
            });

            this.logger.info(imageUrl);

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
                image: imageName,
            };

            const newProduct = await this.productService.create(product);

            this.logger.info('Product created successfully with id', {
                id: newProduct._id,
            });

            res.status(StatusCodes.OK).json(newProduct);
        } catch (error) {
            next(error);
        }
    }
}
