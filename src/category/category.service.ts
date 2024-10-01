import { CategoryRepository } from './category.repository';
import { Category } from './category.types';

export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}

    async create(category: Category) {
        const newCategory = await this.categoryRepository.create(category);
        return newCategory;
    }

    async getAll(): Promise<Category[]> {
        return await this.categoryRepository.getAllCategories();
    }

    async getById(categoryId: string): Promise<Category | null> {
        return await this.categoryRepository.getById(categoryId);
    }

    async updateById(
        categoryId: string,
        category: Partial<Category>,
    ): Promise<Category | null> {
        return await this.categoryRepository.updateById(categoryId, category);
    }
}
