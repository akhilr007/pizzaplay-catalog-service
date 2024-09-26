import { Router } from 'express';

import categoryRoutes from '../category/category.routes';
import productRoutes from '../product/product.routes';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

export default router;
