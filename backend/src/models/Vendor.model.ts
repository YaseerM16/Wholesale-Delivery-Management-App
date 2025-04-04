import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb"

export interface IVendor extends Document {
    _id: ObjectId,
    name: string;
    address: string;
    email: string;
    phone: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const VendorSchema: Schema = new Schema<IVendor>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true, min: 1 },
    address: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const VendorModel = mongoose.model<IVendor>("Vendor", VendorSchema)
