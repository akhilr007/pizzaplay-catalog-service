import { z } from 'zod';

// PriceOption schema
const PriceOptionSchema = z.object({
    priceType: z.enum(['base', 'additional'], {
        errorMap: () => ({
            message: "Price Type must be either 'base' or 'additional'",
        }),
    }),
    availableOptions: z.array(z.string()).min(1, {
        message: 'Available Options must contain at least one option',
    }),
});

// PriceConfiguration schema
const PriceConfigurationSchema = z.record(z.string(), PriceOptionSchema, {
    required_error: 'Price Configuration is required',
});

// Attribute schema
const AttributeSchema = z.object({
    name: z
        .string({
            required_error: 'Attribute Name is required',
            invalid_type_error: 'Attribute Name must be string',
        })
        .trim(),
    widgetType: z.enum(['switch', 'radio'], {
        errorMap: () => ({
            message: "Widget Type must be either 'switch' or 'radio'",
        }),
    }),
    defaultValue: z
        .string({
            required_error: 'Default Value is required',
            invalid_type_error: 'Default Value must be string',
        })
        .trim(),
    availableOptions: z.array(z.string().trim(), {
        required_error: 'Available Options should have at least one option',
        invalid_type_error:
            'Attribute: available options must be an array of string',
    }),
});

// Category schema
export const CategorySchema = z.object({
    name: z
        .string({
            required_error: 'Category name is required',
            invalid_type_error: 'Category name must be string',
        })
        .trim(),
    priceConfiguration: PriceConfigurationSchema,
    attributes: z.array(AttributeSchema, {
        required_error: 'Attribute Name is required',
        invalid_type_error: 'Attribute should be an array',
    }),
});
