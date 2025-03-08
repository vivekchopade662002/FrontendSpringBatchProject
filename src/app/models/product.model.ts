export interface Product {
    id?: number;  // Optional for creation, required for existing products
    name: string;
    description: string | null;
    price: number;
    category: string;
}
