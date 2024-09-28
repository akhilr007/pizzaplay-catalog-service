import Toppings from './topping.model';
import { Topping } from './topping.type';

export class ToppingRepository {
    constructor(private readonly model: typeof Toppings) {}

    async create(topping: Topping) {
        return await this.model.create(topping);
    }
}
