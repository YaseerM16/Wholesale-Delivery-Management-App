import VendorServices, { vendorService } from "../../services/vendor/vendor.service";
import { VendorRegisterInput } from "../../types/vendor.types";
import { sendErrorResponse, sendResponse } from "../../utils/responseHandler";
import { Request, Response } from "express"


export default class VendorController {
    private vendorServices: VendorServices

    constructor(vendorServices: VendorServices) {
        this.vendorServices = vendorServices
    }

    async vendorRegister(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body
            const addVendor = await this.vendorServices.addVendor(data as unknown as VendorRegisterInput)

            sendResponse({
                res,
                success: true,
                message: 'Vendor Registered Successfully',
                data: addVendor,
            })
            return
        } catch (error: unknown) {
            console.log("Error while Register the Vendor :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

    async getVendors(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query
            const vendors = await this.vendorServices.getVendors(query)
            sendResponse({
                res,
                success: true,
                message: 'Vendors Fetched Successfully',
                data: vendors,
            })
            return
        } catch (error) {
            console.log("Error while Fetching the Vendors :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

    async editVendor(req: Request, res: Response): Promise<void> {
        try {
            const { vendorId } = req.params
            const data = req.body

            const updatedVendor = await this.vendorServices.editVendor(vendorId, data)
            sendResponse({
                res,
                success: true,
                message: 'Vendor details Updated Successfully',
                data: updatedVendor,
            })
            return
        } catch (error) {
            console.log("Error while Edit the Vendor detail :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

    async deleteVendor(req: Request, res: Response): Promise<void> {
        try {
            const { vendorId } = req.params
            const query = req.query
            const updatedVendors = await this.vendorServices.deleteVendor(vendorId, query)
            sendResponse({
                res,
                success: true,
                message: 'Vendor has been Deleted Successfully :)',
                data: updatedVendors,
            })
            return
        } catch (error) {
            console.log("Error while try to Delete the Driver :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

}

export const vendorController = new VendorController(vendorService)