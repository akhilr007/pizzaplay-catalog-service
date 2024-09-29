import { Router } from 'express';

import categoryRoutes from '../category/category.routes';
import productRoutes from '../product/product.routes';
import toppingRoutes from '../topping/topping.routes';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/toppings', toppingRoutes);

export default router;
