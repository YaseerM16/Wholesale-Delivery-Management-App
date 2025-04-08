import { IOrderRepositoryMethods } from "../../interface/repository.ts/order/IOrderRepository"
import DriverModel, { IDriver } from "../../models/Driver.model"
import { IInventory, InventoryModel } from "../../models/Inventory.model"
import { IOrder, OrderModel } from "../../models/Order.model"
import { IVendor, VendorModel } from "../../models/Vendor.model"
import { OrderInput } from "../../types/order.types"
import BaseRepository from "../base.repository"

export default class OrderRepository extends BaseRepository<{
    Order: IOrder,
    Inventory: IInventory,
    Vendor: IVendor,
    Driver: IDriver
}>
    implements IOrderRepositoryMethods {

    constructor() {
        super({
            Order: OrderModel,
            Inventory: InventoryModel,
            Vendor: VendorModel,
            Driver: DriverModel
        })
    }
    async addOrder(data: OrderInput): Promise<IOrder> {
        try {
            const validProducts = [];

            // 1. Validate products and their available quantity
            for (const item of data.products) {
                if (item.quantity < 1) {
                    throw new Error(`Invalid quantity for product ${item.product}`);
                }

                const productDoc = await this.models.Inventory.findById(item.product);
                if (!productDoc) {
                    throw new Error(`Product not found: ${item.product}`);
                }

                if (productDoc.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for product ${item.product}`);
                }

                // Push the validated product with quantity
                validProducts.push({
                    product: item.product,
                    quantity: item.quantity,
                });
            }

            // 2. Check vendor existence
            const vendorExists = await this.models.Vendor.findById(data.vendor);
            if (!vendorExists) {
                throw new Error(`Vendor not found: ${data.vendor}`);
            }

            // 3. Check driver existence
            const driverExists = await this.models.Driver.findById(data.truckDriver);
            if (!driverExists) {
                throw new Error(`Truck driver not found: ${data.truckDriver}`);
            }

            // 4. Reduce product stock
            for (const item of validProducts) {
                await this.models.Inventory.findByIdAndUpdate(item.product, {
                    $inc: { quantity: -item.quantity },
                });
            }

            // 5. Create and save order
            const newOrder = new this.models.Order({
                products: validProducts,
                truckDriver: data.truckDriver,
                vendor: data.vendor,
                totalBillAmount: data.totalBillAmount,
                collectedAmount: data.collectedAmount,
                status: data.totalBillAmount === data.collectedAmount ? "Completed" : "Pending"
            });

            await newOrder.save();
            return newOrder as IOrder;

        } catch (error) {
            throw error;
        }
    }

    async getOrders(query: any): Promise<{ orders: IOrder[]; totalOrders: number }> {
        const { page = 1, limit = 6 } = query;

        const totalOrders = await this.findAll("Order", {}).countDocuments();

        const orders = await this.findAll("Order", {})
            .populate("vendor")
            .populate("truckDriver")
            .populate("products.product")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit, 10));

        return { orders, totalOrders };
    }
    async updateCollectedAmount(orderId: string, newCollectedAmount: number): Promise<IOrder> {
        const order = await OrderModel.findById(orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        if (newCollectedAmount > order.totalBillAmount) {
            throw new Error("Collected amount cannot exceed total bill amount");
        }

        order.collectedAmount = newCollectedAmount;

        if (newCollectedAmount === order.totalBillAmount) {
            order.status = "Completed";
        }

        await order.save();

        const populatedOrder = await this.models.Order.findById(orderId)
            .populate("vendor")
            .populate("truckDriver")
            .populate("products.product")

        return populatedOrder as IOrder
    }
    deleteOrder(orderId: string, query: any): Promise<IOrder[]> {
        throw new Error("Method not implemented.")
    }
}