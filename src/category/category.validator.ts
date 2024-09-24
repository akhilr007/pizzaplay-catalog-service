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
const PriceConfigurationSchema = z
    .record(z.string(), PriceOptionSchema)
    .refine((val) => Object.keys(val).length > 0, {
        message: 'Price Configuration must have at least one key-value pair',
    });

// Attribute schema
const AttributeSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Attribute Name is required and cannot be empty' }),
    widgetType: z.enum(['switch', 'radio'], {
        errorMap: () => ({
            message: "Widget Type must be either 'switch' or 'radio'",
        }),
    }),
    defaultValue: z
        .string()
        .min(1, { message: 'Default Value is required and cannot be empty' }),
    availableOptions: z.array(z.string()).min(1, {
        message: 'Available Options must contain at least one option',
    }),
});

// Category schema
export const CategorySchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Category name is required and cannot be empty' }),
    priceConfiguration: PriceConfigurationSchema,
    attributes: z.array(AttributeSchema).min(1, {
        message: 'Category must have at least one attribute',
    }),
});
