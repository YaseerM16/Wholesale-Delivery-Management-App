import { Router } from "express";
import { orderController } from "../controllers/order/Order.Controller";

const router = Router()

router
    .post("/create-order", orderController.createOrder.bind(orderController))
    .get("/get-orders", orderController.getOrders.bind(orderController))
    .patch("/:orderId/update-payment", orderController.updateOrderPayment.bind(orderController))

export const orderRouter = router