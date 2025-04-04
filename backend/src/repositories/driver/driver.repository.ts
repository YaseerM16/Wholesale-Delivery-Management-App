import { IDriverRepositoryMethods } from "../../interface/repository.ts/driver/IDriverRepository"
import DriverModel, { IDriver } from "../../models/Driver.model"
import { DriverRegisterInput } from "../../types/driver.types"
import BaseRepository from "../base.repository"

export default class DriverRepository extends BaseRepository<{
    Driver: IDriver
}>
    implements IDriverRepositoryMethods {

    constructor() {
        super({
            Driver: DriverModel
        })
    }
    async getDrivers(query: any): Promise<{ drivers: IDriver[]; totalDrivers: number }> {
        try {
            const { page = 1, limit = 6, search } = query;

            const queryObj: any = {
                isDeleted: false,
                ...(search && {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { address: { $regex: search, $options: "i" } }
                    ]
                })
            };


            if (search) {
                queryObj.name = { $regex: search, $options: "i" };
            }

            const totalDrivers = await this.findAll("Driver", queryObj).countDocuments();

            const drivers = await this.findAll("Driver", queryObj)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit, 10));

            return { drivers, totalDrivers };
        } catch (error) {
            throw error;
        }
    }
    async editDriver(driverId: string, data: DriverRegisterInput): Promise<IDriver> {
        try {
            const existingDriver = await this.findById("Driver", driverId);
            if (!existingDriver) {
                throw new Error("Driver not found.");
            }

            if (data.name) {
                const nameConflict = await this.findOne("Driver", { name: data.name, _id: { $ne: driverId } });
                if (nameConflict) {
                    throw new Error("A driver with this name already exists.");
                }
            }

            const updatedDriver = await this.updateById("Driver", driverId, {
                name: data.name,
                address: data.address,
                phone: data.phone,
                drivingLicense: data.drivingLicense
            });

            return updatedDriver as IDriver
        } catch (error) {
            throw error;
        }
    }

    async deleteDriver(driverId: string, query: any): Promise<IDriver[]> {
        try {
            const { page = 1, limit = 6 } = query;

            const existingDriver = await this.findById("Driver", driverId);
            if (!existingDriver) {
                throw new Error("Driver not found");
            }
            const updatedDriver = await this.updateById(
                "Driver",
                driverId,
                { isDeleted: true }
            );

            if (updatedDriver) {
                const drivers = await this.findAll("Driver", { isDeleted: false })
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(parseInt(limit, 10));

                return drivers
            }

            throw new Error("Failed to update driver..!");
        } catch (error) {
            throw error;
        }
    }

    addDriver(data: DriverRegisterInput): Promise<IDriver> {
        throw new Error("Method not implemented.")
    }
}