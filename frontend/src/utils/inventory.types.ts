
export type Inventory = {
    _id: string,
    name: string;
    price: number;
    quantity: number;
    category: string;
    images: { imageUrl: string, name: string }[];
    isDeleted: boolean;
}

export type InventoryInput = {
    name: string;
    price: number;
    quantity: number;
    category: string;
    images: { imageUrl: string, name: string }[];
}