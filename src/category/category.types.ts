export interface PriceOption {
    priceType: 'base' | 'additional';
    availableOptions: string[];
}

export type PriceConfiguration = Record<string, PriceOption>;

export interface Attribute {
    name: string;
    widgetType: 'switch' | 'radio';
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}
