import { IDriverServiceMethods } from "../../interface/service.ts/driver/IDriverService";
import { IDriver } from "../../models/Driver.model";
import DriverRepository from "../../repositories/driver/driver.repository";
import { DriverRegisterInput } from "../../types/driver.types";



export default class DriverServices implements IDriverServiceMethods {
    private driverRepository: DriverRepository

    constructor(driverRepository: DriverRepository) {
        this.driverRepository = driverRepository
    }
    async getDrivers(query: any): Promise<{ drivers: IDriver[]; totalDrivers: number; }> {
        try {
            const drivers = await this.driverRepository.getDrivers(query)
            return drivers
        } catch (error) {
            throw error
        }
    }
    async editDriver(driverId: string, data: DriverRegisterInput): Promise<IDriver> {
        if (!driverId || !data) throw new Error("Driver Id or Data isn't getting..!")
        try {
            const updatedDriver = await this.driverRepository.editDriver(driverId, data)
            return updatedDriver
        } catch (error) {
            throw error
        }
    }
    async deleteDriver(driverId: string, query: any): Promise<IDriver[]> {
        if (!driverId) throw new Error("Driver Id isn't getting..!")
        try {
            const updatedDrivers = await this.driverRepository.deleteDriver(driverId, query)
            return updatedDrivers
        } catch (error) {
            throw error
        }
    }
    addDriver(data: DriverRegisterInput): Promise<IDriver> {
        throw new Error("Method not implemented.");
    }

}
const driverRepository = new DriverRepository()
export const driverServices = new DriverServices(driverRepository)