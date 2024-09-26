import Products from './product.model';
import { Product } from './product.type';

export class ProductRepository {
    constructor(private model: typeof Products) {}

    async create(product: Product) {
        return this.model.create(product);
    }
}
