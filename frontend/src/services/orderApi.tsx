import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../utils/constants";
import { OrderInput } from "../utils/order.types";


export const axiosInstance = axios.create({
    baseURL: BACKEND_URL || "http://localhost:5000",
    headers: {
        "Cache-Control": "no-store",
        "Pragma": "no-cache",
        "Expires": "0",
    },
    withCredentials: true,
});

export const createOrderApi = async (item: OrderInput) => {
    try {
        const response = await axiosInstance.post(`/order/create-order`, item);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const getOrders = async (page: number | undefined, limit: number | undefined) => {
    try {
        const response = await axiosInstance.get(`/order/get-orders?page=${page}&limit=${limit}`,);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const updatePaymentApi = async (orderId: string, collectedAmount: number) => {
    try {
        const response = await axiosInstance.patch(`/order/${orderId}/update-payment`, { collectedAmount });
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};