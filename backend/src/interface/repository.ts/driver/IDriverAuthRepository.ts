import { DriverRegisterInput, IDriver } from "../../../types/driver.types";

export interface IDriverAuthRepositoryMethods {
    register(data: DriverRegisterInput): Promise<IDriver>;
    login(phone: number, password: string): Promise<{ token: string }>;
}
