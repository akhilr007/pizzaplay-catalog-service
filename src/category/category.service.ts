import { CategoryRepository } from './category.repository';
import { Category } from './category.types';

export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}

    async create(category: Category) {
        const newCategory = await this.categoryRepository.create(category);
        return newCategory;
    }

    async getAll(): Promise<Category[]> {
        return this.categoryRepository.getAllCategories();
    }
}
