import axios, { AxiosError } from "axios";
import { DriverRegisterInput } from "../utils/driver.types";
import { BACKEND_URL } from "../utils/constants";

export const axiosInstance = axios.create({
    baseURL: BACKEND_URL || "http://localhost:5000",
    headers: {
        "Cache-Control": "no-store",
        "Pragma": "no-cache",
        "Expires": "0",
    },
    withCredentials: true,
});

export const driverRegisterApi = async (signupData: DriverRegisterInput) => {
    try {
        const response = await axiosInstance.post(`/driver/register`, signupData);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const getDrivers = async (page: number | undefined, limit: number | undefined) => {
    try {
        const response = await axiosInstance.get(`/driver/get-drivers?page=${page}&limit=${limit}`,);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const editDriverApi = async (driverId: string, data: DriverRegisterInput) => {
    try {
        const response = await axiosInstance.put(`/driver/edit-driver/${driverId}`, data);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const deleteDriverApi = async (driverId: string, page: number | undefined, limit: number | undefined) => {
    try {
        const response = await axiosInstance.delete(`/driver/delete-driver/${driverId}?page=${page}&limit=${limit}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};
