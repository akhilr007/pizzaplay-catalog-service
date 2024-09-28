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
}
