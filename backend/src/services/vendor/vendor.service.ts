import { IVendorServiceMethods } from "../../interface/service.ts/vendor/IVendorService"
import { IVendor } from "../../models/Vendor.model"
import VendorRepository from "../../repositories/vendor/vendor.repository"
import { VendorRegisterInput } from "../../types/vendor.types"

export default class VendorServices implements IVendorServiceMethods {
    private vendorRepository: VendorRepository

    constructor(vendorRepository: VendorRepository) {
        this.vendorRepository = vendorRepository
    }
    async getVendors(query: any): Promise<{ vendors: IVendor[]; totalVendors: number }> {
        try {
            const vendors = await this.vendorRepository.getVendors(query)
            return vendors
        } catch (error) {
            throw error
        }
    }
    async addVendor(data: VendorRegisterInput): Promise<IVendor> {
        try {
            if (!data) throw new Error("The Registering Data is not getting for Vendor ..!");
            const newAdmin = await this.vendorRepository.addVendor(data)
            return newAdmin as IVendor
        } catch (error) {
            throw error
        }
    }
    async editVendor(vendorId: string, data: VendorRegisterInput): Promise<IVendor> {
        if (!vendorId || !data) throw new Error("Vendor Id or Data isn't getting..!")
        try {
            const updatedVendor = await this.vendorRepository.editVendor(vendorId, data)
            return updatedVendor
        } catch (error) {
            throw error
        }
    }
    async deleteVendor(vendorId: string, query: any): Promise<IVendor[]> {
        if (!vendorId) throw new Error("Vendor Id isn't getting..!")
        try {
            const updatedVendors = await this.vendorRepository.deleteVendor(vendorId, query)
            return updatedVendors
        } catch (error) {
            throw error
        }
    }
}
const vendorRepository = new VendorRepository()
export const vendorService = new VendorServices(vendorRepository)  