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
import { ProductController } from './product.controller';
import Products from './product.model';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductSchema } from './product.validator';

const router = express.Router();

const productRepository = new ProductRepository(Products);

const cloudinaryStorage = new CloudinaryStorage();

const productService = new ProductService(
    productRepository,
    cloudinaryStorage,
    logger,
);

const productController = new ProductController(
    productService,
    cloudinaryStorage,
    logger,
);

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
    validateData(ProductSchema),
    (req, res, next) => productController.create(req, res, next),
);

router.put(
    '/:id',
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
    validateData(ProductSchema),
    (req, res, next) => productController.update(req, res, next),
);

router.get('/', (req, res, next) =>
    productController.getProducts(req, res, next),
);

router.get('/:id', (req, res, next) =>
    productController.getProduct(req, res, next),
);

router.delete(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN, Roles.CUSTOMER]),
    (req, res, next) => productController.deleteProduct(req, res, next),
);
export default router;
