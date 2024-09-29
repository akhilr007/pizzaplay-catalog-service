import z from 'zod';

export const ToppingSchema = z.object({
    name: z
        .string({
            required_error: 'Topping Name is required',
            invalid_type_error: 'Topping Name must be string',
        })
        .trim()
        .min(1),
    price: z.preprocess(
        (val) => {
            if (typeof val === 'string') {
                const parsed = parseFloat(val);
                return isNaN(parsed) ? undefined : parsed;
            }
            return val;
        },
        z
            .number({
                required_error: 'Topping Price is required',
                invalid_type_error: 'Topping Price must be a number',
            })
            .min(0, { message: 'Topping Price must be a positive number' }),
    ),
    tenantId: z
        .string({
            required_error: 'Tenant Id is required',
            invalid_type_error: 'Tenant Id must be a string',
        })
        .trim()
        .min(1),
    isPublished: z.preprocess((arg) => arg === 'true', z.boolean().optional()),
});
