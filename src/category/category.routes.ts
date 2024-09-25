import express from 'express';

import { Roles } from '../common/constants';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { validateData } from '../common/middlewares/validateData';
import logger from '../config/logger';
import { CategoryController } from './category.controller';
import Categories from './category.model';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';
import { CategorySchema } from './category.validator';

const router = express.Router();

const categoryRepository = new CategoryRepository(Categories);

const categoryService = new CategoryService(categoryRepository);

const categoryController = new CategoryController(categoryService, logger);

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    validateData(CategorySchema),
    (req, res, next) => categoryController.create(req, res, next),
);

export default router;
