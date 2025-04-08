// import { IDriver } from "../../types/driver.types"
import { ObjectId } from "mongodb";
import { IDriverAuthRepositoryMethods } from "../../interface/repository.ts/driver/IDriverAuthRepository"
import DriverModel, { IDriver } from "../../models/Driver.model"
import { DriverRegisterInput, IDriver as DriverInstance } from "../../types/driver.types"
import BaseRepository from "../base.repository"
import bcryptjs from "bcrypt"



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
    async login(phone: number, password: string): Promise<DriverInstance> {
        try {

            const driver = await this.findOne("Driver", { phone });
            if (!driver) throw new Error("Invalid phone number or password.");

            if (driver.isDeleted) throw new Error("Your Driver account is deleted.");

            const isPasswordValid = await bcryptjs.compare(password, driver.password);
            if (!isPasswordValid) throw new Error("Invalid or Incorrect password.");

            const loggedInDriver: DriverInstance = {
                _id: driver._id as ObjectId,
                name: driver.name,
                address: driver.address,
                phone: driver.phone,
                drivingLicense: driver.drivingLicense,
                isDeleted: driver.isDeleted
            };

            return loggedInDriver
        } catch (error) {
            throw error;
        }
    }
}