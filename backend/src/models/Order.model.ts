import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface IOrder extends Document {
    products: {
        product: ObjectId;
        quantity: number;
    }[];
    truckDriver: ObjectId;
    vendor: ObjectId;
    totalBillAmount: number;
    collectedAmount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema<IOrder>({
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Inventory", required: true },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    truckDriver: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    totalBillAmount: { type: Number, required: true, min: 0 },
    collectedAmount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        required: true,
    },
}, { timestamps: true });

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
