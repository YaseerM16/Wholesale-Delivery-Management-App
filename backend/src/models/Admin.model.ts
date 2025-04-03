import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb"

export interface IAdmin extends Document {
    _id: ObjectId,
    name: string;
    email: string;
    password: string;
    phone: number;
    createdAt: Date;
    updatedAt: Date;
    verifyToken: string;
    verifyTokenExpiry: Date;
    isVerified: boolean;
}

const AdminSchema: Schema = new Schema<IAdmin>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true, min: 1 },
    verifyToken: {
        type: String,
        default: ""
    },
    verifyTokenExpiry: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema)
