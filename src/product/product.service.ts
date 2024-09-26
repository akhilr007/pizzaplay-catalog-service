import { ProductRepository } from './product.repository';
import { Product } from './product.type';

export class ProductService {
    constructor(private productRepository: ProductRepository) {}

    async create(product: Product): Promise<Product> {
        return this.productRepository.create(product);
    }
}
