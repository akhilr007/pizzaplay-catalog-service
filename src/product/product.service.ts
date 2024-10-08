import { UploadedFile } from 'express-fileupload';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';

import { FileStorage } from '../common/types/storage';
import { ProductRepository } from './product.repository';
import { Filter, PaginateQuery, Product } from './product.type';

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
        tenantId: string;
        isAdmin: boolean;
        body: Product;
        imageFile: UploadedFile | undefined;
    }) {
        const { productId, body, imageFile, tenantId, isAdmin } = data;

        const existingProduct = await this.getById(productId);

        if (isAdmin === false) {
            if (existingProduct?.tenantId !== String(tenantId)) {
                throw createHttpError(StatusCodes.FORBIDDEN, 'Access Denied');
            }
        }

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

    async getProducts(
        q: string,
        filters: Filter,
        paginateQuery: PaginateQuery,
    ) {
        const searchQueryRegExp = new RegExp(q, 'i');

        const matchQuery = { ...filters, name: searchQueryRegExp };

        const products = await this.productRepository.getAggregate(
            matchQuery,
            paginateQuery,
        );
        return products;
    }

    async deleteProduct(productId: string) {
        const product = await this.getById(productId);
        if (!product) {
            throw createHttpError(StatusCodes.NOT_FOUND, 'Product not found');
        }

        await this.deleteImage(product?.image);
        const response = await this.productRepository.delete(productId);
        return response;
    }

    parseProductData(body: Product, imageName: string) {
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

    getImageUri(fileName: string) {
        return this.storage.getObjectUri(fileName);
    }

    async getById(productId: string): Promise<Product | null> {
        return await this.productRepository.getById(productId);
    }
}
