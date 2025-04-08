
export type AdminRegisterInput = {
    name: string;
    email: string;
    phone: number;
    password: string;
    confirmPassword: string
}

export type Admin = {
    _id: string,
    name: string,
    email: string,
    phone: number
}

export type AdminState = {
    admin?: Admin | null
}

export const BACKEND_URL = "https://wholesale-delivery-management-app-tjdi.onrender.com"