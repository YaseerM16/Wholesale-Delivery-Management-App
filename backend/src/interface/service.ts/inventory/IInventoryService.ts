import { IInventory } from "../../../models/Inventory.model"
import { InventoryInput } from "../../../types/inventory.types"

export interface IInventoryServiceMethods {
    getInventory(query: any): Promise<{ inventory: IInventory[], totalInventory: number }>
    addToInventory(data: InventoryInput, images: File[]): Promise<IInventory>
    editFromInventory(itemId: string, data: InventoryInput, images: File[]): Promise<IInventory>
    deleteFromInventory(itemId: string, query: any): Promise<IInventory[]>
}