import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { Logger } from 'winston';

import { AuthRequest } from '../common/types';
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

    async update(req: Request, res: Response, next: NextFunction) {
        const toppingId = req.params.id;
        this.logger.info(
            'ToppingController :: Request for updating topping with ID: ' +
                toppingId,
        );

        if (!mongoose.Types.ObjectId.isValid(toppingId)) {
            this.logger.error(
                'ToppingController :: Invalid topping id format: ' + toppingId,
            );
            next(createHttpError(StatusCodes.BAD_REQUEST, 'Invalid URL param'));
            return;
        }

        try {
            const tenantId = (req as AuthRequest).auth.tenant;
            const isAdmin = (req as AuthRequest).auth.role === 'admin';

            const { files, body } = req;
            const updatedTopping = await this.toppingService.updateProduct({
                toppingId,
                tenantId,
                isAdmin,
                body,
                imageFile: files?.image as UploadedFile,
            });

            this.logger.info(
                `Topping updated successfully with id ${toppingId}`,
            );

            res.status(StatusCodes.OK).json(updatedTopping);
        } catch (error) {
            next(error);
        }
    }

    async getToppings(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        this.logger.info(
            'ToppingController :: Request to retrieve all toppings',
        );
        try {
            const toppings = await this.toppingService.getToppings();

            const finalToppings = toppings.map((topping) => {
                return {
                    ...topping,
                    image: this.toppingService.getImageUri(topping.image),
                };
            });

            this.logger.info('Toppings retrieved successfully');
            res.status(StatusCodes.OK).json(finalToppings);
        } catch (error) {
            next(error);
        }
    }

    async getTopping(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const toppingId = req.params.id;
        this.logger.info(
            'ToppingController :: Request to get a Topping with ID: ' +
                toppingId,
        );

        if (!mongoose.Types.ObjectId.isValid(toppingId)) {
            this.logger.error(
                'ToppingController :: Invalid topping id format: ' + toppingId,
            );
            next(createHttpError(StatusCodes.BAD_REQUEST, 'Invalid URL param'));
            return;
        }

        try {
            const topping = await this.toppingService.getById(toppingId);
            if (!topping) {
                next(
                    createHttpError(StatusCodes.NOT_FOUND, 'Topping not found'),
                );
                return;
            }

            const finalTopping = this.toppingService.parseToppingData(
                topping,
                this.toppingService.getImageUri(topping.image),
            );

            this.logger.info(
                'Successfully retrieved a topping with ID: ' + toppingId,
            );
            res.status(StatusCodes.OK).json(finalTopping);
        } catch (error) {
            next(error);
        }
    }

    async deleteTopping(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const toppingId = req.params.id;
        this.logger.info(
            'ToppingController :: Request to delete a Product with ID: ' +
                toppingId,
        );

        if (!mongoose.Types.ObjectId.isValid(toppingId)) {
            this.logger.error(
                'ToppingController :: Invalid product id format: ' + toppingId,
            );
            next(createHttpError(StatusCodes.BAD_REQUEST, 'Invalid URL param'));
            return;
        }

        try {
            const tenantId = (req as AuthRequest).auth.tenant;
            const isAdmin = (req as AuthRequest).auth.role === 'admin';

            const response = await this.toppingService.deleteTopping(
                toppingId,
                tenantId,
                isAdmin,
            );

            this.logger.info(
                'Successfully deleted a topping with ID: ' + toppingId,
            );

            res.status(StatusCodes.OK).json({ success: response.acknowledged });
        } catch (error) {
            next(error);
        }
    }
}
