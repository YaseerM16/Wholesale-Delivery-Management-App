import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../utils/constants";
import { InventoryInput } from "../utils/inventory.types";

export const axiosInstance = axios.create({
    baseURL: BACKEND_URL || "http://localhost:5000",
    headers: {
        "Cache-Control": "no-store",
        "Pragma": "no-cache",
        "Expires": "0",
    },
    withCredentials: true,
});

export const addItemToInventoryApi = async (item: FormData) => {
    try {
        const response = await axiosInstance.post(`/inventory/add-item`, item);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const getInventory = async (page: number | undefined, limit: number | undefined) => {
    try {
        const response = await axiosInstance.get(`/inventory/get-inventory?page=${page}&limit=${limit}`,);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const editItemApi = async (itemId: string, data: FormData) => {
    try {
        const response = await axiosInstance.put(`/inventory/edit-item/${itemId}`, data);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const deleteItemApi = async (itemId: string, page: number | undefined, limit: number | undefined) => {
    try {
        const response = await axiosInstance.delete(`/inventory/delete-item/${itemId}?page=${page}&limit=${limit}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};
