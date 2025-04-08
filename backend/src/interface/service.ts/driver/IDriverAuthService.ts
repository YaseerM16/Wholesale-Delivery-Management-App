import { IDriver } from "../../../models/Driver.model"
import { DriverRegisterInput } from "../../../types/driver.types"


export interface IDriverAuthServiceMethods {
    register(data: DriverRegisterInput): Promise<IDriver>
    login(phone: number, password: string): Promise<IDriver>
}