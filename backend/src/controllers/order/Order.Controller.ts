import { IOrderServiceMethods } from "../../interface/service.ts/order/IOrderService"
import OrderServices, { orderService } from "../../services/order/order.service"
import { OrderInput } from "../../types/order.types"
import { sendErrorResponse, sendResponse } from "../../utils/responseHandler"
import { Request, Response } from "express"


export default class OrderController {
    private orderServices: IOrderServiceMethods

    constructor(orderServices: OrderServices) {
        this.orderServices = orderServices
    }

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body
            const addOrder = await this.orderServices.addOrder(data as unknown as OrderInput)

            sendResponse({
                res,
                success: true,
                message: 'Order Registered Successfully',
                data: addOrder,
            })
            return
        } catch (error: unknown) {
            console.log("Error while creating the order :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

    async getOrders(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query
            const orders = await this.orderServices.getOrders(query)
            sendResponse({
                res,
                success: true,
                message: 'Orders Fetched Successfully',
                data: orders,
            })
            return
        } catch (error) {
            console.log("Error while Fetching the Orders :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

    async updateOrderPayment(req: Request, res: Response): Promise<void> {
        try {
            const { orderId } = req.params;
            const { collectedAmount } = req.body;
            const updatedOrder = await this.orderServices.updateCollectedAmount(orderId, collectedAmount)
            sendResponse({
                res,
                success: true,
                message: 'Orders Fetched Successfully',
                data: updatedOrder,
            })
            return
        } catch (error) {
            console.log("Error while Fetching the Orders :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }
}

export const orderController = new OrderController(orderService)