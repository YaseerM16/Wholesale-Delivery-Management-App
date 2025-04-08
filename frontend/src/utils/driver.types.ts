export type DriverRegisterInput = {
    name: string,
    address: string,
    phone: number,
    drivingLicense: string,
    password: string,
    dlState: string;
    dlYear: number;
    dlNumber: string;
}

export type IDriver = {
    _id: string,
    name: string;
    address: string;
    phone: number;
    drivingLicense: string;
    isDeleted: boolean;
}

export type DriverState = {
    driver?: IDriver | null
}