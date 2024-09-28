import express from 'express';
import fileUpload from 'express-fileupload';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';

import { Roles } from '../common/constants';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { validateData } from '../common/middlewares/validateData';
import { CloudinaryStorage } from '../common/services/Cloudinary.service';
import logger from '../config/logger';
import { ToppingController } from './topping.controller';
import Toppings from './topping.model';
import { ToppingRepository } from './topping.repository';
import { ToppingService } from './topping.service';
import { ToppingSchema } from './topping.validator';

const router = express.Router();

const toppingRepository = new ToppingRepository(Toppings);

const cloudinaryStorage = new CloudinaryStorage();

const toppingService = new ToppingService(
    toppingRepository,
    cloudinaryStorage,
    logger,
);

const toppingController = new ToppingController(toppingService, logger);

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            next(
                createHttpError(
                    StatusCodes.BAD_REQUEST,
                    'File size exceeds the limit',
                ),
            );
        },
    }),
    validateData(ToppingSchema),
    (req, res, next) => toppingController.create(req, res, next),
);

// router.put(
//     '/:id',
//     authenticate,
//     canAccess([Roles.ADMIN, Roles.MANAGER]),
//     fileUpload({
//         limits: { fileSize: 500 * 1024 },
//         abortOnLimit: true,
//         limitHandler: (req, res, next) => {
//             next(
//                 createHttpError(
//                     StatusCodes.BAD_REQUEST,
//                     'File size exceeds the limit',
//                 ),
//             );
//         },
//     }),
//     validateData(ProductSchema),
//     (req, res, next) => toppingController.update(req, res, next),
// );

// router.get('/', (req, res, next) =>
//     toppingController.getProducts(req, res, next),
// );

// router.get('/:id', (req, res, next) =>
//     toppingController.getProduct(req, res, next),
// );

// router.delete(
//     '/:id',
//     authenticate,
//     canAccess([Roles.ADMIN, Roles.CUSTOMER]),
//     (req, res, next) => toppingController.deleteProduct(req, res, next),
// );
export default router;
