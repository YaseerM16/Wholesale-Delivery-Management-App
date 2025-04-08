import { IDriver } from "./driver.types";
import { Inventory } from "./inventory.types";
import { IVendor } from "./vendor.types";

export type OrderProductInput = {
    product: string;
    quantity: number;
};

export type productList = {
    product: Inventory;
    quantity: number;
}

export type Order = {
    _id: string;
    vendor: IVendor;
    products: productList[];
    totalBillAmount: number;
    collectedAmount: number;
    truckDriver: IDriver;
    status: "Pending" | "Completed"
    createdAt: string;
}

export type OrderInput = {
    vendor: string;
    products: OrderProductInput[];
    totalBillAmount: number;
    collectedAmount: number;
    truckDriver: string;
};
