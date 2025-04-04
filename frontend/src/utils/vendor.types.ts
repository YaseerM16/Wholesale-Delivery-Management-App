export type VendorRegisterInput = {
    name: string;
    address: string;
    email: string;
    phone: number;
}

export type IVendor = {
    _id: string,
    name: string;
    address: string;
    email: string;
    phone: number;
    isDeleted: boolean;
}