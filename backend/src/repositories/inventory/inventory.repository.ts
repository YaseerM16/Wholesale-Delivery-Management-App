import { IInventoryRepositoryMethods } from "../../interface/repository.ts/inventory/IInventoryRepository"
import { IInventory, InventoryModel } from "../../models/Inventory.model"
import { InventoryInput, Inventory } from "../../types/inventory.types"
import BaseRepository from "../base.repository"



export default class InventoryRepository extends BaseRepository<{
    Inventory: IInventory
}>
    implements IInventoryRepositoryMethods {

    constructor() {
        super({
            Inventory: InventoryModel
        })
    }
    async getInventory(query: any): Promise<{ inventory: IInventory[]; totalInventory: number }> {
        const { page = 1, limit = 6 } = query;

        const totalInventory = await this.findAll("Inventory", { isDeleted: false }).countDocuments();

        const inventory = await this.findAll("Inventory", { isDeleted: false })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit, 10));

        return { inventory, totalInventory };
    }
    async addToInventory(data: InventoryInput): Promise<IInventory> {
        try {
            const itemExists = await this.findOne("Inventory", { name: data.name })

            if (itemExists) throw new Error("Item Already Exists by the product Name..!! Try Edit.")
            const addItem = await this.createData("Inventory", data as unknown as Partial<IInventory>)
            const newItem: Inventory = {
                _id: addItem._id,
                name: addItem.name,
                price: addItem.price,
                quantity: addItem.quantity,
                category: addItem.category,
                images: addItem.images
            }
            return newItem as IInventory
        } catch (error) {
            throw error
        }
    }
    async editFromInventory(itemId: string, data: InventoryInput): Promise<IInventory> {
        try {
            const existingItem = await this.findById("Inventory", itemId);
            if (!existingItem) {
                throw new Error("Item not found.");
            }

            if (data.name) {
                const nameConflict = await this.findOne("Inventory", { name: data.name, _id: { $ne: itemId } });
                if (nameConflict) {
                    throw new Error("A Item with this name already exists.");
                }
            }

            const updatedItem = await this.updateById("Inventory", itemId, {
                name: data.name,
                category: data.category,
                price: data.price,
                images: data.images,
                quantity: data.quantity
            });

            return updatedItem as IInventory
        } catch (error) {
            throw error;
        }
    }

    async deleteFromInventory(itemId: string, query: any): Promise<IInventory[]> {
        try {
            const { page = 1, limit = 6 } = query;

            const existingItem = await this.findById("Inventory", itemId);
            if (!existingItem) {
                throw new Error("Item not found");
            }
            const updatedItem = await this.updateById(
                "Inventory",
                itemId,
                { isDeleted: true }
            );

            if (updatedItem) {
                const items = await this.findAll("Inventory", { isDeleted: false })
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(parseInt(limit, 10));

                return items
            }

            throw new Error("Failed to update Item..!");
        } catch (error) {
            throw error;
        }
    }

}