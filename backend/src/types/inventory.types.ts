import { ObjectId } from "mongodb";

export type Inventory = {
    _id: ObjectId,
    name: string;
    price: number;
    category: string;
    images: { imageUrl: string, name: string }[];
}

export type InventoryInput = {
    name: string;
    price: number;
    category: string;
    images: { imageUrl: string, name: string }[];
}