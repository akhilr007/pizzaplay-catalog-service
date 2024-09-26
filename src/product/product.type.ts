import { Types } from 'mongoose';

export interface PriceOption {
    priceType: 'base' | 'additional';
    availableOptions: Map<string, number>;
}

export type PriceConfiguration = Record<string, PriceOption>;

export interface Attribute {
    name: string;
    value: unknown;
}

export interface Product {
    name: string;
    description: string;
    image: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
    tenantId: string;
    categoryId: Types.ObjectId;
    isPublished: boolean;
}
