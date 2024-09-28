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

    async getAggregate(matchQuery: object) {
        return await this.model
            .aggregate([
                {
                    $match: matchQuery,
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category',
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    name: 1,
                                    attributes: 1,
                                    priceConfiguration: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$category',
                },
            ])
            .exec();
    }
}
