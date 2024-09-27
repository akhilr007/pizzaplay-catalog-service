import { ProductRepository } from './product.repository';
import { Product } from './product.type';

export class ProductService {
    constructor(private productRepository: ProductRepository) {}

    async create(product: Product) {
        const newProduct = await this.productRepository.create(product);
        return newProduct;
    }
}
