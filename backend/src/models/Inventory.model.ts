import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb"

export interface IInventory extends Document {
    _id: ObjectId;
    name: string;
    price: number;
    category: string;
    images: { imageUrl: string, name: string }[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const InventorySchema: Schema = new Schema<IInventory>({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    images: {
        type: [{
            imageUrl: { type: String, required: true },
            name: { type: String, required: true },
        }], required: true
    },
    category: {
        type: String,
        enum: ["Groceries", "Construction Materials", "Plumbing", "Tools", "Safety Equipment", "Beverages", "Stationery", "Cleaning Supplies", "Electronics", "Furniture", "Packaging Materials"],
        required: true,
    },
    isDeleted: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const InventoryModel = mongoose.model<IInventory>("Inventory", InventorySchema)
