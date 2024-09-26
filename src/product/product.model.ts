import mongoose from 'mongoose';

const productConfigurationSchema = new mongoose.Schema({
    priceType: {
        type: String,
        enum: ['base', 'additional'],
    },
    availableOptions: {
        type: Map,
        of: Number,
    },
});

const attributeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        trim: true,
    },
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
            trim: true,
        },
        priceConfiguration: {
            type: Map,
            of: productConfigurationSchema,
        },
        attributes: [attributeSchema],
        tenantId: {
            type: String,
            required: true,
            trim: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Products = mongoose.model('Product', productSchema);

export default Products;
