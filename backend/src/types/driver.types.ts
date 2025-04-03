import { ObjectId } from "mongodb";

export type IDriver = {
    _id: ObjectId,
    name: string;
    address: string;
    phone: number;
    drivingLicense: string;
    isDeleted: boolean;
}

export type DriverRegisterInput = {
    name: string,
    address: string,
    phone: number,
    drivingLicense: string,
    password: string,
}