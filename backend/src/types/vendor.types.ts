import { ObjectId } from "mongodb";

export type IVendor = {
    _id: ObjectId,
    name: string;
    address: string;
    email: string;
    phone: number;
    isDeleted: boolean;
}

export type VendorRegisterInput = {
    name: string;
    address: string;
    email: string;
    phone: number;
}