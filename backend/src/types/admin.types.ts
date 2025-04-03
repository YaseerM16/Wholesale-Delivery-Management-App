import { ObjectId } from "mongodb";

export type IAdmin = {
    _id: ObjectId,
    name: string;
    email: string;
    phone: number;
    isVerified: boolean;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
}

export type AdminRegisterInput = {
    name: string;
    email: string;
    password: string;
    phone: number;
}