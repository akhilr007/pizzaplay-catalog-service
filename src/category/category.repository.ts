import { Categories } from './category.model';
import { Category } from './category.types';

export class CategoryRepository {
    constructor(private model: typeof Categories) {}

    async create(category: Category) {
        return this.model.create(category);
    }
}
