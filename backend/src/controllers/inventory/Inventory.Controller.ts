import { Request, Response } from "express"
import InventoryServices, { inventoryServices } from "../../services/inventory/inventory.service"
import { sendErrorResponse, sendResponse } from "../../utils/responseHandler"
import { InventoryInput } from "../../types/inventory.types"
import { IInventoryServiceMethods } from "../../interface/service.ts/inventory/IInventoryService"


export default class InventoryController {
    private inventoryServices: IInventoryServiceMethods

    constructor(inventoryServices: InventoryServices) {
        this.inventoryServices = inventoryServices
    }

    async getInventory(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query
            const inventory = await this.inventoryServices.getInventory(query)
            sendResponse({
                res,
                success: true,
                message: 'Inventory Fetched Successfully',
                data: inventory,
            })
            return
        } catch (error) {
            console.log("Error while Fetching the Drivers :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

    async addToInventory(req: Request, res: Response): Promise<void> {
        try {
            const data = { ...req.body } as unknown as InventoryInput
            console.log("Add Item DEteails (addToInventory) :", data);
            const images = req.files as unknown as File[]
            const addItem = await this.inventoryServices.addToInventory(data, images)

            sendResponse({
                res,
                success: true,
                message: 'Item Added to Inventory Successfully',
                data: addItem,
            })
            return
        } catch (error: unknown) {
            console.log("Error while Add the Item to Inventory :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

    async editFromInventory(req: Request, res: Response): Promise<void> {
        try {
            const { itemId } = req.params
            const existingImages = JSON.parse(req.body.existingImages); // Now accessible
            const data = { ...req.body, existingImages: existingImages } as unknown as InventoryInput
            const images = req.files as unknown as File[]
            // console.log("ItemID :", itemId);

            // console.log("Data form editFormInventory :", req.body);
            // console.log("IMages arr in req.files :", req.files);

            const updatedItem = await this.inventoryServices.editFromInventory(itemId, data, images)
            sendResponse({
                res,
                success: true,
                message: 'Item details Updated Successfully',
                data: updatedItem,
            })
            return
        } catch (error) {
            console.log("Error while Edit the Item detail :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

    async deleteItem(req: Request, res: Response): Promise<void> {
        try {
            const { itemId } = req.params
            const query = req.query
            const updatedItems = await this.inventoryServices.deleteFromInventory(itemId, query)
            sendResponse({
                res,
                success: true,
                message: 'Item has been Deleted Successfully :)',
                data: updatedItems,
            })
            return
        } catch (error) {
            console.log("Error while try to Delete the Item :", error)
            sendErrorResponse(res, (error as Error).message || "Internal Server Error", 500);
            return
        }
    }

}

export const inventoryController = new InventoryController(inventoryServices)