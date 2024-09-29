import Toppings from './topping.model';
import { Topping } from './topping.type';

export class ToppingRepository {
    constructor(private readonly model: typeof Toppings) {}

    async create(topping: Topping) {
        return await this.model.create(topping);
    }

    async getById(id: string) {
        return await this.model.findOne({ _id: id });
    }

    async update(id: string, topping: Topping): Promise<Topping | null> {
        return await this.model
            .findByIdAndUpdate(id, topping, { new: true })
            .exec();
    }
}
