import { IInventory } from "../../../models/Inventory.model"
import { InventoryInput } from "../../../types/inventory.types"

export interface IInventoryRepositoryMethods {
    getInventory(query: any): Promise<{ inventory: IInventory[], totalInventory: number }>
    addToInventory(data: InventoryInput): Promise<IInventory>
    editFromInventory(itemId: string, data: InventoryInput): Promise<IInventory>
    deleteFromInventory(itemId: string, query: any): Promise<IInventory[]>
}