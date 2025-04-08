import { ObjectId } from "mongodb";

export type OrderProductInput = {
    product: ObjectId;
    quantity: number;
};

export type IOrder = {
    _id: ObjectId,
    products: ObjectId[];
    truckDriver: ObjectId;
    vendor: ObjectId;
    totalBillAmount: number;
    collectedAmount: number;
}

export type OrderInput = {
    products: OrderProductInput[];
    truckDriver: ObjectId;
    vendor: ObjectId;
    totalBillAmount: number;
    collectedAmount: number;
}