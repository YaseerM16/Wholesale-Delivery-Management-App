import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../utils/constants";
import { VendorRegisterInput } from "../utils/vendor.types";

export const axiosInstance = axios.create({
    baseURL: BACKEND_URL || "http://localhost:5000",
    headers: {
        "Cache-Control": "no-store",
        "Pragma": "no-cache",
        "Expires": "0",
    },
    withCredentials: true,
});


export const vendorRegisterApi = async (signupData: VendorRegisterInput) => {
    try {
        const response = await axiosInstance.post(`/vendor/register`, signupData);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};
export const getVendors = async (page: number | undefined, limit: number | undefined) => {
    try {
        const response = await axiosInstance.get(`/vendor/get-vendors?page=${page}&limit=${limit}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const editVendorApi = async (vendorId: string, data: VendorRegisterInput) => {
    try {
        const response = await axiosInstance.put(`/vendor/edit-vendor/${vendorId}`, data);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const deleteVendorApi = async (vendorId: string, page: number | undefined, limit: number | undefined) => {
    try {
        const response = await axiosInstance.delete(`/vendor/delete-vendor/${vendorId}?page=${page}&limit=${limit}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};