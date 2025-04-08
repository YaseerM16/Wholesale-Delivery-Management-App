import { IOrderRepositoryMethods } from "../../interface/repository.ts/order/IOrderRepository";
import { IOrderServiceMethods } from "../../interface/service.ts/order/IOrderService";
import { IOrder } from "../../models/Order.model";
import OrderRepository from "../../repositories/order/order.repository";
import { OrderInput } from "../../types/order.types";

export default class OrderServices implements IOrderServiceMethods {
    private orderRepository: IOrderRepositoryMethods

    constructor(orderRepository: IOrderRepositoryMethods) {
        this.orderRepository = orderRepository
    }
    async getOrders(query: any): Promise<{ orders: IOrder[]; totalOrders: number; }> {
        try {
            const orders = await this.orderRepository.getOrders(query)
            return orders
        } catch (error) {
            throw error
        }
    }
    async addOrder(data: OrderInput): Promise<IOrder> {
        try {
            if (!data) throw new Error("The Order Details is not getting while ordering it ..!");
            const newOrder = await this.orderRepository.addOrder(data)
            return newOrder as IOrder
        } catch (error) {
            throw error
        }
    }
    async updateCollectedAmount(orderId: string, newCollectedAmount: number): Promise<IOrder> {
        try {
            if (!orderId || !newCollectedAmount) throw new Error("The OrderId or Collected amount not getting while update the order...!");
            const newOrder = await this.orderRepository.updateCollectedAmount(orderId, newCollectedAmount)
            return newOrder as IOrder
        } catch (error) {
            throw error
        }
    }
    deleteOrder(orderId: string, query: any): Promise<IOrder[]> {
        throw new Error("Method not implemented.");
    }
}
const orderRepository = new OrderRepository()
export const orderService = new OrderServices(orderRepository)