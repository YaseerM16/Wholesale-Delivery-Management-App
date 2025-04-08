import { IInventoryRepositoryMethods } from "../../interface/repository.ts/inventory/IInventoryRepository"
import { IInventoryServiceMethods } from "../../interface/service.ts/inventory/IInventoryService"
import { IInventory } from "../../models/Inventory.model"
import InventoryRepository from "../../repositories/inventory/inventory.repository"
import { InventoryInput } from "../../types/inventory.types"
import fs from "fs"

export default class InventoryServices implements IInventoryServiceMethods {
    private inventoryRepository: IInventoryRepositoryMethods

    constructor(inventoryRepository: InventoryRepository) {
        this.inventoryRepository = inventoryRepository
    }
    async getInventory(query: any): Promise<{ inventory: IInventory[]; totalInventory: number }> {
        try {
            const inventory = await this.inventoryRepository.getInventory(query)
            return inventory
        } catch (error) {
            throw error
        }
    }
    async addToInventory(data: InventoryInput, images: File[]): Promise<IInventory> {
        try {
            if (!data) throw new Error("The Item Details is not getting for Add it to Inventory ..!");

            const imagesArr = images.map((file: any) => {
                const filePath = file.path;
                const fileType = file.mimetype;
                const fileBuffer = fs.readFileSync(filePath);
                const blob = new Blob([fileBuffer], { type: fileType });
                const imageUrl = URL.createObjectURL(blob);
                const name = file.originalname
                return { imageUrl, name };
            })

            const item: InventoryInput = {
                name: data.name,
                price: Number(data.price),
                quantity: Number(data.quantity),
                category: data.category,
                images: imagesArr
            }
            const newItem = await this.inventoryRepository.addToInventory(item)
            return newItem as IInventory
        } catch (error) {
            throw error
        }
    }
    async editFromInventory(itemId: string, data: InventoryInput, images: File[]): Promise<IInventory> {
        if (!itemId || !data) throw new Error("Item Id or Data isn't getting..!")
        try {
            const imagesArr = images.map((file: any) => {
                const filePath = file.path;
                const fileType = file.mimetype;
                const fileBuffer = fs.readFileSync(filePath);
                const blob = new Blob([fileBuffer], { type: fileType });
                const imageUrl = URL.createObjectURL(blob);
                const name = file.originalname
                return { imageUrl, name };
            })
            // console.log("The Existing IMage GOT IT!! (invent_service):", (data as any).existingImages);\
            const existingImages = (data as any).existingImages

            const item: InventoryInput = {
                name: data.name,
                price: Number(data.price),
                quantity: Number(data.quantity),
                category: data.category,
                images: [...existingImages, ...imagesArr]
            }
            const updatedItem = await this.inventoryRepository.editFromInventory(itemId, item)
            return updatedItem
        } catch (error) {
            throw error
        }
    }
    async deleteFromInventory(itemId: string, query: any): Promise<IInventory[]> {
        if (!itemId) throw new Error("Item Id isn't getting..!")
        try {
            const updateditems = await this.inventoryRepository.deleteFromInventory(itemId, query)
            return updateditems
        } catch (error) {
            throw error
        }
    }
}

const inventoryRepository = new InventoryRepository()
export const inventoryServices = new InventoryServices(inventoryRepository)