import DriverAuthServices, { driverAuthServices } from "../../services/driver/driver.auth.service";
import { DriverRegisterInput } from "../../types/driver.types";
import { sendErrorResponse, sendResponse } from "../../utils/responseHandler";
import { Request, Response } from "express";


export default class DriverAuthcontroller {
    private driverAuthServices: DriverAuthServices

    constructor(driverAuthServices: DriverAuthServices) {
        this.driverAuthServices = driverAuthServices
    }

    async driverRegister(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body
            console.log("Driver Regitering Dets :", data);

            const addDriver = await this.driverAuthServices.register(data as unknown as DriverRegisterInput)

            sendResponse({
                res,
                success: true,
                message: 'Driver Registered Successfully',
                data: addDriver,
            })
            return
        } catch (error: unknown) {
            console.log("Error while Register the Driver :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }
}

export const driverAuthController = new DriverAuthcontroller(driverAuthServices)