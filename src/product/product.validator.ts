import mongoose from 'mongoose';
import { z } from 'zod';

// PriceOption schema
const PriceOptionSchema = z.object({
    priceType: z.enum(['base', 'additional'], {
        errorMap: () => ({
            message: "Price Type must be either 'base' or 'additional'",
        }),
    }),
    availableOptions: z.record(z.number(), {
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
    value: z.union([z.string().trim(), z.number()], {
        required_error: 'Attribute Value is required',
    }),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

const ImageSchema = z.object({
    image: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            'Only .jpg, .jpeg, .png and .webp formats are supported.',
        ),
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
    image: ImageSchema,
    priceConfiguration: PriceConfigurationSchema,
    attributes: z.array(AttributeSchema),
    tenantId: z
        .string({
            required_error: 'Tenant Id is required',
            invalid_type_error: 'Tenant Id must be a string',
        })
        .trim(),
    categoryId: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: 'Invalid Category Id',
        }),
    isPublished: z.boolean().default(false).optional(),
});
