import express from 'express';

import { validateData } from '../common/validateData';
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

router.post('/', validateData(CategorySchema), (req, res, next) =>
    categoryController.create(req, res, next),
);

export default router;
