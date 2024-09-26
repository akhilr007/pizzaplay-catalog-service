import express from 'express';

import { Roles } from '../common/constants';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { validateData } from '../common/middlewares/validateData';
import logger from '../config/logger';
import { ProductController } from './product.controller';
import { ProductSchema } from './product.validator';

const router = express.Router();

const productController = new ProductController(logger);

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    validateData(ProductSchema),
    (req, res, next) => productController.create(req, res, next),
);

export default router;
