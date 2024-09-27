import Products from './product.model';
import { Product } from './product.type';

export class ProductRepository {
    constructor(private model: typeof Products) {}

    async create(product: Product) {
        return await this.model.create(product);
    }

    async getById(id: string): Promise<Product | null> {
        return await this.model.findOne({ _id: id });
    }

    async update(id: string, product: Product): Promise<Product | null> {
        return await this.model
            .findByIdAndUpdate(id, product, { new: true })
            .exec();
    }
}
