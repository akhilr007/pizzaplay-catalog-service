import express from 'express';
import fileUpload from 'express-fileupload';

import { Roles } from '../common/constants';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { validateData } from '../common/middlewares/validateData';
import logger from '../config/logger';
import { ProductController } from './product.controller';
import Products from './product.model';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductSchema } from './product.validator';

const router = express.Router();

const productRepository = new ProductRepository(Products);

const productService = new ProductService(productRepository);

const productController = new ProductController(productService, logger);

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload(),
    validateData(ProductSchema),
    (req, res, next) => productController.create(req, res, next),
);

export default router;
