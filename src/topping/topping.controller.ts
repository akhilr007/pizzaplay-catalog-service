import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { StatusCodes } from 'http-status-codes';
import { Logger } from 'winston';

import { ToppingService } from './topping.service';

export class ToppingController {
    constructor(
        private readonly toppingService: ToppingService,
        private readonly logger: Logger,
    ) {}

    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        this.logger.info(
            'ToppingController :: Request to create a new Topping',
        );

        try {
            const { files, body } = req;

            const topping = await this.toppingService.createProduct({
                body,
                imageFile: files?.image as UploadedFile,
            });

            this.logger.info(
                'Topping created successfully with id' + topping._id,
            );

            res.status(StatusCodes.OK).json({ id: topping._id });
        } catch (error) {
            next(error);
        }
    }
}
