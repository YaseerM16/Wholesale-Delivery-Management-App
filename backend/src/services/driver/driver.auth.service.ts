import { IDriverAuthRepositoryMethods } from "../../interface/repository.ts/driver/IDriverAuthRepository";
import { IDriverAuthServiceMethods } from "../../interface/service.ts/driver/IDriverAuthService";
import { IDriver } from "../../models/Driver.model";
import DriverAuthRepository from "../../repositories/driver/driver.auth.repository";
import { DriverRegisterInput } from "../../types/driver.types";



export default class DriverAuthServices implements IDriverAuthServiceMethods {
    private driverAuthRepository: IDriverAuthRepositoryMethods

    constructor(driverAuthRepository: DriverAuthRepository) {
        this.driverAuthRepository = driverAuthRepository
    }

    async register(data: DriverRegisterInput): Promise<IDriver> {
        try {
            if (!data) throw new Error("The Registering Data is not getting ..!");
            const newAdmin = await this.driverAuthRepository.register(data)
            return newAdmin as IDriver
        } catch (error) {
            throw error
        }
    }

    async login(phone: number, password: string): Promise<IDriver> {
        try {
            if (!phone || !password) throw new Error("Phone or Password were not getting..!");

            const loggedADriver = await this.driverAuthRepository.login(phone, password)

            return loggedADriver as IDriver
        } catch (error) {
            throw error
        }
    }
}

const driverAuthRepository = new DriverAuthRepository()
export const driverAuthServices = new DriverAuthServices(driverAuthRepository)