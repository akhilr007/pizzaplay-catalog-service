import { UploadedFile } from 'express-fileupload';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';

import { FileStorage } from '../common/types/storage';
import { ToppingRepository } from './topping.repository';
import { Topping } from './topping.type';

export class ToppingService {
    constructor(
        private readonly toppingRepository: ToppingRepository,
        private readonly storage: FileStorage,
        private readonly logger: Logger,
    ) {}

    async createProduct(data: {
        body: Topping;
        imageFile: UploadedFile | undefined;
    }) {
        const { body, imageFile } = data;

        if (!imageFile) {
            throw createHttpError(
                StatusCodes.BAD_REQUEST,
                'Topping Image is required.',
            );
        }

        const imageName = await this.uploadImage(imageFile);

        const toppingData = this.parseToppingData(body, imageName);

        return await this.toppingRepository.create(toppingData);
    }

    async updateProduct(data: {
        toppingId: string;
        tenantId: string;
        isAdmin: boolean;
        body: Topping;
        imageFile: UploadedFile | undefined;
    }) {
        const { toppingId, body, imageFile, tenantId, isAdmin } = data;

        const existingTopping = await this.getById(toppingId);

        if (isAdmin === false) {
            if (existingTopping?.tenantId !== String(tenantId)) {
                throw createHttpError(StatusCodes.FORBIDDEN, 'Access Denied');
            }
        }

        if (!existingTopping) {
            throw createHttpError(StatusCodes.NOT_FOUND, 'Product not found');
        }

        let imageName = existingTopping.image;

        if (imageFile) {
            imageName = await this.uploadImage(imageFile);
            await this.deleteImage(existingTopping.image);
        }

        const updatedToppingData = this.parseToppingData(body, imageName);

        return await this.toppingRepository.update(
            toppingId,
            updatedToppingData,
        );
    }

    parseToppingData(body: Topping, imageName: string) {
        const { name, tenantId, price, isPublished } = body;

        return {
            name,
            tenantId,
            price,
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

    async getById(toppingId: string) {
        return await this.toppingRepository.getById(toppingId);
    }
}
