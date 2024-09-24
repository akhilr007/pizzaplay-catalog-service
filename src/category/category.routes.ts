import express from 'express';

import logger from '../config/logger';
import { validateData } from '../middlewares/validateData';
import { CategoryController } from './category.controller';
import { CategorySchema } from './category.validator';

const router = express.Router();

const categoryController = new CategoryController(logger);

router.post('/', validateData(CategorySchema), (req, res, next) =>
    categoryController.create(req, res, next),
);

export default router;
