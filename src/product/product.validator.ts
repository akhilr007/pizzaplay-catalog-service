import { z } from 'zod';

// PriceOption schema
const PriceOptionSchema = z.object({
    priceType: z.enum(['base', 'additional'], {
        errorMap: () => ({
            message: "Price Type must be either 'base' or 'additional'",
        }),
    }),
    availableOptions: z.record(z.string(), z.number(), {
        required_error: 'Available Options must have a value',
        invalid_type_error: 'Available option value must be a number',
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
    value: z.any({
        required_error: 'Attribute Value is required',
    }),
});

export const ProductSchema = z.object({
    name: z
        .string({
            required_error: 'Product name is required',
            invalid_type_error: 'Product name must be string',
        })
        .trim(),
    description: z
        .string({
            required_error: 'Product Description is required',
            invalid_type_error: 'Product Description must be string',
        })
        .trim(),
    priceConfiguration: z.preprocess(
        (arg) => (typeof arg === 'string' ? JSON.parse(arg) : arg),
        PriceConfigurationSchema,
    ),
    attributes: z.preprocess(
        (arg) => (typeof arg === 'string' ? JSON.parse(arg) : arg),
        z.array(AttributeSchema),
    ),
    tenantId: z
        .string({
            required_error: 'Tenant Id is required',
            invalid_type_error: 'Tenant Id must be a string',
        })
        .trim(),
    categoryId: z.any(),
    isPublished: z.preprocess((arg) => arg === 'true', z.boolean().optional()),
});
