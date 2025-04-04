// import { IDriver } from "../../types/driver.types"
import { ObjectId } from "mongodb";
import { IDriverAuthRepositoryMethods } from "../../interface/repository.ts/driver/IDriverAuthRepository"
import DriverModel, { IDriver } from "../../models/Driver.model"
import { DriverRegisterInput, IDriver as DriverInstance } from "../../types/driver.types"
import BaseRepository from "../base.repository"




export default class DriverAuthRepository extends BaseRepository<{
    Driver: IDriver
}>
    implements IDriverAuthRepositoryMethods {

    constructor() {
        super({
            Driver: DriverModel
        })
    }
    async register(data: DriverRegisterInput): Promise<DriverInstance> {
        try {
            const driverExists = await this.findOne("Driver", {
                $or: [
                    { phone: data.phone },
                    { drivingLicense: data.drivingLicense }
                ]
            })

            if (driverExists) throw new Error("Driver Already Exists by Phone number or Driving License!! Try Login.")
            const addDriver = await this.createData("Driver", data as unknown as Partial<IDriver>)
            const newDriver: DriverInstance = {
                _id: addDriver._id as ObjectId,
                name: addDriver.name,
                address: addDriver.address,
                phone: addDriver.phone,
                drivingLicense: addDriver.drivingLicense,
                isDeleted: addDriver.isDeleted
            }
            return newDriver as DriverInstance
        } catch (error) {
            throw error
        }
    }
    login(phone: number, password: string): Promise<{ token: string }> {
        throw new Error("Method not implemented.")
    }
}