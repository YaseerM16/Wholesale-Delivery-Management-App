import { IDriver } from "../../models/Driver.model"
import { DriverRegisterInput } from "../../types/driver.types"


export interface IDriverServiceMethods {
    getDrivers(query: any): Promise<{ drivers: IDriver[], totalDrivers: number }>
    addDriver(data: DriverRegisterInput): Promise<IDriver>
    editDriver(driverId: string, data: DriverRegisterInput): Promise<IDriver>
    deleteDriver(driverId: string): Promise<IDriver>
}