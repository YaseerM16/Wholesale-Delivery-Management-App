import { IOrder } from "../../../models/Order.model"
import { OrderInput } from "../../../types/order.types"

export interface IOrderServiceMethods {
    getOrders(query: any): Promise<{ orders: IOrder[], totalOrders: number }>
    addOrder(data: OrderInput): Promise<IOrder>
    updateCollectedAmount(orderId: string, newCollectedAmount: number): Promise<IOrder>
    deleteOrder(orderId: string, query: any): Promise<IOrder[]>
}