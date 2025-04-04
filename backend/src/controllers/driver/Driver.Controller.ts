import { Request, Response } from "express"
import DriverServices, { driverServices } from "../../services/driver/driver.service"
import { sendErrorResponse, sendResponse } from "../../utils/responseHandler"

export default class Drivercontroller {
    private driverServices: DriverServices

    constructor(driverAuthServices: DriverServices) {
        this.driverServices = driverAuthServices
    }

    async getDrivers(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query
            const drivers = await this.driverServices.getDrivers(query)
            sendResponse({
                res,
                success: true,
                message: 'Drivers Fetched Successfully',
                data: drivers,
            })
            return
        } catch (error) {
            console.log("Error while Fetching the Drivers :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

    async editDriver(req: Request, res: Response): Promise<void> {
        try {
            const { driverId } = req.params
            const data = req.body

            const updatedDriver = await this.driverServices.editDriver(driverId, data)
            sendResponse({
                res,
                success: true,
                message: 'Driver details Updated Successfully',
                data: updatedDriver,
            })
            return
        } catch (error) {
            console.log("Error while Edit the Driver detail :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

    async deleteDriver(req: Request, res: Response): Promise<void> {
        try {
            const { driverId } = req.params
            const query = req.query
            const updatedDrivers = await this.driverServices.deleteDriver(driverId, query)
            sendResponse({
                res,
                success: true,
                message: 'Driver has been Deleted Successfully :)',
                data: updatedDrivers,
            })
            return
        } catch (error) {
            console.log("Error while try to Delete the Driver :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }
}

export const driverController = new Drivercontroller(driverServices)