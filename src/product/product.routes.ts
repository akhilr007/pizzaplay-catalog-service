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

const productService = new ProductService(productRepository);

const cloudinaryStorage = new CloudinaryStorage();

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

export default router;
