import { Categories } from './category.model';
import { Category } from './category.types';

export class CategoryRepository {
    constructor(private model: typeof Categories) {}

    async create(category: Category) {
        return this.model.create(category);
    }

    async getAllCategories(): Promise<Category[]> {
        return this.model.find({});
    }

    async getById(id: string): Promise<Category | null> {
        return this.model.findOne({ _id: id });
    }

    async updateById(
        id: string,
        category: Partial<Category>,
    ): Promise<Category | null> {
        return this.model.findByIdAndUpdate(id, category, { new: true }).exec();
    }
}
