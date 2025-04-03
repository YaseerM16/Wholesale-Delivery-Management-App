import axios, { AxiosError } from "axios";
import { AdminRegisterInput, BACKEND_URL } from "../utils/constants";

export const axiosInstance = axios.create({
    baseURL: BACKEND_URL || "http://localhost:5000",
    headers: {
        "Cache-Control": "no-store",
        "Pragma": "no-cache",
        "Expires": "0",
    },
    withCredentials: true,
});

export const adminRegisterApi = async (signupData: AdminRegisterInput) => {
    try {
        const response = await axiosInstance.post(`/admin/register`, signupData);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};
export const verifyEmail = async (token: string, email: string) => {
    try {
        const response = await axiosInstance.get(`/admin/verify-email?token=${token}&email=${email}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};
export const adminLogin = async (email: string, password: string) => {
    try {
        const response = await axiosInstance.post(`/admin/login`, { email, password });
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};
