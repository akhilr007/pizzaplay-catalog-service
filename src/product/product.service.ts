import { UploadedFile } from 'express-fileupload';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';

import { FileStorage } from '../common/types/storage';
import { ProductRepository } from './product.repository';
import { Product } from './product.type';

export class ProductService {
    constructor(
        private productRepository: ProductRepository,
        private storage: FileStorage,
        private logger: Logger,
    ) {}

    async createProduct(data: {
        body: Product;
        imageFile: UploadedFile | undefined;
    }) {
        const { body, imageFile } = data;

        if (!imageFile) {
            throw createHttpError(
                StatusCodes.BAD_REQUEST,
                'Product Image is required.',
            );
        }

        const imageName = await this.uploadImage(imageFile);

        const productData = this.parseProductData(body, imageName);

        return await this.productRepository.create(productData);
    }

    async updateProduct(data: {
        productId: string;
        body: Product;
        imageFile: UploadedFile | undefined;
    }) {
        const { productId, body, imageFile } = data;

        const existingProduct = await this.getById(productId);

        if (!existingProduct) {
            throw createHttpError(StatusCodes.NOT_FOUND, 'Product not found');
        }

        let imageName = existingProduct.image;

        if (imageFile) {
            imageName = await this.uploadImage(imageFile);
            await this.deleteImage(existingProduct.image);
        }

        const updatedProductData = this.parseProductData(body, imageName);

        return await this.productRepository.update(
            productId,
            updatedProductData,
        );
    }

    private parseProductData(body: Product, imageName: string) {
        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublished,
        } = body;

        return {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublished,
            image: imageName,
        };
    }

    private async uploadImage(imageFile: UploadedFile): Promise<string> {
        const imageName = uuidv4();
        const imageUrl = await this.storage.upload({
            fileName: imageName,
            fileData: imageFile.data,
        });

        this.logger.info(`Image uploaded successfully: ${imageUrl}`);

        return imageName;
    }

    private async deleteImage(imageName: string): Promise<void> {
        if (imageName) {
            await this.storage.delete(imageName);
            this.logger.info(`Image deleted successfully: ${imageName}`);
        }
    }

    async getById(productId: string): Promise<Product | null> {
        return await this.productRepository.getById(productId);
    }
}
